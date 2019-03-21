"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitejs_utils_1 = require("./../utils");
var inputsType_1 = require("./inputsType");
var isArray = vitejs_utils_1.encoder.isArray, isObject = vitejs_utils_1.encoder.isObject, blake2bHex = vitejs_utils_1.encoder.blake2bHex;
function encodeFunction(jsonFunction, mehtodName) {
    var isArr = isArray(jsonFunction);
    var _jsonFunction = isArr ? getFunction(jsonFunction, mehtodName) : jsonFunction;
    var result = jsonFunctionToString(_jsonFunction);
    return blake2bHex(result, null, 32);
}
exports.encodeFunction = encodeFunction;
function jsonFunctionToString(jsonFunction) {
    var isObj = isObject(jsonFunction);
    var isRightStr = /\w+\((\w\,\w)*|(\w*)\)/g;
    if (!isObj && !isRightStr.test(jsonFunction)) {
        throw new Error("[Error] Illegal jsonFunction. " + JSON.stringify(jsonFunction));
    }
    if (isRightStr.test(jsonFunction)) {
        return jsonFunction;
    }
    if (jsonFunction.name && isRightStr.test(jsonFunction.name)) {
        return jsonFunction.name;
    }
    var types = inputsType_1.getTypes(jsonFunction);
    return jsonFunction.name + "(" + types.join(',') + ")";
}
function getFunction(jsonFunction, mehtodName) {
    if (!isArray(jsonFunction) && isObject(jsonFunction)) {
        return jsonFunction;
    }
    if (jsonFunction.length !== 1 && !mehtodName) {
        throw new Error('[Error] Param(s) missing, methodName.');
    }
    if (!mehtodName && jsonFunction.length === 1) {
        return jsonFunction[0];
    }
    for (var i = 0; i < jsonFunction.length; i++) {
        if (jsonFunction[i].name === mehtodName) {
            return jsonFunction[i];
        }
    }
}
exports.getFunction = getFunction;
