const scryptsy = require('scryptsy');
const crypto = typeof window !== 'undefined' ? require('browserify-aes') : require('crypto');
import { hexToBytes } from 'utils/encoder';

const TAG_LEN = 32;

export function cipheriv({ rawText, pwd, nonce, algorithm }, additionData = '') {
    let cipher = crypto.createCipheriv(algorithm, pwd, nonce);
    additionData && cipher.setAAD(additionData);

    let ciphertext = cipher.update(hexToBytes(rawText), 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    let tag = cipher.getAuthTag().toString('hex');

    let encryptText = ciphertext + tag;
    return encryptText;
}

export function decipheriv({ algorithm, encryptPwd, nonce, encryptText }, additionData = '') {
    let ciphertext = encryptText.slice(0, encryptText.length - TAG_LEN);
    let tag = encryptText.slice(encryptText.length - TAG_LEN);

    const decipher = crypto.createDecipheriv(algorithm, encryptPwd, hexToBytes(nonce));
    decipher.setAuthTag(hexToBytes(tag));
    additionData && decipher.setAAD(additionData);

    let rawText = decipher.update(hexToBytes(ciphertext), 'utf8', 'hex');
    rawText += decipher.final('hex');
    return rawText;
}

export function encryptPwd(pwd, scryptParams, selfScryptsy) {
    let salt = hexToBytes(scryptParams.salt);
    if (!selfScryptsy) {
        return Promise.resolve(
            scryptsy(pwd, Buffer.from(salt), +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen)
        );
    }
    return selfScryptsy(pwd, Array.from(salt), +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen);
}
