"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitejs_constant_1 = require("./../constant");
var vitejs_utils_1 = require("./../utils");
var vitejs_privtoaddr_1 = require("./../privtoaddr");
var vitejs_accountblock_1 = require("./../accountblock");
var type_1 = require("../type");
var onroad = vitejs_constant_1.methods.onroad;
var checkParams = vitejs_utils_1.tools.checkParams;
var _ledger = vitejs_constant_1.methods.ledger;
var Ledger = (function () {
    function Ledger(client) {
        this._client = client;
    }
    Ledger.prototype.getBalance = function (addr) {
        return __awaiter(this, void 0, void 0, function () {
            var err, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        err = checkParams({ addr: addr }, ['addr'], [{
                                name: 'addr',
                                func: vitejs_privtoaddr_1.isValidHexAddr
                            }]);
                        if (err) {
                            return [2, Promise.reject(err)];
                        }
                        return [4, this._client.batch([{
                                    methodName: _ledger.getAccountByAccAddr,
                                    params: [addr]
                                }, {
                                    methodName: onroad.getAccountOnroadInfo,
                                    params: [addr]
                                }])];
                    case 1:
                        data = _b.sent();
                        if (!data || (data instanceof Array && data.length < 2)) {
                            return [2, null];
                        }
                        return [2, {
                                balance: data[0].result,
                                onroad: data[1].result
                            }];
                }
            });
        });
    };
    Ledger.prototype.getTxList = function (_b) {
        var addr = _b.addr, index = _b.index, _c = _b.pageCount, pageCount = _c === void 0 ? 50 : _c, _d = _b.totalNum, totalNum = _d === void 0 ? null : _d;
        return __awaiter(this, void 0, void 0, function () {
            var err, requests, data, rawList, list;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        err = checkParams({ addr: addr, index: index }, ['addr', 'index'], [{
                                name: 'addr',
                                func: vitejs_privtoaddr_1.isValidHexAddr
                            }]);
                        if (err) {
                            return [2, Promise.reject(err)];
                        }
                        index = index >= 0 ? index : 0;
                        if (totalNum === 0) {
                            return [2, { totalNum: totalNum, list: [] }];
                        }
                        requests = [{
                                methodName: _ledger.getBlocksByAccAddr,
                                params: [addr, index, pageCount]
                            }];
                        if (!totalNum) {
                            requests.push({
                                methodName: _ledger.getAccountByAccAddr,
                                params: [addr]
                            });
                        }
                        return [4, this._client.batch(requests)];
                    case 1:
                        data = _e.sent();
                        requests.forEach(function (_r, i) {
                            if (_r.methodName === _ledger.getAccountByAccAddr) {
                                totalNum = data[i].result ? data[i].result.totalNumber : 0;
                                return;
                            }
                            rawList = data[i].result || [];
                        });
                        list = [];
                        rawList.forEach(function (item) {
                            var txType = vitejs_accountblock_1.getBuiltinTxType(item.toAddress, item.data, Number(item.blockType));
                            item.txType = type_1.BuiltinTxType[txType];
                            list.push(item);
                        });
                        return [2, { list: list, totalNum: totalNum }];
                }
            });
        });
    };
    Ledger.prototype.sendRawTx = function (accountBlock, privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var err, _accountBlock, err_1, _err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        err = checkParams({ accountBlock: accountBlock, privateKey: privateKey }, ['accountBlock', 'privateKey'], [{
                                name: 'accountBlock',
                                func: function (_a) { return !vitejs_accountblock_1.validReqAccountBlock(_a); }
                            }]);
                        if (err) {
                            return [2, Promise.reject(err)];
                        }
                        _accountBlock = vitejs_accountblock_1.signAccountBlock(accountBlock, privateKey);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, this._client.tx.sendRawTx(_accountBlock)];
                    case 2: return [2, _b.sent()];
                    case 3:
                        err_1 = _b.sent();
                        _err = err_1;
                        _err.accountBlock = _accountBlock;
                        return [2, Promise.reject(_err)];
                    case 4: return [2];
                }
            });
        });
    };
    return Ledger;
}());
exports.default = Ledger;
