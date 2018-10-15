"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./Vite/index.js"));

var _index2 = _interopRequireDefault(require("./Wallet/index.js"));

var _HTTP = _interopRequireDefault(require("../libs/HTTP.js"));

var _WS = _interopRequireDefault(require("../libs/WS.js"));

var _utils = _interopRequireDefault(require("../libs/utils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ViteJS =
/*#__PURE__*/
function () {
  function ViteJS(provider) {
    _classCallCheck(this, ViteJS);

    this._currentProvider = provider;
    this.Vite = new _index.default(provider);
    this.Wallet = new _index2.default(this.Vite);
    this.version = '0.0.1-alpha1';
    this.walletVersion = this.Wallet.version;
    this.viteVersion = this.Vite.version;
  }

  _createClass(ViteJS, [{
    key: "resetProvider",
    value: function resetProvider(provider, isAbort) {
      this._currentProvider.reset(isAbort);

      this._currentProvider = provider;
      this.Vite.setProvider(provider);
    }
  }]);

  return ViteJS;
}();

ViteJS.HTTP_RPC = _HTTP.default; // ViteJS.IPC_RPC = IPC_RPC;

ViteJS.WS_RPC = _WS.default; // Libs

ViteJS.utils = _utils.default;
var _default = ViteJS;
exports.default = _default;