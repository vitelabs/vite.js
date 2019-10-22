import { requestTimeout } from '~@vite/vitejs-error';

import { RPCRequest, RPCResponse, Methods } from './type';
import EventEmitter from './eventEmitter';


class ProviderClass {
    isConnected: Boolean
    private _provider: any
    private subscriptionList: Array<EventEmitter>
    private requestList: Array<any>

    constructor(provider: any, onInitCallback: Function) {
        this._provider = provider;
        this.isConnected = false;
        this.connectedOnce(onInitCallback);
        this.requestList = [];
        this.subscriptionList = [];
    }

    setProvider(provider, onInitCallback, abort) {
        abort && this._provider.abort(abort);
        this.unsubscribeAll();

        if (!provider) {
            return;
        }

        this._provider = provider;
        this.isConnected = false;
        this.connectedOnce(onInitCallback);
    }

    unsubscribe(event) {
        let i;

        for (i = 0; i < this.subscriptionList.length; i++) {
            if (this.subscriptionList[i] === event) {
                break;
            }
        }

        if (i >= this.subscriptionList.length) {
            return;
        }

        event && event.stopLoop();
        this.subscriptionList.splice(i, 1);

        if (!this.subscriptionList || !this.subscriptionList.length) {
            this._provider.unsubscribe && this._provider.unsubscribe();
        }
    }

    unsubscribeAll() {
        this.subscriptionList.forEach(s => {
            s.stopLoop();
        });
        this.subscriptionList = [];
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

    async notification(methods: Methods, ...args: any[]) {
        if (!this.isConnected) {
            return this._onReq('notification', methods, ...args);
        }

        return this._provider.notification(methods, args);
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
            rep = await this._provider.request(subMethodName, params);
            rep = rep.result;
        } else {
            rep = await this._onReq('request', subMethodName, ...params);
        }

        const subscription = rep;

        if (!this.subscriptionList || !this.subscriptionList.length) {
            this.subscriptionList = [];
            this._provider.subscribe && this._provider.subscribe(jsonEvent => {
                this.subscribeCallback(jsonEvent);
            });
        }

        const event = new EventEmitter(subscription, this, !!this._provider.subscribe);
        if (!this._provider.subscribe) {
            event.startLoop(jsonEvent => {
                this.subscribeCallback(jsonEvent);
            });
        }

        this.subscriptionList.push(event);
        return event;
    }


    private _offReq(_q) {
        let i;
        for (i = 0; i < this.requestList.length; i++) {
            if (this.requestList[i] === _q) {
                break;
            }
        }
        if (i === this.requestList.length) {
            return;
        }
        this.requestList.splice(i, 1);
    }

    private _onReq(type, methods, ...args) {
        return new Promise((res, rej) => {
            const _q = () => {
                this[type](methods, ...args).then(data => {
                    clearTimeout(_timeout);
                    this._offReq(_q);
                    res(data);
                }).catch(err => {
                    this._offReq(_q);
                    clearTimeout(_timeout);
                    rej(err);
                });
            };

            this.requestList.push(_q);

            const _timeout = setTimeout(() => {
                this._offReq(_q);
                rej(requestTimeout);
            }, this._provider._timeout || 30000);
        });
    }

    private subscribeCallback(jsonEvent) {
        if (!jsonEvent) {
            return;
        }

        const id = jsonEvent.params && jsonEvent.params.subscription ? jsonEvent.params.subscription : jsonEvent.subscription || '';
        if (!id) {
            return;
        }

        this.subscriptionList && this.subscriptionList.forEach(s => {
            if (s.id !== id) {
                return;
            }

            const result = jsonEvent.params && jsonEvent.params.result ? jsonEvent.params.result : jsonEvent.result || null;
            if (!result) {
                return;
            }

            s.emit(result);
        });
    }

    private connectedOnce(cb) {
        const connectedCB = () => {
            this.isConnected = true;
            this.requestList && this.requestList.forEach(_q => {
                _q && _q();
            });
            cb && cb(this);
        };

        if (this._provider.type === 'http' || this._provider.connectStatus) {
            connectedCB();
            return;
        }

        this._provider.on && this._provider.on('connect', () => {
            connectedCB();
            this._provider.remove('connect');
        });
    }
}

export const Provider = ProviderClass;
export default Provider;
