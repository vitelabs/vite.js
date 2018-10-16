"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _version = _interopRequireDefault(require("./version.js"));

var _account = _interopRequireDefault(require("./account.js"));

var _ledger = _interopRequireDefault(require("./ledger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Methods = {
  wallet: ['listAddress', 'newAddress', 'status', 'unlockAddress', 'lockAddress', 'reloadAndFixAddressFile', 'isMayValidKeystoreFile', 'getDataDir', 'createTxWithPassphrase'],
  p2p: ['networkAvailable', 'peersCount'],
  ledger: ['getBlocksByAccAddr', 'getAccountByAccAddr', 'getLatestSnapshotChainHash', 'getLatestBlock', 'getTokenMintage', 'getBlocksByHash', 'getSnapshotChainHeight'],
  onroad: ['getOnroadBlocksByAddress', 'getAccountOnroadInfo', 'listWorkingAutoReceiveWorker', 'startAutoReceive', 'stopAutoReceive'],
  contracts: ['getPledgeData', 'getCancelPledgeData', 'getMintageData', 'getMintageCancelPledgeData', 'getCreateContractToAddress', 'getRegisterData', 'getCancelRegisterData', 'getRewardData', 'getUpdateRegistrationData', 'getVoteData', 'getCancelVoteData', 'getConditionRegisterOfPledge', 'getConditionVoteOfDefault', 'getConditionVoteOfKeepToken', 'getCreateConsensusGroupData', 'getCancelConsensusGroupData', 'getReCreateConsensusGroupData'],
  pow: ['getPowNonce'],
  tx: ['sendRawTx']
};

var Vite =
/*#__PURE__*/
function () {
  function Vite(provider) {
    var _this = this;

    _classCallCheck(this, Vite);

    this._currentProvider = provider;

    var _loop = function _loop(namespace) {
      Methods[namespace].forEach(function (name) {
        var methodName = "".concat(namespace, "_").concat(name);

        _this[methodName] = function () {
          for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
          }

          return _this._currentProvider.request(methodName, params);
        };
      });
    };

    for (var namespace in Methods) {
      _loop(namespace);
    }

    this.Version = new _version.default(provider);
    this.Account = new _account.default(provider);
    this.Ledger = new _ledger.default(provider);
  }

  _createClass(Vite, [{
    key: "setProvider",
    value: function setProvider(provider) {
      var abort = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this._currentProvider.reset(abort);

      this._currentProvider = provider;
    }
  }]);

  return Vite;
}();

var _default = Vite;
exports.default = _default;