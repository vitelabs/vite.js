import { isArray, isObject, blake2bHex  } from 'utils/encoder';
import { validType  } from './inputsType';

function encodeFunction(jsonFunction, mehtodName?) {
    let isArr = isArray(jsonFunction);
    let _jsonFunction = isArr ? getFunction(jsonFunction, mehtodName) : jsonFunction;
    let result = jsonFunctionToString(_jsonFunction);
    return blake2bHex(result, null, 32);
}

function jsonFunctionToString(jsonFunction) {
    const isObj = isObject(jsonFunction);
    const isRightStr = /\w+\((\w\,\w)*|(\w*)\)/g;

    if (!isObj && !isRightStr.test(jsonFunction)) {
        throw '[Error] Illegal jsonFunction'
    }

    if (isRightStr.test(jsonFunction)) {
        return jsonFunction;
    }

    if (jsonFunction.name && isRightStr.test(jsonFunction.name)) {
        return jsonFunction.name;
    }

    let types = [];
    jsonFunction.inputs && jsonFunction.inputs.forEach(function(param) {
        validType(param.type);
        types.push(param.type);
    });
    return jsonFunction.name + '(' + types.join(',') + ')';
}

function getFunction(jsonFunction, mehtodName?) {
    if (jsonFunction.length !== 1 && !mehtodName) {
        throw '[Error] Param(s) missing, methodName.';
    }

    if (!mehtodName && jsonFunction.length === 1) {
        return jsonFunction[0];
    }

    for (let i=0; i<jsonFunction.length; i++) {
        if (jsonFunction[i].name === mehtodName) {
            return jsonFunction[i];
        }
    }
}

export default encodeFunction;
