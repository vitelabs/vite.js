const blake = require('blakejs/blake2b');
import { Hex } from "../type";
import { checkParams } from './tools';

declare const enum Charset {
    utf16 = "utf16",
    utf8 = "utf8"
}

export function bytesToHex(arr: Buffer = Buffer.from([])): Hex {
    let err = checkParams({ arr }, ['arr']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    let hexArr = Array.prototype.map.call(arr, function (bit: Number) {
        return ('00' + bit.toString(16)).slice(-2);
    });
    return hexArr.join('');
}

export function hexToBytes(hex: Hex) {
    let err = checkParams({ hex }, ['hex']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16);
    }));
    return typedArray;
}

export function getBytesSize(str: String, charset: Charset = Charset.utf8) {
    let err = checkParams({ str  }, ['str']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    var total = 0, code, i, len;

    if (charset === Charset.utf16) {
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
        } else if (0x80 <= code && code <= 0x7ff) {
            total += 2;
        } else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {
            total += 3;
        } else {
            total += 4;
        }
    }
    return total;
}

export function utf8ToBytes(str = '') {
    let err = checkParams({ str  }, ['str']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const back = [];
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)));
        } else if ((0x800 <= code && code <= 0xd7ff)
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

export const isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

export function isObject(obj) {
    let type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

export const _Buffer = Buffer;

export const blake2b = blake.blake2b;

export const blake2bHex = blake.blake2bHex;
