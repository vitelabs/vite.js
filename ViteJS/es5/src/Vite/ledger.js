"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _basicStruct2 = _interopRequireDefault(require("./basicStruct.js"));

var _bn = _interopRequireDefault(require("bn.js"));

var _address = _interopRequireDefault(require("../address"));

var _utils = _interopRequireDefault(require("../../libs/utils"));

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

var blake = require('blakejs/blake2b');

var Ledger =
/*#__PURE__*/
function (_basicStruct) {
  _inherits(Ledger, _basicStruct);

  function Ledger(provider) {
    _classCallCheck(this, Ledger);

    return _possibleConstructorReturn(this, _getPrototypeOf(Ledger).call(this, provider));
  }

  _createClass(Ledger, [{
    key: "getBlocks",
    value: function getBlocks(_ref) {
      var addr = _ref.addr,
          index = _ref.index,
          _ref$pageCount = _ref.pageCount,
          pageCount = _ref$pageCount === void 0 ? 50 : _ref$pageCount,
          _ref$needTokenInfo = _ref.needTokenInfo,
          needTokenInfo = _ref$needTokenInfo === void 0 ? false : _ref$needTokenInfo;
      return this.provider.batch([{
        type: 'request',
        methodName: 'ledger_getBlocksByAccAddr',
        params: [addr, index, pageCount, needTokenInfo]
      }, {
        type: 'request',
        methodName: 'ledger_getAccountByAccAddr',
        params: [addr]
      }]).then(function (data) {
        if (!data || data.length < 2) {
          return null;
        }

        var account = data[1].result;
        return {
          list: data[0].result || [],
          totalNum: account && account.totalNumber ? account.totalNumber : 0
        };
      });
    }
  }, {
    key: "getBalance",
    value: function getBalance(addr) {
      return this.provider.batch([{
        type: 'request',
        methodName: 'ledger_getAccountByAccAddr',
        params: [addr]
      }, {
        type: 'request',
        methodName: 'onroad_getAccountOnroadInfo',
        params: [addr]
      }]).then(function (data) {
        if (!data || !data.length || data.length < 2) {
          return null;
        }

        var result = {
          balance: data[0].result,
          onroad: data[1].result
        };
        return result;
      });
    }
  }, {
    key: "getReceiveBlock",
    value: function getReceiveBlock(addr) {
      var _this = this;

      return this.provider.batch([{
        type: 'request',
        methodName: 'onroad_getOnroadBlocksByAddress',
        params: [addr, 0, 1]
      }, {
        type: 'request',
        methodName: 'ledger_getLatestBlock',
        params: [addr]
      }, {
        type: 'request',
        methodName: 'ledger_getLatestSnapshotChainHash'
      }]).then(function (data) {
        if (!data) {
          return null;
        }

        var blocks = data[0].result;
        var latestBlock = data[1].result;
        var latestSnapshotChainHash = data[2].result;

        if (!blocks || !blocks.length) {
          return null;
        }

        var block = blocks[0];
        var baseTx = getBaseTx(addr, latestBlock, latestSnapshotChainHash);
        baseTx.blockType = block.blockType;
        baseTx.fromBlockHash = block.fromBlockHash;
        baseTx.tokenId = block.tokenId;
        block.nonce && (baseTx.nonce = block.nonce);
        block.data && (baseTx.data = block.data);
        return new Promise(function (res, rej) {
          var hash = getPowHash(addr, baseTx.prevHash);
          console.log(hash);
          return _this.provider.request('pow_getPowNonce', ['', hash]).then(function (data) {
            baseTx.nonce = data.result;
            return res(baseTx);
          }).catch(function (err) {
            return rej(err);
          });
        });
      });
    }
  }, {
    key: "getSendBlock",
    value: function getSendBlock(_ref2) {
      var _this2 = this;

      var fromAddr = _ref2.fromAddr,
          toAddr = _ref2.toAddr,
          tokenId = _ref2.tokenId,
          amount = _ref2.amount,
          message = _ref2.message;
      return this.provider.batch([{
        type: 'request',
        methodName: 'ledger_getLatestBlock',
        params: [fromAddr]
      }, {
        type: 'request',
        methodName: 'ledger_getLatestSnapshotChainHash'
      }]).then(function (data) {
        if (!data) {
          return null;
        }

        var latestBlock = data[0].result;
        var latestSnapshotChainHash = data[1].result;
        var baseTx = getBaseTx(fromAddr, latestBlock, latestSnapshotChainHash);
        message && (baseTx.data = message);
        baseTx.tokenId = tokenId;
        baseTx.toAddress = toAddr;
        baseTx.amount = amount;
        baseTx.blockType = 2;
        return new Promise(function (res, rej) {
          var hash = getPowHash(fromAddr, baseTx.prevHash);
          return _this2.provider.request('pow_getPowNonce', ['', hash]).then(function (data) {
            console.log(data); // baseTx.nonce = ''; 

            return res(baseTx);
          }).catch(function (err) {
            return rej(err);
          });
        });
      });
    }
  }]);

  return Ledger;
}(_basicStruct2.default);

var _default = Ledger;
exports.default = _default;

function getBaseTx(accountAddress, latestBlock, snapshotHash) {
  var height = latestBlock && latestBlock.meta && latestBlock.meta.height ? new _bn.default(latestBlock.meta.height).add(new _bn.default(1)).toString() : '1';
  var timestamp = new _bn.default(new Date().getTime()).div(new _bn.default(1000)).toNumber();
  var baseTx = {
    accountAddress: accountAddress,
    meta: {
      height: height
    },
    timestamp: timestamp,
    snapshotHash: snapshotHash,
    fee: '0' // [TODO]

  };

  if (latestBlock && latestBlock.hash) {
    baseTx.prevHash = latestBlock.hash;
  }

  return baseTx;
}

function getPowHash(addr, prevHash) {
  var prev = prevHash || _utils.default.bytesToHex(blake.blake2b('0', null, 32));

  var realAddr = _address.default.getAddrFromHexAddr(addr);

  return _utils.default.bytesToHex(blake.blake2b(realAddr + prev, null, 32));
}