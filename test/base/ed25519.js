const nacl = require('@sisi/tweetnacl-blake2b');
import {hexToBytes,bytesToHex} from '../../src/utils/encoder.ts';

const assert = require('assert');

let testData = [
    {
        priv:  'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951',
        pub:  'f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951',
        message:  '3132333435363738393054455354',
        signdata:  '40920d59cc06c723687a990d0da75fac9bbc4cedfc3b1b7abecd3f1bf7f5f250df07829b19f557fe915589ea5f117207531bd827a052a1b1c9df789d01f4980e'
    },{
        priv:  '3e07a131ef776640970bd4a2000202c04740c53bccb9ca9f76435d8967a459c496330193fc5bb0e3918a626a18205261f8715bfba6da4cf639e5654238d1a73e',
        pub:  '96330193fc5bb0e3918a626a18205261f8715bfba6da4cf639e5654238d1a73e',
        message:  '3132333435363738393054455354',
        signdata:  '5e2de232e327f5436b8dc5042b273d9f6f9670ff8b9fea321bdc3fc318a63781fe30cc0510354b13cb3b0e32fad47c152c0b48eedb7a5bb5b5d3ad94eb1a020c'
    },{
        priv:  '698336fb3ddb03059c02ae960a7aa06f0dc77ae1a7fe8e473b3afa28b04cf3b49c954a2cd6d86fc6981a94223207d29dd37cf98d623128ebd047a9d088d5ae96',
        pub:  '9c954a2cd6d86fc6981a94223207d29dd37cf98d623128ebd047a9d088d5ae96',
        message:  '3132333435363738393054455354',
        signdata:  'a1a9fb3163955c972c91a2d80d7e202bb21f0ba6f07a5feaf58739987e3554cc3907e3cc7144dedcc884d07cffeb94941866a64340acf0d667f3f491181b7a08'
    },{
        priv:  '3137c954bb5db9fee3d09a9dbed659e8cc55e9167dcf390a194ad53a56f7caadada822853301494d2ee4f7cee19cd7ba4cf733c1a9f9c6587cfe77e05ea1fbef',
        pub:  'ada822853301494d2ee4f7cee19cd7ba4cf733c1a9f9c6587cfe77e05ea1fbef',
        message:  '3132333435363738393054455354',
        signdata:  'a09e2fe5db06176ba61d19cf7995fc94536b3ab42038b8bd2cec23af74578bdcff1bbbb63929d3f9a2a2d364e3ba36a23f390dfaf047a132b4a6952b7714250d'
    },{
        priv:  'e54ff008736b665a7f2b963a4e62a9881c65e47c4d8e247e22e2e55d9825d4718101a7355f0848889b5e25753f2df325f4c3b5a18c2b11831b92733fc95e3222',
        pub:  '8101a7355f0848889b5e25753f2df325f4c3b5a18c2b11831b92733fc95e3222',
        message:  '3132333435363738393054455354',
        signdata:  'c8a81ee504a70be4478b292473cdd6f594694f09a8588091ce1c5e794c679655fd6d856b900951875fceacc4b38a580871238af449e7f464be398a6d39360a0c'
    },{
        priv:  '3cc60a3ab1d166bb44721c1dfd25e52090bb4561f60bbd961999a2b7a9ce074c44f7f5713563c9b5c963f5bc9054414480b99343176eb3f176c63ce4ae4609f2',
        pub:  '44f7f5713563c9b5c963f5bc9054414480b99343176eb3f176c63ce4ae4609f2',
        message:  '3132333435363738393054455354',
        signdata:  '46548d7e9a6e26f8d503d0acdd75534b40bc37f5ee0491c8bc9b7cc14f274b7d1fcbaa4bf6555792d34440e0587c9f180ef19ed00d517e5f085892bcae911d0e'
    },{
        priv:  '3fe76b90c5e5aa286be74f8bb46eeca51cb222d8116b8c0d866ac85111a8019a846758d990b7387c52ee81500b4f8e224b54e38d039ece1b55c1c8ba9525c82d',
        pub:  '846758d990b7387c52ee81500b4f8e224b54e38d039ece1b55c1c8ba9525c82d',
        message:  '3132333435363738393054455354',
        signdata:  '11ec37dac50d1a44e371e4f39ecc1f8e00eb11fcd8b2a1a631fc6a554bcddb388b9d60e641ee74e59b2fcc83d63d09b8ce80f53f45b93d44594b724afc1d830f'
    },{
        priv:  'd8bdc3ef0127d005753c0cbd5e2e9dea668aa754107d01462621bf8d4c7f9265857240579c9b3c74c98c70832640dc3fbb99d6f622ef5d26ab9e31ac95c870e5',
        pub:  '857240579c9b3c74c98c70832640dc3fbb99d6f622ef5d26ab9e31ac95c870e5',
        message:  '3132333435363738393054455354',
        signdata:  '8242de3dc7aaba746f1c214b4fd4233aa12120e38a9791058b6d9339d76ddbf8f8ca69186f3f12f7d7ef9d03cf254272b97363474746c29829bef59ceca8550b'
    },{
        priv:  'ca4bd3077d42d4151cb9d7837a212aa39de79d421e2bc8e5950b920a98ed5d58565f2dff433d06d116e70131079d3c99bf67bef6dc65fcad26fa0ee2180161c3',
        pub:  '565f2dff433d06d116e70131079d3c99bf67bef6dc65fcad26fa0ee2180161c3',
        message:  '3132333435363738393054455354',
        signdata:  'ce44d28754ec793813ca48d683887a3ce99d83e7eacef3bc7778bcbb8e686de0fb7cf31c0170eac615da5a6e60504a67fc8f574b93bd3e3f249d61329adbae0c'
    },{
        priv:  '38d1e19958515963c8abfb594fce598ed496d53183f77742425b375ff0a39efd5ff9b0ff38dc450eff27d619e596191ff3643e201a5d06f54672a93462fc335e',
        pub:  '5ff9b0ff38dc450eff27d619e596191ff3643e201a5d06f54672a93462fc335e',
        message:  '3132333435363738393054455354',
        signdata:  'e235b3d7088273bafd3dcf6f40c43a4e6be2aeb6e9eba48ac23e86331285efbe7d75acff1d0715749e96d1815a7dd6b35db793fd361dcabd67de1d341c3cd40e'
    }
];

testData.forEach((testCase, index)=>{
    let privByte = hexToBytes( testCase.priv );
    let key = nacl.sign.keyPair.fromSecretKey(privByte);

    let message = hexToBytes(testCase.message);
    let signData = nacl.sign.detached(message, privByte);
    let signHex = bytesToHex(signData);

    describe(`test_${index}`, function () {
        it('publicKey', function() {
            assert.equal(testCase.pub, bytesToHex(key.publicKey));
        });

        it('signData', function() {
            assert.equal(signHex, testCase.signdata);
        });

        it('verifySign', function() {
            let result = nacl.sign.detached.verify(message, signData, key.publicKey);
            assert.equal(result, true);
        });
    });
});
