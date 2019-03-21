"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blake = require('blakejs/blake2b');
var tools_1 = require("./tools");
function bytesToHex(arr) {
    if (arr === void 0) { arr = Buffer.from([]); }
    var err = tools_1.checkParams({ arr: arr }, ['arr']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    var hexArr = Array.prototype.map.call(arr, function (bit) {
        return ("00" + bit.toString(16)).slice(-2);
    });
    return hexArr.join('');
}
exports.bytesToHex = bytesToHex;
function hexToBytes(hex) {
    var err = tools_1.checkParams({ hex: hex }, ['hex']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16);
    }));
    return typedArray;
}
exports.hexToBytes = hexToBytes;
function getBytesSize(str, charset) {
    if (charset === void 0) { charset = "utf8"; }
    var err = tools_1.checkParams({ str: str }, ['str']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    var total = 0;
    var code;
    var i;
    var len;
    if (charset === "utf16") {
        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            total += code <= 0xffff ? 2 : 4;
        }
        return total;
    }
    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            total += 1;
        }
        else if (0x80 <= code && code <= 0x7ff) {
            total += 2;
        }
        else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {
            total += 3;
        }
        else {
            total += 4;
        }
    }
    return total;
}
exports.getBytesSize = getBytesSize;
function utf8ToBytes(str) {
    if (str === void 0) { str = ''; }
    var err = tools_1.checkParams({ str: str }, ['str']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    var back = [];
    var i;
    for (i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            back.push(code);
        }
        else if (0x80 <= code && code <= 0x7ff) {
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)));
        }
        else if ((0x800 <= code && code <= 0xd7ff)
            || (0xe000 <= code && code <= 0xffff)) {
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)));
        }
    }
    for (i = 0; i < back.length; i++) {
        back[i] &= 0xff;
    }
    return new Uint8Array(back);
}
exports.utf8ToBytes = utf8ToBytes;
exports.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}
exports.isObject = isObject;
exports._Buffer = Buffer;
exports.blake2b = blake.blake2b;
exports.blake2bHex = blake.blake2bHex;
