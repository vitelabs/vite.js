"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BigNumber = require('bn.js');
var vitejs_error_1 = require("./../../error");
var address_1 = require("./../../wallet/address");
var vitejs_utils_1 = require("./../../utils");
function encode(typeObj, params) {
    var Bytes_Data = getBytesData(typeObj, params);
    return encodeBytesData(typeObj, Bytes_Data);
}
exports.encode = encode;
function encodeBytesData(typeObj, Bytes_Data) {
    var Byte_Len = typeObj.byteLength;
    var Offset = Byte_Len - Bytes_Data.length;
    if (Offset < 0) {
        throw lengthError(typeObj, Bytes_Data.length, 'Offset < 0');
    }
    var result = new Uint8Array(Byte_Len);
    result.set(Bytes_Data, typeObj.type === 'bytes' ? 0 : Offset);
    return {
        result: Buffer.from(result).toString('hex'),
        typeObj: typeObj
    };
}
exports.encodeBytesData = encodeBytesData;
function decodeToHexData(typeObj, params) {
    if (typeof params !== 'string' || !/^[0-9a-fA-F]+$/.test(params)) {
        throw new Error('[Error] decode, params should be hex-string.');
    }
    var Byte_Len = typeObj.byteLength;
    var _params = params.substring(0, Byte_Len * 2);
    var Data_Len = _params.length / 2;
    if (Byte_Len !== Data_Len) {
        throw lengthError(typeObj, Data_Len, 'Byte_Len !== Data_Len');
    }
    var Actual_Byte_Len = typeObj.actualByteLen;
    var Offset = Byte_Len - Actual_Byte_Len;
    if (Data_Len < Offset) {
        throw lengthError(typeObj, Actual_Byte_Len, 'Data_Len < Offset');
    }
    return {
        result: typeObj.type === 'bytes' ? _params.substring(0, _params.length - Offset * 2) : _params.substring(Offset * 2),
        params: params.substring(Data_Len * 2),
        _params: _params
    };
}
exports.decodeToHexData = decodeToHexData;
function decode(typeObj, params) {
    var res = decodeToHexData(typeObj, params);
    return {
        result: getRawData(typeObj, res.result, res._params),
        params: res.params
    };
}
exports.decode = decode;
function getRawData(_a, params, _params) {
    var type = _a.type, typeStr = _a.typeStr, actualByteLen = _a.actualByteLen;
    switch (type) {
        case 'address':
            return address_1.getAddressFromOriginalAddress(params);
        case 'bool':
            return showNumber(params ? '1' : '0', 'uint');
        case 'number':
            return showNumber(params, typeStr, actualByteLen, _params);
        case 'gid':
            return params;
        case 'tokenId':
            return showTokenId(params);
    }
}
function getBytesData(_a, params) {
    var type = _a.type, typeStr = _a.typeStr, actualByteLen = _a.actualByteLen;
    switch (type) {
        case 'address':
            return formatAddr(params);
        case 'bool':
            return formatNumber(params ? '1' : '0', 'uint');
        case 'number':
            return formatNumber(params, typeStr, actualByteLen);
        case 'gid':
            return formatGid(params);
        case 'tokenId':
            return fomatTokenId(params);
    }
}
function formatAddr(address) {
    var addr = address_1.getOriginalAddressFromAddress(address);
    return Buffer.from(addr, 'hex');
}
function formatGid(gid) {
    if (!gid || !/^[0-9a-fA-F]+$/.test(gid) || gid.length !== 20) {
        throw new Error("[Error] Illegal gid. " + gid);
    }
    return Buffer.from(gid, 'hex');
}
function formatNumber(params, typeStr, actualByteLen) {
    var isSafe = vitejs_utils_1.isSafeInteger(params);
    if (isSafe === -1) {
        throw new Error(vitejs_error_1.integerIllegal.message + ", number: " + params + ", type: " + typeStr);
    }
    else if (isSafe === 0) {
        throw new Error(vitejs_error_1.unsafeInteger.message + ", number: " + params + ", type: " + typeStr);
    }
    var num = new BigNumber(params);
    var bitLen = num.bitLength();
    if (bitLen > actualByteLen * 8) {
        throw new Error("[Error] Out of range: " + params + ", " + typeStr);
    }
    if (typeStr.indexOf('uint') === 0) {
        if (num.cmp(new BigNumber(0)) < 0) {
            throw new Error("[Error] Uint shouldn't be a negative number " + params);
        }
        return num.toArray();
    }
    return num.toTwos(256).toArray('be');
}
function fomatTokenId(tokenId) {
    var originalTokenId = vitejs_utils_1.getOriginalTokenIdFromTokenId(tokenId);
    if (!originalTokenId) {
        throw new Error("[Error] Illegal tokenId. " + tokenId);
    }
    return Buffer.from(originalTokenId, 'hex');
}
function showNumber(str, typeStr, actualByteLen, _params) {
    var num = new BigNumber(str, 16);
    var actualNum = new BigNumber(_params, 16);
    if (typeStr.indexOf('int') === 0) {
        num = num.fromTwos(actualByteLen ? actualByteLen * 8 : '');
        actualNum = actualNum.fromTwos(256);
    }
    var bitLen = actualNum.bitLength();
    if (bitLen > actualByteLen * 8) {
        throw new Error("[Error] Out of range: " + _params + ", " + typeStr);
    }
    return num.toString();
}
function showTokenId(originalTokenId) {
    var tokenId = vitejs_utils_1.getTokenIdFromOriginalTokenId(originalTokenId);
    if (!tokenId) {
        throw new Error("[Error] Illegal tokenId. " + originalTokenId);
    }
    return tokenId;
}
function lengthError(typeObj, length, type) {
    if (type === void 0) { type = ''; }
    return new Error("[Error] Illegal length. " + JSON.stringify(typeObj) + ", data length: " + length + ", " + type);
}
