const assert = require('assert');
import vitejs from '../../index.js';

const HTTP_RPC = new vitejs.HTTP_RPC({});
const ViteJS = new vitejs(HTTP_RPC);

describe('Account_newHexAddr', function () {
    it('test', function () {
        let privKey = 'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951';
        let k = ViteJS.Vite.Account.newHexAddress(privKey);
        assert.equal(k.privKey, privKey);
    });
});

describe('Account_isValidHexAddr', function () {
    it('test', function () {
        let privKey = '3e07a131ef776640970bd4a2000202c04740c53bccb9ca9f76435d8967a459c496330193fc5bb0e3918a626a18205261f8715bfba6da4cf639e5654238d1a73e';
        let k = ViteJS.Vite.Account.newHexAddress(privKey);
        assert.equal( ViteJS.Vite.Types.isValidHexAddress(k.hexAddr), true );
    });
});
