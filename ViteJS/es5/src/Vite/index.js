"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _version = _interopRequireDefault(require("./version.js"));

var _account = _interopRequireDefault(require("./account.js"));

var _ledger = _interopRequireDefault(require("./ledger.js"));

var _p2p = _interopRequireDefault(require("./p2p.js"));

var _types = _interopRequireDefault(require("./types.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Vite =
/*#__PURE__*/
function () {
  function Vite(provider) {
    _classCallCheck(this, Vite);

    this._currentProvider = provider;
    this.Version = new _version.default(provider);
    this.Account = new _account.default(provider);
    this.Ledger = new _ledger.default(provider);
    this.P2P = new _p2p.default(provider);
    this.Types = new _types.default(provider);
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