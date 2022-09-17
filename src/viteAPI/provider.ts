import { requestTimeout } from '~@vite/vitejs-error';

import { RPCRequest, RPCResponse, Methods } from './type';
import EventEmitter from './eventEmitter';

class ProviderClass {
    isConnected = false;
    _provider: any; // rpc provider, e.g. http, ws or ipc
    requestList: {[id:number]:()=>void} = {}; // pending request queue
    subscriptionList: {[id:number]:EventEmitter} = {};
    private subscriptionId = 0;
    private requestId = 0;
    private connectHandler = null;

    constructor(provider: any, onInitCallback: Function, onConnectCallback?: ConnectHandler) {
        this._provider = provider;
        this.connectHandler = onConnectCallback || new ReconnectHandler();
        this.connectHandler.init(this);
        this.connectHandler.setConnectListener(onInitCallback);
    }

    setProvider(provider, onInitCallback, abort) {
        abort && this._provider.abort(abort);
        this.unsubscribeAll();

        if (!provider) {
            return;
        }

        this._provider = provider;
        this.isConnected = false;
        this.connectHandler.setConnectListener(onInitCallback);
    }

    unsubscribe(event:EventEmitter) {
        if (this.subscriptionList[event['_id'] || 0] !== event) return;

        event && event.stopLoop();
        delete this.subscriptionList[event['_id']];

        if (!Object.keys(this.subscriptionList).length) {
            this._provider.unsubscribe && this._provider.unsubscribe();
        }
    }

    unsubscribeAll() {
        Object.values(this.subscriptionList).forEach(s => {
            s.stopLoop();
        });
        this.subscriptionList = {};
        this._provider.unsubscribe && this._provider.unsubscribe();
    }

    async request(methods: Methods, ...args: any[]) {
        if (!this.isConnected) {
            return this._onReq('request', methods, ...args);
        }

        const rep: RPCResponse = await this._provider.request(methods, args);
        if (rep.error) {
            throw rep.error;
        }
        return rep.result;
    }

    async sendNotification(methods: Methods, ...args: any[]) {
        if (!this.isConnected) {
            return this._onReq('sendNotification', methods, ...args);
        }

        return this._provider.sendNotification(methods, args);
    }

    async batch(reqs: RPCRequest[]) {
        if (!this.isConnected) {
            return this._onReq('batch', reqs);
        }

        reqs.forEach(v => {
            v.type = v.type || 'request';
        });
        const reps: RPCResponse[] = await this._provider.batch(reqs);
        return reps;
    }

    async subscribe(methodName, ...args) {
        const subMethodName = this._provider.subscribe ? 'subscribe_subscribe' : `subscribe_${ methodName }Filter`;
        const params = this._provider.subscribe ? [ methodName, ...args ] : args;

        let rep;
        if (this.isConnected) {
            rep = await this._provider.request(subMethodName, params); // call rpc
            rep = rep.result;
        } else { // if connection is not established, put the request in the request queue
            rep = await this._onReq('request', subMethodName, ...params);
        }

        const subscription = rep;

        if (!Object.keys(this.subscriptionList).length) { // initialize subscription list if empty
            this.subscriptionList = {};
            // register subscription callback
            this._provider.subscribe && this._provider.subscribe(jsonEvent => {
                this.subscribeCallback(jsonEvent);
            });
        }

        const event = new EventEmitter(subscription, this, !!this._provider.subscribe, {method: subMethodName, params: params});
        if (!this._provider.subscribe) {
            event.startLoop(jsonEvent => { // polling for http
                this.subscribeCallback(jsonEvent);
            });
        }

        event['_id'] = this.subscriptionId++;

        this.subscriptionList[event['_id']] = event;
        return event;
    }

    private _offReq(_q) {
        delete this.requestList[_q._id];
    }

    // cache the request in requestList and wait till the connection is established or timeout
    private _onReq(type, methods, ...args) {
        return new Promise((res, rej) => {
            const _q = () => { // create the request
                this[type](methods, ...args).then(data => {
                    clearTimeout(_timeout);
                    this._offReq(_q); // move the request out of queue after sent
                    res(data);
                }).catch(err => {
                    this._offReq(_q);
                    clearTimeout(_timeout);
                    rej(err);
                });
            };
            _q._id = this.requestId++;

            this.requestList[_q._id] = _q;

            const _timeout = setTimeout(() => {
                this._offReq(_q);
                rej(requestTimeout);
            }, this._provider._timeout || 30000);
        });
    }

