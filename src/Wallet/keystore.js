// Compatible with the wallet-client keystore

import libUtils from '../../libs/utils';
import address from '../address.js';

const uuid = require('pure-uuid');
const scryptsy = require('scryptsy');
const nacl = require('@sisi/tweetnacl-blake2b');
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
            !address.isValidHexAddr(keyJson.hexaddress)) {
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
