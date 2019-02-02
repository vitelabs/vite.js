import { ADDR_SIZE } from 'utils/address/vars';

const getNum = new RegExp(/(\d+)/g);
const typePre = ['uint', 'int', 'address', 'bool', 'bytes', 'string', 'tokenId', 'gid'];

function formatType(typeStr) {
    let { isArr, type, size } = validType(typeStr);

    let _len;
    if (isArr) {
        let _typeStrArr = typeStr.split('[');
        _len = _typeStrArr[1].match(getNum);
    }

    let arrLen = _len && _len[0] ? _len[0] : null;
    let byteLength = size || 0;
    
    switch (type) {
        case 'number': 
            byteLength = size / 8 || 32;
            break;
        case 'bool':
            byteLength = 1;
            break;
        case 'address':
            byteLength = ADDR_SIZE;
            break;
        case 'gid': 
            byteLength = 10;
            break;
        case 'tokenId':
            byteLength = 10;
            break;
    }

    return {
        type, 
        byteLength: Math.ceil(byteLength / 32) * 32, 
        actualByteLen: byteLength,
        isArr, 
        len: arrLen
    };
}

function validType(typeStr) {
    if (typeof typeStr !== 'string') {
        throw 'Need type-string, like \'uint32\'.'
    }

    let isArr = /^\w+(\[\d*\])+$/g.test(typeStr);
    let isSingle = /^\w+\d*$/g.test(typeStr);
    if (!isArr && !isSingle) {
        throw 'Illegal type-string';
    }

    let _type = typeStr.match(/^[a-zA-Z]+/g);
    let type = _type && _type[0] ? _type[0] : '';
    if (!type || typePre.indexOf(type) === -1) {
        throw 'Illegal type';
    }

    // int uint ==> int
    type = type.indexOf('int') >= 0 ? 'number' : type;

    let _size;
    if (!isArr) {
        _size = typeStr.match(getNum);
    } else {
        let _typeStrArr = typeStr.split('[');
        _size = _typeStrArr[0].match(getNum);
    }
    let size = _size ? _size[0] : 0;

    // bytes
    if (type === 'bytes' && size && !(size > 0 && size <= 32)) {
        throw 'Binary type of M bytes, 0 < M <= 32. Or dynamic sized byte sequence.';
    }

    // int
    if (type === 'number' && size && !(size > 0 && size <= 256 && size%8 === 0)) {
        throw 'Unsigned integer type of M bits, 0 < M <= 256, M % 8 == 0. e.g. uint32, uint8, uint256.'
    }

    return {
        isArr, type, size
    };
}

export {
    validType, formatType
}
