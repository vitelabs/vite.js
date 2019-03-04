import * as _methods from "const/method";
import { requestTimeout } from 'const/error';
import { RPCrequest, RPCresponse, Methods } from "const/type";
import txBlock from './txBlock';
import ledger from './ledger';
import eventEmitter from './eventEmitter';

export default class client {
    _provider: any
    isConnected: Boolean
    buildinTxBlock: txBlock
    buildinLedger: ledger
    private requestList: Array<any>

    wallet: _methods.walletFunc
    net: _methods.netFunc
    onroad: _methods.onroadFunc
    contract: _methods.contractFunc
    pledge: _methods.pledgeFunc
    register: _methods.registerFunc
    vote: _methods.voteFunc
    mintage: _methods.mintageFunc
    consensusGroup: _methods.consensusGroupFunc
    ledger: _methods.ledgerFunc
    tx: _methods.txFunc

    subscriptionList: Array<eventEmitter>

    constructor(provider: any, firstConnect: Function) {
        this._provider = provider;
        this.buildinTxBlock = new txBlock(this);
        this.buildinLedger = new ledger(this);

        this._setMethodsName();
        this.isConnected = false;
        this.connectedOnce(firstConnect);
        this.requestList = [];

        this.subscriptionList = [];
    }

    setProvider(provider, firstConnect, abort) {
        abort && this._provider.abort(abort);
        this._provider = provider;

        this.isConnected = false;
        this.connectedOnce(firstConnect);

        let providerType = this._provider.type || 'http';
        if (providerType.toLowerCase !== 'ipc' || this.wallet) {
            return;
        }

        this._setMethodsName();
    }

    connectedOnce(cb) {
        let connectedCB = () => {
            this.isConnected = true;
            this.requestList.forEach((_q) => {
                _q && _q();
            });
            cb && cb(this);
        }

        if (this._provider.type === 'http' || this._provider.connectStatus) {
            connectedCB();
            return;
        }

        this._provider.on('connect', () => {
            connectedCB();
            this._provider.remove('connect');
        });
    }

    private _setMethodsName() {
        let providerType = (this._provider.type || 'http').toLowerCase();
        for (let namespace in _methods) {
            if (providerType === 'ipc' && namespace === 'wallet') {
                this.wallet = null;
                continue;
            }

            if (this[namespace]) {
                continue;
            }

            let spaceMethods = _methods[namespace];
            this[namespace] = {};

            for (let methodName in spaceMethods) {
                let name = spaceMethods[methodName]
                this[namespace][methodName] = (...args: any[]) => {
                    return this.request(name, ...args);
                }
            }
        }
    }

    private _offReq(_q) {
        let i;
        for (i=0; i<this.requestList.length; i++) {
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
            let _q = () => {
                this[type](methods, ...args).then((data) => {
                    clearTimeout(_timeout);
                    res(data);
                }).catch((err) => {
                    clearTimeout(_timeout);
                    rej(err);
                });
            };

            this.requestList.push(_q);

            let _timeout = setTimeout(() => {
                this._offReq(_q);
                rej(requestTimeout);
            }, this._provider._timeout || 30000);
        });
    }

    async request(methods: Methods, ...args: any[]) {
        if (!this.isConnected) {
            return this._onReq('request', methods, ...args);
        }

        const rep: RPCresponse = await this._provider.request(methods, args);
        if (rep.error) { 
            throw rep.error 
        };
        return rep.result;
    }

    async notification(methods: Methods, ...args: any[]) {
        if (!this.isConnected) {
            return this._onReq('notification', methods, ...args);
        }

        return this._provider.notification(methods, args);
    }

    async batch(reqs: RPCrequest[]) {
        if (!this.isConnected) {
            return this._onReq('batch', reqs);
        }

        reqs.forEach(v => {
            v.type = v.type || 'request'
        });
        const reps: RPCresponse[] = await this._provider.batch(reqs);
        return reps;
    }

    private subscribeCallback(jsonEvent) {
        if (!jsonEvent || !jsonEvent.method || jsonEvent.method !== 'subscribe_subscription') {
            return;
        }

        let id = jsonEvent.params && jsonEvent.params.subscription ? jsonEvent.params.subscription : '';
        if (!id) {
            return;
        }

        this.subscriptionList && this.subscriptionList.forEach((s) => {
            if (s.id === id) {
                s.emit(jsonEvent.params.result || null);
            }
        });
    }

    async subscribe(methodName, ...args) {
        if (!this._provider.subscribe) {
            throw '[Error] Not supported subscribe.';
        }

        if (!this.isConnected) {
            return this._onReq('request', 'subscribe_subscribe', [methodName, ...args]);
        }

        const rep: RPCresponse = await this._provider.request('subscribe_subscribe', [methodName, ...args]);
        if (rep.error) {
            throw rep.error;
        };
        const subscription = rep.result;
        
        if (!this.subscriptionList || !this.subscriptionList.length) {
            this.subscriptionList = [];
            this._provider.subscribe((jsonEvent) => {
                this.subscribeCallback(jsonEvent);
            });
        }

        let event = new eventEmitter(subscription, this);
        this.subscriptionList.push(event);
        return event;
    }

    async unSubscribe(event) {
        let i;

        for(i = 0; i<this.subscriptionList.length; i++) {
            if (this.subscriptionList[i] === event) {
                break;
            }
        }

        if (i >= this.subscriptionList.length) {
            return;
        }

        this.subscriptionList.splice(i, 1);

        if (!this.subscriptionList || !this.subscriptionList.length) {
            this._provider.unSubscribe();
        }
    }

    clearSubscriptions() {
        this.subscriptionList = [];
        this._provider.unSubscribe();
    }
}
