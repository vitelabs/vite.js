// address bool gid number

const BigNumber = require('bn.js');
import { getAddrFromHexAddr } from 'utils/address/privToAddr';
import { getRawTokenid } from 'utils/tools';

export function encode(typeObj, params) {
    const Bytes_Data = getBytesData(typeObj.type, params);

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
    result.set(Bytes_Data, Offset);

    return {
        result: Buffer.from(result).toString('hex'),
        isDynamic: false,
        typeObj
    }
}

export function decode(typeObj, params) {
    if ( typeof params !== 'string' || !/^[0-9a-fA-F]+$/.test(params) ) {
        throw 'Need hex-string.';
    }

    const Data_Len = params.length / 2;
    const Byte_Len = typeObj.byteLength;
    if (Byte_Len !== Data_Len) {
        throw 'Illegal length.';
    }

    const Actual_Byte_Len = typeObj.actualByteLen;
    const Offset = Byte_Len - Actual_Byte_Len;
    if (Data_Len < Offset) {
        throw 'Illegal length.';
    }

    let data = params.substring(Offset * 2);
    return getRawData(typeObj.type, data);
}


function getRawData(type, params) {
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
