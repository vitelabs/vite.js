"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _address = _interopRequireDefault(require("./address.js"));

var _viteCoin = _interopRequireDefault(require("./viteCoin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  newHexAddr: _address.default.newHexAddr,
  isValidHexAddr: _address.default.isValidHexAddr,
  getAddrFromHexAddr: _address.default.getAddrFromHexAddr,
  viteToBasic: _viteCoin.default.toBasic,
  viteToMin: _viteCoin.default.toMin
};
exports.default = _default;