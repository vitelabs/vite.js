import methods, * as _methods from "const/method";
import { Builtin } from "./builtin";

export declare interface RPCrequest {
    types?: string;
    Method: methods;
    params: any[];
}

export declare interface RPCresponse {
    jsonrpc?: string;
    id?: number;
    result?: any;
    error?: RPCerror
}

export declare interface RPCerror {
    code: number,
    message: string
}

export default class client {
    _provider: any
    builtin: Builtin
    wallet: any
    net: Object
    onroad: Object
    contract: Object
    pledge: Object
    register: Object
    vote: Object
    mintage: Object
    consensusGroup: Object
    ledger: Object
    tx: Object

    constructor(provider: any) {
        this._provider = provider;
        this.builtin = new Builtin(this._provider);
        this._setMethodsName();
    }

    _setMethodsName() {
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

    set provider(provider) {
        this._provider = provider;

        let providerType = this._provider.type || 'http';
        if (providerType.toLowerCase !== 'ipc' || this.wallet) {
            return;
        }
        this._setMethodsName();
    }

    async request(methods: methods, ...args: any[]) {
        const rep: RPCresponse = await this._provider.request(methods, args);
        if (rep.error) { 
            throw rep.error 
        };
        return rep.result;
    }

    async notification(methods: methods, ...args: any[]) {
        return this._provider.notification(methods, args);
    }

    async batch(reqs: RPCrequest[]) {
        reqs.forEach(v => {
            v.types = v.types || 'request'
        });
        const reps: RPCresponse[] = await this._provider.batch(reqs);
        return reps;
    }

    async subscribe() {

    }

    async unSubscribe() {

    }
}
