"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keystore = _interopRequireDefault(require("./keystore.js"));

var _address = _interopRequireDefault(require("./address.js"));

var _account = _interopRequireDefault(require("./account.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wallet = function Wallet(Vite) {
  _classCallCheck(this, Wallet);

  this.version = 1;
  this.Vite = Vite;
  this.Keystore = new _keystore.default();
  this.Address = new _address.default();
  this.Account = new _account.default(Vite);
};

var _default = Wallet;
exports.default = _default;