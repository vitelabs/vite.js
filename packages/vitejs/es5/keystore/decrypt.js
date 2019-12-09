"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitejs_error_1 = require("./../error");
var vitejs_utils_1 = require("./../utils");
var tools_1 = require("./tools");
var vars_1 = require("./vars");
var validated_1 = require("./validated");
var n = vars_1.defaultScryptParams.n;
var p = vars_1.defaultScryptParams.p;
var r = vars_1.defaultScryptParams.r;
var keyLen = vars_1.defaultScryptParams.keyLen;
function decryptVersion3(keystore, pwd, selfScryptsy) {
    var crypto = keystore.crypto;
    var scryptParams = crypto.scryptparams;
    return _decrypt(pwd, {
        ciphername: crypto.ciphername,
        nonce: crypto.nonce,
        ciphertext: crypto.ciphertext,
        scryptParams: scryptParams
    }, null, selfScryptsy);
}
function decryptVersion2(keystore, pwd, selfScryptsy) {
    var crypto = keystore.crypto;
    var scryptParams = {
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
        scryptParams: scryptParams
    }, null, selfScryptsy);
}
function decryptVersion1(keystore, pwd, selfScryptsy) {
    return new Promise(function (res, rej) {
        tools_1.encryptPwd(pwd, keystore.scryptparams, selfScryptsy).then(function (encryptP) { return res(encryptP.toString('hex') === keystore.encryptp); }).catch(function (err) {
            rej(err);
        });
    });
}
function decryptOldKeystore(keystore, pwd, selfScryptsy) {
    var crypto = keystore.crypto;
    var scryptParams = crypto.scryptparams;
    return _decrypt(pwd, {
        ciphername: crypto.ciphername,
        nonce: crypto.nonce,
        ciphertext: crypto.ciphertext,
        scryptParams: scryptParams
    }, vars_1.additionData, selfScryptsy);
}
var decryptFuncs = [decryptOldKeystore, decryptVersion1, decryptVersion2, decryptVersion3];
function decrypt(keystore, pwd, selfScryptsy) {
    var err = vitejs_utils_1.checkParams({ keystore: keystore, pwd: pwd }, ['keystore', 'pwd']);
    if (err) {
        return Promise.reject(err);
    }
    var keyJson = validated_1.default(keystore);
    if (!keyJson) {
        return Promise.reject({
            code: vitejs_error_1.paramsFormat.code,
            message: vitejs_error_1.paramsFormat.message + " Illegal keystore."
        });
    }
    if (keyJson.version) {
        return decryptFuncs[Number(keyJson.version)](keyJson, pwd, selfScryptsy);
    }
    return decryptFuncs[0](keyJson, pwd, selfScryptsy);
}
exports.default = decrypt;
function _decrypt(pwd, _a, additionData, selfScryptsy) {
    var ciphername = _a.ciphername, nonce = _a.nonce, ciphertext = _a.ciphertext, scryptParams = _a.scryptParams;
    var getResult = function (encryptPwd, res, rej) {
        try {
            var entropy = tools_1.decipheriv({
                algorithm: ciphername,
                encryptPwd: encryptPwd,
                nonce: nonce,
                encryptText: ciphertext
            }, additionData);
            return res(entropy);
        }
        catch (err) {
            return rej(err);
        }
    };
    return new Promise(function (res, rej) {
        tools_1.encryptPwd(pwd, scryptParams, selfScryptsy).then(function (result) {
            getResult(result, res, rej);
        }).catch(function (err) {
            rej(err);
        });
    });
}
