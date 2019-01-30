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
    encodeMethod(jsonMethod) {
        if (isObject(jsonMethod)) {
            jsonMethod = jsonMethodToString(jsonMethod);
        }
        return blake.blake2bHex(jsonMethod).slice(0, 8);
    },

    encodeParameter(type, params) {
        let typeObj = validType(type.toString());
        if ( !typeObj || 
             (typeObj && typeObj.isArr && !isArray(params) ||
             (typeObj && !typeObj.isArr && typeof params !== 'string')) ) {
            return false;
        }

        let _params = typeObj.isArr ? params : [params];
        return encode[typeObj.type](typeObj, _params);
    },

    encodeMethodCall(jsonMethod, params) {
        return this.encodeMethod(jsonMethod) + this.encodeParameter(jsonMethod.inputs, params);
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
    if (isObject(jsonMethod) && jsonMethod.name && jsonMethod.name.indexOf('(') !== -1) {
        return jsonMethod.name;
    }

    let types = [];
    jsonMethod.inputs.forEach(function(param) {
        types.push(param.type);
    });
    return jsonMethod.name + '(' + types.join(',') + ')';
}

/**
 *  uint<M>: unsigned integer type of M bits, 0 < M <= 256, M % 8 == 0. e.g. uint32, uint8, uint256.
    int<M>: two’s complement signed integer type of M bits, 0 < M <= 256, M % 8 == 0.
    uint, int: synonyms for uint256, int256 respectively. For computing the function selector, uint256 and int256 have to be used.
    
    bytes<M>: binary type of M bytes, 0 < M <= 32.
    bytes: dynamic sized byte sequence.
    
    bool: equivalent to uint8 restricted to the values 0 and 1. For computing the function selector, bool is used.
    string: dynamic sized unicode string assumed to be UTF-8 encoded.

    address: 和以太不同，是vite的地址格式
    tokenid: vite新增，代币id
    gid: vite新增，委托共识组id

    []: bool intM uintM address tokenId gid string
    <type>[M]: a fixed-length array of M elements, M >= 0, of the given type.
    <type>[]: a variable-length array of elements of the given type.
*/
function validType(typeStr) {
    const typeSingle = new RegExp(/(^\w+)(\d*)$/g);
    const typeArray = new RegExp(/(^\w+)\[(\d*)\]$/g);
    const typePre = ['uint', 'int', 'address', 'bool', 'bytes', 'string', 'tokenId', 'gid'];

    let isArr = typeArray.test(typeStr);
    if (!isArr && !typeSingle.test(typeStr)) {
        console.log('1')
        return false;
    }

    let _type = typeStr.match(/^[a-zA-Z]+/g);
    if (!_type || typePre.indexOf(_type[0]) === -1) {
        console.log('2')
        return false;
    }

    let type = _type[0];
    if (isArr && type === 'bytes') {
        console.log('3')
        return false;
    }

    let _size = typeStr.match(/^\d+/g);
    let byteLength = _size ? _size[0] : null;

    // int uint
    if (type.indexOf('int') >= 0) {
        if (_size && !(_size > 0 && _size <= 256 && _size%8 === 0)) {
        console.log('4')
        return false;
        }
        type = 'int';
        byteLength = byteLength || 32;
    // bytes
    } else if (type === 'bytes') {
        if (_size && !(_size > 0 && _size <= 32)) {
        console.log('5')
        return false;
        }
    // bool
    } else if (type === 'bool') {
        byteLength = 1;
    // address gid tokenId
    } else if (['address', 'gid', 'tokenId'].indexOf(type) !== -1) {
        byteLength = 32;
    }
    
    return {
        type, byteLength, isArr
    };
}
