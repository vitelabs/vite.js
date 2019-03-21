const scryptsy = require('scryptsy');
const crypto = typeof window === 'undefined' ? require('crypto') : require('browserify-aes');
import { encoder } from '~@vite/vitejs-utils';

const { hexToBytes } = encoder;

const TAG_LEN = 32;

export function cipheriv({ rawText, pwd, nonce, algorithm }, additionData = '') {
    const cipher = crypto.createCipheriv(algorithm, pwd, nonce);
    additionData && cipher.setAAD(additionData);

    let ciphertext = cipher.update(hexToBytes(rawText), 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');

    const encryptText = ciphertext + tag;
    return encryptText;
}

export function decipheriv({ algorithm, encryptPwd, nonce, encryptText }, additionData = '') {
    const ciphertext = encryptText.slice(0, encryptText.length - TAG_LEN);
    const tag = encryptText.slice(encryptText.length - TAG_LEN);

    const decipher = crypto.createDecipheriv(algorithm, encryptPwd, hexToBytes(nonce));
    decipher.setAuthTag(hexToBytes(tag));
    additionData && decipher.setAAD(additionData);

    let rawText = decipher.update(hexToBytes(ciphertext), 'utf8', 'hex');
    rawText += decipher.final('hex');
    return rawText;
}

export function encryptPwd(pwd, scryptParams, selfScryptsy) {
    const salt = hexToBytes(scryptParams.salt);
    if (!selfScryptsy) {
        return Promise.resolve(scryptsy(pwd, Buffer.from(salt), Number(scryptParams.n), Number(scryptParams.r), Number(scryptParams.p), Number(scryptParams.keylen)));
    }
    return selfScryptsy(pwd, Array.from(salt), Number(scryptParams.n), Number(scryptParams.r), Number(scryptParams.p), Number(scryptParams.keylen));
}
