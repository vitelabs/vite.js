import * as _methods from "const/method";
import txBlock from './txBlock';
import ledger from './ledger';
import netProcessor from "netProcessor";

export default class client extends netProcessor {
    buildinTxBlock: txBlock
    buildinLedger: ledger

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
    subscribeFunc: _methods.subscribeFunc

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
