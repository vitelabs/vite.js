import { blake2bHex, isArray, isObject } from '~@vite/vitejs-utils';
import { getTypes } from './inputsType';


export function encodeFunction(jsonFunction, methodName?) {
    const isArr = isArray(jsonFunction);
    const _jsonFunction = isArr ? getFunction(jsonFunction, methodName) : jsonFunction;
    const result = jsonFunctionToString(_jsonFunction);
    return blake2bHex(result, null, 32);
}

export function getFunction(jsonFunction, methodName?) {
    if (!isArray(jsonFunction) && isObject(jsonFunction)) {
        return jsonFunction;
    }

    if (jsonFunction.length !== 1 && !methodName) {
        throw new Error('[Error] Param(s) missing, methodName.');
    }

    if (!methodName && jsonFunction.length === 1) {
        return jsonFunction[0];
    }

    return jsonFunction.find(e => e.name === methodName);
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
