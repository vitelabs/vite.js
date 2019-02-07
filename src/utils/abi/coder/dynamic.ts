import { encode as commonEncode, encodeBytesData, decode as commonDecode, decodeToHexData } from "./common";


export function encode(typeObj, params) {
    const Bytes_Data = getBytesData(typeObj.type, params);
    const Is_Dynamic = !typeObj.byteLength;

    if (!Is_Dynamic) {
        return encodeBytesData(typeObj, Bytes_Data);
    }

    let result = dynamicEncode(Bytes_Data);
    if (typeObj.type === 'bytes') {
        let dataLength = 32 * Math.ceil(Bytes_Data.length / 32);
        result = commonEncode({
            type: 'number', byteLength: 32
        }, dataLength).result + result
    }

    return {
        result,
        isDynamic: true,
        typeObj
    }
}

export function decode(typeObj, params) {
    const Is_Dynamic = !typeObj.byteLength;
    const Type = typeObj.type;

    if (!Is_Dynamic) {
        let decodeRes = decodeToHexData(typeObj, params);
        return {
            result: getRawData(typeObj.type, decodeRes.result),
            params: decodeRes.params
        };
    }

    let _params = Type === 'bytes' ? params.substring(64) : params;
    let res = dynamicDecode(_params);
    
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
    if ( typeof params !== 'string' ) {
        throw 'Illegal params. Should be string'; 
    }

    let isHex = /^0x[0-9a-fA-F]+$/.test(params) ;
    if (isHex && params.length % 2 !== 0) {
        throw 'Illegal hex-string.'; 
    }

    if (type === 'bytes' && !isHex ) {
        throw 'Illegal bytes-type params.'; 
    }

    if (isHex) {
        return Buffer.from(params.substring(2), 'hex');
    }
    return Buffer.from(params, 'utf8');
}

function dynamicEncode(bytesData) {
    const Str_Len = bytesData.length;
    const Data_Length = 32 * Math.ceil(Str_Len / 32);

    let bytesLen = commonEncode({ 
        type: 'number', byteLength: 32
    }, Str_Len).result;

    let len = bytesLen.length/2 + Data_Length;
    let arr = new Uint8Array(len);

    arr.set(Buffer.from(bytesLen, 'hex'));
    arr.set(bytesData, bytesLen.length / 2);
    return Buffer.from(arr).toString('hex');
}

function dynamicDecode(params) {
    const Str_Len = commonDecode({
        type: 'number', byteLength: 32
    }, params.substring(0, 64)).result;
    const Data_Length = 32 * Math.ceil(Str_Len / 32);

    return {
        result: params.substring(64, 64 + Str_Len * 2),
        params: params.substring(64 + Data_Length * 2)
    };
}
