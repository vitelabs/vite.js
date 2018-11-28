const assert = require('assert');
import {encrypt,decrypt} from '../../src/Wallet/account';

describe('Wallet_Account', function () {
    it('test_encrypt_decrypt', function () {
        let entropy = 'e92a9e90900908185e6c041b21be5602bc515357d60504b1f10d65ae445af516';
        let encryptRes = encrypt(entropy, '1');
        let encryptEntropy = decrypt(encryptRes, '1');
        assert.equal(encryptEntropy, entropy);
    });
});
