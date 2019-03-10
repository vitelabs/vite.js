"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("utils");
var inputsType_1 = require("../inputsType");
var common_1 = require("./common");
var dynamic_1 = require("./dynamic");
var isArray = utils_1.encoder.isArray;
var encode = {
    address: common_1.encode,
    gid: common_1.encode,
    tokenId: common_1.encode,
    number: common_1.encode,
    bool: common_1.encode,
    string: dynamic_1.encode,
    bytes: dynamic_1.encode,
};
var decode = {
    address: common_1.decode,
    gid: common_1.decode,
    tokenId: common_1.decode,
    number: common_1.decode,
    bool: common_1.decode,
    string: dynamic_1.decode,
    bytes: dynamic_1.decode
};
function encodeParameter(typeStr, params) {
    var typeObj = inputsType_1.formatType(typeStr);
    if (typeObj.isArr && !isArray(params) ||
        (!typeObj.isArr && ['string', 'boolean', 'number'].indexOf(typeof params) === -1)) {
        throw "[Error] Illegal type or params. type: " + typeObj.type + ", params: " + params;
    }
    if (!typeObj.isArr) {
        return encode[typeObj.type](typeObj, params);
    }
    return encodeArrs(typeObj, params);
}
exports.encodeParameter = encodeParameter;
function encodeParameters(types, params) {
    if (!isArray(types) || !isArray(params) || types.length !== params.length) {
        throw '[Error] Illegal types or params. Types and params should be array.';
    }
    var tempResult = [];
    var dynamicRes = [];
    var totalLength = 0;
    types.forEach(function (type, i) {
        var _res = encodeParameter(type, params[i]);
        if (!_res.typeObj.isDynamic) {
            totalLength += _res.result.length;
            tempResult.push(_res.result);
            return;
        }
        var result = _res.result;
        if (_res.typeObj.type === 'bytes' && !_res.typeObj.isArr) {
            result = result.slice(64);
        }
        totalLength += 64;
        tempResult.push(false);
        dynamicRes.push(result);
    });
    var result = '';
    var dynamicResult = '';
    tempResult.forEach(function (_r) {
        if (_r) {
            result += _r;
            return;
        }
        var index = (totalLength + dynamicResult.length) / 2;
        result += encode.number({
            type: 'number', byteLength: 32, isArr: false
        }, index).result;
        dynamicResult += dynamicRes.shift();
    });
    return result + dynamicResult;
}
exports.encodeParameters = encodeParameters;
function decodeParameter(typeStr, params) {
    var typeObj = inputsType_1.formatType(typeStr);
    if (!typeObj.isArr) {
        return decode[typeObj.type](typeObj, params).result;
    }
    return decodeArrs(typeObj, params);
}
exports.decodeParameter = decodeParameter;
function decodeParameters(types, params) {
    if (!isArray(types)) {
        throw '[Error] Illegal types. Should be array.';
    }
    var _params = params;
    var resArr = [];
    var indexArr = [];
    types.forEach(function (type) {
        var typeObj = inputsType_1.formatType(type);
        if (!typeObj.isDynamic) {
            var _res_1 = decode[typeObj.type](typeObj, _params);
            _params = _res_1.params;
            resArr.push({
                isDynamic: false,
                result: _res_1.result
            });
            return;
        }
        var _res = decode.number({
            type: 'number', byteLength: 32, isArr: false
        }, _params);
        var index = _res.result;
        _params = _res.params;
        indexArr.push(index * 2);
        resArr.push({
            isDynamic: true,
            typeObj: typeObj,
            index: index * 2
        });
    });
    var result = [];
    var currentInx = 0;
    resArr.forEach(function (_res, i) {
        if (!_res.isDynamic) {
            result.push(_res.result);
            return;
        }
        var _p;
        if ((currentInx + 1) !== indexArr.length) {
            _p = params.slice(_res.index, indexArr[currentInx + 1]);
        }
        else {
            _p = params.slice(_res.index);
        }
        if (_res.typeObj.type === 'bytes' && !_res.typeObj.isArr) {
            var len = 32 * Math.ceil(_p.length / 2 / 32);
            _p = encode.number({
                type: 'number', byteLength: 32
            }, len).result + _p;
        }
        currentInx++;
        result.push(decodeParameter(types[i], _p));
    });
    return result;
}
exports.decodeParameters = decodeParameters;
function encodeArr(typeObj, arrLen, params) {
    if (!params || (arrLen && params.length !== +arrLen)) {
        throw "[Error] Params.length !== arr.length. Params: " + JSON.stringify(params) + ". " + JSON.stringify(typeObj);
    }
    var result = '';
    params.forEach(function (_param) {
        var res = encode[typeObj.type](typeObj, _param);
        result += res.result;
    });
    var bytesArrLen = arrLen ? '' :
        encode.number({
            type: 'number', byteLength: 32, isArr: false
        }, params.length).result;
    return bytesArrLen + result;
}
function encodeArrs(typeObj, params) {
    var result = '';
    var lenArr = typeObj.arrLen;
    var loop = function (params, i) {
        if (i === void 0) { i = 0; }
        if (i === lenArr.length - 1) {
            result += encodeArr(typeObj, lenArr[lenArr.length - i - 1], params);
            return;
        }
        i++;
        isArray(params) && params.forEach(function (_p) {
            loop(_p, i);
        });
    };
    loop(params);
    return {
        typeObj: typeObj, result: result
    };
}
function decodeArr(typeObj, arrLen, params) {
    var _param = params;
    if (typeObj.isDynamic) {
        var len = params.substring(0, 64);
        arrLen = decode.number({
            type: 'number', byteLength: 32, isArr: false
        }, len).result;
        _param = params.substring(64);
    }
    var result = [];
    for (var i = 0; i < arrLen; i++) {
        var res = decode[typeObj.type](typeObj, _param);
        result.push(res.result);
        _param = res.params;
    }
    return {
        result: result, params: _param
    };
}
function decodeArrs(typeObj, params) {
    var lenArr = typeObj.arrLen;
    var loop = function (i, result) {
        if (i === void 0) { i = 0; }
        if ((lenArr.length <= 1 && i === lenArr.length) ||
            (lenArr.length > 1 && i === lenArr.length - 1)) {
            return result;
        }
        var l = lenArr[i];
        var _r = [];
        if (!result) {
            while (params) {
                var _res = decodeArr(typeObj, l, params);
                params = _res.params;
                _r.push(_res.result);
            }
            _r = _r.length > 1 ? _r : _r[0];
        }
        else {
            while (result && result.length) {
                _r.push(result.splice(0, l));
            }
        }
        i++;
        return loop(i, _r);
    };
    return loop();
}
