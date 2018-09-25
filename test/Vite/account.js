const assert = require('assert');
import vitejs from '../../index.js';

const HTTP_RPC = new vitejs.HTTP_RPC({});
const ViteJS = new vitejs(HTTP_RPC);
const Account = ViteJS.Vite.Account;

describe('Vite_Account', function () {
    let accountBlock = {
        'snapshotTimestamp': 'bc3002d5f874350854806ab7db3e00c656bc3240533e47704b2d49e1386b8ca7',
        'accountAddress': 'vite_18068b64b49852e1c4dfbc304c4e606011e068836260bc9975',
        'timestamp': 1537510969,
        'nonce': '0000000000',
        'tokenId': 'tti_000000000000000000004cfd',
        'meta':{
            'height':'19'
        },
        'publicKey': 'f13846b668dd58cc7a1e7da580c4c916b8c2fb390a6ff9d66278ed65b6823341',
        'fAmount': '0',
        'amount':'1000000000000000000',
        'data':'',
        'prevHash':'37389229df60ccbd5ca2c96d48cc08a2d3f4ba5f4f24618681b119f19309ad17',
        'difficulty':'0000000000',
        'to':'vite_4827fbc6827797ac4d9e814affb34b4c5fa85d39bf96d105e7'
    };
    let privKey = '1da63c9641c9dcab4f7eb382269dee80a333c925bc0ce2ee27bc8a244d2ca4d1f13846b668dd58cc7a1e7da580c4c916b8c2fb390a6ff9d66278ed65b6823341';
    
    it('test_signTX', function () {
        let { hash, signature } = Account.signTX(accountBlock, privKey);
        assert.equal(hash, '3e94e0090dd2f95d9c3ff3ece2b38fff52084dd34c9c6d0cff40c942a7013d31');
        assert.equal(signature, 'a9f04266e7e0e1a5b6942af781c810f30548adcdddf06ce4008ba82cde2fa8f2dcd03efff26b597ba11706cd5fb3f01fd5fff6ec8957fdee397c17557cf8ca07');
    });
});
