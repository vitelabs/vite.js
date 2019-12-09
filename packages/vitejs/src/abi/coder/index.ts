import { isArray } from './../../utils';
import { formatType } from '../inputsType';

import { encode as commonEncode, decode as commonDecode } from './common';
import { encode as dynamicEncode, decode as dynamicDecode } from './dynamic';

const encode = {
    address: commonEncode,
    gid: commonEncode,
    tokenId: commonEncode,
    number: commonEncode,
    bool: commonEncode,
    string: dynamicEncode,
    bytes: dynamicEncode
};

const decode = {
    address: commonDecode,
    gid: commonDecode,
    tokenId: commonDecode,
    number: commonDecode,
    bool: commonDecode,
    string: dynamicDecode,
    bytes: dynamicDecode
};

export function encodeParameter(typeStr, params) {
    const typeObj = formatType(typeStr);
    if (!typeObj.isArr && [ 'string', 'boolean', 'number' ].indexOf(typeof params) === -1) {
        throw new Error(`[Error] Illegal type or params. type: ${ typeObj.type }, params: ${ params }`);
    }

    if (typeObj.isArr && !isArray(params)) {
        try {
            params = JSON.parse(params);
            if (!isArray(params)) {
                throw new Error(`[Error] Illegal type or params. type: ${ typeObj.typeStr }, params: ${ params }`);
            }
        } catch (err) {
            throw new Error(`[Error] Illegal type or params. type: ${ typeObj.typeStr }, params: ${ params }`);
        }
    }

    if (!typeObj.isArr) {
        return encode[typeObj.type](typeObj, params);
    }

    return encodeArrs(typeObj, params);
}

export function encodeParameters(types, params) {
    if (typeof params === 'string') {
        params = JSON.parse(params);
    }

    if (!isArray(types)) {
        throw new Error('[Error] Illegal inputs. Inputs should be array.');
    }

    // console.log(types);
    if (!types.length) {
        return '';
    }

    if (!isArray(params) || types.length !== params.length) {
        throw new Error('[Error] Illegal params. Params should be array and the length should be equal to inputs.length');
    }

    const tempResult = [];
    const dynamicRes = [];
    let totalLength = 0;

    types.forEach((type, i) => {
        const _res = encodeParameter(type, params[i]);

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
    tempResult.forEach(_r => {
        if (_r) {
            result += _r;
            return;
        }

        const index = (totalLength + dynamicResult.length) / 2;
        result += encode.number({ type: 'number', typeStr: 'uint', byteLength: 32, isArr: false }, index).result;
        dynamicResult += dynamicRes.shift();
    });

    return result + dynamicResult;
}

export function decodeParameter(typeStr, params) {
    const typeObj = formatType(typeStr);
    if (!typeObj.isArr) {
        return decode[typeObj.type](typeObj, params).result;
    }
    return decodeArrs(typeObj, params);
}

export function decodeParameters(types, params) {
    // console.log('startDecode', types, params);

    if (!isArray(types)) {
        throw new Error('[Error] Illegal types. Should be array.');
    }

    if (!params) {
        return null;
    }

    let _params = params;
    const resArr = [];
    const indexArr = [];

    types.forEach(type => {
        const typeObj = formatType(type);
        // console.log(typeObj);
        if (!typeObj.isDynamic && typeObj.isArr) {
            let len = 0;
            typeObj.arrLen.forEach(_l => {
                len += _l * typeObj.byteLength;
            });
            const _p = _params.slice(0, len * 2);
            _params = _params.slice(len * 2);
            resArr.push({
                isDynamic: false,
                result: decodeArrs(typeObj, _p)
            });
            return;
        }

        if (!typeObj.isDynamic) {
            const _res = decode[typeObj.type](typeObj, _params);
            _params = _res.params;
            resArr.push({
                isDynamic: false,
                result: _res.result
            });
            return;
        }

        const _res = decode.number({ type: 'number', typeStr: 'uint', byteLength: 32, isArr: false }, _params);
        const index = _res.result;
        _params = _res.params;
        indexArr.push(index * 2);
        resArr.push({
            isDynamic: true,
            typeObj,
            index: index * 2
        });
    });

    const result = [];
    let currentInx = 0;
    resArr.forEach((_res, i) => {
        if (!_res.isDynamic) {
            result.push(_res.result);
            return;
        }

        let _p;
        if ((currentInx + 1) === indexArr.length) {
            _p = params.slice(_res.index);
        } else {
            _p = params.slice(_res.index, indexArr[currentInx + 1]);
        }

        if (_res.typeObj.type === 'bytes' && !_res.typeObj.isArr) {
            const len = 32 * Math.ceil(_p.length / 2 / 32);
            _p = encode.number({ type: 'number', typeStr: 'uint', byteLength: 32 }, len).result + _p;
        }
        currentInx++;

        result.push(decodeParameter(types[i], _p));
    });

    return result;
}


function encodeArr(typeObj, arrLen, params) {
    if (!params || (arrLen && params.length !== Number(arrLen))) {
        throw new Error(`[Error] Params.length !== arr.length. Params: ${ JSON.stringify(params) }. ${ JSON.stringify(typeObj) }`);
    }

    let result = '';
    params.forEach(_param => {
        const res = encode[typeObj.type](typeObj, _param);
        result += res.result;
    });

    const bytesArrLen = arrLen ? ''
        : encode.number({ type: 'number', typeStr: 'uint', byteLength: 32, isArr: false }, params.length).result;

    return bytesArrLen + result;
}

function encodeArrs(typeObj, params) {
    let result = '';
    const lenArr = typeObj.arrLen;

    const loop = (params, i = 0) => {
        if (i === lenArr.length - 1) {
            result += encodeArr(typeObj, lenArr[lenArr.length - i - 1], params);
            return;
        }
        i++;
        isArray(params) && params.forEach(_p => {
            loop(_p, i);
        });
    };

    loop(params);
    return { typeObj, result };
}

function decodeArr(typeObj, arrLen, params) {
    let _param = params;
    if (typeObj.isDynamic) {
        const len = params.substring(0, 64);
        arrLen = decode.number({ type: 'number', typeStr: 'uint', byteLength: 32, isArr: false }, len).result;
        _param = params.substring(64);
    }

    const result = [];
    for (let i = 0; i < arrLen; i++) {
        const res = decode[typeObj.type](typeObj, _param);
        result.push(res.result);
        _param = res.params;
    }

    return { result, params: _param };
}

function decodeArrs(typeObj, params) {
    const lenArr = typeObj.arrLen;

    const loop = (i = 0, result?) => {
        if ((lenArr.length <= 1 && i === lenArr.length)
            || (lenArr.length > 1 && i === lenArr.length - 1)) {
            return result;
        }

        const l = lenArr[i];
        let _r = [];

        if (result) {
            let resultOpt = result && result.length;
            while (resultOpt) {
                _r.push(result.splice(0, l));
                resultOpt = result && result.length;
            }
        } else {
            while (params) {
                const _res = decodeArr(typeObj, l, params);
                params = _res.params;
                _r.push(_res.result);
            }
            _r = _r.length > 1 ? _r : _r[0];
        }

        i++;
        return loop(i, _r);
    };
    return loop();
}
