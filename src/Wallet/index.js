import keystore from './keystore.js';
import hd from './hd.js';

class Wallet {
    constructor(Vite) {
        this.version = 1;
        this.Vite = Vite;

        this.Keystore = new keystore();
        this.HD = new hd(this.Vite);
    }
}

export default Wallet;
