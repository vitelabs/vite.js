import { isArray  } from 'utils/encoder';
import encodeFunction from './encodeFunction';
import { encodeParameter, encodeParameters, decodeParameter, decodeParameters } from './coder/index';

export default {
    encodeFunctionSignature,
    encodeLogSignature(jsonFunction, mehtodName?) {
        return encodeFunction(jsonFunction, mehtodName);
    },
    encodeParameter(type, param) {
        return encodeParameter(type, param).result;
    },
    encodeParameters,
    encodeFunctionCall(jsonInterface, params) {
        let inputs = jsonInterface.inputs;
        let types = [];
        inputs.forEach(({ type }) => {
            types.push(type);
        });
        return encodeFunctionSignature(jsonInterface) + encodeParameters(types, params)
    },
    decodeParameter,
    decodeParameters,
    decodeLog
}

function encodeFunctionSignature(jsonFunction, mehtodName?) {
    let result = encodeFunction(jsonFunction, mehtodName);
    return result.slice(0, 8);
}

function decodeLog(inputs, data = '', topics) {
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
