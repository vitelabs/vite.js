import { verify, getPublicKey, sign } from '../../packages/utils/src/ed25519';
import { bytesToHex } from '../../packages/utils/src/encoder';

const assert = require('assert');

let testData = [{
    priv:  'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951',
    pub:  'f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951',
    message:  '3132333435363738393054455354',
    signature:  '40920d59cc06c723687a990d0da75fac9bbc4cedfc3b1b7abecd3f1bf7f5f250df07829b19f557fe915589ea5f117207531bd827a052a1b1c9df789d01f4980e'
},{
    priv:  '3e07a131ef776640970bd4a2000202c04740c53bccb9ca9f76435d8967a459c496330193fc5bb0e3918a626a18205261f8715bfba6da4cf639e5654238d1a73e',
    pub:  '96330193fc5bb0e3918a626a18205261f8715bfba6da4cf639e5654238d1a73e',
    message:  '3132333435363738393054455354',
    signature:  '5e2de232e327f5436b8dc5042b273d9f6f9670ff8b9fea321bdc3fc318a63781fe30cc0510354b13cb3b0e32fad47c152c0b48eedb7a5bb5b5d3ad94eb1a020c'
},{
    priv:  '698336fb3ddb03059c02ae960a7aa06f0dc77ae1a7fe8e473b3afa28b04cf3b49c954a2cd6d86fc6981a94223207d29dd37cf98d623128ebd047a9d088d5ae96',
    pub:  '9c954a2cd6d86fc6981a94223207d29dd37cf98d623128ebd047a9d088d5ae96',
    message:  '3132333435363738393054455354',
    signature:  'a1a9fb3163955c972c91a2d80d7e202bb21f0ba6f07a5feaf58739987e3554cc3907e3cc7144dedcc884d07cffeb94941866a64340acf0d667f3f491181b7a08'
}];

testData.forEach((testCase, index)=>{
    let priv = Buffer.from(testCase.priv, 'hex');
    let pub = getPublicKey(priv);

    let signature = sign(testCase.message, priv);

    describe(`test_${index}`, function () {
        it('publicKey', function() {
            assert.equal(testCase.pub, bytesToHex(pub));
        });

        it('signData', function() {
            assert.equal(signature, testCase.signature);
        });

        it('verifySign', function() {
            let result = verify(testCase.message, signature, pub);
            assert.equal(result, true);
        });
    });
});
