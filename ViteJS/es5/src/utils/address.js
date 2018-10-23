"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(require("../../libs/utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var blake = require('blakejs/blake2b');

var nacl = require('../../libs/nacl_blake2b');

var ADDR_PRE = 'vite_';
var ADDR_SIZE = 20;
var ADDR_CHECK_SUM_SIZE = 5;
var ADDR_LEN = ADDR_PRE.length + ADDR_SIZE * 2 + ADDR_CHECK_SUM_SIZE * 2;
var _default = {
  newHexAddr: function newHexAddr(priv) {
    // address = Blake2b(PubKey)(len:20)
    var _newAddr = newAddr(priv),
        addr = _newAddr.addr,
        privKey = _newAddr.privKey; // checkSum = Blake2b(address)(len:5)


    var checkSum = getAddrCheckSum(addr); // HumanReadableAddress = 'vite_' + Hex(address + checkSum)

    addr = _utils.default.bytesToHex(addr);
    return {
      addr: addr,
      pubKey: _utils.default.bytesToHex(privToPub(privKey)),
      privKey: _utils.default.bytesToHex(privKey),
      hexAddr: ADDR_PRE + addr + checkSum
    };
  },
  isValidHexAddr: isValidHexAddr,
  getAddrFromHexAddr: function getAddrFromHexAddr(hexAddr) {
    if (!isValidHexAddr(hexAddr)) {
      return null;
    }

    return getRealAddr(hexAddr);
  }
};
exports.default = _default;

function isValidHexAddr(hexAddr) {
  if (!hexAddr || hexAddr.length !== ADDR_LEN || hexAddr.indexOf(ADDR_PRE) !== 0) {
    return false;
  }

  var pre = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);

  var addr = _utils.default.hexToBytes(pre);

  var currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
  var checkSum = getAddrCheckSum(addr);
  return currentChecksum === checkSum;
}

function getRealAddr(hexAddr) {
  return hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
}

function privToPub(privKey) {
  return privKey.slice(32);
}

function newAddr(privKey) {
  var addr = '';

  if (privKey) {
    privKey = privKey instanceof ArrayBuffer ? privKey : _utils.default.hexToBytes(privKey);
    addr = newAddrFromPriv(privKey);
  } else {
    var keyPair = nacl.sign.keyPair();
    var publicKey = keyPair.publicKey;
    privKey = keyPair.secretKey;
    addr = newAddrFromPub(publicKey);
  }

  return {
    addr: addr,
    privKey: privKey
  };
}

function newAddrFromPub(pubKey) {
  var pre = blake.blake2b(pubKey, null, ADDR_SIZE);
  return pre.slice(0, ADDR_SIZE);
}

function newAddrFromPriv(privKey) {
  return newAddrFromPub(privToPub(privKey));
}

function getAddrCheckSum(addr) {
  var res = blake.blake2bHex(addr, null, ADDR_CHECK_SUM_SIZE);
  return res;
}