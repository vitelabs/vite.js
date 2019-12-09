const scryptsy = require('scryptsy');

declare const window;
const crypto = typeof window === 'undefined' ? require('crypto') : require('browserify-aes');

const TAG_LEN = 32;

export function cipheriv({ rawText, pwd, nonce, algorithm }, additionData?: Buffer) {
    const cipher = crypto.createCipheriv(algorithm, pwd, nonce);
    additionData && cipher.setAAD(additionData);

    let ciphertext = cipher.update(Buffer.from(rawText, 'hex'), 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');

    const encryptText = ciphertext + tag;
    return encryptText;
}

export function decipheriv({ algorithm, encryptPwd, nonce, encryptText }, additionData = '') {
    const ciphertext = encryptText.slice(0, encryptText.length - TAG_LEN);
    const tag = encryptText.slice(encryptText.length - TAG_LEN);

    const decipher = crypto.createDecipheriv(algorithm, encryptPwd, Buffer.from(nonce, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    additionData && decipher.setAAD(additionData);

    let rawText = decipher.update(Buffer.from(ciphertext, 'hex'), 'utf8', 'hex');
    rawText += decipher.final('hex');
    return rawText;
}

export function encryptPwd(pwd, scryptParams, selfScryptsy) {
    const salt = Buffer.from(scryptParams.salt, 'hex');
    if (!selfScryptsy) {
        return Promise.resolve(scryptsy(pwd, Buffer.from(salt), Number(scryptParams.n), Number(scryptParams.r), Number(scryptParams.p), Number(scryptParams.keylen)));
    }
    return selfScryptsy(pwd, Array.from(salt), Number(scryptParams.n), Number(scryptParams.r), Number(scryptParams.p), Number(scryptParams.keylen));
}
