// address bool gid number

const BigNumber = require('bn.js');

import { getAddrFromHexAddr, getHexAddrFromAddr } from 'utils/address/privToAddr';
import { getRawTokenid, getTokenIdFromRaw } from 'utils/tools';



export function encode(typeObj, params) {
    const Bytes_Data = getBytesData(typeObj.type, params);
    return encodeBytesData(typeObj, Bytes_Data);
}

export function encodeBytesData(typeObj, Bytes_Data) {
    const Actual_Byte_Len = typeObj.actualByteLen;
    if (Actual_Byte_Len < Bytes_Data.length) {
        throw 'Illegal length.';
    }

    const Byte_Len = typeObj.byteLength;
    const Offset = Byte_Len - Bytes_Data.length;
    if (Offset < 0) {
        throw 'Illegal length.';
    }

    let result = new Uint8Array(Byte_Len);
    result.set(Bytes_Data, typeObj.type === 'bytes' ? 0 : Offset);

    return {
        result: Buffer.from(result).toString('hex'),
        typeObj
    }
}

export function decodeToHexData(typeObj, params) {
    if ( typeof params !== 'string' || !/^[0-9a-fA-F]+$/.test(params) ) {
        throw 'Need hex-string.';
    }

    const Byte_Len = typeObj.byteLength;
    const _params = params.substring(0, Byte_Len*2);
    const Data_Len = _params.length / 2;

    if (Byte_Len !== Data_Len) {
        throw 'Illegal length.';
    }

    const Actual_Byte_Len = typeObj.actualByteLen;
    const Offset = Byte_Len - Actual_Byte_Len;
    if (Data_Len < Offset) {
        throw 'Illegal length.';
    }

    return {
        result: typeObj.type === 'bytes' ? _params.substring(0, _params.length - Offset * 2) : _params.substring(Offset * 2),
        params: params.substring(Data_Len * 2)
    };
}


export function decode(typeObj, params) {
    let res = decodeToHexData(typeObj, params);

    return {
        result: getRawData(typeObj.type, res.result),
        params: res.params
    }
}



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
    let addr = getAddrFromHexAddr(address);
    if (!addr) {
        throw 'Illegal address.';
    }
    return Buffer.from(addr, 'hex');
}

function formatGid(gid) {
    if (!gid || !/^[0-9a-fA-F]+$/.test(gid) || gid.length !== 20 ) {
        throw 'Illegal gid.';
    }
    return Buffer.from(gid, 'hex');
}

function formatNumber(params) {
    return new BigNumber(params).toArray();
}

function fomatTokenId(tokenId) {
    let rawTokenId = getRawTokenid(tokenId);
    if (!rawTokenId) {
        throw 'Illegal tokenId.';
    }
    return Buffer.from(rawTokenId, 'hex');
}

function showAddr(address) {
    let addr = getHexAddrFromAddr(address);
    if (!addr) {
        throw 'Illegal address.';
    }
    return addr;
}

function showNumber(str) {
    return new BigNumber(str, 16).toString();
}

function showTokenId(rawTokenId) {
    let tokenId = getTokenIdFromRaw(rawTokenId);
    if (!tokenId) {
        throw 'Illegal tokenId.';
    }
    return tokenId;
}
