"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createHmac = _interopRequireDefault(require("create-hmac"));

var _nacl_blake2b = _interopRequireDefault(require("./nacl_blake2b"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// [TODO] Fork and publish
// Copy from https://github.com/alepop/ed25519-hd-key
// Convert to ed25519-blake2b
var ED25519_CURVE = 'ed25519 blake2b seed';
var HARDENED_OFFSET = 0x80000000;
var pathRegex = new RegExp('^m(\\/[0-9]+\')+$');

var replaceDerive = function replaceDerive(val) {
  return val.replace('\'', '');
};

var _default = {
  getMasterKeyFromSeed: getMasterKeyFromSeed,
  getPublicKey: function getPublicKey(seed) {
    var _nacl$sign$keyPair$fr = _nacl_blake2b.default.sign.keyPair.fromSeed(seed),
        secretKey = _nacl$sign$keyPair$fr.secretKey,
        publicKey = _nacl$sign$keyPair$fr.publicKey;

    return {
      publicKey: publicKey,
      privateKey: secretKey
    };
  },
  derivePath: function derivePath(path, seed) {
    if (!isValidPath(path)) {
      throw new Error('Invalid derivation path');
    }

    var _getMasterKeyFromSeed = getMasterKeyFromSeed(seed),
        key = _getMasterKeyFromSeed.key,
        chainCode = _getMasterKeyFromSeed.chainCode;

    var segments = path.split('/').slice(1).map(replaceDerive).map(function (el) {
      return parseInt(el, 10);
    });
    return segments.reduce(function (parentKeys, segment) {
      return CKDPriv(parentKeys, segment + HARDENED_OFFSET);
    }, {
      key: key,
      chainCode: chainCode
    });
  }
};
exports.default = _default;

function getMasterKeyFromSeed(seed) {
  var hmac = (0, _createHmac.default)('sha512', ED25519_CURVE);
  var I = hmac.update(Buffer.from(seed, 'hex')).digest();
  var IL = I.slice(0, 32);
  var IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
}

function CKDPriv(_ref, index) {
  var key = _ref.key,
      chainCode = _ref.chainCode;
  var indexBuffer = Buffer.allocUnsafe(4);
  indexBuffer.writeUInt32BE(index, 0);
  var data = Buffer.concat([Buffer.alloc(1, 0), key, indexBuffer]);
  var I = (0, _createHmac.default)('sha512', chainCode).update(data).digest();
  var IL = I.slice(0, 32);
  var IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
}

function isValidPath(path) {
  if (!pathRegex.test(path)) {
    return false;
  }

  return !path.split('/').slice(1).map(replaceDerive).some(isNaN);
}