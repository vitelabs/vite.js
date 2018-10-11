"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _basicStruct2 = _interopRequireDefault(require("./basicStruct.js"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

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

_bignumber.default.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: '',
    groupSize: 0,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0
  }
});

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
          totalNum: account && account.blockHeight ? account.blockHeight : 0
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
        methodName: 'ledger_getUnconfirmedInfo',
        params: [addr]
      }]).then(function (data) {
        if (!data || !data.length || data.length < 2) {
          return null;
        }

        var result = {
          balance: data[0].result,
          unconfirm: data[1].result
        };
        return result;
      });
    }
  }, {
    key: "sendTx",
    value: function sendTx(accountBlock) {
      return this.provider.request('ledger_sendTx', [accountBlock]);
    }
  }, {
    key: "getBlocksByAccAddr",
    value: function getBlocksByAccAddr(_ref2) {
      var accAddr = _ref2.accAddr,
          index = _ref2.index,
          _ref2$count = _ref2.count,
          count = _ref2$count === void 0 ? 20 : _ref2$count,
          _ref2$needTokenInfo = _ref2.needTokenInfo,
          needTokenInfo = _ref2$needTokenInfo === void 0 ? false : _ref2$needTokenInfo;
      return this.provider.request('ledger_getBlocksByAccAddr', [accAddr, index, count, needTokenInfo]);
    }
  }, {
    key: "getAccountByAccAddr",
    value: function getAccountByAccAddr(accAddr) {
      return this.provider.request('ledger_getAccountByAccAddr', accAddr);
    }
  }, {
    key: "getUnconfirmedInfo",
    value: function getUnconfirmedInfo(accAddr) {
      return this.provider.request('ledger_getUnconfirmedInfo', accAddr);
    }
  }, {
    key: "getUnconfirmedBlocksByAccAddr",
    value: function getUnconfirmedBlocksByAccAddr(accAddr) {
      return this.provider.request('ledger_getUnconfirmedBlocksByAccAddr', accAddr);
    }
  }, {
    key: "getLatestBlock",
    value: function getLatestBlock(accAddr) {
      return this.provider.request('ledger_getLatestBlock', accAddr);
    }
  }, {
    key: "getTokenMintage",
    value: function getTokenMintage() {
      return this.provider.request('ledger_getTokenMintage');
    }
  }, {
    key: "getBlocksByHash",
    value: function getBlocksByHash(accAddr) {
      return this.provider.request('ledger_getBlocksByHash', accAddr);
    }
  }, {
    key: "getInitSyncInfo",
    value: function getInitSyncInfo() {
      return this.provider.request('ledger_getInitSyncInfo');
    }
  }, {
    key: "getSnapshotChainHeight",
    value: function getSnapshotChainHeight() {
      return this.provider.request('ledger_getSnapshotChainHeight');
    }
  }, {
    key: "getReceiveBlock",
    value: function getReceiveBlock(addr) {
      return this.provider.batch([{
        type: 'request',
        methodName: 'ledger_getUnconfirmedBlocksByAccAddr',
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
        baseTx.fromHash = block.hash;
        baseTx.tokenId = block.tokenId;
        block.data && (baseTx.data = block.data);
        return baseTx;
      });
    }
  }, {
    key: "getSendBlock",
    value: function getSendBlock(_ref3) {
      var fromAddr = _ref3.fromAddr,
          toAddr = _ref3.toAddr,
          tokenId = _ref3.tokenId,
          amount = _ref3.amount,
          message = _ref3.message;
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
        baseTx.to = toAddr;
        baseTx.amount = amount;
        return baseTx;
      });
    }
  }]);

  return Ledger;
}(_basicStruct2.default);

var _default = Ledger;
exports.default = _default;

function getBaseTx(accountAddress, latestBlock, snapshotTimestamp) {
  var height = latestBlock && latestBlock.meta && latestBlock.meta.height ? new _bignumber.default(latestBlock.meta.height).plus(1).toFormat() : '1';
  var timestamp = new _bignumber.default(new Date().getTime()).dividedToIntegerBy(1000).toNumber();
  var baseTx = {
    accountAddress: accountAddress,
    meta: {
      height: height
    },
    timestamp: timestamp,
    snapshotTimestamp: snapshotTimestamp,
    nonce: '0000000000',
    difficulty: '0000000000',
    fAmount: '0'
  };

  if (latestBlock && latestBlock.hash) {
    baseTx.prevHash = latestBlock.hash;
  }

  return baseTx;
}