"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("utils");
var encodeFunction_1 = require("./encodeFunction");
var coder_1 = require("./coder");
var inputsType_1 = require("./inputsType");
var isArray = utils_1.encoder.isArray, isObject = utils_1.encoder.isObject;
function encodeLogSignature(jsonFunction, mehtodName) {
    return encodeFunction_1.encodeFunction(jsonFunction, mehtodName);
}
exports.encodeLogSignature = encodeLogSignature;
function encodeFunctionSignature(jsonFunction, mehtodName) {
    var result = encodeFunction_1.encodeFunction(jsonFunction, mehtodName);
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
function encodeParameters(types, params, mehtodName) {
    try {
        var func = encodeFunction_1.getFunction(types, mehtodName);
        types = inputsType_1.getTypes(func);
    }
    catch (err) { }
    return coder_1.encodeParameters(inputsType_1.getTypes(types), params);
}
exports.encodeParameters = encodeParameters;
function decodeParameters(types, params, mehtodName) {
    try {
        var func = encodeFunction_1.getFunction(types, mehtodName);
        types = inputsType_1.getTypes(func);
    }
    catch (err) { }
    return coder_1.decodeParameters(inputsType_1.getTypes(types), params);
}
exports.decodeParameters = decodeParameters;
function decodeLog(inputs, data, topics, mehtodName) {
    if (data === void 0) { data = ''; }
    var topicCount = 0;
    topics = isArray(topics) ? topics : [topics];
    var notIndexedInputsShow = [];
    var indexedParams = [];
    inputs = getInputs(inputs, mehtodName);
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
function getInputs(inputs, mehtodName) {
    try {
        var func = encodeFunction_1.getFunction(inputs, mehtodName);
        func && (inputs = func);
    }
    catch (err) { }
    if (!isArray(inputs) && !isObject(inputs)) {
        throw "[Error] decodeLog: Illegal inputs " + JSON.stringify(inputs) + ". Should be Array or JsonInterface.";
    }
    inputs = isArray(inputs) ? inputs : inputs.inputs;
    return inputs || [];
}
