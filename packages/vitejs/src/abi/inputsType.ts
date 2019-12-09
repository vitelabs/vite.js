import { isArray, isObject } from './../utils';

const ADDR_SIZE = 21;
const getNum = new RegExp(/(\d+)/g);
const typePre = [ 'uint', 'int', 'address', 'bool', 'bytes', 'string', 'tokenId', 'gid' ];

function formatType(typeStr) {
    const { isArr, type, size } = validType(typeStr);

    const arrLen = [];
    let isDynamic = type === 'string';
    if (isArr) {
        const _typeStrArr = typeStr.split('[').slice(1);
        if (_typeStrArr.length > 1) {
            console.warn(`Not support [][][] like ${ typeStr }, now.`);
        }
        _typeStrArr.forEach(_tArr => {
            const _len = _tArr.match(/\d+/g);
            const len = _len && _len[0] ? _len[0] : 0;
            isDynamic = isDynamic || !len;
            arrLen.push(len);
        });
    }

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
    case 'tokenId':
        byteLength = 10;
        break;
    }

    return {
        typeStr,
        type,
        byteLength: Math.ceil(byteLength / 32) * 32,
        actualByteLen: byteLength,
        isArr,
        arrLen,
        isDynamic: isDynamic || (type === 'bytes' && !byteLength)
    };
}

function validType(typeStr) {
    if (typeof typeStr !== 'string') {
        throw new Error(`[Error] Illegal type ${ JSON.stringify(typeStr) }. Should be type-string, like \'uint32\'.`);
    }

    const isArr = /^\w+(\[\d*\])+$/g.test(typeStr);
    const isSingle = /^\w+\d*$/g.test(typeStr);
    if (!isArr && !isSingle) {
        throw new Error(`[Error] Illegal type. ${ typeStr }`);
    }

    const _type = typeStr.match(/^[a-zA-Z]+/g);
    let type = _type && _type[0] ? _type[0] : '';
    if (!type || typePre.indexOf(type) === -1) {
        throw new Error(`[Error] Illegal type. ${ typeStr }`);
    }

    // int uint ==> number
    type = type.indexOf('int') >= 0 ? 'number' : type;

    let _size;
    if (isArr) {
        const _typeStrArr = typeStr.split('[');
        _size = _typeStrArr[0].match(getNum);
    } else {
        _size = typeStr.match(getNum);
    }
    const size = _size ? _size[0] : 0;

    // bytes
    if (type === 'bytes' && size && !(size > 0 && size <= 32)) {
        throw new Error(`[Error] Illegal type. ${ typeStr }: Binary type of M bytes, 0 < M <= 32. Or dynamic sized byte sequence.`);
    }

    // int
    if (type === 'number' && size && !(size > 0 && size <= 256 && size % 8 === 0)) {
        throw new Error(`[Error] Illegal type. ${ typeStr }: Unsigned integer type of M bits, 0 < M <= 256, M % 8 == 0. e.g. uint32, uint8, uint256.`);
    }

    return { isArr, type, size };
}

function getTypes(jsonInterface) {
    if (isArray(jsonInterface)) {
        const types = [];
        jsonInterface && jsonInterface.forEach(function (param) {
            const type = typeof param === 'string' ? param : param.type;
            validType(type);
            types.push(type);
        });
        return types;
    }

    if (!isObject(jsonInterface)) {
        throw new Error(`[Error] Illegal types: ${ jsonInterface }. Should be Array<string> or JsonInterface.`);
    }

    const types = [];
    jsonInterface.inputs && jsonInterface.inputs.forEach(function (param) {
        validType(param.type);
        types.push(param.type);
    });
    return types;
}

export { validType, formatType, getTypes };
