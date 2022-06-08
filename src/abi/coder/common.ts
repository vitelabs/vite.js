// address bool gid number

import * as BigNumber from 'bn.js';

import { unsafeInteger, integerIllegal } from '@vite/vitejs-error';
import { getAddressFromOriginalAddress, getOriginalAddressFromAddress } from '@vite/vitejs-wallet/address';
import { getOriginalTokenIdFromTokenId, getTokenIdFromOriginalTokenId, isSafeInteger } from '@vite/vitejs-utils';


export function encode(typeObj, params) {
    const Bytes_Data = getBytesData(typeObj, params);
    return encodeBytesData(typeObj, Bytes_Data);
}

export function encodeBytesData(typeObj, Bytes_Data) {
    const Byte_Len = typeObj.byteLength;
    const Offset = Byte_Len - Bytes_Data.length;
    if (Offset < 0) {
        throw lengthError(typeObj, Bytes_Data.length, 'Offset < 0');
    }

    const result = new Uint8Array(Byte_Len);
    result.set(Bytes_Data, typeObj.type === 'bytes' ? 0 : Offset);

    return {
        result: Buffer.from(result).toString('hex'),
        typeObj
    };
}

export function decodeToHexData(typeObj, params) {
    if (typeof params !== 'string' || !/^[0-9a-fA-F]+$/.test(params)) {
        throw new Error('[Error] decode, params should be hex-string.');
    }

    const Byte_Len = typeObj.byteLength;
    const _params = params.substring(0, Byte_Len * 2);
    const Data_Len = _params.length / 2;

    if (Byte_Len !== Data_Len) {
        throw lengthError(typeObj, Data_Len, 'Byte_Len !== Data_Len');
    }

    const Actual_Byte_Len = typeObj.actualByteLen;
    const Offset = Byte_Len - Actual_Byte_Len;
    if (Data_Len < Offset) {
        throw lengthError(typeObj, Actual_Byte_Len, 'Data_Len < Offset');
    }

    return {
        result: typeObj.type === 'bytes' ? _params.substring(0, _params.length - Offset * 2) : _params.substring(Offset * 2),
        params: params.substring(Data_Len * 2),
        _params
    };
}


export function decode(typeObj, params) {
    const res = decodeToHexData(typeObj, params);

    return {
        result: getRawData(typeObj, res.result, res._params),
        params: res.params
    };
}


function getRawData({ type, typeStr, actualByteLen }, params, _params) {
    switch (type) {
    case 'address':
        return getAddressFromOriginalAddress(params);
    case 'bool':
        return showNumber(params === '01' ? '1' : '0', 'uint');
    case 'number':
        return showNumber(params, typeStr, actualByteLen, _params);
    case 'gid':
        return params;
    case 'tokenId':
        return showTokenId(params);
    }
}

function getBytesData({ type, typeStr, actualByteLen }, params) {
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
    const addr = getOriginalAddressFromAddress(address);
    return Buffer.from(addr, 'hex');
}

function formatGid(gid) {
    if (!gid || !/^[0-9a-fA-F]+$/.test(gid) || gid.length !== 20) {
        throw new Error(`[Error] Illegal gid. ${ gid }`);
    }
    return Buffer.from(gid, 'hex');
}

function formatNumber(params, typeStr, actualByteLen?) {
    const isSafe = isSafeInteger(params);
    if (isSafe === -1) {
        throw new Error(`${ integerIllegal.message }, number: ${ params }, type: ${ typeStr }`);
    } else if (isSafe === 0) {
        throw new Error(`${ unsafeInteger.message }, number: ${ params }, type: ${ typeStr }`);
    }

    const num = new BigNumber(params);
    const bitLen = num.bitLength();

    if (bitLen > actualByteLen * 8) {
        throw new Error(`[Error] Out of range: ${ params }, ${ typeStr }`);
    }

    if (typeStr.indexOf('uint') === 0) {
        if (num.cmp(new BigNumber(0)) < 0) {
            throw new Error(`[Error] Uint shouldn't be a negative number ${ params }`);
        }
        return num.toArray();
    }

    return num.toTwos(256).toArray('be');
}

function fomatTokenId(tokenId) {
    const originalTokenId = getOriginalTokenIdFromTokenId(tokenId);
    if (!originalTokenId) {
        throw new Error(`[Error] Illegal tokenId. ${ tokenId }`);
    }
    return Buffer.from(originalTokenId, 'hex');
}

function showNumber(str, typeStr, actualByteLen?, _params?) {
    let num = new BigNumber(str, 16);
    let actualNum = new BigNumber(_params, 16);

    if (typeStr.indexOf('int') === 0) {
        num = num.fromTwos(actualByteLen ? actualByteLen * 8 : '');
        actualNum = actualNum.fromTwos(256);
    }

    const bitLen = actualNum.bitLength();
    if (bitLen > actualByteLen * 8) {
        throw new Error(`[Error] Out of range: ${ _params }, ${ typeStr }`);
    }

    return num.toString();
}

function showTokenId(originalTokenId) {
    const tokenId = getTokenIdFromOriginalTokenId(originalTokenId);
    if (!tokenId) {
        throw new Error(`[Error] Illegal tokenId. ${ originalTokenId }`);
    }
    return tokenId;
}


function lengthError(typeObj, length, type = '') {
    return new Error(`[Error] Illegal length. ${ JSON.stringify(typeObj) }, data length: ${ length }, ${ type }`);
}
