import encodeFunction from './encodeFunction'
import { encodeParameter, encodeParameters, decodeParameter } from './coder/index'

export default {
    encodeFunctionSignature,
    encodeLogSignature(jsonFunction, mehtodName?) {
        return encodeFunction(jsonFunction, mehtodName);
    },
    encodeParameter(type, param) {
        return encodeParameter(type, param).result;
    },
    encodeParameters,
    decodeParameter(type, params) {
        return decodeParameter(type, params);
    },

    // decodeParameters() {

    // },

    // decodeLog() {

    // }
}

function encodeFunctionSignature(jsonFunction, mehtodName?) {
    let result = encodeFunction(jsonFunction, mehtodName);
    return result.slice(0, 8);
}
