import txBlock from './txBlock';
import ledger from './ledger';
import { subscribeFunc, walletFunc, netFunc, onroadFunc, contractFunc, pledgeFunc, registerFunc, voteFunc, mintageFunc, consensusGroupFunc, ledgerFunc, txFunc } from "../type";

import { methods as _methods } from 'constant';
import netProcessor from "netProcessor";


export default class client extends netProcessor {
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
    subscribeFunc: subscribeFunc

    constructor(provider: any, firstConnect: Function) {
        super(provider, firstConnect);

        this.buildinTxBlock = new txBlock(this);
        this.buildinLedger = new ledger(this);

        this._setMethodsName();
    }

    setProvider(provider, firstConnect, abort) {
        this._setProvider(provider, firstConnect, abort);

        let providerType = this._provider.type || 'http';
        if (providerType.toLowerCase !== 'ipc' || this.wallet) {
            return;
        }

        this._setMethodsName();
    }

    private _setMethodsName() {
        let providerType = (this._provider.type || 'http').toLowerCase();
        for (let namespace in _methods) {
            if (providerType === 'ipc' && namespace === 'wallet') {
                this.wallet = null;
                continue;
            }

            let _namespace = namespace === 'subscribe' ? 'subscribeFunc' : namespace;

            if (this[_namespace]) {
                continue;
            }

            let spaceMethods = _methods[namespace];
            this[_namespace] = {};

            for (let methodName in spaceMethods) {
                let name = spaceMethods[methodName]
                this[_namespace][methodName] = (...args: any[]) => {
                    return this.request(name, ...args);
                }
            }
        }
    }
}
