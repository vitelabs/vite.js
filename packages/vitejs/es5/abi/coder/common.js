"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BigNumber = require('bn.js');
var privToAddr_1 = require("privToAddr");
var utils_1 = require("utils");
var getRawTokenid = utils_1.tools.getRawTokenid, getTokenIdFromRaw = utils_1.tools.getTokenIdFromRaw;
function encode(typeObj, params) {
    var Bytes_Data = getBytesData(typeObj.type, params);
    return encodeBytesData(typeObj, Bytes_Data);
}
exports.encode = encode;
function encodeBytesData(typeObj, Bytes_Data) {
    var Actual_Byte_Len = typeObj.actualByteLen;
    if (Actual_Byte_Len < Bytes_Data.length) {
        throw lengthError(typeObj, Bytes_Data.length);
    }
    var Byte_Len = typeObj.byteLength;
    var Offset = Byte_Len - Bytes_Data.length;
    if (Offset < 0) {
        throw lengthError(typeObj, Bytes_Data.length);
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
        throw '[Error] decode, params should be hex-string.';
    }
    var Byte_Len = typeObj.byteLength;
    var _params = params.substring(0, Byte_Len * 2);
    var Data_Len = _params.length / 2;
    if (Byte_Len !== Data_Len) {
        throw lengthError(typeObj, Data_Len);
    }
    var Actual_Byte_Len = typeObj.actualByteLen;
    var Offset = Byte_Len - Actual_Byte_Len;
    if (Data_Len < Offset) {
        throw lengthError(typeObj, Actual_Byte_Len);
    }
    return {
        result: typeObj.type === 'bytes' ? _params.substring(0, _params.length - Offset * 2) : _params.substring(Offset * 2),
        params: params.substring(Data_Len * 2)
    };
}
exports.decodeToHexData = decodeToHexData;
function decode(typeObj, params) {
    var res = decodeToHexData(typeObj, params);
    return {
        result: getRawData(typeObj.type, res.result),
        params: res.params
    };
}
exports.decode = decode;
function getRawData(type, params) {
    switch (type) {
        case 'address':
            return showAddr(params);
        case 'bool':
            return showNumber(!!params ? '1' : '0');
        case 'number':
            return showNumber(params);
        case 'gid':
            return params;
        case 'tokenId':
            return showTokenId(params);
    }
}
function getBytesData(type, params) {
    switch (type) {
        case 'address':
            return formatAddr(params);
        case 'bool':
            return formatNumber(!!params ? '1' : '0');
        case 'number':
            return formatNumber(params);
        case 'gid':
            return formatGid(params);
        case 'tokenId':
            return fomatTokenId(params);
    }
}
function formatAddr(address) {
    var addr = privToAddr_1.getAddrFromHexAddr(address);
    if (!addr) {
        throw "[Error] Illegal address. " + address;
    }
    return Buffer.from(addr, 'hex');
}
function formatGid(gid) {
    if (!gid || !/^[0-9a-fA-F]+$/.test(gid) || gid.length !== 20) {
        throw "[Error] Illegal gid. " + gid;
    }
    return Buffer.from(gid, 'hex');
}
function formatNumber(params) {
    return new BigNumber(params).toArray();
}
function fomatTokenId(tokenId) {
    var rawTokenId = getRawTokenid(tokenId);
    if (!rawTokenId) {
        throw "[Error] Illegal tokenId. " + tokenId;
    }
    return Buffer.from(rawTokenId, 'hex');
}
function showAddr(address) {
    var addr = privToAddr_1.getHexAddrFromAddr(address);
    if (!addr) {
        throw "[Error] Illegal address. " + address;
    }
    return addr;
}
function showNumber(str) {
    return new BigNumber(str, 16).toString();
}
function showTokenId(rawTokenId) {
    var tokenId = getTokenIdFromRaw(rawTokenId);
    if (!tokenId) {
        throw "[Error] Illegal tokenId. " + rawTokenId;
    }
    return tokenId;
}
function lengthError(typeObj, length) {
    return "[Error] Illegal length. " + JSON.stringify(typeObj) + ", data length: " + length;
}
