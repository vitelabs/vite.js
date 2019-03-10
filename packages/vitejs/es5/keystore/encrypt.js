"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require('pure-uuid');
var utils_1 = require("utils");
var privToAddr_1 = require("privToAddr");
var error_1 = require("error");
var validated_1 = require("./validated");
var tools_1 = require("./tools");
var vars_1 = require("./vars");
var random = utils_1.ed25519.random;
var checkParams = utils_1.tools.checkParams;
var hexToBytes = utils_1.encoder.hexToBytes, bytesToHex = utils_1.encoder.bytesToHex;
var n = vars_1.defaultScryptParams.n;
var p = vars_1.defaultScryptParams.p;
var r = vars_1.defaultScryptParams.r;
var keyLen = vars_1.defaultScryptParams.keyLen;
function encrypt(key, pwd, _scryptParams, selfScryptsy) {
    var err = checkParams({ key: key, pwd: pwd }, ['key', 'pwd']);
    if (err) {
        return Promise.reject(err);
    }
    var scryptParams = {
        n: _scryptParams && _scryptParams.n ? _scryptParams.n : n,
        r: _scryptParams && _scryptParams.r ? _scryptParams.r : r,
        p: _scryptParams && _scryptParams.p ? _scryptParams.p : p,
        keylen: _scryptParams && _scryptParams.keylen ? _scryptParams.keylen : keyLen,
        salt: _scryptParams && _scryptParams.salt ? _scryptParams.salt : bytesToHex(random())
    };
    var getResult = function (encryptPwd, res, rej) {
        try {
            var _keystore = getKeystore(key, encryptPwd, scryptParams);
            res(_keystore);
        }
        catch (err) {
            rej(err);
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
exports.encrypt = encrypt;
function encryptV1ToV3(key, keystore) {
    var err = checkParams({ key: key, keystore: keystore }, ['key', 'keystore']);
    if (err) {
        console.error(new Error(err.message));
        return false;
    }
    var keyJson = validated_1.default(keystore);
    if (!keyJson) {
        console.error(new Error(error_1.paramsFormat.message + " Illegal keystore."));
        return false;
    }
    var scryptParams = keyJson.scryptparams;
    var _encryptPwd = hexToBytes(keyJson.encryptp);
    try {
        return getKeystore(key, _encryptPwd, scryptParams);
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
exports.encryptV1ToV3 = encryptV1ToV3;
function encryptOldKeystore(privKey, pwd, selfScryptsy) {
    var err = checkParams({ privKey: privKey, pwd: pwd }, ['privKey', 'pwd']);
    if (err) {
        console.error(new Error(err.message));
        return false;
    }
    var key = privToAddr_1.newHexAddr(privKey);
    var scryptParams = {
        n: n,
        r: r,
        p: p,
        keylen: keyLen,
        salt: bytesToHex(random()),
    };
    var getResult = function (_encryptPwd, res) {
        var nonce = random(12);
        var text = tools_1.cipheriv({
            rawText: key.privKey,
            pwd: _encryptPwd,
            nonce: nonce,
            algorithm: vars_1.algorithm
        }, vars_1.additionData);
        var cryptoJSON = {
            cipherName: vars_1.algorithm,
            KDF: vars_1.scryptName,
            ScryptParams: scryptParams,
            CipherText: text,
            Nonce: bytesToHex(nonce)
        };
        var encryptedKeyJSON = {
            hexAddress: key.hexAddr,
            crypto: cryptoJSON,
            id: new uuid(1).format(),
            keystoreVersion: 1,
            timestamp: new Date().getTime(),
        };
        return res(JSON.stringify(encryptedKeyJSON).toLocaleLowerCase());
    };
    return new Promise(function (res, rej) {
        tools_1.encryptPwd(pwd, scryptParams, selfScryptsy).then(function (result) {
            getResult(result, res);
        }).catch(function (err) {
            rej(err);
        });
    });
}
exports.encryptOldKeystore = encryptOldKeystore;
function getKeystore(rawText, pwd, scryptParams) {
    var nonce = random(12);
    var ciphertext = tools_1.cipheriv({
        rawText: rawText,
        pwd: pwd,
        nonce: nonce,
        algorithm: vars_1.algorithm
    });
    var cryptoJSON = {
        cipherName: vars_1.algorithm,
        ciphertext: ciphertext,
        Nonce: bytesToHex(nonce),
        KDF: vars_1.scryptName,
        scryptParams: scryptParams
    };
    var encryptedKeyJSON = {
        uuid: new uuid(1).format(),
        crypto: cryptoJSON,
        version: vars_1.currentVersion,
        timestamp: new Date().getTime()
    };
    return JSON.stringify(encryptedKeyJSON).toLocaleLowerCase();
}
