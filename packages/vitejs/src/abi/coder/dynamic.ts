import { encode as commonEncode, encodeBytesData, decode as commonDecode, decodeToHexData } from './common';


export function encode(typeObj, params) {
    const Bytes_Data = getBytesData(typeObj.type, params);

    if (typeObj.byteLength) {
        return encodeBytesData(typeObj, Bytes_Data);
    }

    let result = dynamicEncode(Bytes_Data);
    if (typeObj.type === 'bytes') {
        const dataLength = 32 * Math.ceil(Bytes_Data.length / 32);
        result = commonEncode({ type: 'number', typeStr: 'uint', byteLength: 32 }, dataLength).result + result;
    }

    return { result, typeObj };
}

export function decode(typeObj, params) {
    const Type = typeObj.type;

    if (typeObj.byteLength) {
        const decodeRes = decodeToHexData(typeObj, params);
        return {
            result: getRawData(typeObj.type, decodeRes.result),
            params: decodeRes.params
        };
    }

    const _params = Type === 'bytes' ? params.substring(64) : params;
    const res = dynamicDecode(_params);

    return {
        result: getRawData(Type, res.result),
        params: res.params
    };
}


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

    const is0xHex = /^0x[0-9a-fA-F]+$/.test(params) && params.length % 2 === 0;
    const isHex = /^[0-9a-fA-F]+$/.test(params) && params.length % 2 === 0;

    if (type === 'bytes' && !is0xHex && !isHex) {
        throw new Error('[Error] Illegal params. Should be hex-string.');
    }

    if (isHex) {
        return Buffer.from(params, 'hex');
    }
    return Buffer.from(params.substring(2), 'hex');
}

function dynamicEncode(bytesData) {
    const Str_Len = bytesData.length;
    const Data_Length = 32 * Math.ceil(Str_Len / 32);

    const bytesLen = commonEncode({ type: 'number', typeStr: 'uint', byteLength: 32 }, Str_Len).result;

    const len = bytesLen.length / 2 + Data_Length;
    const arr = new Uint8Array(len);

    arr.set(Buffer.from(bytesLen, 'hex'));
    arr.set(bytesData, bytesLen.length / 2);
    return Buffer.from(arr).toString('hex');
}

function dynamicDecode(params) {
    const Str_Len = commonDecode({ type: 'number', typeStr: 'uint', byteLength: 32 }, params.substring(0, 64)).result;
    const Data_Length = 32 * Math.ceil(Str_Len / 32);

    return {
        result: params.substring(64, 64 + Str_Len * 2),
        params: params.substring(64 + Data_Length * 2)
    };
}
