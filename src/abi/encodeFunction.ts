import { encoder, tools } from '~@vite/vitejs-utils';
import { getTypes } from './inputsType';

const { blake2bHex } = encoder;
const { isArray, isObject } = tools;

export function encodeFunction(jsonFunction, mehtodName?) {
    const isArr = isArray(jsonFunction);
    const _jsonFunction = isArr ? getFunction(jsonFunction, mehtodName) : jsonFunction;
    const result = jsonFunctionToString(_jsonFunction);
    return blake2bHex(result, null, 32);
}

function jsonFunctionToString(jsonFunction) {
    const isObj = isObject(jsonFunction);
    const isRightStr = /\w+\((\w\,\w)*|(\w*)\)/g;

    if (!isObj && !isRightStr.test(jsonFunction)) {
        throw new Error(`[Error] Illegal jsonFunction. ${ JSON.stringify(jsonFunction) }`);
    }

    if (isRightStr.test(jsonFunction)) {
        return jsonFunction;
    }

    if (jsonFunction.name && isRightStr.test(jsonFunction.name)) {
        return jsonFunction.name;
    }

    const types = getTypes(jsonFunction);
    return `${ jsonFunction.name }(${ types.join(',') })`;
}

export function getFunction(jsonFunction, mehtodName?) {
    if (!isArray(jsonFunction) && isObject(jsonFunction)) {
        return jsonFunction;
    }

    if (jsonFunction.length !== 1 && !mehtodName) {
        throw new Error('[Error] Param(s) missing, methodName.');
    }

    if (!mehtodName && jsonFunction.length === 1) {
        return jsonFunction[0];
    }

    for (let i = 0; i < jsonFunction.length; i++) {
        if (jsonFunction[i].name === mehtodName) {
            return jsonFunction[i];
        }
    }
}
