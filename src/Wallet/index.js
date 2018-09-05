import keystore from './keystore.js';

class Wallet {
    constructor(Vite) {
        this.version = 1;
        this.Vite = Vite;

        this.Keystore = new keystore();
        
    }
}

export default Wallet;
