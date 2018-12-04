const uuid = require('pure-uuid');
const nacl = require('@sisi/tweetnacl-blake2b');

import { hexToBytes, bytesToHex } from 'utils/encoder';
import { cipheriv, encryptPwd } from './tools';
import { scryptName, algorithm, currentVersion, defaultScryptParams, additionData } from './vars';
import isValid from './validated';
import { newHexAddr } from 'utils/address/privToAddr';

const n = defaultScryptParams.n;
const p = defaultScryptParams.p;
const r = defaultScryptParams.r;
const keyLen = defaultScryptParams.keyLen;


export function encrypt(key, pwd, _scryptParams, selfScryptsy) {
    let scryptParams = {
        n: _scryptParams && _scryptParams.n ? _scryptParams.n : n,
        r: _scryptParams && _scryptParams.r ? _scryptParams.r : r,
        p: _scryptParams && _scryptParams.p ? _scryptParams.p : p,
        keylen: _scryptParams && _scryptParams.keylen ? _scryptParams.keylen : keyLen,
        salt : _scryptParams && _scryptParams.salt ? _scryptParams.salt : bytesToHex(nacl.randomBytes(32))
    };

    let getResult = (encryptPwd, res, rej) => {
        try {
            let _keystore = getKeystore(key, encryptPwd, scryptParams);
            res(_keystore);
        } catch (err) {
            rej(err);
        }
    };

    return new Promise((res, rej) => {
        encryptPwd(pwd, scryptParams, selfScryptsy).then((result) => {
            getResult(result, res, rej);
        }).catch((err) => {
            rej(err);
        });
    });
}

// encryptToVersion3
export function encryptV1ToV3(key, keystore) {
    let keyJson = isValid(keystore);
    if (!keyJson) {
        return false;
    }

    let scryptParams = keyJson.scryptparams;
    let _encryptPwd = hexToBytes(keyJson.encryptp);

    try {
        return getKeystore(key, _encryptPwd, scryptParams);
    } catch (err) {
        return false;
    }
}

export function encryptOldKeystore(privKey, pwd, selfScryptsy) {
    let key = newHexAddr(privKey);

    let scryptParams = {
        n,
        r,
        p,
        keylen: keyLen,
        salt: bytesToHex(nacl.randomBytes(32)),
    };

    let getResult = (_encryptPwd, res) => {
        let nonce = nacl.randomBytes(12);
        let text = cipheriv({
            rawText: key.privKey,
            pwd: _encryptPwd,
            nonce,
            algorithm
        }, additionData);

        let cryptoJSON = {
            cipherName: algorithm,
            KDF: scryptName,
            ScryptParams: scryptParams,
            CipherText: text,
            Nonce: bytesToHex(nonce)
        };

        let encryptedKeyJSON = {
            hexAddress: key.hexAddr,
            crypto: cryptoJSON,
            id: new uuid(1).format(),
            keystoreVersion: 1,
            timestamp: new Date().getTime(),
        };
        return res(JSON.stringify(encryptedKeyJSON).toLocaleLowerCase());
    };

    return new Promise((res, rej) => {
        encryptPwd(pwd, scryptParams, selfScryptsy).then((result) => {
            getResult(result, res);
        }).catch((err) => {
            rej(err);
        });
    });
}


function getKeystore(rawText, pwd, scryptParams) {
    let nonce = nacl.randomBytes(12);

    let ciphertext = cipheriv({
        rawText,
        pwd,
        nonce,
        algorithm: algorithm
    });

    let cryptoJSON = {
        cipherName: algorithm,
        ciphertext,
        Nonce: bytesToHex(nonce),
        KDF: scryptName,
        scryptParams
    };

    let encryptedKeyJSON = {
        uuid: new uuid(1).format(),
        crypto: cryptoJSON,
        version: currentVersion,
        timestamp: new Date().getTime()
    };

    return JSON.stringify(encryptedKeyJSON).toLocaleLowerCase();
}

// Version2 encrypt
// export function encryptVersion2(key, pwd, _scryptParams, selfScryptsy) {
//     let scryptParams = {
//         n: _scryptParams && _scryptParams.n ? _scryptParams.n : n,
//         r: _scryptParams && _scryptParams.r ? _scryptParams.r : r,
//         p: _scryptParams && _scryptParams.p ? _scryptParams.p : p,
//         keylen: _scryptParams && _scryptParams.keylen ? _scryptParams.keylen : keyLen,
//         salt : _scryptParams && _scryptParams.salt ? _scryptParams.salt : bytesToHex(nacl.randomBytes(32))
//     };

//     let getResult = (encryptPwd, res, rej) => {
//         try {
//             let _keystore = getKeystoreVersion2(key, encryptPwd, scryptParams);
//             res(_keystore);
//         } catch (err) {
//             rej(err);
//         }
//     };

//     return new Promise((res, rej) => {
//         encryptPwd(pwd, scryptParams, selfScryptsy).then((result) => {
//             getResult(result, res, rej);
//         }).catch((err) => {
//             rej(err);
//         });
//     });
// }

// function getKeystoreVersion2(rawText, pwd, scryptParams) {
//     let nonce = nacl.randomBytes(12);

//     let encryptEntropy = cipheriv({
//         rawText,
//         pwd,
//         nonce,
//         algorithm: algorithm
//     });

//     let cryptoJSON = {
//         cipherName: algorithm,
//         KDF: scryptName,
//         Nonce: bytesToHex(nonce),
//     };

//     if (scryptParams && (
//         scryptParams.n !== n ||
//         scryptParams.r !== r ||
//         scryptParams.p !== p ||
//         scryptParams.keylen !== keyLen )) {
//         cryptoJSON.scryptParams = scryptParams;
//     } else {
//         cryptoJSON.salt = scryptParams.salt;
//     }

//     let encryptedKeyJSON = {
//         encryptEntropy,
//         crypto: cryptoJSON,
//         version: currentVersion,
//         timestamp: new Date().getTime()
//     };

//     return JSON.stringify(encryptedKeyJSON).toLocaleLowerCase();
// }
