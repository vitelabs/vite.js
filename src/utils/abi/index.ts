import { isArray } from 'utils/encoder';
import { encodeFunction, getFunction } from './encodeFunction';
import { encodeParameter as _encodeParameter, encodeParameters as _encodeParameters, decodeParameter as _decodeParameter, decodeParameters as _decodeParameters } from './coder';


export function encodeLogSignature(jsonFunction, mehtodName?) {
    return encodeFunction(jsonFunction, mehtodName);
}
export function encodeParameter(type, param) {
    return _encodeParameter(type, param).result;
}
export const encodeParameters = _encodeParameters
export const decodeParameter = _decodeParameter
export const decodeParameters = _decodeParameters
export function encodeFunctionCall(jsonInterface, params, methodName?) {
    if (!methodName && isArray(jsonInterface)) {
        throw 'No methodName, jsonInterface should be jsonObject.'
    }

    let func = getFunction(jsonInterface, methodName);
    let inputs = func.inputs;
    let types = [];
    inputs.forEach(({ type }) => {
        types.push(type);
    });
    return encodeFunctionSignature(func) + encodeParameters(types, params)
}


export function encodeFunctionSignature(jsonFunction, mehtodName?) {
    let result = encodeFunction(jsonFunction, mehtodName);
    return result.slice(0, 8);
}

export function decodeLog(inputs, data = '', topics) {
    let topicCount = 0;
    topics = isArray(topics) ? topics : [topics];

    const notIndexedInputsShow = [];
    const indexedParams = [];

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
