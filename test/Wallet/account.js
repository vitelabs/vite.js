const assert = require('assert');
import vitejs from '../../index.js';

const HTTP_RPC = new vitejs.HTTP_RPC({});
const ViteJS = new vitejs(HTTP_RPC);
const Account = ViteJS.Wallet.Account;

describe('Wallet_Account', function () {
    it('test_encrypt_decrypt', function () {
        let pass = 'sdsdsdsds';
        let encrypt = Account.encrypt(pass);
        let verify = Account.verify(encrypt, pass);

        assert.equal(verify, true);
    });
});
