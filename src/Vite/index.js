import Version from './version.js';
import Ledger from './ledger.js';

class Vite {
    constructor(provider) {
        this._currentProvider = provider;

        this.Version = new Version(provider);
        this.Ledger = new Ledger(provider);
    }

    setProvider(provider, abort = true) {
        this._currentProvider.reset(abort);
        this._currentProvider = provider;
    }
}

export default Vite;
