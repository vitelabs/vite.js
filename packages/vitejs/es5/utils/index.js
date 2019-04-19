"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blake = require('blakejs/blake2b');
var qs_1 = require("qs");
var vitejs_error_1 = require("./../error");
var _e = require("./ed25519");
exports.ed25519 = _e;
function uriStringify(o) {
    var schema = o.schema, prefix = o.prefix, target_address = o.target_address, chain_id = o.chain_id, function_name = o.function_name, params = o.params;
    var _schema = schema ? schema + ":" : 'vite:';
    var _prefix = typeof prefix === 'undefined' ? '' : prefix + "-";
    var _target_address = target_address || '';
    var _chain_id = chain_id ? "@" + chain_id : '';
    var _function_name = function_name ? "/" + function_name : '';
    var _params = params ? "?" + qs_1.stringify(params, { encode: false }) : '';
    var str = "" + _schema + _prefix + _target_address + _chain_id + _function_name + _params;
    return str;
}
exports.uriStringify = uriStringify;
function checkParams(params, requiredP, validFunc) {
    if (requiredP === void 0) { requiredP = []; }
    if (validFunc === void 0) { validFunc = []; }
    if (!params) {
        return null;
    }
    var isHave = function (name) { return params.hasOwnProperty(name)
        && typeof params[name] !== 'undefined'
        && params[name] !== null; };
    for (var i = 0; i < requiredP.length; i++) {
        var name = requiredP[i];
        if (!isHave(name)) {
            return {
                code: vitejs_error_1.paramsMissing.code,
                message: vitejs_error_1.paramsMissing.message + " " + name + "."
            };
        }
    }
    for (var i = 0; i < validFunc.length; i++) {
        var _a = validFunc[i], name = _a.name, func = _a.func, msg = _a.msg;
        if (!name || !func || !isHave(name)) {
            continue;
        }
        if (!func(params[name])) {
            return {
                code: vitejs_error_1.paramsFormat.code,
                message: vitejs_error_1.paramsFormat.message + " Illegal " + name + ". " + (msg || '')
            };
        }
    }
    return null;
}
exports.checkParams = checkParams;
function getRawTokenId(tokenId) {
    var err = checkParams({ tokenId: tokenId }, ['tokenId'], [{
            name: 'tokenId',
            func: function (_t) { return _t.indexOf('tti_') === 0 && _t.length === 28; }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    return tokenId.slice(4, tokenId.length - 4);
}
exports.getRawTokenId = getRawTokenId;
function getTokenIdFromRaw(rawTokenId) {
    var err = checkParams({ rawTokenId: rawTokenId }, ['rawTokenId'], [{
            name: 'rawTokenId',
            func: function (_t) { return /^[0-9a-fA-F]+$/.test(_t) && _t.length === 20; }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    var checkSum = blake.blake2bHex(Buffer.from(rawTokenId, 'hex'), null, 2);
    return "tti_" + rawTokenId + checkSum;
}
exports.getTokenIdFromRaw = getTokenIdFromRaw;
function validNodeName(nodeName) {
    return /^[a-zA-Z0-9_\.]+(\s{1}[a-zA-Z0-9_\.]+)*$/g.test(nodeName) && nodeName.length <= 40;
}
exports.validNodeName = validNodeName;
function validInteger(num) {
    return num && (/(^[1-9]\d*$)/g.test(num) || num === '0');
}
exports.validInteger = validInteger;
exports.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}
exports.isObject = isObject;
function bytesToHex(arr) {
    if (arr === void 0) { arr = Buffer.from([]); }
    var err = checkParams({ arr: arr }, ['arr']);
    if (err) {
        throw new Error(err.message);
    }
    var hexArr = Array.prototype.map.call(arr, function (bit) {
        return ("00" + bit.toString(16)).slice(-2);
    });
    return hexArr.join('');
}
exports.bytesToHex = bytesToHex;
function hexToBytes(hex) {
    var err = checkParams({ hex: hex }, ['hex']);
    if (err) {
        throw new Error(err.message);
    }
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16);
    }));
    return typedArray;
}
exports.hexToBytes = hexToBytes;
function getBytesSize(str, charset) {
    if (charset === void 0) { charset = "utf8"; }
    var err = checkParams({ str: str }, ['str']);
    if (err) {
        throw new Error(err.message);
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
    var err = checkParams({ str: str }, ['str']);
    if (err) {
        throw new Error(err.message);
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
exports._Buffer = Buffer;
exports.blake2b = blake.blake2b;
exports.blake2bHex = blake.blake2bHex;
