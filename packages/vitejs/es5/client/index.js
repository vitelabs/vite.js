"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var vitejs_netprocessor_1 = require("./../netprocessor");
var vitejs_utils_1 = require("./../utils");
var vitejs_privtoaddr_1 = require("./../privtoaddr");
var vitejs_accountblock_1 = require("./../accountblock");
var builtin_1 = require("./../accountblock/builtin");
var vitejs_abi_1 = require("./../abi");
var txBlock_1 = require("./txBlock");
var type_1 = require("../type");
var onroad = vitejs_constant_1.methods.onroad;
var _ledger = vitejs_constant_1.methods.ledger;
var ClientClass = (function (_super) {
    __extends(ClientClass, _super);
    function ClientClass(provider, firstConnect) {
        var _this = _super.call(this, provider, firstConnect) || this;
        _this.builtinTxBlock = new txBlock_1.default(_this);
        _this._setMethodsName();
        return _this;
    }
    ClientClass.prototype.setProvider = function (provider, firstConnect, abort) {
        this._setProvider(provider, firstConnect, abort);
        var providerType = this._provider.type || 'http';
        if (providerType.toLowerCase !== 'ipc' || this.wallet) {
            return;
        }
        this._setMethodsName();
    };
    ClientClass.prototype.getBalance = function (addr) {
        return __awaiter(this, void 0, void 0, function () {
            var err, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        err = vitejs_utils_1.checkParams({ addr: addr }, ['addr'], [{
                                name: 'addr',
                                func: vitejs_privtoaddr_1.isValidHexAddr
                            }]);
                        if (err) {
                            return [2, Promise.reject(err)];
                        }
                        return [4, this.batch([{
                                    methodName: _ledger.getAccountByAccAddr,
                                    params: [addr]
                                }, {
                                    methodName: onroad.getOnroadInfoByAddress,
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
    ClientClass.prototype.getTxList = function (_b) {
        var addr = _b.addr, index = _b.index, _c = _b.pageCount, pageCount = _c === void 0 ? 50 : _c, _d = _b.totalNum, totalNum = _d === void 0 ? null : _d;
        return __awaiter(this, void 0, void 0, function () {
            var err, requests, data, rawList, list;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        err = vitejs_utils_1.checkParams({ addr: addr, index: index }, ['addr', 'index'], [{
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
                        return [4, this.batch(requests)];
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
    ClientClass.prototype.callOffChainContract = function (_b) {
        var addr = _b.addr, abi = _b.abi, offChainCode = _b.offChainCode;
        return __awaiter(this, void 0, void 0, function () {
            var jsonInterface, data, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        jsonInterface = builtin_1.getAbi(abi, 'offchain');
                        if (!jsonInterface) {
                            throw new Error('Can\'t find offchain');
                        }
                        data = vitejs_abi_1.encodeFunctionCall(jsonInterface, jsonInterface.inputs || []);
                        return [4, this.contract.callOffChainMethod({
                                selfAddr: addr,
                                offChainCode: offChainCode,
                                data: data
                            })];
                    case 1:
                        result = _c.sent();
                        return [2, vitejs_abi_1.decodeParameters(jsonInterface.outputs, result)];
                }
            });
        });
    };
    ClientClass.prototype.sendAutoPowRawTx = function (_b) {
        var accountBlock = _b.accountBlock, privateKey = _b.privateKey, _c = _b.usePledgeQuota, usePledgeQuota = _c === void 0 ? true : _c;
        return __awaiter(this, void 0, void 0, function () {
            var err, powTx;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        err = vitejs_utils_1.checkParams({ accountBlock: accountBlock, privateKey: privateKey }, ['accountBlock', 'privateKey'], [{
                                name: 'accountBlock',
                                func: function (_a) { return !builtin_1.validReqAccountBlock(_a); }
                            }]);
                        if (err) {
                            throw err;
                        }
                        return [4, this.builtinTxBlock.autoPow(accountBlock, usePledgeQuota)];
                    case 1:
                        powTx = _d.sent();
                        return [2, this.sendRawTx(powTx.accountBlock, privateKey)];
                }
            });
        });
    };
    ClientClass.prototype.sendRawTx = function (accountBlock, privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _accountBlock, err_1, _err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _accountBlock = vitejs_accountblock_1.signAccountBlock(accountBlock, privateKey);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, this.tx.sendRawTx(_accountBlock)];
                    case 2:
                        _b.sent();
                        return [2, _accountBlock];
                    case 3:
                        err_1 = _b.sent();
                        _err = err_1;
                        _err.accountBlock = _accountBlock;
                        throw _err;
                    case 4: return [2];
                }
            });
        });
    };
    ClientClass.prototype._setMethodsName = function () {
        var _this = this;
        var providerType = (this._provider.type || 'http').toLowerCase();
        for (var namespace in vitejs_constant_1.methods) {
            if (providerType !== 'ipc' && namespace === 'wallet') {
                this.wallet = null;
                continue;
            }
            var _namespace = namespace === 'subscribe' ? 'subscribeFunc' : namespace;
            if (this[_namespace]) {
                continue;
            }
            var spaceMethods = vitejs_constant_1.methods[namespace];
            this[_namespace] = {};
            var _loop_1 = function (methodName) {
                var name = spaceMethods[methodName];
                this_1[_namespace][methodName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.request.apply(_this, [name].concat(args));
                };
            };
            var this_1 = this;
            for (var methodName in spaceMethods) {
                _loop_1(methodName);
            }
        }
    };
    return ClientClass;
}(vitejs_netprocessor_1.default));
exports.client = ClientClass;
exports.default = ClientClass;
