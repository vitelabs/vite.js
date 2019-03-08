const uuid = require('pure-uuid');

import { tools, ed25519, encoder } from 'utils';
import { newHexAddr } from 'privToAddr';
import { paramsFormat } from 'error';

import isValid from './validated';
import { cipheriv, encryptPwd } from './tools';
import { scryptName, algorithm, currentVersion, defaultScryptParams, additionData } from './vars';

const { random } = ed25519;
const { checkParams } = tools;
const { hexToBytes, bytesToHex } = encoder;

const n = defaultScryptParams.n;
const p = defaultScryptParams.p;
const r = defaultScryptParams.r;
const keyLen = defaultScryptParams.keyLen;


export function encrypt(key, pwd, _scryptParams, selfScryptsy) {
    let err = checkParams({ key, pwd }, ['key', 'pwd']);
    if (err) {
        return Promise.reject(err);
    }

    let scryptParams = {
        n: _scryptParams && _scryptParams.n ? _scryptParams.n : n,
        r: _scryptParams && _scryptParams.r ? _scryptParams.r : r,
        p: _scryptParams && _scryptParams.p ? _scryptParams.p : p,
        keylen: _scryptParams && _scryptParams.keylen ? _scryptParams.keylen : keyLen,
        salt : _scryptParams && _scryptParams.salt ? _scryptParams.salt : bytesToHex(random())
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
    let err = checkParams({ key, keystore }, ['key', 'keystore']);
    if (err) {
        console.error(new Error(err.message));
        return false;
    }

    let keyJson = isValid(keystore);
    if (!keyJson) {
        console.error(new Error(`${paramsFormat.message} Illegal keystore.`));
        return false;
    }

    let scryptParams = keyJson.scryptparams;
    let _encryptPwd = hexToBytes(keyJson.encryptp);

    try {
        return getKeystore(key, _encryptPwd, scryptParams);
    } catch (err) {
        console.error(err);
        return false;
    }
}

export function encryptOldKeystore(privKey, pwd, selfScryptsy) {
    let err = checkParams({ privKey, pwd }, ['privKey', 'pwd']);
    if (err) {
        console.error(new Error(err.message));
        return false;
    }

    let key = newHexAddr(privKey);

    let scryptParams = {
        n,
        r,
        p,
        keylen: keyLen,
        salt: bytesToHex(random()),
    };

    let getResult = (_encryptPwd, res) => {
        let nonce = random(12);
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
    let nonce = random(12);

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
