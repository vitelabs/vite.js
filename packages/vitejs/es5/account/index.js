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
var privToAddr = require("./../privtoaddr");
var vitejs_error_1 = require("./../error");
var vitejs_utils_1 = require("./../utils");
var vitejs_addraccount_1 = require("./../addraccount");
var checkParams = vitejs_utils_1.tools.checkParams;
var sign = vitejs_utils_1.ed25519.sign, getPublicKey = vitejs_utils_1.ed25519.getPublicKey;
var Account = (function (_super) {
    __extends(Account, _super);
    function Account(_b) {
        var privateKey = _b.privateKey, client = _b.client;
        var _this = this;
        if (!client) {
            _this = _super.call(this) || this;
            throw new Error(vitejs_error_1.paramsMissing.message + " Client.");
        }
        var _c = privToAddr.newHexAddr(privateKey), pubKey = _c.pubKey, privKey = _c.privKey, hexAddr = _c.hexAddr;
        _this = _super.call(this, { address: hexAddr, client: client }) || this;
        _this.privateKey = privKey;
        _this.publicKey = pubKey;
        _this._lock = true;
        _this._autoReceive = false;
        _this.balance = null;
        return _this;
    }
    Account.prototype.getPublicKey = function () {
        if (this.publicKey) {
            return Buffer.from(this.publicKey, 'hex');
        }
        var privKey = Buffer.from(this.privateKey, 'hex');
        return getPublicKey(privKey);
    };
    Account.prototype.sign = function (hexStr) {
        var privKey = Buffer.from(this.privateKey, 'hex');
        return sign(hexStr, privKey);
    };
    Account.prototype.activate = function (intervals, receiveFailAction) {
        var _this = this;
        if (intervals === void 0) { intervals = 2000; }
        if (receiveFailAction === void 0) { receiveFailAction = null; }
        if (!this._lock) {
            return;
        }
        this._lock = false;
        var loop = function () {
            if (_this._lock) {
                return;
            }
            var _t = function () {
                var loopTimeout = setTimeout(function () {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                    loop();
                }, intervals);
            };
            _this.getBalance().then(function (balance) {
                _this.balance = balance;
                var onroad = _this.balance && _this.balance.onroad ? _this.balance.onroad : null;
                var balanceInfos = onroad && onroad.tokenBalanceInfoMap ? onroad.tokenBalanceInfoMap : null;
                _t();
                if (balanceInfos) {
                    _this.autoReceiveTx(intervals, receiveFailAction);
                    return;
                }
                _this.stopAutoReceiveTx();
            }).catch(function () {
                _t();
            });
        };
        loop();
    };
    Account.prototype.freeze = function () {
        this._lock = true;
    };
    Account.prototype.autoReceiveTx = function (intervals, receiveFailAction) {
        var _this = this;
        if (intervals === void 0) { intervals = 2000; }
        if (receiveFailAction === void 0) { receiveFailAction = null; }
        if (this._autoReceive) {
            return;
        }
        this._autoReceive = true;
        var _receive = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, fromBlockHash, data, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this._client.onroad.getOnroadBlocksByAddress(this.address, 0, 1)];
                    case 1:
                        result = _b.sent();
                        if (!result || !result.length) {
                            return [2, null];
                        }
                        fromBlockHash = result[0].hash;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4, this.receiveTx({ fromBlockHash: fromBlockHash })];
                    case 3:
                        data = _b.sent();
                        return [2, data];
                    case 4:
                        err_1 = _b.sent();
                        if (!receiveFailAction) {
                            return [2, Promise.reject(err_1)];
                        }
                        return [2, receiveFailAction(err_1)];
                    case 5: return [2];
                }
            });
        }); };
        var loop = function () {
            if (!_this._autoReceive) {
                return;
            }
            var _t = function () {
                var loopTimeout = setTimeout(function () {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                    loop();
                }, intervals);
            };
            _receive().then(function () {
                _t();
            }).catch(function () {
                _t();
            });
        };
        loop();
    };
    Account.prototype.stopAutoReceiveTx = function () {
        this._autoReceive = false;
    };
    Account.prototype.sendRawTx = function (accountBlock) {
        var _this = this;
        checkParams({ accountBlock: accountBlock }, ['accountBlock'], [{
                name: 'accountBlock',
                func: function (_a) { return !_a.accountAddress || (_a.accountAddress === _this.address); },
                msg: 'AccountAddress is wrong.'
            }]);
        accountBlock.accountAddress = this.address;
        return this._client.buildinLedger.sendRawTx(accountBlock, this.privateKey);
    };
    Account.prototype.sendTx = function (_b) {
        var toAddress = _b.toAddress, tokenId = _b.tokenId, amount = _b.amount, message = _b.message;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _sendTxBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            toAddress: toAddress,
                            tokenId: tokenId,
                            amount: amount,
                            message: message
                        };
                        return [4, this._client.buildinTxBlock.asyncSendTx(reqBlock)];
                    case 1:
                        _sendTxBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_sendTxBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.receiveTx = function (_b) {
        var fromBlockHash = _b.fromBlockHash;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _receiveTxBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            fromBlockHash: fromBlockHash
                        };
                        return [4, this._client.buildinTxBlock.asyncReceiveTx(reqBlock)];
                    case 1:
                        _receiveTxBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_receiveTxBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.SBPreg = function (_b) {
        var nodeName = _b.nodeName, toAddress = _b.toAddress, amount = _b.amount, tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _SBPregBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            nodeName: nodeName,
                            toAddress: toAddress,
                            amount: amount,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.SBPreg(reqBlock)];
                    case 1:
                        _SBPregBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_SBPregBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.updateReg = function (_b) {
        var nodeName = _b.nodeName, toAddress = _b.toAddress, tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _updateRegBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            nodeName: nodeName,
                            toAddress: toAddress,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.updateReg(reqBlock)];
                    case 1:
                        _updateRegBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_updateRegBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.revokeReg = function (_b) {
        var nodeName = _b.nodeName, tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _revokeRegBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            nodeName: nodeName,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.revokeReg(reqBlock)];
                    case 1:
                        _revokeRegBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_revokeRegBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.retrieveReward = function (_b) {
        var nodeName = _b.nodeName, toAddress = _b.toAddress, tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _retrieveRewardBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            nodeName: nodeName,
                            toAddress: toAddress,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.retrieveReward(reqBlock)];
                    case 1:
                        _retrieveRewardBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_retrieveRewardBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.voting = function (_b) {
        var nodeName = _b.nodeName, tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _votingBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            nodeName: nodeName,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.voting(reqBlock)];
                    case 1:
                        _votingBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_votingBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.revokeVoting = function (_b) {
        var tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _revokeVotingBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.revokeVoting(reqBlock)];
                    case 1:
                        _revokeVotingBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_revokeVotingBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.getQuota = function (_b) {
        var toAddress = _b.toAddress, tokenId = _b.tokenId, amount = _b.amount;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _getQuotaBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            toAddress: toAddress,
                            tokenId: tokenId,
                            amount: amount
                        };
                        return [4, this._client.buildinTxBlock.getQuota(reqBlock)];
                    case 1:
                        _getQuotaBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_getQuotaBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.withdrawalOfQuota = function (_b) {
        var toAddress = _b.toAddress, tokenId = _b.tokenId, amount = _b.amount;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _withdrawalOfQuotaBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            toAddress: toAddress,
                            tokenId: tokenId,
                            amount: amount
                        };
                        return [4, this._client.buildinTxBlock.withdrawalOfQuota(reqBlock)];
                    case 1:
                        _withdrawalOfQuotaBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_withdrawalOfQuotaBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.createContract = function (_b) {
        var hexCode = _b.hexCode, abi = _b.abi, params = _b.params, tokenId = _b.tokenId, amount = _b.amount, _c = _b.fee, fee = _c === void 0 ? '10000000000000000000' : _c;
        return __awaiter(this, void 0, void 0, function () {
            var _createContractBlock;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, this._client.buildinTxBlock.createContract({
                            accountAddress: this.address,
                            hexCode: hexCode,
                            abi: abi,
                            params: params,
                            tokenId: tokenId,
                            amount: amount,
                            fee: fee
                        })];
                    case 1:
                        _createContractBlock = _d.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_createContractBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.callContract = function (_b) {
        var toAddress = _b.toAddress, abi = _b.abi, params = _b.params, methodName = _b.methodName, tokenId = _b.tokenId, amount = _b.amount;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.callContract({
                            accountAddress: this.address,
                            toAddress: toAddress,
                            abi: abi,
                            params: params,
                            methodName: methodName,
                            tokenId: tokenId,
                            amount: amount
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.mintage = function (_b) {
        var _c = _b.feeType, feeType = _c === void 0 ? 'burn' : _c, tokenName = _b.tokenName, isReIssuable = _b.isReIssuable, maxSupply = _b.maxSupply, ownerBurnOnly = _b.ownerBurnOnly, totalSupply = _b.totalSupply, decimals = _b.decimals, tokenSymbol = _b.tokenSymbol;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, this._client.buildinTxBlock.mintage({
                            accountAddress: this.address,
                            feeType: feeType,
                            tokenName: tokenName,
                            isReIssuable: isReIssuable,
                            maxSupply: maxSupply,
                            ownerBurnOnly: ownerBurnOnly,
                            totalSupply: totalSupply,
                            decimals: decimals,
                            tokenSymbol: tokenSymbol
                        })];
                    case 1:
                        _callContractBlock = _d.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.mintageCancelPledge = function (_b) {
        var tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.mintageCancelPledge({
                            accountAddress: this.address,
                            tokenId: tokenId
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.mintageIssue = function (_b) {
        var tokenId = _b.tokenId, amount = _b.amount, beneficial = _b.beneficial;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.mintageIssue({
                            accountAddress: this.address,
                            tokenId: tokenId,
                            amount: amount,
                            beneficial: beneficial
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.mintageBurn = function (_b) {
        var amount = _b.amount, tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.mintageBurn({
                            accountAddress: this.address,
                            amount: amount,
                            tokenId: tokenId
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.changeTokenType = function (_b) {
        var tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.changeTokenType({
                            accountAddress: this.address,
                            tokenId: tokenId
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey)];
                }
            });
        });
    };
    Account.prototype.changeTransferOwner = function (_b) {
        var ownerAddress = _b.ownerAddress, tokenId = _b.tokenId;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.changeTransferOwner({
                            accountAddress: this.address,
                            tokenId: tokenId,
                            ownerAddress: ownerAddress
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey)];
                }
            });
        });
    };
    return Account;
}(vitejs_addraccount_1.default));
exports.default = Account;
