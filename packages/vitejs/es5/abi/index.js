"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitejs_utils_1 = require("./../utils");
var encodeFunction_1 = require("./encodeFunction");
var coder_1 = require("./coder");
var inputsType_1 = require("./inputsType");
function encodeLogSignature(jsonFunction, methodName) {
    return encodeFunction_1.encodeFunction(jsonFunction, methodName);
}
exports.encodeLogSignature = encodeLogSignature;
function encodeFunctionSignature(jsonFunction, methodName) {
    var result = encodeFunction_1.encodeFunction(jsonFunction, methodName);
    return result.slice(0, 8);
}
exports.encodeFunctionSignature = encodeFunctionSignature;
function encodeFunctionCall(jsonInterface, params, methodName) {
    return encodeFunctionSignature(jsonInterface, methodName) + encodeParameters(jsonInterface, params, methodName);
}
exports.encodeFunctionCall = encodeFunctionCall;
function encodeParameter(type, param) {
    return coder_1.encodeParameter(type, param).result;
}
exports.encodeParameter = encodeParameter;
exports.decodeParameter = coder_1.decodeParameter;
function encodeParameters(types, params, methodName) {
    try {
        if (methodName || !vitejs_utils_1.isArray(types) && vitejs_utils_1.isObject(types)) {
            var func = encodeFunction_1.getFunction(types, methodName);
            types = inputsType_1.getTypes(func);
        }
    }
    catch (err) { }
    return coder_1.encodeParameters(inputsType_1.getTypes(types), params);
}
exports.encodeParameters = encodeParameters;
function decodeParameters(types, params, methodName) {
    try {
        if (methodName || !vitejs_utils_1.isArray(types) && vitejs_utils_1.isObject(types)) {
            var func = encodeFunction_1.getFunction(types, methodName);
            types = inputsType_1.getTypes(func);
        }
    }
    catch (err) { }
    return coder_1.decodeParameters(inputsType_1.getTypes(types), params);
}
exports.decodeParameters = decodeParameters;
function decodeLog(inputs, data, topics, methodName) {
    if (data === void 0) { data = ''; }
    var topicCount = 0;
    topics = vitejs_utils_1.isArray(topics) ? topics : [topics];
    var notIndexedInputsShow = [];
    var indexedParams = [];
    inputs = getInputs(inputs, methodName);
    inputs.forEach(function (input, i) {
        indexedParams[i] = input;
        if (!input.indexed) {
            notIndexedInputsShow.push(input.type);
            return;
        }
        indexedParams[i].result = exports.decodeParameter(input.type, topics[topicCount]);
        topicCount++;
    });
    var notIndexedParams = data ? decodeParameters(notIndexedInputsShow, data) : [];
    var returnValues = {};
    var notIndexedCount = 0;
    indexedParams.forEach(function (_a, i) {
        var indexed = _a.indexed, name = _a.name, result = _a.result;
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
exports.decodeLog = decodeLog;
function getAbiByType(jsonInterfaces, type) {
    if (!jsonInterfaces || !type) {
        return null;
    }
    if (!(vitejs_utils_1.isArray(jsonInterfaces) || vitejs_utils_1.isObject(jsonInterfaces))) {
        throw new Error('jsonInterfaces need array or object ');
    }
    if (!vitejs_utils_1.isArray(jsonInterfaces) && vitejs_utils_1.isObject(jsonInterfaces)) {
        if (jsonInterfaces.type === type) {
            return jsonInterfaces;
        }
    }
    for (var i = 0; i < jsonInterfaces.length; i++) {
        if (jsonInterfaces[i].type === type) {
            return jsonInterfaces[i];
        }
    }
    return null;
}
exports.getAbiByType = getAbiByType;
function getInputs(inputs, methodName) {
    try {
        var func = encodeFunction_1.getFunction(inputs, methodName);
        func && (inputs = func);
    }
    catch (err) { }
    if (!vitejs_utils_1.isArray(inputs) && !vitejs_utils_1.isObject(inputs)) {
        throw new Error("[Error] decodeLog: Illegal inputs " + JSON.stringify(inputs) + ". Should be Array or JsonInterface.");
    }
    inputs = vitejs_utils_1.isArray(inputs) ? inputs : inputs.inputs;
    return inputs || [];
}
