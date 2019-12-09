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
var vitejs_utils_1 = require("./../utils");
var address_1 = require("./../wallet/address");
var vitejs_abi_1 = require("./../abi");
var utils_1 = require("./../accountblock/utils");
var provider_1 = require("./provider");
var ViteAPIClass = (function (_super) {
    __extends(ViteAPIClass, _super);
    function ViteAPIClass(provider, onInitCallback) {
        var _this = _super.call(this, provider, onInitCallback) || this;
        _this.customTransactionType = {};
        return _this;
    }
    Object.defineProperty(ViteAPIClass.prototype, "transactionType", {
        get: function () {
            return Object.assign({}, this.customTransactionType, utils_1.Default_Contract_TransactionType);
        },
        enumerable: true,
        configurable: true
    });
    ViteAPIClass.prototype.addTransactionType = function (contractList) {
        if (contractList === void 0) { contractList = {}; }
        for (var transactionType in contractList) {
            if (vitejs_constant_1.Contracts[transactionType]) {
                throw new Error("Please rename it. Your transactionType " + transactionType + " conflicts with default transactionType.");
            }
            if (this.customTransactionType && this.customTransactionType[transactionType]) {
                throw new Error("Please rename it. Your transactionType " + transactionType + " conflicts with custom transactionType.");
            }
        }
        var transactionTypeAfterEncode = utils_1.encodeContractList(contractList);
        this.customTransactionType = Object.assign({}, this.customTransactionType, transactionTypeAfterEncode);
    };
    ViteAPIClass.prototype.getBalanceInfo = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var err, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        err = vitejs_utils_1.checkParams({ address: address }, ['address'], [{
                                name: 'address',
                                func: address_1.isValidAddress
                            }]);
                        if (err) {
                            throw err;
                        }
                        return [4, this.batch([{
                                    methodName: 'ledger_getAccountInfoByAddress',
                                    params: [address]
                                }, {
                                    methodName: 'ledger_getUnreceivedTransactionSummaryByAddress',
                                    params: [address]
                                }])];
                    case 1:
                        data = _b.sent();
                        if (!data || (data instanceof Array && data.length < 2)) {
                            return [2, {
                                    balance: null,
                                    unreceived: null
                                }];
                        }
                        if (data[0].error) {
                            throw data[0].error;
                        }
                        if (data[1].error) {
                            throw data[1].error;
                        }
                        return [2, {
                                balance: data[0].result,
                                unreceived: data[1].result
                            }];
                }
            });
        });
    };
    ViteAPIClass.prototype.getTransactionList = function (_b, decodeTxTypeList) {
        var address = _b.address, pageIndex = _b.pageIndex, _c = _b.pageSize, pageSize = _c === void 0 ? 50 : _c;
        if (decodeTxTypeList === void 0) { decodeTxTypeList = 'all'; }
        return __awaiter(this, void 0, void 0, function () {
            var err, data, rawList, list;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        err = vitejs_utils_1.checkParams({ address: address, pageIndex: pageIndex, decodeTxTypeList: decodeTxTypeList }, ['address', 'pageIndex'], [{
                                name: 'address',
                                func: address_1.isValidAddress
                            }, {
                                name: 'decodeTxTypeList',
                                func: function (_d) {
                                    return _d === 'all' || _d === 'none' || vitejs_utils_1.isArray(_d);
                                },
                                msg: '\'all\' || \'none\' || TransactionType[]'
                            }]);
                        if (err) {
                            throw err;
                        }
                        pageIndex = pageIndex >= 0 ? pageIndex : 0;
                        return [4, this.request('ledger_getAccountBlocksByAddress', address, pageIndex, pageSize)];
                    case 1:
                        data = _e.sent();
                        rawList = data || [];
                        list = [];
                        rawList.forEach(function (accountBlock) {
                            var transaction = accountBlock;
                            var _b = utils_1.getTransactionType(accountBlock, _this.customTransactionType), abi = _b.abi, transactionType = _b.transactionType, contractAddress = _b.contractAddress;
                            transaction.transactionType = transactionType;
                            var isDecodeTx = contractAddress
                                && abi
                                && (decodeTxTypeList === 'all'
                                    || (decodeTxTypeList.length && decodeTxTypeList.indexOf(transactionType) !== -1));
                            if (isDecodeTx) {
                                transaction.contractParams = contractAddress && abi
                                    ? utils_1.decodeContractAccountBlock({ accountBlock: accountBlock, contractAddress: contractAddress, abi: abi })
                                    : null;
                            }
                            list.push(transaction);
                        });
                        return [2, list];
                }
            });
        });
    };
    ViteAPIClass.prototype.callOffChainContract = function (_b) {
        var address = _b.address, abi = _b.abi, code = _b.code, params = _b.params;
        return __awaiter(this, void 0, void 0, function () {
            var err, offchainAbi, data, result, hexResult;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        err = vitejs_utils_1.checkParams({ address: address, abi: abi }, ['address', 'abi'], [{
                                name: 'address',
                                func: function (_a) { return address_1.isValidAddress(_a) === address_1.AddressType.Contract; }
                            }]);
                        if (err) {
                            throw err;
                        }
                        offchainAbi = vitejs_abi_1.getAbiByType(abi, 'offchain');
                        if (!offchainAbi) {
                            throw new Error('Can\'t find abi that type is offchain');
                        }
                        data = vitejs_abi_1.encodeFunctionCall(offchainAbi, params || []);
                        return [4, this.request('contract_callOffChainMethod', {
                                address: address,
                                code: code,
                                data: Buffer.from(data, 'hex').toString('base64')
                            })];
                    case 1:
                        result = _c.sent();
                        if (!result) {
                            return [2, null];
                        }
                        hexResult = Buffer.from(result, 'base64').toString('hex');
                        return [2, vitejs_abi_1.decodeParameters(offchainAbi.outputs, hexResult)];
                }
            });
        });
    };
    ViteAPIClass.prototype.getNonce = function (_b) {
        var difficulty = _b.difficulty, previousHash = _b.previousHash, address = _b.address;
        return __awaiter(this, void 0, void 0, function () {
            var err, originalAddress, getNonceHashBuffer, getNonceHash;
            return __generator(this, function (_c) {
                err = vitejs_utils_1.checkParams({ difficulty: difficulty, previousHash: previousHash, address: address }, ['address', 'difficulty', 'previousHash']);
                if (err) {
                    throw err;
                }
                originalAddress = address_1.getOriginalAddressFromAddress(address);
                getNonceHashBuffer = Buffer.from(originalAddress + previousHash, 'hex');
                getNonceHash = vitejs_utils_1.blake2bHex(getNonceHashBuffer, null, 32);
                return [2, this.request('util_getPoWNonce', difficulty, getNonceHash)];
            });
        });
    };
    return ViteAPIClass;
}(provider_1.default));
exports.ViteAPI = ViteAPIClass;
exports.default = exports.ViteAPI;
