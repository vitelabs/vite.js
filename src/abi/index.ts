import { isArray, isObject } from '~@vite/vitejs-utils';

import { encodeFunction, getFunction } from './encodeFunction';
import { encodeParameter as _encodeParameter, encodeParameters as _encodeParameters, decodeParameter as _decodeParameter, decodeParameters as _decodeParameters } from './coder';
import { getTypes } from './inputsType';


export function encodeLogSignature(jsonFunction, methodName?: string) {
    return encodeFunction(jsonFunction, methodName);
}
export function encodeFunctionSignature(jsonFunction, methodName?: string) {
    const result = encodeFunction(jsonFunction, methodName);
    return result.slice(0, 8);
}
export function encodeFunctionCall(jsonInterface, params, methodName?: string) {
    return encodeFunctionSignature(jsonInterface, methodName) + encodeParameters(jsonInterface, params, methodName);
}

export function encodeParameter(type, param) {
    return _encodeParameter(type, param).result;
}
export const decodeParameter = _decodeParameter;

export function encodeParameters(types, params, methodName?: string) {
    try {
        if (methodName || !isArray(types) && isObject(types)) {
            const func = getFunction(types, methodName);
            types = getTypes(func);
        }
    } catch (err) {
        // Do nothing
    }

    return _encodeParameters(getTypes(types), params);
}
export function decodeParameters(types, params, methodName?: string) {
    try {
        if (methodName || !isArray(types) && isObject(types)) {
            const func = getFunction(types, methodName);
            types = getTypes(func);
        }
    } catch (err) {
        // Do nothing
    }
    return _decodeParameters(getTypes(types), params);
}

export function decodeLog(inputs, data = '', topics, methodName?: string) {
    let topicCount = 0;
    topics = isArray(topics) ? topics : [topics];

    const notIndexedInputsShow = [];
    const indexedParams = [];

    inputs = getInputs(inputs, methodName);
    inputs.forEach((input, i) => {
        indexedParams[i] = input;

        if (!input.indexed) {
            notIndexedInputsShow.push(input.type);
            return;
        }

        indexedParams[i].result = decodeParameter(input.type, topics[topicCount]);
        topicCount++;
    });

    const notIndexedParams = data ? decodeParameters(notIndexedInputsShow, data) : [];

    const returnValues = {};
    let notIndexedCount = 0;

    indexedParams.forEach(({ indexed, name, result }, i) => {
        if (!indexed) {
            result = notIndexedParams[notIndexedCount];
            notIndexedCount++;
        }

        returnValues[i] = result;
        if (name) {
            returnValues[name] = result;
        }
    });

    return returnValues;
}

export function getAbiByType(jsonInterfaces, type) {
    if (!jsonInterfaces || !type) {
        return null;
    }

    if (!(isArray(jsonInterfaces) || isObject(jsonInterfaces))) {
        throw new Error('jsonInterfaces need array or object ');
    }

    // jsonInterfaces is an object
    if (!isArray(jsonInterfaces) && isObject(jsonInterfaces)) {
        if (jsonInterfaces.type === type) {
            return jsonInterfaces;
        }
    }

    // jsonInterfaces is an array
    for (let i = 0; i < jsonInterfaces.length; i++) {
        if (jsonInterfaces[i].type === type) {
            return jsonInterfaces[i];
        }
    }

    return null;
}


function getInputs(inputs, methodName?: string) {
    try {
        const func = getFunction(inputs, methodName);
        func && (inputs = func);
    } catch (err) {
        // Do nothing
    }

    if (!isArray(inputs) && !isObject(inputs)) {
        throw new Error(`[Error] decodeLog: Illegal inputs ${ JSON.stringify(inputs) }. Should be Array or JsonInterface.`);
    }

    inputs = isArray(inputs) ? inputs : inputs.inputs;
    return inputs || [];
}
