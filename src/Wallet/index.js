import keystore from './keystore.js';
import address from './address.js';
import account from './account.js';

class Wallet {
    constructor(Vite) {
        this.version = 1;
        this.Vite = Vite;

        this.Keystore = new keystore();
        this.Address = new address();
        this.Account = new account(Vite);
    }
}

export default Wallet;
