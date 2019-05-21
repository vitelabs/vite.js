"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDR_PRE = 'vite_';
exports.ADDR_SIZE = 20;
exports.ADDR_CHECK_SUM_SIZE = 5;
exports.ADDR_LEN = exports.ADDR_PRE.length + exports.ADDR_SIZE * 2 + exports.ADDR_CHECK_SUM_SIZE * 2;
var ADDR_TYPE;
(function (ADDR_TYPE) {
    ADDR_TYPE[ADDR_TYPE["Illegal"] = 0] = "Illegal";
    ADDR_TYPE[ADDR_TYPE["Account"] = 1] = "Account";
    ADDR_TYPE[ADDR_TYPE["Contract"] = 2] = "Contract";
})(ADDR_TYPE = exports.ADDR_TYPE || (exports.ADDR_TYPE = {}));
