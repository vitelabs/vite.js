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

export function decodeLog(abi, data = '', topics, methodName?: string) {
    const nonIndexedInputs = [];
    const nonIndexedTypes = [];
    let inputs = getInputs(abi, methodName);
    const returnValues = {};
    let topicIndex = abi.anonymous ? 0 : 1;  // for non-anonymous events, topics[0] always refers to the hash of the event signature
    inputs.forEach((input, i) => {
        if (input.indexed) {
            // parse indexed params from topics
            // if it's a reference type such as a string for an indexed argument, the blake2b hash of the value is stored as a topic instead.
            let param =  (['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].find(function (staticType) {
                return input.type.indexOf(staticType) !== -1;
            })) ? decodeParameter(input.type, topics[topicIndex]) : topics[topicIndex];
            topicIndex++;
            // add the indexed param to the return values
            returnValues[i] = param;
            if (input.name) returnValues[input.name] = param;
        } else {
            nonIndexedInputs.push(input);
            nonIndexedTypes.push(input.type);
        }
    });
    // parse non-indexed params from data
    const nonIndexedParams = decodeParameters(nonIndexedTypes, data);
    // add non-indexed params to the return values
    let index = 0;  
    inputs.forEach((input, i) => {
        if (!input.indexed) {
            returnValues[i] = nonIndexedParams[index];
            if (input.name) returnValues[input.name] = nonIndexedParams[index];
            index++;
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
    return jsonInterfaces.find(e => e.type === type) || null;
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
