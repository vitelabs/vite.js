import * as _methods from "const/method";
import { RPCrequest, RPCresponse, Methods } from "const/type";
// import { Builtin } from "./builtin";

import txBlock from './txBlock';
import ledger from './ledger';

export default class client {
    _provider: any
    // builtin: Builtin
    buildinTxBlock: txBlock
    buildinLedger: ledger

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

        this.buildinTxBlock = new txBlock(this);
        this.buildinLedger = new ledger(this);

        // this.builtin = new Builtin(this._provider);
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

    async request(methods: Methods, ...args: any[]) {
        const rep: RPCresponse = await this._provider.request(methods, args);
        if (rep.error) { 
            throw rep.error 
        };
        return rep.result;
    }

    async notification(methods: Methods, ...args: any[]) {
        return this._provider.notification(methods, args);
    }

    async batch(reqs: RPCrequest[]) {
        reqs.forEach(v => {
            v.type = v.type || 'request'
        });
        const reps: RPCresponse[] = await this._provider.batch(reqs);
        return reps;
    }

    async subscribe() {

    }

    async unSubscribe() {

    }
}
