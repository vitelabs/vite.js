import { formatType } from '../inputsType';
import { isArray  } from 'utils/encoder';

import { encode as commonEncode } from './common';

import stringCoder from './string';
import bytesCoder from './bytes';

const encode = {
    address: commonEncode,
    gid: commonEncode,
    tokenId: commonEncode,
    number: commonEncode,
    bool: commonEncode,
    string: stringCoder.encode,
    bytes: bytesCoder.encode,
}

// const decode = {
//     address: addressCoder.decode,
//     gid: gidCoder.decode,
//     tokenId: tokenIdCoder.decode,
//     string: stringCoder.decode,
//     bytes: bytesCoder.decode,
//     number: numberCoder.decode,
//     bool: boolCoder.decode
// }

export function encodeParameter(typeStr, params) {
    let typeObj = formatType(typeStr);
    if (typeObj.isArr && !isArray(params) ||
        (!typeObj.isArr && typeof params !== 'string')) {
        throw 'Illegal format params.';
    }

    if (!typeObj.isArr) {
        return encode[typeObj.type](typeObj, params);
    }

    return encodeArrs(typeStr, params, typeObj);
}

export function encodeParameters(types, params) {
    if (!isArray(types) || !isArray(params) || types.length !== params.length) {
        throw 'Illegal types and params.';
    }

    let tempResult = [];
    let dynamicRes = [];
    let totalLength = 0;
    
    types.forEach((type, i) => {
        let _res = encodeParameter(type, params[i]);

        if (!_res.isDynamic) {
            totalLength += _res.result.length;
            tempResult.push(_res.result);
            return;
        }

        let result = _res.result;
        if (_res.typeObj.type === 'bytes' && !_res.typeObj.isArr) {
            result = result.slice(64);
        }

        totalLength += 64;
        tempResult.push(false);
        dynamicRes.push(result);
    });

    let result = '';
    let dynamicResult = '';
    tempResult.forEach((_r) => {
        if (_r) {
            result += _r;
            return;
        }

        let index = (totalLength + dynamicResult.length) / 2;
        result += encode.number({
            type: 'number', byteLength: 32, isArr: false
        }, index).result;
        dynamicResult += dynamicRes.shift();
    });

    return result + dynamicResult;
}



function encodeArr(typeObj, arrLen, params) {
    if (!params || (arrLen && params.length !== +arrLen)) {
        throw 'Params-length !== arr-length';
    }
    
    let result = '';
    let isDynamic = false;

    params.forEach((_param) => {
        let res = encode[typeObj.type](typeObj, _param);
        isDynamic = isDynamic || res.isDynamic;
        result += res.result;
    });

    let bytesArrLen = arrLen ? '' : 
        encode.number({
            type: 'number', byteLength: 32, isArr: false
        }, params.length).result;

    return {
        isDynamic: isDynamic || !arrLen,
        result: bytesArrLen + result
    }
}

function encodeArrs(typeStr, params, typeObj) {
    let result = '';
    let lenArr = [];
    let isDynamic = false;

    let typeArr = typeStr.split('[').slice(1);
    if (typeArr.length > 1) {
        console.warn(`Not support [][][] like ${typeStr}, now.`);
    }

    typeArr.forEach(_tArr => {
        let _len = _tArr.match(/\d+/g);
        lenArr.push(_len && _len[0] ? _len[0] : 0);
    });

    let loop = (params, i = 0) => {
        if (i === lenArr.length - 1) {
            let _res = encodeArr(typeObj, lenArr[lenArr.length - i - 1], params);
            isDynamic = isDynamic || _res.isDynamic;
            result += _res.result;
            return;
        }
        i++;
        isArray(params) && params.forEach((_p) => {
            loop(_p, i);
        });
    }

    loop(params);
    return {
        typeObj, isDynamic, result
    };
}
