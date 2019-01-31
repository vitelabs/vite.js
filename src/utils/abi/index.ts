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
    encodeMethod(jsonMethod, mehtodName) {
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
    },

    encodeParameter(type, params) {
        let typeObj = validType(type.toString());
        if ( !typeObj || 
             (typeObj && typeObj.isArr && !isArray(params) ||
             (typeObj && !typeObj.isArr && typeof params !== 'string')) ) {
            return false;
        }

        let result = '';

        let _params = [params];
        if (typeObj.isArr) {
            _params = params;
            const ARR_LEN = _params.length;

            let bytesLen = typeObj.isArr ? encode.int({
                type: 'int', byteLength: 32, isArr: false
            }, [ARR_LEN]) : '';
            result += bytesLen;
        }

        let encodeResult = encode[typeObj.type](typeObj, _params);
        return result + encodeResult;
    },

    encodeParameters(types, params) {
        if (types.length !== params.length) {
            throw 'error';
        }
        let typeArr = [];
        types.forEach((type) => {
            typeArr.push(validType(type.toString()));
        });
    },

    encodeMethodCall(jsonMethod, params) {
        return this.encodeMethod(jsonMethod) + this.encodeParameters(jsonMethod.inputs, params);
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

    decodeLog() {

    }
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
    const typeArray = new RegExp(/(^\w+)\[(\d*)\]$/g);
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
