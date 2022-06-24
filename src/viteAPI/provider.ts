import { requestTimeout } from '@vite/vitejs-error';

import { RPCRequest, RPCResponse, Methods } from './type';
import EventEmitter from './eventEmitter';
import ConnectHandler, { ReconnectHandler } from './connectHandler';


class ProviderClass {
    isConnected = false;
    private _provider: any; // connection provider
    private subscriptionList: {[id:number]:EventEmitter} = {};
    private subscriptionId = 0;
    private requestList: {[id:number]:()=>void} = {}; // pending request queue
    private requestId = 0;
    private connectHandler?: ConnectHandler;

    constructor(provider: any, onInitCallback: Function, onConnectCallback?: ConnectHandler) {
        this._provider = provider;
        this.connectHandler = onConnectCallback || new ReconnectHandler();
        this.connectHandler.init(this);
        this.connectHandler.onConnect(onInitCallback);
    }

    setProvider(provider, onInitCallback, abort) {
        abort && this._provider.abort(abort);
        this.unsubscribeAll();

        if (!provider) {
            return;
        }

        this._provider = provider;
        this.isConnected = false;
        this.connectHandler?.onConnect(onInitCallback);
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
        } else { // if the connection is not established, temporarily put the request in the request queue
            rep = await this._onReq('request', subMethodName, ...params);
        }

        const subscription = rep;

        if (!Object.keys(this.subscriptionList).length) { // initialize if the subscription list is empty
            this.subscriptionList = {};
            // register the subscription event handling callback to the connection provider
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

    // when the connection is not established, the request is stored in requestList and wait to be executed after the connection is established
    private _onReq(type, methods, ...args) {
        return new Promise((res, rej) => {
            const _q = () => { // create the request
                this[type](methods, ...args).then(data => {
                    clearTimeout(_timeout);
                    this._offReq(_q); // move the request out of queue after execution
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

    // process the event response
    private subscribeCallback(jsonEvent) {
        if (!jsonEvent) {
            return;
        }

        const id = jsonEvent.params && jsonEvent.params.subscription ? jsonEvent.params.subscription : jsonEvent.subscription || '';
        if (!id) {
            return;
        }

        // find the matching corresponding event handler in the subscription list
        Object.values(this.subscriptionList).forEach(s => {
            if (s.id !== id) {
                return;
            }

            const result = jsonEvent.params && jsonEvent.params.result ? jsonEvent.params.result : jsonEvent.result || null;
            if (!result) {
                return;
            }

            s.emit(result); // call the event handling callback defined through event.on
        });
    }
}

export const Provider = ProviderClass;
export default Provider;
