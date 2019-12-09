import { paramsFormat } from './../error';
import { checkParams } from './../utils';

import { decipheriv, encryptPwd } from './tools';
import { defaultScryptParams, additionData } from './vars';
import isValid from './validated';

const n = defaultScryptParams.n;
const p = defaultScryptParams.p;
const r = defaultScryptParams.r;
const keyLen = defaultScryptParams.keyLen;


function decryptVersion3(keystore, pwd, selfScryptsy) {
    const crypto = keystore.crypto;
    const scryptParams = crypto.scryptparams;

    return _decrypt(pwd, {
        ciphername: crypto.ciphername,
        nonce: crypto.nonce,
        ciphertext: crypto.ciphertext,
        scryptParams
    }, null, selfScryptsy);
}

function decryptVersion2(keystore, pwd, selfScryptsy) {
    const crypto = keystore.crypto;
    const scryptParams = {
        n: keystore.scryptparams ? keystore.scryptparams.n || n : n,
        r: keystore.scryptparams ? keystore.scryptparams.r || r : r,
        p: keystore.scryptparams ? keystore.scryptparams.p || p : p,
        keylen: keystore.scryptparams ? keystore.scryptparams.keylen || keyLen : keyLen,
        salt: keystore.crypto.salt
    };

    return _decrypt(pwd, {
        ciphername: crypto.ciphername,
        nonce: crypto.nonce,
        ciphertext: keystore.encryptentropy,
        scryptParams
    }, null, selfScryptsy);
}

function decryptVersion1(keystore, pwd, selfScryptsy) {
    return new Promise((res, rej) => {
        encryptPwd(pwd, keystore.scryptparams, selfScryptsy).then(encryptP => res(encryptP.toString('hex') === keystore.encryptp)).catch(err => {
            rej(err);
        });
    });
}

function decryptOldKeystore(keystore, pwd, selfScryptsy) {
    const crypto = keystore.crypto;
    const scryptParams = crypto.scryptparams;

    return _decrypt(pwd, {
        ciphername: crypto.ciphername,
        nonce: crypto.nonce,
        ciphertext: crypto.ciphertext,
        scryptParams
    }, additionData, selfScryptsy);
}


const decryptFuncs = [ decryptOldKeystore, decryptVersion1, decryptVersion2, decryptVersion3 ];

export default function decrypt(keystore, pwd, selfScryptsy) {
    const err = checkParams({ keystore, pwd }, [ 'keystore', 'pwd' ]);
    if (err) {
        return Promise.reject(err);
    }

    const keyJson = isValid(keystore);
    if (!keyJson) {
        return Promise.reject({
            code: paramsFormat.code,
            message: `${ paramsFormat.message } Illegal keystore.`
        });
    }

    if (keyJson.version) {
        return decryptFuncs[Number(keyJson.version)](keyJson, pwd, selfScryptsy);
    }

    return decryptFuncs[0](keyJson, pwd, selfScryptsy);
}


function _decrypt(pwd, { ciphername, nonce, ciphertext, scryptParams }, additionData, selfScryptsy) {
    const getResult = (encryptPwd, res, rej) => {
        try {
            const entropy = decipheriv({
                algorithm: ciphername,
                encryptPwd,
                nonce: nonce,
                encryptText: ciphertext
            }, additionData);
            return res(entropy);
        } catch (err) {
            return rej(err);
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
