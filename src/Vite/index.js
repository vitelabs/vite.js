import Version from './version.js';
import Account from './account.js';
import Ledger from './ledger.js';
import P2P from './p2p.js';
import Types from './types.js';

class Vite {
    constructor(provider) {
        this._currentProvider = provider;

        this.Version = new Version(provider);
        this.Account = new Account(provider);
        this.Ledger = new Ledger(provider);
        this.P2P = new P2P(provider);
        this.Types = new Types(provider);
    }

    setProvider(provider, abort = true) {
        this._currentProvider.reset(abort);
        this._currentProvider = provider;
    }
}

export default Vite;
