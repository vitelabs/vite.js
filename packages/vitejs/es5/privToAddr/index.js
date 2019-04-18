"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blake = require('blakejs/blake2b');
var vitejs_utils_1 = require("./../utils");
var vars_1 = require("./vars");
var keyPair = vitejs_utils_1.ed25519.keyPair, getPublicKey = vitejs_utils_1.ed25519.getPublicKey;
function newHexAddr(priv) {
    var _a = newAddr(priv), addr = _a.addr, privKey = _a.privKey;
    var checkSum = getAddrCheckSum(addr);
    var _addr = vitejs_utils_1.bytesToHex(addr);
    var _pubKey = getPublicKey(privKey);
    return {
        addr: _addr,
        pubKey: _pubKey,
        privKey: vitejs_utils_1.bytesToHex(privKey),
        hexAddr: vars_1.ADDR_PRE + _addr + checkSum
    };
}
exports.newHexAddr = newHexAddr;
function newHexAddrFromPub(pubkey) {
    var err = vitejs_utils_1.checkParams({ pubkey: pubkey }, ['pubkey']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    var addr = newAddrFromPub(pubkey);
    var checkSum = getAddrCheckSum(addr);
    var _addr = vitejs_utils_1.bytesToHex(addr);
    return vars_1.ADDR_PRE + _addr + checkSum;
}
exports.newHexAddrFromPub = newHexAddrFromPub;
function getAddrFromHexAddr(hexAddr) {
    var err = vitejs_utils_1.checkParams({ hexAddr: hexAddr }, ['hexAddr'], [{
            name: 'hexAddr',
            func: isValidHexAddr
        }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    return getRealAddr(hexAddr);
}
exports.getAddrFromHexAddr = getAddrFromHexAddr;
function getHexAddrFromAddr(realAddr) {
    var err = vitejs_utils_1.checkParams({ realAddr: realAddr }, ['realAddr'], [{
            name: 'realAddr',
            func: function (_realAddr) { return typeof _realAddr === 'string' && /^[0-9a-fA-F]+$/.test(_realAddr) && _realAddr.length === vars_1.ADDR_SIZE * 2; }
        }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    var checkSum = getAddrCheckSum(Buffer.from(realAddr, 'hex'));
    return vars_1.ADDR_PRE + realAddr + checkSum;
}
exports.getHexAddrFromAddr = getHexAddrFromAddr;
function isValidHexAddr(hexAddr) {
    if (!hexAddr || hexAddr.length !== vars_1.ADDR_LEN || hexAddr.indexOf(vars_1.ADDR_PRE) !== 0) {
        return false;
    }
    var pre = getRealAddr(hexAddr);
    var addr = vitejs_utils_1.hexToBytes(pre);
    var currentChecksum = hexAddr.slice(vars_1.ADDR_PRE.length + vars_1.ADDR_SIZE * 2);
    var checkSum = getAddrCheckSum(addr);
    return currentChecksum === checkSum;
}
exports.isValidHexAddr = isValidHexAddr;
function getRealAddr(hexAddr) {
    return hexAddr.slice(vars_1.ADDR_PRE.length, vars_1.ADDR_PRE.length + vars_1.ADDR_SIZE * 2);
}
function newAddr(privKey) {
    var _privKey;
    if (privKey) {
        _privKey = privKey instanceof Buffer ? privKey : Buffer.from(privKey, 'hex');
    }
    else {
        var _keyPair = keyPair();
        _privKey = _keyPair.privateKey;
    }
    var addr = newAddrFromPriv(_privKey);
    return { addr: addr, privKey: _privKey };
}
function newAddrFromPub(pubKey) {
    var pre = blake.blake2b(pubKey, null, vars_1.ADDR_SIZE);
    return pre;
}
function newAddrFromPriv(privKey) {
    var publicKey = getPublicKey(privKey);
    return newAddrFromPub(publicKey);
}
function getAddrCheckSum(addr) {
    return blake.blake2bHex(addr, null, vars_1.ADDR_CHECK_SUM_SIZE);
}
