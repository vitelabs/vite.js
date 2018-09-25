"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  bytesToHex: function bytesToHex(arr) {
    var hexArr = Array.prototype.map.call(arr, function (bit) {
      return ('00' + bit.toString(16)).slice(-2);
    });
    return hexArr.join('');
  },
  hexToBytes: function hexToBytes(hex) {
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    }));
    return typedArray;
  },
  getBytesSize: function getBytesSize(str) {
    var count = 0;

    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i);
      var bytes = /^[\u0000-\u00ff]$/.test(c) ? 1 : 2;
      count += bytes;
    }

    return count;
  },
  strToHex: function strToHex(str) {
    var hex = '';

    for (var i = 0; i < str.length; i++) {
      hex += '' + str.charCodeAt(i).toString(16);
    }

    return hex;
  },
  hexToStr: function hexToStr(hex) {
    var string = '';

    for (var i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }

    return string;
  }
};
exports.default = _default;