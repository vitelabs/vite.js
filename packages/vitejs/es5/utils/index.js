"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bn = require('bn.js');
var qs_1 = require("qs");
var blake = require('blakejs/blake2b');
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
    if (params && params.data) {
        params.data = params.data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
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
function isValidTokenId(tokenId) {
    if (tokenId.indexOf('tti_') !== 0 || tokenId.length !== 28) {
        return false;
    }
    var originalTokenId = tokenId.slice(4, tokenId.length - 4);
    var checkSum = getTokenIdCheckSum(originalTokenId);
    return tokenId.slice(tokenId.length - 4) === checkSum;
}
exports.isValidTokenId = isValidTokenId;
function getOriginalTokenIdFromTokenId(tokenId) {
    var err = checkParams({ tokenId: tokenId }, ['tokenId'], [{
            name: 'tokenId',
            func: function (_t) { return _t.indexOf('tti_') === 0 && _t.length === 28; }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    return tokenId.slice(4, tokenId.length - 4);
}
exports.getOriginalTokenIdFromTokenId = getOriginalTokenIdFromTokenId;
function getTokenIdFromOriginalTokenId(originalTokenId) {
    var err = checkParams({ originalTokenId: originalTokenId }, ['originalTokenId'], [{
            name: 'originalTokenId',
            func: function (_t) { return /^[0-9a-fA-F]+$/.test(_t) && _t.length === 20; }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    return "tti_" + originalTokenId + getTokenIdCheckSum(originalTokenId);
}
exports.getTokenIdFromOriginalTokenId = getTokenIdFromOriginalTokenId;
function isValidSBPName(sbpName) {
    return /^[a-zA-Z0-9_\.]+(\s{1}[a-zA-Z0-9_\.]+)*$/g.test(sbpName) && sbpName.length <= 40;
}
exports.isValidSBPName = isValidSBPName;
function isNonNegativeInteger(num) {
    num = "" + num;
    return num && (/(^[1-9]\d*$)/g.test(num) || num === '0');
}
exports.isNonNegativeInteger = isNonNegativeInteger;
function isInteger(num) {
    num = "" + num;
    return num && (/^[\-]{0,1}[1-9]\d*$/g.test(num) || num === '0');
}
exports.isInteger = isInteger;
exports.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}
exports.isObject = isObject;
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
function isSafeInteger(num) {
    if (typeof num === 'string') {
        return isInteger(num) ? 1 : -1;
    }
    if (typeof num !== 'number') {
        return -1;
    }
    if (!Number.isSafeInteger(num)) {
        return 0;
    }
    return 1;
}
exports.isSafeInteger = isSafeInteger;
function isHexString(str) {
    return /^[0-9a-fA-F]+$/.test(str);
}
exports.isHexString = isHexString;
function isBase64String(str) {
    if (str === '') {
        return true;
    }
    var base64Pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    return base64Pattern.test(str);
}
exports.isBase64String = isBase64String;
exports.blake2b = blake.blake2b;
exports.blake2bHex = blake.blake2bHex;
exports._Buffer = Buffer;
exports._bn = bn;
function getTokenIdCheckSum(originalTokenId) {
    return blake.blake2bHex(Buffer.from(originalTokenId, 'hex'), null, 2);
}
