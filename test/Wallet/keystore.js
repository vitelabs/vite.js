const assert = require('assert');
import Keystore  from '../../src/Wallet/keystore';
import { newHexAddr } from 'utils/address';

const keystore = new Keystore();

let keyJSON = {'hexaddress':'vite_5f03e33f9550155548bf0a045a7a602384d3f1a65fb2ceff6b','id':'71b3bd76-a938-403d-b876-57ca22f993f3','crypto':{'ciphername':'aes-256-gcm','ciphertext':'03d8f2773ddce6132a5ceb136ba736ae1640ba2d664f2a8493a2f3ff2bb84dec8a3229edad6031a7ef494946852d3e3a45b0b3a88eb3167b41a3843d01d93c9abe52479f582b694e9c378dfb5aac7eb5','nonce':'a6bb299c35e48960e096351d','kdf':'scrypt','scryptparams':{'n':262144,'r':8,'p':1,'keylen':32,'salt':'a35724d6c46cb59e47c893a2bba3875c5b238c8a9ce9b2b1b3c4c0f6dec618db'}},'keystoreversion':1,'timestamp':1536059534};
const ks = JSON.stringify(keyJSON);

if (process.env.NODE_ENV !== 'testWatch') {
    describe('Wallet_encryptKeystore', function () {
        it('test_encrypt', function () {
            let privKey = 'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951';
            let k = newHexAddr(privKey);
            let keystore = keystore.encrypt(k, '1');
            assert.equal(keystore.decrypt(keystore, '1'), privKey);
        });
    });

    describe('Wallet_isValidKeystore', function() {
        it('test_valid', function () {
            let result = keystore.isValid(ks);
            assert.equal(!!result, true);
        });
    });

    describe('Wallet_decryptKeystore', function() {
        it('test_decrypt', function () {
            let privKey = keystore.decrypt(ks, '1');
            let k = newHexAddr(privKey);
            assert.equal(k.hexAddr, keyJSON.hexaddress);
        });
    });
}
