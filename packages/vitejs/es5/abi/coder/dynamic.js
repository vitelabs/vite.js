"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
function encode(typeObj, params) {
    var Bytes_Data = getBytesData(typeObj.type, params);
    if (typeObj.byteLength) {
        return common_1.encodeBytesData(typeObj, Bytes_Data);
    }
    var result = dynamicEncode(Bytes_Data);
    if (typeObj.type === 'bytes') {
        var dataLength = 32 * Math.ceil(Bytes_Data.length / 32);
        result = common_1.encode({ type: 'number', typeStr: 'uint', byteLength: 32 }, dataLength).result + result;
    }
    return { result: result, typeObj: typeObj };
}
exports.encode = encode;
function decode(typeObj, params) {
    var Type = typeObj.type;
    if (typeObj.byteLength) {
        var decodeRes = common_1.decodeToHexData(typeObj, params);
        return {
            result: getRawData(typeObj.type, decodeRes.result),
            params: decodeRes.params
        };
    }
    var _params = Type === 'bytes' ? params.substring(64) : params;
    var res = dynamicDecode(_params);
    return {
        result: getRawData(Type, res.result),
        params: res.params
    };
}
exports.decode = decode;
function getRawData(type, params) {
    if (type === 'string') {
        return Buffer.from(params, 'hex').toString('utf8');
    }
    return params;
}
function getBytesData(type, params) {
    if (typeof params !== 'string') {
        throw new Error('[Error] Illegal params. Should be string');
    }
    if (type === 'string') {
        return Buffer.from(params, 'utf8');
    }
    var is0xHex = /^0x[0-9a-fA-F]+$/.test(params) && params.length % 2 === 0;
    var isHex = /^[0-9a-fA-F]+$/.test(params) && params.length % 2 === 0;
    if (type === 'bytes' && !is0xHex && !isHex) {
        throw new Error('[Error] Illegal params. Should be hex-string.');
    }
    if (isHex) {
        return Buffer.from(params, 'hex');
    }
    return Buffer.from(params.substring(2), 'hex');
}
function dynamicEncode(bytesData) {
    var Str_Len = bytesData.length;
    var Data_Length = 32 * Math.ceil(Str_Len / 32);
    var bytesLen = common_1.encode({ type: 'number', typeStr: 'uint', byteLength: 32 }, Str_Len).result;
    var len = bytesLen.length / 2 + Data_Length;
    var arr = new Uint8Array(len);
    arr.set(Buffer.from(bytesLen, 'hex'));
    arr.set(bytesData, bytesLen.length / 2);
    return Buffer.from(arr).toString('hex');
}
function dynamicDecode(params) {
    var Str_Len = common_1.decode({ type: 'number', typeStr: 'uint', byteLength: 32 }, params.substring(0, 64)).result;
    var Data_Length = 32 * Math.ceil(Str_Len / 32);
    return {
        result: params.substring(64, 64 + Str_Len * 2),
        params: params.substring(64 + Data_Length * 2)
    };
}