    // process subscription event
    private subscribeCallback(jsonEvent) {
        if (!jsonEvent) {
            return;
        }

        const id = jsonEvent.params && jsonEvent.params.subscription ? jsonEvent.params.subscription : jsonEvent.subscription || '';
        if (!id) {
            return;
        }

        // find matched event emitter in subscription list
        Object.values(this.subscriptionList).forEach(s => {
            if (s.id !== id) {
                return;
            }

            const result = jsonEvent.params && jsonEvent.params.result ? jsonEvent.params.result : jsonEvent.result || null;
            if (!result) {
                return;
            }

            s.emit(result); // trigger the event handler defined in EventEmitter.on
        });
    }
}

export const Provider = ProviderClass;
export default Provider;

export abstract class ConnectHandler {
    protected provider: ProviderClass;
    // callback to trigger when connection is established
    protected connectedCB: () => void;
    // a user-defined function that will be triggered when connection is established
    private onInitCallback: Function;

    /**
     * Initialize a new connect handler with a Provider
     * @param provider
     */
    init(provider: ProviderClass) {
        if (this.provider) {
            throw new Error('Connect handler already initialized');
        }
        this.provider = provider;

        this.connectedCB = () => {
            this.provider.isConnected = true;
            this.provider.requestList && Object.values(this.provider.requestList).forEach(_q => {
                _q && _q(); // process pending requests in requestList when connected
            });
            this.onInitCallback && this.onInitCallback(this.provider); // trigger user-defined callback
        };
    }

    /**
     * Called by client, e.g. Provider class to register listener for connect event and trigger the callback when the event occurs.
     * This function will trigger the callback directly for http provider.
     * @param callback User-defined callback that will be triggered when connection is established
     */
    setConnectListener(callback: Function) {
        if (!this.provider) {
            throw new Error('Connect handler must be initialized first');
        }
        this.onInitCallback = callback;

        if (this.provider._provider.type === 'http' || this.provider._provider.connectStatus) {
            this.connectedCB(); // for http provider trigger callback directly
        } else if (this.provider._provider.on) {
            this.provider._provider.on('connect', () => { // this will be triggered when websocket or ipc connection is established
                this.connectedCB();
                this.onConnect();
            });
            this.provider._provider.on('close', () => {
                this.onClose();
            });
            this.provider._provider.on('error', err => {
                this.onError(err); // handle error
            });

            if (this.provider._provider.type === 'ipc') {
                this.provider._provider.on('end', msg => {
                    this.onEnd(msg);
                });
                this.provider._provider.on('timeout', () => {
                    this.onTimeout();
                });
            }
        }
    }

    protected onConnect() {}

    protected onClose() {
        this.setReconnect(); // set reconnect logic
    }

    protected onError(err: any) {}

    protected onEnd(msg: any) {}

    protected onTimeout() {}

    /**
     * Define your reconnect logic here
     */
    protected abstract setReconnect();
}

/**
 * ReconnectHandler will do auto reconnect when websocket or ipc connection is broken.
 * It accepts two parameters `retryTimes` and `retryInterval` for maximum number of retries and reconnection interval.
 */
export class ReconnectHandler extends ConnectHandler {
    times = 1; // counter
    private readonly retryTimes: number;
    private readonly retryInterval: number;

    /**
     * Create a ReconnectHandler instance with `retryTimes` and `retryInterval`
     * @param retryTimes Default is 10
     * @param retryInterval Default is 10000 ms
     */
    constructor(retryTimes = 10, retryInterval = 10000) {
        super();
        this.retryTimes = retryTimes;
        this.retryInterval = retryInterval;
    }

    protected setReconnect() {
        if (this.times > this.retryTimes) {
            return; // stop reconnect when maximum retries is reached
        }
        setTimeout(() => {
            this.times++;
            this.provider._provider.reconnect();
        }, this.retryInterval);
    }
}

/**
 * Reconnect with unlimited retries
 */
export class AlwaysReconnect extends ReconnectHandler {
    /**
     * Create an AlwaysReconnect instance with `retryInterval`
     * @param retryInterval Default is 10000 ms
     */
    constructor(retryInterval = 10000) {
        super(1, retryInterval);
    }

    protected onConnect() {
        this.times = 0; // reset counter on every reconnect
    }
}

/**
 * Reconnect with given retry times and interval, and renew subscriptions after connection is established
 */
export class RenewSubscription extends ReconnectHandler {
    protected onConnect() {
        // renew subscriptions
        Object.values(this.provider.subscriptionList).forEach(async e => {
            if (e.isSubscribe && e.payload) {
                const rep = await this.provider._provider.request(e.payload.method, e.payload.params);
                e.id = rep.result;
            }
        });
    }
}
