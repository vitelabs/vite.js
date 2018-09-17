import keystore from './keystore.js';
import address from './address.js';

class Wallet {
    constructor(Vite) {
        this.version = 1;
        this.Vite = Vite;

        this.Keystore = new keystore();
        this.Address = new address();
    }
}

export default Wallet;
