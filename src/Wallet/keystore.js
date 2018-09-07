import libUtils from '../../libs/utils';
import utils from '../utils/index';

const uuid = require('pure-uuid');
const scryptsy = require('scryptsy');
const nacl = require('../../libs/nacl_blake2b');
const crypto = typeof window !== 'undefined' ? require('browserify-aes') : require('crypto');

const versions = [1];
const algorithms = ['aes-256-gcm'];
const scryptName = 'scrypt';
const additionData = Buffer.from('vite');

const privKeyLen = 64;

class keystore {
    constructor() {
        this.keystoreVersion = 1;

        // LightScryptN is the N parameter of Scrypt encryption algorithm, using 4MB
        // memory and taking approximately 100ms CPU time on a modern processor.
        this.n = 4096;
        // LightScryptP is the P parameter of Scrypt encryption algorithm, using 4MB
        // memory and taking approximately 100ms CPU time on a modern processor.
        this.p = 6;
        this.scryptR = 8;
        this.scryptKeyLen = 32;

        this.algorithm = 'aes-256-gcm';
    }

    encrypt(key, pwd) {
        let scryptParams = {
            n: this.n,
            r: this.scryptR,
            p: this.p,
            keylen: this.scryptKeyLen,
            salt: libUtils.bytesToHex(nacl.randomBytes(32)),
        };
        let encryptPwd = encryptKey(pwd, scryptParams);

        // TestData
        // cipherText({
        //     hexData: '313132323333343435353636373738383939414141424243434243', 
        //     pwd: libUtils.hexToBytes('3131313132323232333333333434343435353535363636363737373738383838'), 
        //     nonce: libUtils.hexToBytes('95c9fc5de8a48943cdc96bd0'),
        //     algorithm: 'aes-256-gcm'
        // });
        // 'c47a0f805282c664df34f0c32e5cc43331362585cf090734850001d32cb91f62971277056c222f0c904ee8'
    
        let nonce = nacl.randomBytes(12);
        let text = cipherText({
            hexData: key.privKey,
            pwd: encryptPwd, 
            nonce, 
            algorithm: this.algorithm
        });

        let cryptoJSON = {
            cipherName: this.algorithm,
            KDF: scryptName,
            ScryptParams: scryptParams,
            CipherText: text,
            Nonce: libUtils.bytesToHex(nonce)
        };
    
        let encryptedKeyJSON = {
            hexAddress: key.hexAddr,
            crypto: cryptoJSON,
            id: new uuid(1).format(),
            keystoreversion: this.keystoreVersion,
            timestamp: new Date().getTime(),
        };
    
        return JSON.stringify(encryptedKeyJSON).toLocaleLowerCase();
    }

    isValid(keystore) {
        // Out keystore file size is about 500 so if a file is very large it must not be a keystore file
        if (libUtils.getBytesSize(keystore) > 2 * 1024) {
            return false;
        }
    
        // Must be a JSON-string
        let keyJson = {};
        try {
            keyJson = JSON.parse(keystore.toLowerCase());
        } catch(err) {
            console.warn(err);
            return false;
        }

        // Required parameter
        if (!keyJson.id || 
            !keyJson.crypto || 
            !keyJson.hexaddress || 
            !keyJson.keystoreversion || 
            !utils.isValidHexAddr(keyJson.hexaddress)) {
            return false;
        }
    
        try {
            new uuid().parse(keyJson.id);
        } catch (err) {
            console.warn(err);
            return false;
        }

        if (versions.indexOf(+keyJson.keystoreversion) === -1) {
            return false;
        }

        // Check cryptoJSON
        let crypto = keyJson.crypto;
        try {
            if (algorithms.indexOf(crypto.ciphername) === -1 ||
                crypto.kdf !== scryptName ||
                !crypto.scryptparams ||
                !crypto.scryptparams.salt) {
                return false;
            }

            libUtils.hexToBytes(crypto.ciphertext);
            libUtils.hexToBytes(crypto.nonce);
            libUtils.hexToBytes(crypto.scryptparams.salt);
        } catch(err) {
            console.warn(err);
            return false;
        }

        return keyJson;
    }

    decrypt(keystore, pwd) {
        let keyJson = this.isValid(keystore);
        if (!keyJson) {
            return false;
        }

        let encryptPwd = encryptKey(pwd, keyJson.crypto.scryptparams);
        let ciphertext = keyJson.crypto.ciphertext.slice(0, privKeyLen * 2);
        let tag = keyJson.crypto.ciphertext.slice(privKeyLen * 2);

        let privKey;
        try {
            const decipher = crypto.createDecipheriv(keyJson.crypto.ciphername, encryptPwd, libUtils.hexToBytes(keyJson.crypto.nonce));
            decipher.setAuthTag( libUtils.hexToBytes(tag) );
            decipher.setAAD(additionData);
    
            privKey = decipher.update(libUtils.hexToBytes(ciphertext), 'utf8', 'hex');
            privKey += decipher.final('hex');
        } catch(err) {
            console.warn(err);
            return false;
        }

        return privKey;
    }
}

export default keystore;

function encryptKey(pwd, scryptParams) {
    let pwdBuff = Buffer.from(pwd);
    let salt = libUtils.hexToBytes(scryptParams.salt);
    salt = Buffer.from(salt);
    return scryptsy(pwdBuff, salt, +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen);
}

function cipherText({ hexData, pwd, nonce, algorithm }) {
    let cipher = crypto.createCipheriv(algorithm, pwd, nonce);
    cipher.setAAD(additionData);

    let ciphertext = cipher.update(libUtils.hexToBytes(hexData), 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    let tag = cipher.getAuthTag().toString('hex');

    return ciphertext + tag;
}
