"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UUID = require('pure-uuid');
var vitejs_utils_1 = require("./../utils");
var vitejs_privtoaddr_1 = require("./../privtoaddr");
var vars_1 = require("./vars");
function isValidVersion1(keyJson) {
    if (!keyJson.scryptparams
        || !keyJson.encryptp
        || !keyJson.version
        || Number(keyJson.version) !== 1) {
        return false;
    }
    var scryptParams = keyJson.scryptparams;
    if (!scryptParams.n
        || !scryptParams.r
        || !scryptParams.p
        || !scryptParams.keylen
        || !scryptParams.salt) {
        return false;
    }
    vitejs_utils_1.hexToBytes(scryptParams.salt);
    return keyJson;
}
function isValidVersion2(keyJson) {
    if (!keyJson.crypto
        || !keyJson.encryptentropy
        || !keyJson.version
        || Number(keyJson.version) !== 2) {
        return false;
    }
    var crypto = keyJson.crypto;
    if (crypto.ciphername !== vars_1.algorithm
        || crypto.kdf !== vars_1.scryptName
        || !crypto.nonce
        || (!crypto.salt && !crypto.scryptparams)) {
        return false;
    }
    var salt = crypto.salt || crypto.scryptparams.salt;
    if (!salt) {
        return false;
    }
    if (crypto.scryptparams && (!crypto.scryptparams.n
        || !crypto.scryptparams.p
        || !crypto.scryptparams.r
        || !crypto.scryptparams.keylen)) {
        return false;
    }
    vitejs_utils_1.hexToBytes(keyJson.encryptentropy);
    vitejs_utils_1.hexToBytes(crypto.nonce);
    vitejs_utils_1.hexToBytes(crypto.salt);
    return keyJson;
}
function isValidVersion3(keyJson) {
    if (!keyJson.uuid
        || !keyJson.crypto
        || !keyJson.version
        || Number(keyJson.version) !== 3) {
        return false;
    }
    var crypto = keyJson.crypto;
    if (crypto.ciphername !== vars_1.algorithm
        || !crypto.ciphertext
        || !crypto.nonce
        || crypto.kdf !== vars_1.scryptName
        || !crypto.scryptparams) {
        return false;
    }
    var scryptparams = crypto.scryptparams;
    if (!scryptparams.n
        || !scryptparams.p
        || !scryptparams.r
        || !scryptparams.keylen
        || !scryptparams.salt) {
        return false;
    }
    new UUID().parse(keyJson.uuid);
    vitejs_utils_1.hexToBytes(crypto.ciphertext);
    vitejs_utils_1.hexToBytes(crypto.nonce);
    vitejs_utils_1.hexToBytes(scryptparams.salt);
    return keyJson;
}
function isValidOldKeystore(keyJson) {
    if (!keyJson.id
        || !keyJson.crypto
        || !keyJson.hexaddress
        || !vitejs_privtoaddr_1.isValidHexAddr(keyJson.hexaddress)) {
        return false;
    }
    var crypto = keyJson.crypto;
    if (crypto.ciphername !== vars_1.algorithm
        || !crypto.ciphertext
        || !crypto.nonce
        || crypto.kdf !== vars_1.scryptName
        || !crypto.scryptparams) {
        return false;
    }
    var scryptparams = crypto.scryptparams;
    if (!scryptparams.n
        || !scryptparams.p
        || !scryptparams.r
        || !scryptparams.keylen
        || !scryptparams.salt) {
        return false;
    }
    new UUID().parse(keyJson.id);
    vitejs_utils_1.hexToBytes(crypto.ciphertext);
    vitejs_utils_1.hexToBytes(crypto.nonce);
    vitejs_utils_1.hexToBytes(scryptparams.salt);
    return keyJson;
}
var validatedFuncs = [isValidOldKeystore, isValidVersion1, isValidVersion2, isValidVersion3];
function isValid(keystore) {
    var err = vitejs_utils_1.checkParams({ keystore: keystore }, ['keystore']);
    if (err) {
        console.error(err);
        return false;
    }
    try {
        var keyJson = JSON.parse(keystore.toLowerCase());
        if (!keyJson.version && !keyJson.keystoreversion) {
            return false;
        }
        if ((keyJson.version && Number(keyJson.version) > vars_1.currentVersion)
            || (keyJson.keystoreversion && keyJson.keystoreversion !== 1)) {
            return false;
        }
        if (keyJson.version) {
            return validatedFuncs[Number(keyJson.version)](keyJson);
        }
        return validatedFuncs[0](keyJson);
    }
    catch (err) {
        return false;
    }
}
exports.default = isValid;
