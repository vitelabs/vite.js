"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blake = require('blakejs/blake2b');
var qs_1 = require("qs");
var error_1 = require("error");
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
                code: error_1.paramsMissing.code,
                message: error_1.paramsMissing.message + " " + name + "."
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
                code: error_1.paramsFormat.code,
                message: error_1.paramsFormat.message + " Illegal " + name + ". " + (msg || '')
            };
        }
    }
    return null;
}
exports.checkParams = checkParams;
function getRawTokenid(tokenId) {
    var err = checkParams({ tokenId: tokenId }, ['tokenId'], [{
            name: 'tokenId',
            func: function (_t) { return _t.indexOf('tti_') === 0 && _t.length === 28; }
        }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    return tokenId.slice(4, tokenId.length - 4);
}
exports.getRawTokenid = getRawTokenid;
function getTokenIdFromRaw(rawTokenId) {
    var err = checkParams({ rawTokenId: rawTokenId }, ['rawTokenId'], [{
            name: 'rawTokenId',
            func: function (_t) { return /^[0-9a-fA-F]+$/.test(_t) && _t.length === 20; }
        }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
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
