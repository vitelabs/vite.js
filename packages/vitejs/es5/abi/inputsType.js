"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitejs_utils_1 = require("./../utils");
var isArray = vitejs_utils_1.encoder.isArray, isObject = vitejs_utils_1.encoder.isObject;
var ADDR_SIZE = 20;
var getNum = new RegExp(/(\d+)/g);
var typePre = ['uint', 'int', 'address', 'bool', 'bytes', 'string', 'tokenId', 'gid'];
function formatType(typeStr) {
    var _a = validType(typeStr), isArr = _a.isArr, type = _a.type, size = _a.size;
    var arrLen = [];
    var isDynamic = type === 'string';
    if (isArr) {
        var _typeStrArr = typeStr.split('[').slice(1);
        if (_typeStrArr.length > 1) {
            console.warn("Not support [][][] like " + typeStr + ", now.");
        }
        _typeStrArr.forEach(function (_tArr) {
            var _len = _tArr.match(/\d+/g);
            var len = _len && _len[0] ? _len[0] : 0;
            isDynamic = isDynamic || !len;
            arrLen.push(len);
        });
    }
    var byteLength = size || 0;
    switch (type) {
        case 'number':
            byteLength = size / 8 || 32;
            break;
        case 'bool':
            byteLength = 1;
            break;
        case 'address':
            byteLength = ADDR_SIZE;
            break;
        case 'gid':
        case 'tokenId':
            byteLength = 10;
            break;
    }
    return {
        type: type,
        byteLength: Math.ceil(byteLength / 32) * 32,
        actualByteLen: byteLength,
        isArr: isArr,
        arrLen: arrLen,
        isDynamic: isDynamic || (type === 'bytes' && !byteLength)
    };
}
exports.formatType = formatType;
function validType(typeStr) {
    if (typeof typeStr !== 'string') {
        throw new Error("[Error] Illegal type " + JSON.stringify(typeStr) + ". Should be type-string, like 'uint32'.");
    }
    var isArr = /^\w+(\[\d*\])+$/g.test(typeStr);
    var isSingle = /^\w+\d*$/g.test(typeStr);
    if (!isArr && !isSingle) {
        throw new Error("[Error] Illegal type. " + typeStr);
    }
    var _type = typeStr.match(/^[a-zA-Z]+/g);
    var type = _type && _type[0] ? _type[0] : '';
    if (!type || typePre.indexOf(type) === -1) {
        throw new Error("[Error] Illegal type. " + typeStr);
    }
    type = type.indexOf('int') >= 0 ? 'number' : type;
    var _size;
    if (isArr) {
        var _typeStrArr = typeStr.split('[');
        _size = _typeStrArr[0].match(getNum);
    }
    else {
        _size = typeStr.match(getNum);
    }
    var size = _size ? _size[0] : 0;
    if (type === 'bytes' && size && !(size > 0 && size <= 32)) {
        throw new Error("[Error] Illegal type. " + typeStr + ": Binary type of\u00A0M\u00A0bytes,\u00A00\u00A0<\u00A0M\u00A0<=\u00A032. Or dynamic sized byte sequence.");
    }
    if (type === 'number' && size && !(size > 0 && size <= 256 && size % 8 === 0)) {
        throw new Error("[Error] Illegal type. " + typeStr + ": Unsigned integer type of\u00A0M\u00A0bits,\u00A00\u00A0<\u00A0M\u00A0<=\u00A0256,\u00A0M\u00A0%\u00A08\u00A0==\u00A00. e.g.\u00A0uint32,\u00A0uint8,\u00A0uint256.");
    }
    return { isArr: isArr, type: type, size: size };
}
exports.validType = validType;
function getTypes(jsonInterface) {
    if (isArray(jsonInterface)) {
        return jsonInterface;
    }
    if (!isObject(jsonInterface)) {
        throw new Error("[Error] Illegal types: " + jsonInterface + ". Should be Array<string> or JsonInterface.");
    }
    var types = [];
    jsonInterface.inputs && jsonInterface.inputs.forEach(function (param) {
        validType(param.type);
        types.push(param.type);
    });
    return types;
}
exports.getTypes = getTypes;
