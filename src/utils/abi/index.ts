const blake = require('blakejs/blake2b');

import { encode, decode } from './coder/index';

const isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
const isObject = function(obj) {
    let type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

export default {
    encodeMethod,

    encodeParameter(type, param) {
        return _encodeParameter(type, param).result;
    },

    encodeParameters,

    encodeMethodCall(jsonMethod, params) {
        return encodeMethod(jsonMethod) + encodeParameters(jsonMethod.inputs, params);
    },

    encodeLog(jsonMethod, mehtodName?) {
        let _jsonMethod = jsonMethod;
        let isArr = isArray(jsonMethod);
    
        if (isArr && jsonMethod.length !== 1 && !mehtodName ||
            (!isArr && !isObject(jsonMethod))) {
            throw 'error';
        }
        
        if (isArr) {
            if (!mehtodName && jsonMethod.length === 1) {
                _jsonMethod = jsonMethod[0];
            } else {
                for (let i=0; i<jsonMethod.length; i++) {
                    if (jsonMethod[i].name === mehtodName) {
                        _jsonMethod = jsonMethod[i];
                    }
                }
            }
        }

        let result = jsonMethodToString(_jsonMethod);
        return blake.blake2bHex(Buffer.from(result), null, 32);
    },

    decodeParameter(type, params) {
        let typeObj = validType(type.toString());
        if ( !typeObj ||
             typeof params !== 'string' ||
             !/^[0-9a-fA-F]+$/.test(params) ||
             (typeObj.byteLength && params.length % (typeObj.byteLength*2) !== 0) ) {
            return false;
        }
        return decode[typeObj.type](typeObj, params);
    },

    decodeParameters() {

    },

    decodeLog() {

    }
}

function encodeMethod(jsonMethod, mehtodName?) {
    let _jsonMethod = jsonMethod;
    let isArr = isArray(jsonMethod);

    if (isArr && jsonMethod.length !== 1 && !mehtodName ||
        (!isArr && !isObject(jsonMethod))) {
        throw 'error';
    }
    
    if (isArr) {
        if (!mehtodName && jsonMethod.length === 1) {
            _jsonMethod = jsonMethod[0];
        } else {
            for (let i=0; i<jsonMethod.length; i++) {
                if (jsonMethod[i].name === mehtodName) {
                    _jsonMethod = jsonMethod[i];
                }
            }
        }
    }

    let result = jsonMethodToString(_jsonMethod);
    return blake.blake2bHex(Buffer.from(result), null, 32).slice(0, 8);
}

function encodeParameters(types, params) {
    if (!isArray(types) || !isArray(params) || types.length !== params.length) {
        throw 'error';
    }

    let _indexResult = [];
    let dynamicRes = [];
    let totalLength = 0;
    
    types.forEach((type, i) => {
        let _res = _encodeParameter(type, params[i]);

        if (!_res.isDynamic) {
            totalLength += _res.result.length;
            _indexResult.push(_res.result);
            return
        }

        totalLength += 64;
        _indexResult.push(false);
        let _r = _res.result;
        if (_res.typeObj.type === 'bytes') {
            _r = _r.slice(64);
        }
        dynamicRes.push(_r);
    });

    let result = '';
    let dynamicResult = '';
    _indexResult.forEach((_r) => {
        if (_r) {
            result += _r;
            return;
        }

        let len = totalLength + dynamicResult.length;
        let bytesDataLen = encode.int({
            type: 'int', byteLength: 32, isArr: false
        }, [len/2 + '']).result; 
        result += bytesDataLen;
        dynamicResult += dynamicRes.shift();
    });

    return result + dynamicResult;
}

function _encodeParameter(type, params) {
    let typeObj = validType(type.toString());
    if ( !typeObj || 
         (typeObj && typeObj.isArr && !isArray(params) ||
         (typeObj && !typeObj.isArr && typeof params !== 'string')) ) {
        return false;
    }

    if (!typeObj.isArr) {
        let _r = encode[typeObj.type](typeObj, [params]);
        _r.typeObj = typeObj;
        return _r;
    }

    let computedArr = (typeObj, arrLen, params) => {
        if (!params || (arrLen && params.length !== +arrLen)) {
            throw 'length error';
        }
        
        let result = '';
        let _res = encode[typeObj.type](typeObj, params);
        if (!arrLen) {
            const ARR_LEN = params.length;

            let bytesLen = typeObj.isArr ? encode.int({
                type: 'int', byteLength: 32, isArr: false
            }, [ARR_LEN]).result : '';
            result += bytesLen;
        }
        return {
            isDynamic: _res.isDynamic || !arrLen,
            result: result + _res.result
        }
    }

    let result = '';
    let lenArr = [];
    let isDynamic = false;

    let typeArr = type.split('[').slice(1);
    if (!typeArr) {
        lenArr.push(0);
    } else {
        typeArr.forEach(_tArr => {
            let _len = _tArr.match(/\d+/g);
            lenArr.push(_len && _len[0] ? _len[0] : 0);
        });
    }

    let loop = (params, _i = 0) => {
        if (_i === lenArr.length - 1) {
            let _res = computedArr(typeObj, lenArr[lenArr.length - _i - 1], params);
            isDynamic = isDynamic || _res.isDynamic;
            result += _res.result;
            return;
        }
        _i++;
        isArray(params) && params.forEach((_p) => {
            loop(_p, _i);
        });
    }
    loop(params);
    return {
        typeObj, isDynamic, result
    };
}

function jsonMethodToString(jsonMethod) {
    let isObj = isObject(jsonMethod);
    if (isObj && jsonMethod.name && jsonMethod.name.indexOf('(') !== -1) {
        return jsonMethod.name;
    } else if (!isObj) {
        throw 'err';
    }

    let types = [];
    jsonMethod.inputs && jsonMethod.inputs.forEach(function(param) {
        types.push(param.type);
    });
    return jsonMethod.name + '(' + types.join(',') + ')';
}

/**
    uint<M>: unsigned integer type of M bits, 0 < M <= 256, M % 8 == 0. e.g. uint32, uint8, uint256.
    int<M>: two’s complement signed integer type of M bits, 0 < M <= 256, M % 8 == 0.
    uint, int: synonyms for uint256, int256 respectively. For computing the function selector, uint256 and int256 have to be used.
    
    bytes<M>: binary type of M bytes, 0 < M <= 32.
    bytes: dynamic sized byte sequence.
    
    bool: equivalent to uint8 restricted to the values 0 and 1. For computing the function selector, bool is used.
    string: dynamic sized unicode string assumed to be UTF-8 encoded.

    address
    tokenid
    gid

    <type>[M]: a fixed-length array of M elements, M >= 0, of the given type.
    <type>[]: a variable-length array of elements of the given type.
*/
function validType(typeStr) {
    const typeSingle = new RegExp(/(^\w+)(\d*)$/g);
    const typeArray = new RegExp(/(^\w+)(\[(\d*)\])+$/g);
    const getNum = new RegExp(/(\d+)/g);
    const typePre = ['uint', 'int', 'address', 'bool', 'bytes', 'string', 'tokenId', 'gid'];

    let isArr = typeArray.test(typeStr);
    if (!isArr && !typeSingle.test(typeStr)) {
        return false;
    }

    let _type = typeStr.match(/^[a-zA-Z]+/g);
    if (!_type || typePre.indexOf(_type[0]) === -1) {
        return false;
    }

    let type = _type[0];
    let _size;
    let _len;
    
    if (!isArr) {
        _size = typeStr.match(getNum);
    } else {
        let _typeStrArr = typeStr.split('[');
        _size = _typeStrArr[0].match(getNum);
        _len = _typeStrArr[1].match(getNum);
    }

    let byteLength = _size ? _size[0] : null;
    let len = _len ? _len[0] : null;

    // int uint
    if (type.indexOf('int') >= 0) {
        if (_size && !(_size > 0 && _size <= 256 && _size%8 === 0)) {
            return false;
        }
        type = 'int';
        byteLength = _size / 8 || 32;
    // bytes
    } else if (type === 'bytes') {
        if (_size && !(_size > 0 && _size <= 32)) {
            return false;
        }
    // bool
    } else if (type === 'bool') {
        byteLength = 1;
    // address gid tokenId
    } else if (['address', 'gid', 'tokenId'].indexOf(type) !== -1) {
        byteLength = 32;
    }
    
    let _byteLength = Math.ceil(byteLength / 32) * 32;

    return {
        type, 
        byteLength: _byteLength, 
        actualByteLen: byteLength,
        isArr, 
        len
    };
}































// decodeLog(inputs, data = '', topics) {
//     let topicCount = 0;

//     if (!isArray(topics)) {
//         topics = [topics];
//     }

//     // TODO: check for anonymous logs?
//     // TODO: Refactor this to one loop
//     const notIndexedInputs = [];

//     const indexedParams = [];

//     inputs.forEach((input, i) => {
//         if (input.indexed) {
//             indexedParams[i] = ['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].find((staticType) => {
//                 return input.type.indexOf(staticType) !== -1;
//             })
//                 ? this.decodeParameter(input.type, topics[topicCount])
//                 : topics[topicCount];
//             topicCount++;
//         } else {
//             notIndexedInputs[i] = input;
//         }
//     });

//     const nonIndexedData = data;

//     const notIndexedParams = nonIndexedData ? this.decodeParameters(notIndexedInputs, nonIndexedData) : [];

//     const returnValues = {};

//     inputs.forEach((res, i) => {
//         returnValues[i] = res.type === 'string' ? '' : null;

//         if (typeof notIndexedParams[i] !== 'undefined') {
//             returnValues[i] = notIndexedParams[i];
//         }
//         if (typeof indexedParams[i] !== 'undefined') {
//             returnValues[i] = indexedParams[i];
//         }

//         if (res.name) {
//             returnValues[res.name] = returnValues[i];
//         }
//     });

//     return returnValues;
// }
