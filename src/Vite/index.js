import Version from './version.js';
import Account from './account.js';
import Ledger from './ledger.js';
import Methods from './rpcMethods';


class Vite {
    constructor(provider) {
        this._currentProvider = provider;

        for (let namespace in Methods) {
            Methods[namespace].forEach(name => {
                let methodName = `${namespace}_${name}`;
                this[methodName] = (...params) => {
                    return this._currentProvider.request(methodName, params);
                };
            });
        }

        this.Version = new Version(provider);
        this.Account = new Account(provider);
        this.Ledger = new Ledger(provider);
    }

    setProvider(provider, abort = true) {
        this._currentProvider.reset(abort);
        this._currentProvider = provider;
    }
}

export default Vite;
