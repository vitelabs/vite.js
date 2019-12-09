const UUID = require('pure-uuid');

import { checkParams, ed25519 } from './../utils';
import { createAddressByPrivateKey } from './../wallet/address';
import { paramsFormat } from './../error';

import isValid from './validated';
import { cipheriv, encryptPwd } from './tools';
import { scryptName, algorithm, currentVersion, defaultScryptParams, additionData } from './vars';

const { random } = ed25519;

const n = defaultScryptParams.n;
const p = defaultScryptParams.p;
const r = defaultScryptParams.r;
const keyLen = defaultScryptParams.keyLen;


export function encrypt(key, pwd, _scryptParams, selfScryptsy) {
    const err = checkParams({ key, pwd }, [ 'key', 'pwd' ]);
    if (err) {
        return Promise.reject(err);
    }

    const scryptParams = {
        n: _scryptParams && _scryptParams.n ? _scryptParams.n : n,
        r: _scryptParams && _scryptParams.r ? _scryptParams.r : r,
        p: _scryptParams && _scryptParams.p ? _scryptParams.p : p,
        keylen: _scryptParams && _scryptParams.keylen ? _scryptParams.keylen : keyLen,
        salt: _scryptParams && _scryptParams.salt ? _scryptParams.salt : Buffer.from(random()).toString('hex')
    };

    const getResult = (encryptPwd, res, rej) => {
        try {
            const _keystore = getKeystore(key, encryptPwd, scryptParams);
            res(_keystore);
        } catch (err) {
            rej(err);
        }
    };

    return new Promise((res, rej) => {
        encryptPwd(pwd, scryptParams, selfScryptsy).then(result => {
            getResult(result, res, rej);
        }).catch(err => {
            rej(err);
        });
    });
}

// encryptToVersion3
export function encryptV1ToV3(key, keystore) {
    const err = checkParams({ key, keystore }, [ 'key', 'keystore' ]);
    if (err) {
        console.error(new Error(err.message));
        return false;
    }

    const keyJson = isValid(keystore);
    if (!keyJson) {
        console.error(new Error(`${ paramsFormat.message } Illegal keystore.`));
        return false;
    }

    const scryptParams = keyJson.scryptparams;
    const _encryptPwd = Buffer.from(keyJson.encryptp, 'hex');

    try {
        return getKeystore(key, _encryptPwd, scryptParams);
    } catch (err) {
        console.error(err);
        return false;
    }
}

export function encryptOldKeystore(privKey, pwd, selfScryptsy) {
    const err = checkParams({ privKey, pwd }, [ 'privKey', 'pwd' ]);
    if (err) {
        throw new Error(err.message);
    }

    const AddressObj = createAddressByPrivateKey(privKey);

    const scryptParams = {
        n,
        r,
        p,
        keylen: keyLen,
        salt: Buffer.from(random()).toString('hex')
    };

    const getResult = (_encryptPwd, res) => {
        const nonce = random(12);
        const text = cipheriv({
            rawText: AddressObj.privateKey,
            pwd: _encryptPwd,
            nonce,
            algorithm
        }, additionData);

        const cryptoJSON = {
            cipherName: algorithm,
            KDF: scryptName,
            ScryptParams: scryptParams,
            CipherText: text,
            Nonce: Buffer.from(nonce).toString('hex')
        };

        const encryptedKeyJSON = {
            hexAddress: AddressObj.address,
            crypto: cryptoJSON,
            id: new UUID(1).format(),
            keystoreVersion: 1,
            timestamp: new Date().getTime()
        };
        return res(JSON.stringify(encryptedKeyJSON).toLocaleLowerCase());
    };

    return new Promise((res, rej) => {
        encryptPwd(pwd, scryptParams, selfScryptsy).then(result => {
            getResult(result, res);
        }).catch(err => {
            rej(err);
        });
    });
}


function getKeystore(rawText, pwd, scryptParams) {
    const nonce = random(12);

    const ciphertext = cipheriv({
        rawText,
        pwd,
        nonce,
        algorithm: algorithm
    });

    const cryptoJSON = {
        cipherName: algorithm,
        ciphertext,
        Nonce: Buffer.from(nonce).toString('hex'),
        KDF: scryptName,
        scryptParams
    };

    const encryptedKeyJSON = {
        uuid: new UUID(1).format(),
        crypto: cryptoJSON,
        version: currentVersion,
        timestamp: new Date().getTime()
    };

    return JSON.stringify(encryptedKeyJSON).toLocaleLowerCase();
}
