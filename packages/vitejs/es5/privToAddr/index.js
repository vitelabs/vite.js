"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitejs_utils_1 = require("./../utils");
var vitejs_error_1 = require("./../error");
var vars_1 = require("./vars");
var keyPair = vitejs_utils_1.ed25519.keyPair, getPublicKey = vitejs_utils_1.ed25519.getPublicKey;
function newHexAddr(priv, isContract) {
    var _a = newAddr(priv, isContract), realAddr = _a.realAddr, privKey = _a.privKey;
    var checkSum = getAddrCheckSum(realAddr, isContract);
    var hexAddr = getHexAddr(realAddr, checkSum);
    return {
        addr: realAddr.toString('hex'),
        pubKey: getPublicKey(privKey),
        privKey: privKey.toString('hex'),
        hexAddr: hexAddr
    };
}
exports.newHexAddr = newHexAddr;
function newHexAddrFromPub(pubkey, isContract) {
    var err = vitejs_utils_1.checkParams({ pubkey: pubkey }, ['pubkey']);
    if (err) {
        throw new Error(err.message);
    }
    var realAddr = newAddrFromPub(pubkey, isContract);
    var checkSum = getAddrCheckSum(realAddr, isContract);
    return getHexAddr(realAddr, checkSum);
}
exports.newHexAddrFromPub = newHexAddrFromPub;
function getAddrFromHexAddr(hexAddr) {
    var err = vitejs_utils_1.checkParams({ hexAddr: hexAddr }, ['hexAddr'], [{
            name: 'hexAddr',
            func: isValidHex
        }]);
    if (err) {
        throw new Error(err.message);
    }
    var addrType = isValidCheckSum(hexAddr);
    if (addrType === vars_1.ADDR_TYPE.Illegal) {
        throw vitejs_error_1.addressIllegal;
    }
    return getRealAddr(hexAddr, addrType);
}
exports.getAddrFromHexAddr = getAddrFromHexAddr;
function getHexAddrFromAddr(realAddr) {
    var err = vitejs_utils_1.checkParams({ realAddr: realAddr }, ['realAddr'], [{
            name: 'realAddr',
            func: function (_realAddr) { return typeof _realAddr === 'string' && /^[0-9a-fA-F]+$/.test(_realAddr) && (_realAddr.length === vars_1.ADDR_SIZE * 2 || _realAddr.length === (vars_1.ADDR_SIZE + 1) * 2); }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    var realAddrBuf = Buffer.from(realAddr, 'hex');
    var checkSum = getAddrCheckSum(realAddrBuf);
    return getHexAddr(realAddrBuf, checkSum);
}
exports.getHexAddrFromAddr = getHexAddrFromAddr;
function isValidHexAddr(hexAddr) {
    if (!isValidHex(hexAddr)) {
        return vars_1.ADDR_TYPE.Illegal;
    }
    return isValidCheckSum(hexAddr);
}
exports.isValidHexAddr = isValidHexAddr;
function getRealAddr(hexAddr, addrType) {
    var addr = hexAddr.slice(vars_1.ADDR_PRE.length, vars_1.ADDR_PRE.length + vars_1.ADDR_SIZE * 2);
    if (addrType === vars_1.ADDR_TYPE.Account) {
        return addr + "00";
    }
    return addr + "01";
}
function newAddr(privKey, isContract) {
    var _privKey;
    if (privKey) {
        _privKey = privKey instanceof Buffer ? privKey : Buffer.from(privKey, 'hex');
    }
    else {
        var _keyPair = keyPair();
        _privKey = Buffer.from(_keyPair.privateKey);
    }
    var addr = newAddrFromPriv(_privKey, isContract);
    return {
        realAddr: addr,
        privKey: _privKey
    };
}
function newAddrFromPub(pubKey, isContract) {
    var _pre = vitejs_utils_1.blake2b(pubKey, null, vars_1.ADDR_SIZE);
    var isContractByte = isContract ? 1 : 0;
    var pre = new Uint8Array(21);
    pre.set(_pre);
    pre.set([isContractByte], 20);
    return Buffer.from(pre);
}
function newAddrFromPriv(privKey, isContract) {
    var publicKey = getPublicKey(privKey);
    return newAddrFromPub(publicKey, isContract);
}
function getAddrCheckSum(addr, isContract) {
    var addrPre20 = addr.slice(0, 20);
    var _checkSum = vitejs_utils_1.blake2b(addrPre20, null, vars_1.ADDR_CHECK_SUM_SIZE);
    var checkSum = Buffer.from(_checkSum);
    if (!isContract) {
        return checkSum.toString('hex');
    }
    var newCheckSum = [];
    checkSum.forEach(function (byte) {
        newCheckSum.push(byte ^ 0xFF);
    });
    return Buffer.from(newCheckSum).toString('hex');
}
function getHexAddr(realAddr, checkSum) {
    return vars_1.ADDR_PRE + realAddr.slice(0, 20).toString('hex') + checkSum;
}
function isValidHex(hexAddr) {
    return hexAddr && hexAddr.length === vars_1.ADDR_LEN && hexAddr.indexOf(vars_1.ADDR_PRE) === 0;
}
function isValidCheckSum(hexAddr) {
    var currentChecksum = hexAddr.slice(vars_1.ADDR_PRE.length + vars_1.ADDR_SIZE * 2);
    var _addr = hexAddr.slice(vars_1.ADDR_PRE.length, vars_1.ADDR_PRE.length + vars_1.ADDR_SIZE * 2);
    var addr = Buffer.from(_addr, 'hex');
    var contractCheckSum = getAddrCheckSum(addr, true);
    if (contractCheckSum === currentChecksum) {
        return vars_1.ADDR_TYPE.Contract;
    }
    var checkSum = getAddrCheckSum(addr);
    if (currentChecksum === checkSum) {
        return vars_1.ADDR_TYPE.Account;
    }
    return vars_1.ADDR_TYPE.Illegal;
}
