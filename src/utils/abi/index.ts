import encodeFunction from './encodeFunction'
import { encodeParameter, encodeParameters } from './coder/index'

export default {
    encodeFunctionSignature,
    encodeLogSignature(jsonFunction, mehtodName?) {
        return encodeFunction(jsonFunction, mehtodName);
    },
    encodeParameter(type, param) {
        return encodeParameter(type, param).result;
    },
    encodeParameters,
    // decodeParameter(type, params) {
    //     let typeObj = validType(type.toString());
    //     if ( !typeObj ||
    //          typeof params !== 'string' ||
    //          !/^[0-9a-fA-F]+$/.test(params) ||
    //          (typeObj.byteLength && params.length % (typeObj.byteLength*2) !== 0) ) {
    //         return false;
    //     }
    //     return decode[typeObj.type](typeObj, params);
    // },

    // decodeParameters() {

    // },

    // decodeLog() {

    // }
}

function encodeFunctionSignature(jsonFunction, mehtodName?) {
    let result = encodeFunction(jsonFunction, mehtodName);
    return result.slice(0, 8);
}
