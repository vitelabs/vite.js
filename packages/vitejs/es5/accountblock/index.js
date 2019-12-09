"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitejs_utils_1 = require("./../utils");
var accountBlock_1 = require("./accountBlock");
var transaction_1 = require("./transaction");
var _utils = require("./utils");
exports.AccountBlock = accountBlock_1.default;
exports.Transaction = transaction_1.default;
exports.utils = _utils;
function createAccountBlock(methodName, params) {
    var err = vitejs_utils_1.checkParams({ methodName: methodName, params: params }, ['methodName', 'params'], [{
            name: 'methodName',
            func: function (_m) { return typeof methodName === 'string'; }
        }, {
            name: 'params',
            func: vitejs_utils_1.isObject
        }]);
    if (err) {
        throw err;
    }
    var tx = new transaction_1.default(params.address);
    if (!tx[methodName]) {
        throw new Error("Don't support transaction type " + methodName);
    }
    return tx[methodName](params);
}
exports.createAccountBlock = createAccountBlock;
