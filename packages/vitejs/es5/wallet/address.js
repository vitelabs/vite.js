"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitejs_utils_1 = require("./../utils");
var vitejs_error_1 = require("./../error");
var keyPair = vitejs_utils_1.ed25519.keyPair, getPublicKey = vitejs_utils_1.ed25519.getPublicKey;
exports.ADDR_PRE = 'vite_';
exports.ADDR_SIZE = 20;
exports.ADDR_CHECK_SUM_SIZE = 5;
exports.ADDR_LEN = exports.ADDR_PRE.length + exports.ADDR_SIZE * 2 + exports.ADDR_CHECK_SUM_SIZE * 2;
var AddressType;
(function (AddressType) {
    AddressType[AddressType["Illegal"] = 0] = "Illegal";
    AddressType[AddressType["Account"] = 1] = "Account";
    AddressType[AddressType["Contract"] = 2] = "Contract";
})(AddressType = exports.AddressType || (exports.AddressType = {}));
function createAddressByPrivateKey(privateKey) {
    var err = vitejs_utils_1.checkParams({ privateKey: privateKey }, [], [{
            name: 'privateKey',
            func: vitejs_utils_1.isHexString
        }]);
    if (err) {
        throw err;
    }
    var addressResult = createAddress(privateKey);
    var originalAddress = addressResult.originAddress;
    var checkSum = getAddrCheckSum(originalAddress, false);
    var address = getHexAddr(originalAddress, checkSum);
    var publicKey = getPublicKey(addressResult.privateKey);
    return {
        originalAddress: originalAddress.toString('hex'),
        publicKey: Buffer.from(publicKey).toString('hex'),
        privateKey: addressResult.privateKey.toString('hex'),
        address: address
    };
}
exports.createAddressByPrivateKey = createAddressByPrivateKey;
function getAddressFromPublicKey(publicKey) {
    var err = vitejs_utils_1.checkParams({ publicKey: publicKey }, ['publicKey'], [{
            name: 'publicKey',
            func: vitejs_utils_1.isHexString
        }]);
    if (err) {
        throw new Error(err.message);
    }
    var publicKeyBuffer = Buffer.from(publicKey, 'hex');
    var originalAddress = newAddrFromPub(publicKeyBuffer);
    var checkSum = getAddrCheckSum(originalAddress, false);
    return getHexAddr(originalAddress, checkSum);
}
exports.getAddressFromPublicKey = getAddressFromPublicKey;
function getOriginalAddressFromAddress(hexAddr) {
    var addrType = isValidAddress(hexAddr);
    if (addrType === AddressType.Illegal) {
        throw vitejs_error_1.addressIllegal;
    }
    return getOriginalAddress(hexAddr, addrType);
}
exports.getOriginalAddressFromAddress = getOriginalAddressFromAddress;
function getAddressFromOriginalAddress(originalAddress) {
    var err = vitejs_utils_1.checkParams({ originalAddress: originalAddress }, ['originalAddress'], [{
            name: 'originalAddress',
            func: function (_originalAddress) { return typeof _originalAddress === 'string' && /^[0-9a-fA-F]+$/.test(_originalAddress) && (_originalAddress.length === exports.ADDR_SIZE * 2 || _originalAddress.length === (exports.ADDR_SIZE + 1) * 2); }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    var contractNum = Number(originalAddress.slice(-2));
    contractNum = contractNum !== 0 && contractNum !== 1 ? 0 : contractNum;
    var isContract = !!Number(contractNum);
    var originalAddressBuf = Buffer.from(originalAddress, 'hex');
    var checkSum = getAddrCheckSum(originalAddressBuf, isContract);
    return getHexAddr(originalAddressBuf, checkSum);
}
exports.getAddressFromOriginalAddress = getAddressFromOriginalAddress;
function isValidAddress(address) {
    if (!isValidHex(address)) {
        return AddressType.Illegal;
    }
    return isValidCheckSum(address);
}
exports.isValidAddress = isValidAddress;
function getOriginalAddress(hexAddr, addrType) {
    var addr = hexAddr.slice(exports.ADDR_PRE.length, exports.ADDR_PRE.length + exports.ADDR_SIZE * 2);
    if (addrType === AddressType.Account) {
        return addr + "00";
    }
    return addr + "01";
}
function createAddress(privateKey) {
    var privateKeyBuffer;
    if (privateKey) {
        privateKeyBuffer = Buffer.from(privateKey, 'hex');
    }
    else {
        var _keyPair = keyPair();
        privateKeyBuffer = _keyPair.privateKey;
    }
    return {
        originAddress: newAddrFromPriv(privateKeyBuffer),
        privateKey: privateKeyBuffer
    };
}
function newAddrFromPub(publicKey) {
    var _pre = vitejs_utils_1.blake2b(publicKey, null, exports.ADDR_SIZE);
    var pre = new Uint8Array(21);
    pre.set(_pre);
    pre.set([0], 20);
    return Buffer.from(pre);
}
function newAddrFromPriv(privateKey) {
    var publicKey = getPublicKey(privateKey);
    return newAddrFromPub(Buffer.from(publicKey));
}
function getAddrCheckSum(addr, isContract) {
    var addrPre20 = addr.slice(0, 20);
    var _checkSum = vitejs_utils_1.blake2b(addrPre20, null, exports.ADDR_CHECK_SUM_SIZE);
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
function getHexAddr(originalAddress, checkSum) {
    return exports.ADDR_PRE + originalAddress.slice(0, 20).toString('hex') + checkSum;
}
function isValidHex(hexAddr) {
    return hexAddr && hexAddr.length === exports.ADDR_LEN && hexAddr.indexOf(exports.ADDR_PRE) === 0;
}
function isValidCheckSum(hexAddr) {
    var currentChecksum = hexAddr.slice(exports.ADDR_PRE.length + exports.ADDR_SIZE * 2);
    var _addr = hexAddr.slice(exports.ADDR_PRE.length, exports.ADDR_PRE.length + exports.ADDR_SIZE * 2);
    var addr = Buffer.from(_addr, 'hex');
    var contractCheckSum = getAddrCheckSum(addr, true);
    if (contractCheckSum === currentChecksum) {
        return AddressType.Contract;
    }
    var checkSum = getAddrCheckSum(addr);
    if (currentChecksum === checkSum) {
        return AddressType.Account;
    }
    return AddressType.Illegal;
}
