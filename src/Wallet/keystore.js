// Compatible with the wallet-client keystore

import { bytesToHex, getBytesSize, hexToBytes } from 'utils/encoder';
import { isValidHexAddr } from 'utils/address';

const uuid = require('pure-uuid');
const scryptsy = require('scryptsy');
const nacl = require('@sisi/tweetnacl-blake2b');
const crypto = typeof window !== 'undefined' ? require('browserify-aes') : require('crypto');

const versions = [1];
const algorithms = ['aes-256-gcm'];
const scryptName = 'scrypt';
const additionData = Buffer.from('vite');

const privKeyLen = 64;

class Keystore {
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

    encrypt(key, pwd, selfScryptsy) {
        let scryptParams = {
            n: this.n,
            r: this.scryptR,
            p: this.p,
            keylen: this.scryptKeyLen,
            salt: bytesToHex(nacl.randomBytes(32)),
        };

        let getResult = (encryptPwd, res) => {
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
                Nonce: bytesToHex(nonce)
            };

            let encryptedKeyJSON = {
                hexAddress: key.hexAddr,
                crypto: cryptoJSON,
                id: new uuid(1).format(),
                keystoreversion: this.keystoreVersion,
                timestamp: new Date().getTime(),
            };
            return res(JSON.stringify(encryptedKeyJSON).toLocaleLowerCase());
        };

        return new Promise((res, rej) => {
            encryptKey(pwd, scryptParams, selfScryptsy).then((result) => {
                getResult(result, res);
            }).catch((err) => {
                rej(err);
            });
        });
    }

    isValid(keystore) {
        // Out keystore file size is about 500 so if a file is very large it must not be a keystore file
        if (getBytesSize(keystore) > 2 * 1024) {
            return false;
        }

        // Must be a JSON-string
        let keyJson = {};
        try {
            keyJson = JSON.parse(keystore.toLowerCase());
        } catch (err) {
            console.warn(err);
            return false;
        }

        // Required parameter
        if (!keyJson.id ||
            !keyJson.crypto ||
            !keyJson.hexaddress ||
            !keyJson.keystoreversion ||
            !isValidHexAddr(keyJson.hexaddress)) {
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

            hexToBytes(crypto.ciphertext);
            hexToBytes(crypto.nonce);
            hexToBytes(crypto.scryptparams.salt);
        } catch (err) {
            console.warn(err);
            return false;
        }

        return keyJson;
    }

    decrypt(keystore, pwd, selfScryptsy) {
        let keyJson = this.isValid(keystore);
        if (!keyJson) {
            return Promise.reject(false);
        }

        let ciphertext = keyJson.crypto.ciphertext.slice(0, privKeyLen * 2);
        let tag = keyJson.crypto.ciphertext.slice(privKeyLen * 2);
        console.log(tag);

        let getResult = (encryptPwd, res, rej) => {
            try {
                const decipher = crypto.createDecipheriv(keyJson.crypto.ciphername, encryptPwd, hexToBytes(keyJson.crypto.nonce));
                decipher.setAuthTag(hexToBytes(tag));
                decipher.setAAD(additionData);

                let privKey = decipher.update(hexToBytes(ciphertext), 'utf8', 'hex');
                privKey += decipher.final('hex');
                return res(privKey);
            } catch (err) {
                return rej(err);
            }
        };

        return new Promise((res, rej) => {
            encryptKey(pwd, keyJson.crypto.scryptparams, selfScryptsy).then((result) => {
                getResult(result, res, rej);
            }).catch((err) => {
                rej(err);
            });
        });
    }
}

export default Keystore;

function encryptKey(pwd, scryptParams, selfScryptsy) {
    let salt = hexToBytes(scryptParams.salt);
    if (!selfScryptsy) {
        return Promise.resolve(
            scryptsy(pwd, Buffer.from(salt), +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen)
        );
    }
    return selfScryptsy(pwd, Array.from(salt), +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen);
}

function cipherText({ hexData, pwd, nonce, algorithm }) {
    let cipher = crypto.createCipheriv(algorithm, pwd, nonce);
    cipher.setAAD(additionData);

    let ciphertext = cipher.update(hexToBytes(hexData), 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    let tag = cipher.getAuthTag().toString('hex');

    return ciphertext + tag;
}