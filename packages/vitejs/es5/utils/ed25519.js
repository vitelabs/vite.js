"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nacl = require('@sisi/tweetnacl-blake2b');
var index_1 = require("./index");
function keyPair() {
    var keys = nacl.sign.keyPair();
    return {
        privateKey: Buffer.from(keys.secretKey),
        publicKey: Buffer.from(keys.publicKey)
    };
}
exports.keyPair = keyPair;
function getPublicKey(privKey) {
    var err = index_1.checkParams({ privKey: privKey }, ['privKey']);
    if (err) {
        throw new Error(err.message);
    }
    var key = nacl.sign.keyPair.fromSecretKey(privKey);
    return Buffer.from(key.publicKey);
}
exports.getPublicKey = getPublicKey;
function sign(hexStr, privKey) {
    var err = index_1.checkParams({ hexStr: hexStr, privKey: privKey }, ['hexStr', 'privKey'], [{
            name: 'hexStr',
            func: index_1.isHexString
        }, {
            name: 'privKey',
            func: index_1.isHexString
        }]);
    if (err) {
        throw new Error(err.message);
    }
    var privateKeyBuffer = Buffer.from(privKey, 'hex');
    var hash = Buffer.from(hexStr, 'hex');
    var pubKey = getPublicKey(privateKeyBuffer);
    var signature = nacl.sign.detached(hash, privateKeyBuffer, pubKey);
    var signatureHex = Buffer.from(signature).toString('hex');
    return signatureHex;
}
exports.sign = sign;
function verify(message, signature, publicKey) {
    var err = index_1.checkParams({ message: message, signature: signature, publicKey: publicKey }, ['message', 'signature', 'publicKey'], [{
            name: 'message',
            func: index_1.isHexString
        }, {
            name: 'signature',
            func: index_1.isHexString
        }, {
            name: 'publicKey',
            func: index_1.isHexString
        }]);
    if (err) {
        throw new Error(err.message);
    }
    var _publicKey = Buffer.from(publicKey, 'hex');
    var _msg = Buffer.from(message, 'hex');
    var _signature = Buffer.from(signature, 'hex');
    return nacl.sign.detached.verify(_msg, _signature, _publicKey);
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
