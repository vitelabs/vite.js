import { formatType } from '../inputsType';
import { isArray  } from 'utils/encoder';

import { encode as commonEncode, decode as commonDecode } from './common';
import { encode as dynamicEncode, decode as dynamicDecode } from './dynamic';

const encode = {
    address: commonEncode,
    gid: commonEncode,
    tokenId: commonEncode,
    number: commonEncode,
    bool: commonEncode,
    string: dynamicEncode,
    bytes: dynamicEncode,
}

const decode = {
    address: commonDecode,
    gid: commonDecode,
    tokenId: commonDecode,
    number: commonDecode,
    bool: commonDecode,
    string: dynamicDecode,
    bytes: dynamicDecode
}

export function encodeParameter(typeStr, params) {
    let typeObj = formatType(typeStr);
    if (typeObj.isArr && !isArray(params) ||
        (!typeObj.isArr && ['string', 'boolean', 'number'].indexOf(typeof params) === -1)) {
        throw `Illegal types or params. type: ${typeObj.type}, params: ${params}`;
    }

    if (!typeObj.isArr) {
        return encode[typeObj.type](typeObj, params);
    }

    return encodeArrs(typeObj, params);
}

export function encodeParameters(types, params) {
    if (!isArray(types) || !isArray(params) || types.length !== params.length) {
        throw 'Illegal types or params. Is array? Length?';
    }

    let tempResult = [];
    let dynamicRes = [];
    let totalLength = 0;
    
    types.forEach((type, i) => {
        let _res = encodeParameter(type, params[i]);

        if (!_res.typeObj.isDynamic) {
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

export function decodeParameter(typeStr, params) {
    let typeObj = formatType(typeStr);
    if (!typeObj.isArr) {
        return decode[typeObj.type](typeObj, params).result;
    }
    return decodeArrs(typeObj, params);
}

export function decodeParameters(types, params) {
    if (!isArray(types)) {
        throw 'Illegal types and params.';
    }

    let _params = params;
    let resArr = [];
    let indexArr = [];

    types.forEach((type) => {
        let typeObj = formatType(type);

        if (!typeObj.isDynamic) {
            let _res = decode[typeObj.type](typeObj, _params);
            _params = _res.params;
            resArr.push({
                isDynamic: false,
                result: _res.result
            });
            return;
        }

        let _res = decode.number({
            type: 'number', byteLength: 32, isArr: false
        }, _params);
        let index = _res.result;
        _params = _res.params;
        indexArr.push(index * 2);
        resArr.push({
            isDynamic: true,
            typeObj, 
            index: index * 2
        });
    });

    let result = [];
    let currentInx = 0;
    resArr.forEach((_res, i) => {
        if (!_res.isDynamic) {
            result.push(_res.result);
            return;
        }

        let _p;
        if ((currentInx + 1) !== indexArr.length) {
            _p = params.slice(_res.index, indexArr[currentInx+1]);
        } else {
            _p = params.slice(_res.index);
        }

        if (_res.typeObj.type === 'bytes' && !_res.typeObj.isArr) {
            let len = 32 * Math.ceil(_p.length / 2 / 32);
            _p = encode.number({
                type: 'number', byteLength: 32
            }, len).result + _p;
        }
        currentInx++;

        result.push( decodeParameter(types[i], _p) );
    });

    return result;
}



function encodeArr(typeObj, arrLen, params) {
    if (!params || (arrLen && params.length !== +arrLen)) {
        throw 'Params-length !== arr-length';
    }
    
    let result = '';
    params.forEach((_param) => {
        let res = encode[typeObj.type](typeObj, _param);
        result += res.result;
    });

    let bytesArrLen = arrLen ? '' : 
        encode.number({
            type: 'number', byteLength: 32, isArr: false
        }, params.length).result;

    return bytesArrLen + result;
}

function encodeArrs(typeObj, params) {
    let result = '';
    let lenArr = typeObj.arrLen;

    let loop = (params, i = 0) => {
        if (i === lenArr.length - 1) {
            result += encodeArr(typeObj, lenArr[lenArr.length - i - 1], params);
            return;
        }
        i++;
        isArray(params) && params.forEach((_p) => {
            loop(_p, i);
        });
    }

    loop(params);
    return {
        typeObj, result
    };
}

function decodeArr(typeObj, arrLen, params) {
    let _param = params;
    if (typeObj.isDynamic) {
        let len = params.substring(0, 64);
        arrLen = decode.number({
            type: 'number', byteLength: 32, isArr: false
        }, len).result;
        _param = params.substring(64);
    }

    let result = [];
    for(let i=0; i<arrLen; i++) {
        let res = decode[typeObj.type](typeObj, _param);
        result.push(res.result);
        _param = res.params;
    }

    return {
        result, params: _param
    };
}

function decodeArrs(typeObj, params) {
    let lenArr = typeObj.arrLen;

    let loop = (i = 0, result?) => {
        if ((lenArr.length <= 1 && i === lenArr.length) ||
            (lenArr.length > 1 && i === lenArr.length - 1)) {
            return result;
        }

        let l  = lenArr[i];
        let _r = [];

        if (!result) {
            while (params) {
                let _res = decodeArr(typeObj, l, params);
                params = _res.params;
                _r.push(_res.result);
            }
            _r = _r.length > 1 ? _r : _r[0]
        } else {
            while (result && result.length) {
                _r.push(result.splice(0, l));
            }
        }

        i++;
        return loop(i, _r);
    }
    return loop();
}
