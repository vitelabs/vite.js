"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scryptsy = require('scryptsy');
var crypto = typeof window === 'undefined' ? require('crypto') : require('browserify-aes');
var TAG_LEN = 32;
function cipheriv(_a, additionData) {
    var rawText = _a.rawText, pwd = _a.pwd, nonce = _a.nonce, algorithm = _a.algorithm;
    var cipher = crypto.createCipheriv(algorithm, pwd, nonce);
    additionData && cipher.setAAD(additionData);
    var ciphertext = cipher.update(Buffer.from(rawText, 'hex'), 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    var tag = cipher.getAuthTag().toString('hex');
    var encryptText = ciphertext + tag;
    return encryptText;
}
exports.cipheriv = cipheriv;
function decipheriv(_a, additionData) {
    var algorithm = _a.algorithm, encryptPwd = _a.encryptPwd, nonce = _a.nonce, encryptText = _a.encryptText;
    if (additionData === void 0) { additionData = ''; }
    var ciphertext = encryptText.slice(0, encryptText.length - TAG_LEN);
    var tag = encryptText.slice(encryptText.length - TAG_LEN);
    var decipher = crypto.createDecipheriv(algorithm, encryptPwd, Buffer.from(nonce, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    additionData && decipher.setAAD(additionData);
    var rawText = decipher.update(Buffer.from(ciphertext, 'hex'), 'utf8', 'hex');
    rawText += decipher.final('hex');
    return rawText;
}
exports.decipheriv = decipheriv;
function encryptPwd(pwd, scryptParams, selfScryptsy) {
    var salt = Buffer.from(scryptParams.salt, 'hex');
    if (!selfScryptsy) {
        return Promise.resolve(scryptsy(pwd, Buffer.from(salt), Number(scryptParams.n), Number(scryptParams.r), Number(scryptParams.p), Number(scryptParams.keylen)));
    }
    return selfScryptsy(pwd, Array.from(salt), Number(scryptParams.n), Number(scryptParams.r), Number(scryptParams.p), Number(scryptParams.keylen));
}
exports.encryptPwd = encryptPwd;
