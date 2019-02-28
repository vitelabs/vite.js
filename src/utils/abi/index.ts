import { isArray, isObject } from 'utils/encoder';
import { encodeFunction, getFunction } from './encodeFunction';
import { encodeParameter as _encodeParameter, encodeParameters as _encodeParameters, decodeParameter as _decodeParameter, decodeParameters as _decodeParameters } from './coder';
import { getTypes } from './inputsType';

export function encodeLogSignature(jsonFunction, mehtodName?) {
    return encodeFunction(jsonFunction, mehtodName);
}
export function encodeFunctionSignature(jsonFunction, mehtodName?) {
    let result = encodeFunction(jsonFunction, mehtodName);
    return result.slice(0, 8);
}
export function encodeFunctionCall(jsonInterface, params, methodName?) {
    let func = getFunction(jsonInterface, methodName);
    return encodeFunctionSignature(func) + encodeParameters(getTypes(func), params)
}

export function encodeParameter(type, param) {
    return _encodeParameter(type, param).result;
}
export const decodeParameter = _decodeParameter;

export function encodeParameters(types, params) {
    return _encodeParameters(getTypes(types), params);
}
export function decodeParameters(types, params) {
    return _decodeParameters(getTypes(types), params);
} 

export function decodeLog(inputs, data = '', topics) {
    let topicCount = 0;
    topics = isArray(topics) ? topics : [topics];

    const notIndexedInputsShow = [];
    const indexedParams = [];

    inputs = getInputs(inputs);
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

    let returnValues = {};
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



function getInputs(inputs) {
    if (!isArray(inputs) && !isObject(inputs)) {
        throw '[Error] decodeLog: Illegal inputs ${inputes}. Should be Array or JsonInterface.';
    }

    inputs = isArray(inputs) ? inputs : inputs.inputs;
    return inputs || [];
}
