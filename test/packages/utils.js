const assert = require('assert');

import {
    hexToBytes, utf8ToBytes, bytesToHex, getBytesSize,
    getRawTokenId, validNodeName, isNonNegativeInteger,
    isInteger, getTokenIdFromRaw, uriStringify, ed25519,
    isSafeInteger
} from '../../src/utils/index';

const { keyPair, verify, getPublicKey, sign, random } = ed25519;

describe('strToUtf8', function () {
    it('case 1', function () {
        const utf8Bytes = utf8ToBytes('为');
        const hex = bytesToHex(utf8Bytes);

        assert.equal('e4b8ba', hex);
        assert.deepEqual(utf8Bytes, hexToBytes(hex));
    });
    it('case 2', function () {
        const utf8Bytes = utf8ToBytes('sdsdsds。；。、lp.;,p[oo阿京东方]');
        const hex = bytesToHex(utf8Bytes);

        assert.equal('73647364736473e38082efbc9be38082e380816c702e3b2c705b6f6fe998bfe4baace4b89ce696b95d', hex);
        assert.deepEqual(utf8Bytes, hexToBytes(hex));
    });
    it('case 3', function () {
        const utf8Bytes = utf8ToBytes('[坏笑]😊🙂🙂😆😅😅');
        const hex = bytesToHex(utf8Bytes);

        assert.equal('5be59d8fe7ac915d', hex);
        assert.deepEqual(utf8Bytes, hexToBytes(hex));
    });
});

describe('getBytesSize', function () {
    it('case 1', function () {
        assert.equal(40, getBytesSize('是打发发发 水电费是否爽肤水'));
    });
    it('case 2', function () {
        assert.equal(30, getBytesSize('sdjafofaodsfjwo8eifhsnodslkfjs'));
    });
    it('case 3', function () {
        assert.equal(56, getBytesSize('[坏笑]😊🙂🙂😆😅😅'));
    });
    it('case 4', function () {
        assert.equal(32, getBytesSize('[坏笑]😊🙂🙂😆😅😅', 'utf16'));
    });
});

describe('tools', function () {
    it('getRawTokenId', function () {
        assert.equal('5649544520544f4b454e', getRawTokenId('tti_5649544520544f4b454e6e40'));
    });
    it('uriStringify', function () {
        assert.equal('vite:vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad/echo?amount=1&data=MTIzYWJjZA', uriStringify({ target_address: 'vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad', params: { amount: 1, data: 'MTIzYWJjZA' }, function_name: 'echo' }));
        assert.equal('vite:vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad?tti=tti_5649544520544f4b454e6e40&amount=1&data=MTIzYWJjZA', uriStringify({ target_address: 'vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad', params: { tti: 'tti_5649544520544f4b454e6e40', amount: 1, data: 'MTIzYWJjZA' }}));
    });
    it('getTokenIdFromRaw', function () {
        assert.equal('tti_5649544520544f4b454e6e40', getTokenIdFromRaw('5649544520544f4b454e'));
    });
    it('validNodeName', function () {
        assert.equal(true, validNodeName('2323_sdsd'));
        assert.equal(true, validNodeName('2323_sd sd'));
        assert.equal(false, validNodeName(' 2323_sdsd '));
        assert.equal(false, validNodeName('2323_sd  sd'));
        assert.equal(false, validNodeName('232涉及到法律是否啊3_sd  sd'));
    });
    it('isNonNegativeInteger', function () {
        assert.equal(false, isNonNegativeInteger('232   2323'));
        assert.equal(true, isNonNegativeInteger('2323'));
        assert.equal(false, isNonNegativeInteger('0000'));
        assert.equal(true, isNonNegativeInteger('0'));
        assert.equal(false, isNonNegativeInteger('0.23829'));
    });
    it('isInteger', function () {
        assert.equal(false, isInteger('232   2323'));
        assert.equal(true, isInteger('2323'));
        assert.equal(true, isInteger('209823'));
        assert.equal(false, isInteger('09823'));
        assert.equal(false, isInteger('-09823'));
        assert.equal(false, isInteger('0000'));
        assert.equal(true, isInteger('0'));
        assert.equal(false, isInteger('-0'));
        assert.equal(true, isInteger('-209823'));
        assert.equal(false, isInteger('-2.323'));
        assert.equal(false, isInteger('0.23829'));
    });
    it('isSafeInteger', function () {
        assert.equal(-1, isSafeInteger('232   2323'));
        assert.equal(1, isSafeInteger('2323'));
        assert.equal(1, isSafeInteger(209823));
        assert.equal(-1, isSafeInteger('09823'));
        assert.equal(-1, isSafeInteger('-09823'));
        assert.equal(-1, isSafeInteger('0000'));
        assert.equal(1, isSafeInteger('0'));
        assert.equal(-1, isSafeInteger('-0'));
        assert.equal(1, isSafeInteger('-209823'));
        assert.equal(0, isSafeInteger(-2.323));
        assert.equal(-1, isSafeInteger('0.23829'));
        assert.equal(0, isSafeInteger(0.23829));
        assert.equal(0, isSafeInteger(-1000000000000000000));
        assert.equal(0, isSafeInteger(1000000000000000000));
    });
});


const testData = [ {
    priv: 'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951',
    pub: 'f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951',
    message: '3132333435363738393054455354',
    signature: '40920d59cc06c723687a990d0da75fac9bbc4cedfc3b1b7abecd3f1bf7f5f250df07829b19f557fe915589ea5f117207531bd827a052a1b1c9df789d01f4980e'
}, {
    priv: '3e07a131ef776640970bd4a2000202c04740c53bccb9ca9f76435d8967a459c496330193fc5bb0e3918a626a18205261f8715bfba6da4cf639e5654238d1a73e',
    pub: '96330193fc5bb0e3918a626a18205261f8715bfba6da4cf639e5654238d1a73e',
    message: '3132333435363738393054455354',
    signature: '5e2de232e327f5436b8dc5042b273d9f6f9670ff8b9fea321bdc3fc318a63781fe30cc0510354b13cb3b0e32fad47c152c0b48eedb7a5bb5b5d3ad94eb1a020c'
}, {
    priv: '698336fb3ddb03059c02ae960a7aa06f0dc77ae1a7fe8e473b3afa28b04cf3b49c954a2cd6d86fc6981a94223207d29dd37cf98d623128ebd047a9d088d5ae96',
    pub: '9c954a2cd6d86fc6981a94223207d29dd37cf98d623128ebd047a9d088d5ae96',
    message: '3132333435363738393054455354',
    signature: 'a1a9fb3163955c972c91a2d80d7e202bb21f0ba6f07a5feaf58739987e3554cc3907e3cc7144dedcc884d07cffeb94941866a64340acf0d667f3f491181b7a08'
} ];

testData.forEach((testCase, index) => {
    const priv = Buffer.from(testCase.priv, 'hex');
    const pub = getPublicKey(priv);

    const signature = sign(testCase.message, priv);

    describe(`test_${ index }`, function () {
        it('publicKey', function () {
            assert.equal(testCase.pub, Buffer.from(pub).toString('hex'));
        });

        it('signData', function () {
            assert.equal(signature, testCase.signature);
        });

        it('verifySign', function () {
            const result = verify(testCase.message, signature, pub);
            assert.equal(result, true);
        });
    });
});

it('keyPair', function () {
    const pairData = keyPair();
    const _pubkey = getPublicKey(pairData.privateKey);
    assert.deepEqual(_pubkey, pairData.publicKey);
});

it('random', function () {
    assert.equal(random().length, 32);
});
