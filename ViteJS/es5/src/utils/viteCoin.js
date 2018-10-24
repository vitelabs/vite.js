"use strict";

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VITE_MIN_UNIT = new _bignumber.default('1000000000000000000');
var DP = 8;
module.exports = {
  getViteMinUnit: function getViteMinUnit() {
    return VITE_MIN_UNIT;
  },
  toBasic: function toBasic(num) {
    var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DP;
    var minUnit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : VITE_MIN_UNIT;
    num = new _bignumber.default(num);

    if (num.c == null) {
      return '';
    }

    try {
      return num.dividedBy(minUnit).decimalPlaces(decimalPlaces).toFormat();
    } catch (err) {
      return '';
    }
  },
  toMin: function toMin(num) {
    var minUnit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : VITE_MIN_UNIT;
    num = new _bignumber.default(num);

    if (num.c == null) {
      return '';
    }

    try {
      return num.multipliedBy(minUnit).toFormat();
    } catch (err) {
      return '';
    }
  }
};