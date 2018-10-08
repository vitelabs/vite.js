const assert = require('assert');
import vitejs from '../../index.js';

const HTTP_RPC = new vitejs.HTTP_RPC({});
const ViteJS = new vitejs(HTTP_RPC);
const Account = ViteJS.Wallet.Account;

describe('Wallet_Account', function () {
    // it('test_encrypt_decrypt', function () {
    //     let pass = 'sdsdsdsds';
    //     let encrypt = Account.encrypt(pass);
    //     let verify = Account.verify(encrypt, pass);

    //     assert.equal(verify, true);
    // });

    it('test_encrypt_decrypt', function () {
        let entropy = 'e92a9e90900908185e6c041b21be5602bc515357d60504b1f10d65ae445af516';
        let encrypt = Account.encrypt(entropy, '1');
        let encryptEntropy = Account.decrypt(encrypt, '1');
        // console.log(encrypt);
        assert.equal(encryptEntropy, entropy);
    });
});
