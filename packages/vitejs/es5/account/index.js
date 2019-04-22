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
var vitejs_accountblock_1 = require("./../accountblock");
var vitejs_constant_1 = require("./../constant");
var sign = vitejs_utils_1.ed25519.sign, getPublicKey = vitejs_utils_1.ed25519.getPublicKey;
var Account = (function (_super) {
    __extends(Account, _super);
    function Account(_b, _c) {
        var privateKey = _b.privateKey, client = _b.client;
        var _d = _c === void 0 ? { autoPow: false, usePledgeQuota: true } : _c, _e = _d.autoPow, autoPow = _e === void 0 ? false : _e, _f = _d.usePledgeQuota, usePledgeQuota = _f === void 0 ? true : _f;
        var _this = this;
        if (!client) {
            throw new Error(vitejs_error_1.paramsMissing.message + " Client.");
        }
        var _g = privToAddr.newHexAddr(privateKey), pubKey = _g.pubKey, privKey = _g.privKey, hexAddr = _g.hexAddr;
        _this = _super.call(this, { address: hexAddr, client: client }) || this;
        _this.privateKey = privKey;
        _this.publicKey = pubKey;
        _this._lock = true;
        _this._autoReceive = false;
        _this.balance = null;
        _this.autoPow = autoPow;
        _this.usePledgeQuota = usePledgeQuota;
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
    Account.prototype.signAccountBlock = function (accountBlock) {
        return vitejs_accountblock_1.signAccountBlock(accountBlock, this.privateKey);
    };
    Account.prototype.activate = function (intervals, autoPow, usePledgeQuota) {
        var _this = this;
        if (intervals === void 0) { intervals = 2000; }
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
                    _this.autoReceiveTx(intervals, autoPow, usePledgeQuota);
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
    Account.prototype.autoReceiveTx = function (intervals, autoPow, usePledgeQuota) {
        var _this = this;
        if (intervals === void 0) { intervals = 2000; }
        if (this._autoReceive) {
            return;
        }
        this._autoReceive = true;
        var _receive = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, fromBlockHash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.getOnroadBlocks({
                            index: 0,
                            pageCount: 1
                        })];
                    case 1:
                        result = _b.sent();
                        if (!result || !result.length) {
                            return [2, null];
                        }
                        fromBlockHash = result[0].hash;
                        return [2, this.receiveTx(fromBlockHash, autoPow, usePledgeQuota)];
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
        vitejs_utils_1.checkParams({ accountBlock: accountBlock }, ['accountBlock'], [{
                name: 'accountBlock',
                func: function (_a) { return !_a.accountAddress || (_a.accountAddress === _this.address); },
                msg: 'AccountAddress is wrong.'
            }]);
        accountBlock.accountAddress = this.address;
        return this._client.sendRawTx(accountBlock, this.privateKey);
    };
    Account.prototype.sendAutoPowRawTx = function (accountBlock, usePledgeQuota) {
        var _usePledgeQuota = usePledgeQuota === true || usePledgeQuota === false ? usePledgeQuota : !!this.usePledgeQuota;
        return this._client.sendAutoPowRawTx({
            accountBlock: accountBlock,
            privateKey: this.privateKey,
            usePledgeQuota: _usePledgeQuota
        });
    };
    Account.prototype.sendTx = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_sendTxBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.receiveTx = function (fromBlockHash, autoPow, usePledgeQuota) {
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _receiveTxBlock;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            fromBlockHash: fromBlockHash
                        };
                        return [4, this._client.buildinTxBlock.asyncReceiveTx(reqBlock)];
                    case 1:
                        _receiveTxBlock = _b.sent();
                        return [2, this._sendRawTx(_receiveTxBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.SBPreg = function (_b, autoPow, usePledgeQuota) {
        var nodeName = _b.nodeName, toAddress = _b.toAddress, amount = _b.amount, _c = _b.tokenId, tokenId = _c === void 0 ? vitejs_constant_1.Vite_TokenId : _c;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _SBPregBlock;
            return __generator(this, function (_d) {
                switch (_d.label) {
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
                        _SBPregBlock = _d.sent();
                        return [2, this._sendRawTx(_SBPregBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.updateReg = function (_b, autoPow, usePledgeQuota) {
        var nodeName = _b.nodeName, toAddress = _b.toAddress, _c = _b.tokenId, tokenId = _c === void 0 ? vitejs_constant_1.Vite_TokenId : _c;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _updateRegBlock;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            nodeName: nodeName,
                            toAddress: toAddress,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.updateReg(reqBlock)];
                    case 1:
                        _updateRegBlock = _d.sent();
                        return [2, this._sendRawTx(_updateRegBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.revokeReg = function (_b, autoPow, usePledgeQuota) {
        var nodeName = _b.nodeName, _c = _b.tokenId, tokenId = _c === void 0 ? vitejs_constant_1.Vite_TokenId : _c;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _revokeRegBlock;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            nodeName: nodeName,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.revokeReg(reqBlock)];
                    case 1:
                        _revokeRegBlock = _d.sent();
                        return [2, this._sendRawTx(_revokeRegBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.retrieveReward = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_retrieveRewardBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.voting = function (_b, autoPow, usePledgeQuota) {
        var nodeName = _b.nodeName, _c = _b.tokenId, tokenId = _c === void 0 ? vitejs_constant_1.Vite_TokenId : _c;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _votingBlock;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            nodeName: nodeName,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.voting(reqBlock)];
                    case 1:
                        _votingBlock = _d.sent();
                        return [2, this._sendRawTx(_votingBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.revokeVoting = function (_b, autoPow, usePledgeQuota) {
        var _c = (_b === void 0 ? { tokenId: vitejs_constant_1.Vite_TokenId } : _b).tokenId, tokenId = _c === void 0 ? vitejs_constant_1.Vite_TokenId : _c;
        return __awaiter(this, void 0, void 0, function () {
            var reqBlock, _revokeVotingBlock;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        reqBlock = {
                            accountAddress: this.address,
                            tokenId: tokenId
                        };
                        return [4, this._client.buildinTxBlock.revokeVoting(reqBlock)];
                    case 1:
                        _revokeVotingBlock = _d.sent();
                        return [2, this._sendRawTx(_revokeVotingBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.getQuota = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_getQuotaBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.withdrawalOfQuota = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_withdrawalOfQuotaBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.createContract = function (_b, autoPow, usePledgeQuota) {
        var hexCode = _b.hexCode, abi = _b.abi, params = _b.params, confirmTimes = _b.confirmTimes, amount = _b.amount, _c = _b.fee, fee = _c === void 0 ? '10000000000000000000' : _c;
        return __awaiter(this, void 0, void 0, function () {
            var _createContractBlock;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, this._client.buildinTxBlock.createContract({
                            accountAddress: this.address,
                            hexCode: hexCode,
                            abi: abi,
                            params: params,
                            confirmTimes: confirmTimes,
                            amount: amount,
                            fee: fee
                        })];
                    case 1:
                        _createContractBlock = _d.sent();
                        return [2, this._sendRawTx(_createContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.callContract = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.mintage = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.mintageCancelPledge = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.mintageIssue = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.mintageBurn = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.changeTokenType = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.changeTransferOwner = function (_b, autoPow, usePledgeQuota) {
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
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.dexFundUserDeposit = function (_b, autoPow, usePledgeQuota) {
        var tokenId = _b.tokenId, amount = _b.amount;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.dexFundUserDeposit({
                            accountAddress: this.address,
                            tokenId: tokenId,
                            amount: amount
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.dexFundUserWithdraw = function (_b, autoPow, usePledgeQuota) {
        var tokenId = _b.tokenId, amount = _b.amount;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.dexFundUserDeposit({
                            accountAddress: this.address,
                            tokenId: tokenId,
                            amount: amount
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.dexTradeCancelOrder = function (_b, autoPow, usePledgeQuota) {
        var orderId = _b.orderId, tradeToken = _b.tradeToken, side = _b.side, quoteToken = _b.quoteToken;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.dexTradeCancelOrder({
                            accountAddress: this.address,
                            orderId: orderId,
                            tradeToken: tradeToken,
                            side: side,
                            quoteToken: quoteToken
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.dexFundNewOrder = function (_b, autoPow, usePledgeQuota) {
        var tradeToken = _b.tradeToken, quoteToken = _b.quoteToken, side = _b.side, price = _b.price, quantity = _b.quantity;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.dexFundNewOrder({
                            accountAddress: this.address,
                            tradeToken: tradeToken,
                            quoteToken: quoteToken,
                            side: side,
                            price: price,
                            quantity: quantity
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype.dexFundNewMarket = function (_b, autoPow, usePledgeQuota) {
        var tokenId = _b.tokenId, amount = _b.amount, tradeToken = _b.tradeToken, quoteToken = _b.quoteToken;
        return __awaiter(this, void 0, void 0, function () {
            var _callContractBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, this._client.buildinTxBlock.dexFundNewMarket({
                            accountAddress: this.address,
                            tokenId: tokenId,
                            amount: amount,
                            tradeToken: tradeToken,
                            quoteToken: quoteToken
                        })];
                    case 1:
                        _callContractBlock = _c.sent();
                        return [2, this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota)];
                }
            });
        });
    };
    Account.prototype._sendRawTx = function (accountBlock, autoPow, usePledgeQuota) {
        var _autoPow = autoPow === true || autoPow === false ? autoPow : !!this.autoPow;
        if (!_autoPow) {
            return this.sendRawTx(accountBlock);
        }
        return this.sendAutoPowRawTx(accountBlock, usePledgeQuota);
    };
    return Account;
}(vitejs_addraccount_1.default));
exports.default = Account;
