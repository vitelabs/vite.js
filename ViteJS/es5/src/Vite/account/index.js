"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _basicStruct2 = _interopRequireDefault(require("../basicStruct"));

var _utils = _interopRequireDefault(require("../../../libs/utils"));

var _index = _interopRequireDefault(require("../../utils/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var nacl = require('../../../libs/nacl_blake2b');

var blake = require('blakejs/blake2b');

var Account =
/*#__PURE__*/
function (_basicStruct) {
  _inherits(Account, _basicStruct);

  function Account(provider) {
    _classCallCheck(this, Account);

    return _possibleConstructorReturn(this, _getPrototypeOf(Account).call(this, provider));
  }

  _createClass(Account, [{
    key: "newHexAddr",
    value: function newHexAddr(privKey) {
      return _index.default.newHexAddr(privKey);
    }
  }, {
    key: "signTX",
    value: function signTX(accountBlock, privKey) {
      var source = getSource(accountBlock);
      source = _utils.default.hexToBytes(source);

      var addr = _index.default.newHexAddr(privKey);

      var pubKey = addr.pubKey; // Hex string

      var hash = blake.blake2b(source, null, 32);

      var hashString = _utils.default.bytesToHex(hash);

      var signature = nacl.sign.detached(hash, _utils.default.hexToBytes(privKey), _utils.default.hexToBytes(pubKey));

      var signatureHex = _utils.default.bytesToHex(signature);

      return {
        hash: hashString,
        signature: signatureHex
      };
    }
  }]);

  return Account;
}(_basicStruct2.default);

var _default = Account;
exports.default = _default;

function getSource(accountBlock) {
  var source = '';
  source += accountBlock.prevHash || '';
  source += accountBlock.meta && accountBlock.meta.height ? _utils.default.strToHex(accountBlock.meta.height) : '';
  source += accountBlock.accountAddress ? _index.default.getAddrFromHexAddr(accountBlock.accountAddress) : '';

  if (accountBlock.to) {
    source += _index.default.getAddrFromHexAddr(accountBlock.to);
    source += getRawTokenid(accountBlock.tokenId) || '';
    source += _utils.default.strToHex(accountBlock.amount) || '';
  } else {
    source += accountBlock.fromHash || '';
  } // timestamp: The Magic Number


  source += 'EFBFBD';
  source += accountBlock.data ? _utils.default.strToHex(JSON.stringify(accountBlock.data)) : '';
  source += accountBlock.snapshotTimestamp || '';
  source += accountBlock.nonce || '';
  source += accountBlock.difficulty || '';
  source += accountBlock.fAmount ? _utils.default.strToHex(accountBlock.fAmount) : '';
  return source;
}

function getRawTokenid(tokenId) {
  if (tokenId.indexOf('tti_') !== 0) {
    return null;
  }

  return tokenId.slice(4);
}