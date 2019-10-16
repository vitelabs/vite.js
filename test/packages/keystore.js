const assert = require('assert');

import { isValid, decrypt, encrypt, encryptV1ToV3, encryptOldKeystore } from '../../src/keystore/index';
import { createAddressByPrivateKey } from '../../src/wallet/address';

const OLD_PWD = '1';
const oldKeyJSON = {
    'hexaddress': 'vite_5f03e33f9550155548bf0a045a7a602384d3f1a65fb2ceff6b',
    'id': '71b3bd76-a938-403d-b876-57ca22f993f3',
    'crypto': {
        'ciphername': 'aes-256-gcm',
        'ciphertext': '03d8f2773ddce6132a5ceb136ba736ae1640ba2d664f2a8493a2f3ff2bb84dec8a3229edad6031a7ef494946852d3e3a45b0b3a88eb3167b41a3843d01d93c9abe52479f582b694e9c378dfb5aac7eb5',
        'nonce': 'a6bb299c35e48960e096351d',
        'kdf': 'scrypt',
        'scryptparams': {
            'n': 262144,
            'r': 8,
            'p': 1,
            'keylen': 32,
            'salt': 'a35724d6c46cb59e47c893a2bba3875c5b238c8a9ce9b2b1b3c4c0f6dec618db'
        }
    },
    'keystoreversion': 1,
    'timestamp': 1536059534
};
const oldks = JSON.stringify(oldKeyJSON);

const PWD = 'x';
const entropyV1 = 'a359c6c8438bff7b62d51b1ff390617363d4886ac9955124f6b3608f70efeea9';
const keyJSONV1 = {
    'encryptP': '606eb5afdfad86c7638d74bdda7bd922e2be3d726c1bb083bcc59a66a8e09768',
    'scryptParams': {
        'n': 4096,
        'r': 8,
        'p': 6,
        'keylen': 32,
        'salt': '5fcccee5c99afd6fc19cda07b0d4bc7e5d4b762cab99d2190ee8cb2b83139ac6'
    },
    'version': 1
};
const ksV1 = JSON.stringify(keyJSONV1);

// Old version do it
const keyJSONV1toV2 = {
    'encryptentropy': '64d689501e27d0ff5b99c06cd1005d0507a37c0d932b9dbccea56f3740fb8736a862735b3cc9c8b68d3e5d8f72091f79',
    'crypto': {
        'ciphername': 'aes-256-gcm',
        'kdf': 'scrypt',
        'salt': '5fcccee5c99afd6fc19cda07b0d4bc7e5d4b762cab99d2190ee8cb2b83139ac6',
        'nonce': '1b27e09a4f73dce83f17cc17'
    },
    'version': 2,
    'timestamp': 1542956499289
};
const ksV1toV2 = JSON.stringify(keyJSONV1toV2);

// current version do it
const keyJSONV1toV3 = {
    'uuid': '56536f60-f790-11e8-8abd-d3483c871226',
    'crypto': {
        'ciphername': 'aes-256-gcm',
        'ciphertext': 'c911d743a856e66263df5441fa050ccc667af8ef038966cbb6609fc8b86c5c0ccd745bea459ade7e811bec0391363bdd',
        'nonce': 'a18be60de9b8fc9c8a1e86fc',
        'kdf': 'scrypt',
        'scryptparams': {
            'n': 4096,
            'r': 8,
            'p': 6,
            'keylen': 32,
            'salt': '5fcccee5c99afd6fc19cda07b0d4bc7e5d4b762cab99d2190ee8cb2b83139ac6'
        }
    },
    'version': 3,
    'timestamp': 1543905993047
};
const ksV1toV3 = JSON.stringify(keyJSONV1toV3);


if (process.env.NODE_ENV !== 'testWatch') {
    describe('Old_Keystore', function () {
        it('valid', function () {
            const result = isValid(oldks);
            assert.equal(!!result, true);
        });

        it('the result of encrypt and decrypt is same', function (done) {
            const privKey = 'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951';

            encryptOldKeystore(privKey, OLD_PWD).then(keystoreF => {
                decrypt(keystoreF, OLD_PWD).then(_privKey => {
                    done(assert.equal(_privKey, privKey));
                }).catch(err => {
                    done(err);
                });
            }).catch(err => {
                done(err);
            });
        });

        it('only decrypt', function (done) {
            decrypt(oldks, OLD_PWD).then(privKey => {
                const k = createAddressByPrivateKey(privKey);
                done(assert.equal(k.address, oldKeyJSON.hexaddress));
            }).catch(err => {
                done(err);
            });
        });
    });

    describe('Keystore', function () {
        it('valid V1', function () {
            const result = isValid(ksV1);
            assert.equal(!!result, true);
        });
        it('valid V2', function () {
            const result = isValid(ksV1toV2);
            assert.equal(!!result, true);
        });
        it('valid V3', function () {
            const result = isValid(ksV1toV3);
            assert.equal(!!result, true);
        });

        it('decrypt V1', function (done) {
            decrypt(ksV1, PWD).then(verify => {
                done(assert.equal(verify, true));
            }).catch(err => {
                done(err);
            });
        });
        it('decrypt V2', function (done) {
            decrypt(ksV1toV2, PWD).then(entropy => {
                done(assert.equal(entropy, entropyV1));
            }).catch(err => {
                done(err);
            });
        });
        it('encrypt version 1 to version 3', function (done) {
            const k3 = encryptV1ToV3(entropyV1, ksV1);
            decrypt(k3, PWD).then(entropy => {
                done(assert.equal(entropy, entropyV1));
            }).catch(err => {
                done(err);
            });
        });

        it('encrypt', function (done) {
            encrypt(entropyV1, PWD).then(k => {
                decrypt(k, PWD).then(entropy => {
                    done(assert.equal(entropy, entropyV1));
                }).catch(err => {
                    done(err);
                });
            }).catch(err => {
                done(err);
            });
        });

        it('encrypt and change all scryptParams', function (done) {
            encrypt(entropyV1, PWD, {
                'n': 262144,
                'r': 8,
                'p': 1,
                'keylen': 32,
                'salt': 'a35724d6c46cb59e47c893a2bba3875c5b238c8a9ce9b2b1b3c4c0f6dec618db'
            }).then(k => {
                decrypt(k, PWD).then(entropy => {
                    done(assert.equal(entropy, entropyV1));
                }).catch(err => {
                    done(err);
                });
            }).catch(err => {
                done(err);
            });
        });
        it('encrypt and change scryptParams', function (done) {
            encrypt(entropyV1, PWD, {
                'r': 4,
                'p': 1
            }).then(k => {
                decrypt(k, PWD).then(entropy => {
                    done(assert.equal(entropy, entropyV1));
                }).catch(err => {
                    done(err);
                });
            }).catch(err => {
                done(err);
            });
        });
    });
}
