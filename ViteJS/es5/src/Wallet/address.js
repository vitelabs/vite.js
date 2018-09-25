"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bip = _interopRequireDefault(require("bip39"));

var _hd = _interopRequireDefault(require("../../libs/hd"));

var _utils = _interopRequireDefault(require("../../libs/utils"));

var _address = _interopRequireDefault(require("../address"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var rootPath = 'm/44\'/666666\'';

var Address =
/*#__PURE__*/
function () {
  function Address() {
    _classCallCheck(this, Address);
  }

  _createClass(Address, [{
    key: "getEntropyFromMnemonic",
    value: function getEntropyFromMnemonic(mnemonic) {
      var valid = _bip.default.validateMnemonic(mnemonic);

      if (!valid) {
        return false;
      }

      return _bip.default.mnemonicToEntropy(mnemonic);
    }
  }, {
    key: "getMnemonicFromEntropy",
    value: function getMnemonicFromEntropy(entropy) {
      return _bip.default.entropyToMnemonic(entropy);
    }
  }, {
    key: "newAddr",
    value: function newAddr() {
      var mnemonic = _bip.default.generateMnemonic(256);

      var entropy = _bip.default.mnemonicToEntropy(mnemonic);

      var seed = _bip.default.mnemonicToSeedHex(mnemonic);

      var addr = getAddrFromPath.call(this, rootPath, seed);
      return {
        addr: addr,
        entropy: entropy
      };
    }
  }, {
    key: "newAddrFromMnemonic",
    value: function newAddrFromMnemonic(mnemonic, index) {
      if (!mnemonic) {
        return false;
      }

      var valid = _bip.default.validateMnemonic(mnemonic);

      if (!valid) {
        return false;
      }

      var path = "".concat(rootPath, "/").concat(index, "'");

      var seed = _bip.default.mnemonicToSeedHex(mnemonic);

      return getAddrFromPath.call(this, path, seed);
    }
  }, {
    key: "getAddrsFromMnemonic",
    value: function getAddrsFromMnemonic(mnemonic) {
      var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      var path = arguments.length > 2 ? arguments[2] : undefined;
      path = path || rootPath;

      if (!mnemonic || num > 10 || num < 0) {
        return false;
      }

      var valid = _bip.default.validateMnemonic(mnemonic);

      if (!valid) {
        return false;
      }

      var addrs = [];

      var seed = _bip.default.mnemonicToSeedHex(mnemonic);

      for (var i = 0; i < num; i++) {
        var currentPath = "".concat(path, "/").concat(i, "'");
        var addr = getAddrFromPath.call(this, currentPath, seed);
        addrs.push(addr);
      }

      return addrs;
    }
  }]);

  return Address;
}();

var _default = Address;
exports.default = _default;

function getAddrFromPath(path, seed) {
  var _hd$derivePath = _hd.default.derivePath(path, seed),
      key = _hd$derivePath.key;

  var _hd$getPublicKey = _hd.default.getPublicKey(key),
      privateKey = _hd$getPublicKey.privateKey;

  var priv = _utils.default.bytesToHex(privateKey);

  return _address.default.newHexAddr(priv);
}