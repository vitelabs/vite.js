import TxBlock from './txBlock';
import Ledger from './ledger';
import { subscribeFunc, walletFunc, netFunc, onroadFunc, contractFunc, pledgeFunc, registerFunc, voteFunc, mintageFunc, consensusGroupFunc, ledgerFunc, txFunc } from '../type';

import { methods as _methods } from 'constant';
import netProcessor from 'netProcessor';


export default class Client extends netProcessor {
    buildinTxBlock: TxBlock
    buildinLedger: Ledger

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

        this.buildinTxBlock = new TxBlock(this);
        this.buildinLedger = new Ledger(this);

        this._setMethodsName();
    }

    setProvider(provider, firstConnect, abort) {
        this._setProvider(provider, firstConnect, abort);

        const providerType = this._provider.type || 'http';
        if (providerType.toLowerCase !== 'ipc' || this.wallet) {
            return;
        }

        this._setMethodsName();
    }

    private _setMethodsName() {
        const providerType = (this._provider.type || 'http').toLowerCase();
        for (const namespace in _methods) {
            if (!Object.prototype.hasOwnProperty.call(_methods, namespace)) {
                continue;
            }

            if (providerType === 'ipc' && namespace === 'wallet') {
                this.wallet = null;
                continue;
            }

            const _namespace = namespace === 'subscribe' ? 'subscribeFunc' : namespace;
            if (this[_namespace]) {
                continue;
            }

            const spaceMethods = _methods[namespace];
            this[_namespace] = {};

            for (const methodName in spaceMethods) {
                if (!Object.prototype.hasOwnProperty.call(spaceMethods, namespace)) {
                    continue;
                }

                const name = spaceMethods[methodName];
                this[_namespace][methodName] = (...args: any[]) => this.request(name, ...args);
            }
        }
    }
}
