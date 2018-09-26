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
  strToUtf8Bytes: function strToUtf8Bytes(str) {
    if (!str) {
      return null;
    }

    var back = []; // var byteSize = 0;

    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);

      if (0x00 <= code && code <= 0x7f) {
        // byteSize += 1;
        back.push(code);
      } else if (0x80 <= code && code <= 0x7ff) {
        // byteSize += 2;
        back.push(192 | 31 & code >> 6);
        back.push(128 | 63 & code);
      } else if (0x800 <= code && code <= 0xd7ff || 0xe000 <= code && code <= 0xffff) {
        // byteSize += 3;
        back.push(224 | 15 & code >> 12);
        back.push(128 | 63 & code >> 6);
        back.push(128 | 63 & code);
      }
    }

    for (i = 0; i < back.length; i++) {
      back[i] &= 0xff;
    }

    return new Uint8Array(back);
  }
};
exports.default = _default;