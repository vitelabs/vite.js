import Version from './version.js';
import Account from './account/index.js';
import Ledger from './ledger/index.js';
import P2P from './p2p/index.js';
import Types from './types/index.js';

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