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
  },
  strToBytes: function strToBytes(str) {
    var utf8 = [];

    for (var i = 0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);else if (charcode < 0x800) {
        utf8.push(0xc0 | charcode >> 6, 0x80 | charcode & 0x3f);
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(0xe0 | charcode >> 12, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
      } // surrogate pair
      else {
          i++; // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves

          charcode = 0x10000 + ((charcode & 0x3ff) << 10 | str.charCodeAt(i) & 0x3ff);
          utf8.push(0xf0 | charcode >> 18, 0x80 | charcode >> 12 & 0x3f, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
        }
    }

    return utf8;
  }
};
exports.default = _default;