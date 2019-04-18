"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nacl = require('@sisi/tweetnacl-blake2b');
var index_1 = require("./index");
function keyPair() {
    var keys = nacl.sign.keyPair();
    return {
        privateKey: keys.secretKey,
        publicKey: keys.publicKey
    };
}
exports.keyPair = keyPair;
function getPublicKey(privKey) {
    var err = index_1.checkParams({ privKey: privKey }, ['privKey']);
    if (err) {
        throw new Error(err.message);
    }
    var key = nacl.sign.keyPair.fromSecretKey(privKey);
    return key.publicKey;
}
exports.getPublicKey = getPublicKey;
function sign(hexStr, privKey) {
    var err = index_1.checkParams({ hexStr: hexStr, privKey: privKey }, ['hexStr', 'privKey']);
    if (err) {
        throw new Error(err.message);
    }
    var hash = Buffer.from(hexStr, 'hex');
    var pubKey = getPublicKey(privKey);
    var signature = nacl.sign.detached(hash, privKey, pubKey);
    var signatureHex = Buffer.from(signature).toString('hex');
    return signatureHex;
}
exports.sign = sign;
function verify(message, signature, publicKey) {
    var err = index_1.checkParams({ message: message, signature: signature, publicKey: publicKey }, ['message', 'signature', 'publicKey']);
    if (err) {
        throw new Error(err.message);
    }
    var _msg = Buffer.from(message, 'hex');
    var _signature = Buffer.from(signature, 'hex');
    return nacl.sign.detached.verify(_msg, _signature, publicKey);
}
exports.verify = verify;
function random(bytesLen) {
    if (bytesLen === void 0) { bytesLen = 32; }
    var err = index_1.checkParams({ bytesLen: bytesLen }, ['bytesLen']);
    if (err) {
        throw new Error(err.message);
    }
    return nacl.randomBytes(bytesLen);
}
exports.random = random;
