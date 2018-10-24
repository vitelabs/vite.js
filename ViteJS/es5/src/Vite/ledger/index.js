"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _basicStruct2 = _interopRequireDefault(require("../basicStruct.js"));

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
    key: "createTx",
    value: function createTx(AccountBlock) {
      return this.provider.request('ledger_createTx', [AccountBlock]);
    } // SelfAddr: string of addr 
    // ToAddr: string of addr
    // Passphrase: string
    // TokenTypeId: string of tokentypeid
    // Amount:big int

  }, {
    key: "createTxWithPassphrase",
    value: function createTxWithPassphrase(AccountBlock) {
      return this.provider.request('ledger_createTxWithPassphrase', AccountBlock);
    }
  }, {
    key: "getBlocksByAccAddr",
    value: function getBlocksByAccAddr(_ref) {
      var accAddr = _ref.accAddr,
          index = _ref.index,
          _ref$count = _ref.count,
          count = _ref$count === void 0 ? 20 : _ref$count;
      return this.provider.request('ledger_getBlocksByAccAddr', {
        Addr: accAddr,
        Index: index,
        Count: count
      });
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
        var height = latestBlock.meta.height ? new _bignumber.default(block.meta.height).plus(1).toFormat() : 1;
        return {
          meta: {
            height: height
          },
          accountAddress: addr,
          fromHash: block.hash,
          prevHash: latestBlock.hash,
          timestamp: new Date().getTime(),
          tokenId: block.tokenId,
          data: block.data,
          snapshotTimestamp: latestSnapshotChainHash,
          nonce: '0000000000',
          difficulty: '0000000000'
        };
      });
    }
  }]);

  return Ledger;
}(_basicStruct2.default);

var _default = Ledger;
exports.default = _default;