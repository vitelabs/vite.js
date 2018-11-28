const assert = require('assert');
import tools from 'utils/tools';

const Account = tools;

describe('Wallet_Account', function () {
    it('test_encrypt_decrypt', function () {
        let entropy = 'e92a9e90900908185e6c041b21be5602bc515357d60504b1f10d65ae445af516';
        let encrypt = Account.encrypt(entropy, '1');
        let encryptEntropy = Account.decrypt(encrypt, '1');
        assert.equal(encryptEntropy, entropy);
    });
});
