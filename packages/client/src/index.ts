import txBlock from './txBlock';
import ledger from './ledger';
import { walletFunc, netFunc, onroadFunc, contractFunc, pledgeFunc, registerFunc, voteFunc, mintageFunc, consensusGroupFunc, ledgerFunc, txFunc, RPCrequest, RPCresponse, Methods } from './type';

import { method as _methods }  from '@vite/vitejs-constant';

export default class client {
    _provider: any
    buildinTxBlock: txBlock
    buildinLedger: ledger

    wallet: walletFunc
    net: netFunc
    onroad: onroadFunc
    contract: contractFunc
    pledge: pledgeFunc
    register: registerFunc
    vote: voteFunc
    mintage: mintageFunc
    consensusGroup: consensusGroupFunc
    ledger: ledgerFunc
    tx: txFunc

    constructor(provider: any, firstConnect: Function) {
        this._provider = provider;
        this.buildinTxBlock = new txBlock(this);
        this.buildinLedger = new ledger(this);

        firstConnect && this.connectedOnce(firstConnect);
        this._setMethodsName();
    }

    connectedOnce(cb) {
        if (this._provider.type === 'http' || this._provider.connectStatus) {
            cb && cb(this);
            return;
        }

        this._provider.on('connect', () => {
            cb && cb(this);
            this._provider.remove('connect');
        });
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

    setProvider(provider, abort) {
        abort && this._provider.abort(abort);
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
