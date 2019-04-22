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
var vitejs_accountblock_1 = require("./../accountblock");
var vitejs_abi_1 = require("./../abi");
var vitejs_privtoaddr_1 = require("./../privtoaddr");
var ledger = vitejs_constant_1.methods.ledger;
var Tx = (function () {
    function Tx(client) {
        this._client = client;
        this.getAccountBlock = {
            sync: vitejs_accountblock_1.getAccountBlock,
            async: this.asyncAccountBlock.bind(this)
        };
        this.receiveTx = {
            sync: vitejs_accountblock_1.getReceiveTxBlock,
            async: this.asyncReceiveTx.bind(this)
        };
        this.sendTx = {
            sync: vitejs_accountblock_1.getSendTxBlock,
            async: this.asyncSendTx.bind(this)
        };
    }
    Tx.prototype.asyncAccountBlock = function (_a) {
        var blockType = _a.blockType, fromBlockHash = _a.fromBlockHash, accountAddress = _a.accountAddress, message = _a.message, data = _a.data, height = _a.height, prevHash = _a.prevHash, toAddress = _a.toAddress, _b = _a.tokenId, tokenId = _b === void 0 ? vitejs_constant_1.Vite_TokenId : _b, amount = _a.amount, fee = _a.fee;
        return __awaiter(this, void 0, void 0, function () {
            var reject, err, latestBlock;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        reject = function (error, errMsg) {
                            if (errMsg === void 0) { errMsg = ''; }
                            var message = error.msg + " " + errMsg;
                            return Promise.reject({
                                code: error.code,
                                message: message
                            });
                        };
                        err = vitejs_accountblock_1.validReqAccountBlock({ blockType: blockType, fromBlockHash: fromBlockHash, accountAddress: accountAddress, message: message, data: data, toAddress: toAddress, amount: amount });
                        if (err) {
                            return [2, reject(err)];
                        }
                        return [4, this._client.request(ledger.getLatestBlock, accountAddress)];
                    case 1:
                        latestBlock = _d.sent();
                        height = latestBlock && latestBlock.height ? latestBlock.height : '';
                        prevHash = latestBlock && latestBlock.hash ? latestBlock.hash : '';
                        return [2, vitejs_accountblock_1.formatAccountBlock({ blockType: blockType, fromBlockHash: fromBlockHash, accountAddress: accountAddress, message: message, data: data, height: height, prevHash: prevHash, toAddress: toAddress, tokenId: tokenId, amount: amount, fee: fee })];
                }
            });
        });
    };
    Tx.prototype.asyncSendTx = function (_a) {
        var accountAddress = _a.accountAddress, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, message = _a.message, height = _a.height, prevHash = _a.prevHash;
        var err = vitejs_utils_1.checkParams({ toAddress: toAddress, tokenId: tokenId, amount: amount }, ['toAddress', 'tokenId', 'amount']);
        if (err) {
            return Promise.reject(err);
        }
        return this.asyncAccountBlock({
            blockType: 2,
            accountAddress: accountAddress,
            toAddress: toAddress,
            tokenId: tokenId,
            amount: amount,
            message: message,
            height: height,
            prevHash: prevHash
        });
    };
    Tx.prototype.asyncReceiveTx = function (_a) {
        var accountAddress = _a.accountAddress, fromBlockHash = _a.fromBlockHash, height = _a.height, prevHash = _a.prevHash;
        var err = vitejs_utils_1.checkParams({ fromBlockHash: fromBlockHash }, ['fromBlockHash']);
        if (err) {
            return Promise.reject(err);
        }
        return this.asyncAccountBlock({
            blockType: 4,
            fromBlockHash: fromBlockHash,
            accountAddress: accountAddress,
            height: height,
            prevHash: prevHash
        });
    };
    Tx.prototype.createContract = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, amount = _a.amount, fee = _a.fee, hexCode = _a.hexCode, abi = _a.abi, params = _a.params, height = _a.height, prevHash = _a.prevHash, _b = _a.confirmTimes, confirmTimes = _b === void 0 ? 0 : _b;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err, block, _d, toAddress, data;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        err = vitejs_utils_1.checkParams({ hexCode: hexCode, abi: abi, tokenId: tokenId, amount: amount, fee: fee, confirmTimes: confirmTimes }, ['hexCode', 'abi', 'tokenId', 'amount', 'fee', 'confirmTimes'], [{
                                name: 'confirmTimes',
                                func: function (_c) { return _c >= 0 && _c <= 75; }
                            }]);
                        if (err) {
                            return [2, Promise.reject(err)];
                        }
                        if (!(requestType === 'async')) return [3, 2];
                        return [4, this.asyncAccountBlock({ blockType: 1, accountAddress: accountAddress, height: height, prevHash: prevHash, tokenId: tokenId, amount: amount, fee: fee })];
                    case 1:
                        _d = _e.sent();
                        return [3, 3];
                    case 2:
                        _d = vitejs_accountblock_1.getAccountBlock({ blockType: 1, accountAddress: accountAddress, height: height, prevHash: prevHash, tokenId: tokenId, amount: amount, fee: fee });
                        _e.label = 3;
                    case 3:
                        block = _d;
                        return [4, this._client.contract.getCreateContractToAddress(accountAddress, block.height, block.prevHash)];
                    case 4:
                        toAddress = _e.sent();
                        data = vitejs_accountblock_1.getCreateContractData({ abi: abi, hexCode: hexCode, params: params, confirmTimes: confirmTimes });
                        block.toAddress = toAddress;
                        block.data = data;
                        return [2, block];
                }
            });
        });
    };
    Tx.prototype.callContract = function (_a, requestType) {
        var accountAddress = _a.accountAddress, toAddress = _a.toAddress, _b = _a.tokenId, tokenId = _b === void 0 ? vitejs_constant_1.Vite_TokenId : _b, amount = _a.amount, abi = _a.abi, methodName = _a.methodName, _d = _a.params, params = _d === void 0 ? [] : _d, fee = _a.fee, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err, data;
            return __generator(this, function (_e) {
                err = vitejs_utils_1.checkParams({ toAddress: toAddress, abi: abi, requestType: requestType }, ['toAddress', 'abi', 'requestType'], [{
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                data = vitejs_abi_1.encodeFunctionCall(abi, params, methodName);
                return [2, this[requestType + "AccountBlock"]({
                        blockType: 2,
                        accountAddress: accountAddress,
                        toAddress: toAddress,
                        data: Buffer.from(data, 'hex').toString('base64'),
                        height: height,
                        fee: fee,
                        prevHash: prevHash,
                        tokenId: tokenId,
                        amount: amount
                    })];
            });
        });
    };
    Tx.prototype.SBPreg = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, toAddress = _a.toAddress, amount = _a.amount, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ toAddress: toAddress, nodeName: nodeName, tokenId: tokenId, amount: amount }, ['toAddress', 'nodeName', 'tokenId', 'amount'], [{
                        name: 'nodeName',
                        func: vitejs_utils_1.validNodeName
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: vitejs_constant_1.Register_Abi,
                        toAddress: vitejs_constant_1.Register_Addr,
                        params: [vitejs_constant_1.Snapshot_Gid, nodeName, toAddress],
                        tokenId: tokenId,
                        amount: amount,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.updateReg = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, toAddress = _a.toAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ toAddress: toAddress, nodeName: nodeName, tokenId: tokenId }, ['toAddress', 'nodeName', 'tokenId'], [{
                        name: 'nodeName',
                        func: vitejs_utils_1.validNodeName
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: vitejs_constant_1.UpdateRegistration_Abi,
                        toAddress: vitejs_constant_1.Register_Addr,
                        params: [vitejs_constant_1.Snapshot_Gid, nodeName, toAddress],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.revokeReg = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ nodeName: nodeName, tokenId: tokenId }, ['nodeName', 'tokenId'], [{
                        name: 'nodeName',
                        func: vitejs_utils_1.validNodeName
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: vitejs_constant_1.CancelRegister_Abi,
                        toAddress: vitejs_constant_1.Register_Addr,
                        params: [vitejs_constant_1.Snapshot_Gid, nodeName],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.retrieveReward = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, toAddress = _a.toAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ toAddress: toAddress, nodeName: nodeName, tokenId: tokenId }, ['toAddress', 'nodeName', 'tokenId'], [{
                        name: 'nodeName',
                        func: vitejs_utils_1.validNodeName
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: vitejs_constant_1.Reward_Abi,
                        toAddress: vitejs_constant_1.Register_Addr,
                        params: [vitejs_constant_1.Snapshot_Gid, nodeName, toAddress],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.voting = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ nodeName: nodeName, tokenId: tokenId }, ['nodeName', 'tokenId'], [{
                        name: 'nodeName',
                        func: vitejs_utils_1.validNodeName
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: vitejs_constant_1.Vote_Abi,
                        toAddress: vitejs_constant_1.Vote_Addr,
                        params: [vitejs_constant_1.Snapshot_Gid, nodeName],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.revokeVoting = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ tokenId: tokenId }, ['tokenId']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: vitejs_constant_1.CancelVote_Abi,
                        toAddress: vitejs_constant_1.Vote_Addr,
                        params: [vitejs_constant_1.Snapshot_Gid],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.getQuota = function (_a, requestType) {
        var accountAddress = _a.accountAddress, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ toAddress: toAddress, tokenId: tokenId, amount: amount }, ['toAddress', 'tokenId', 'amount']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: vitejs_constant_1.Pledge_Abi,
                        toAddress: vitejs_constant_1.Pledge_Addr,
                        params: [toAddress],
                        accountAddress: accountAddress,
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash,
                        amount: amount
                    }, requestType)];
            });
        });
    };
    Tx.prototype.withdrawalOfQuota = function (_a, requestType) {
        var accountAddress = _a.accountAddress, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ toAddress: toAddress, tokenId: tokenId, amount: amount }, ['toAddress', 'tokenId', 'amount']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: vitejs_constant_1.CancelPledge_Abi,
                        toAddress: vitejs_constant_1.Pledge_Addr,
                        params: [toAddress, amount],
                        accountAddress: accountAddress,
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.mintage = function (_a, requestType) {
        var accountAddress = _a.accountAddress, _b = _a.feeType, feeType = _b === void 0 ? 'burn' : _b, tokenName = _a.tokenName, isReIssuable = _a.isReIssuable, maxSupply = _a.maxSupply, ownerBurnOnly = _a.ownerBurnOnly, totalSupply = _a.totalSupply, decimals = _a.decimals, tokenSymbol = _a.tokenSymbol, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err, spendAmount, spendFee, requestBlock;
            return __generator(this, function (_d) {
                err = vitejs_utils_1.checkParams({ tokenName: tokenName, isReIssuable: isReIssuable, maxSupply: maxSupply, ownerBurnOnly: ownerBurnOnly, totalSupply: totalSupply, decimals: decimals, tokenSymbol: tokenSymbol, feeType: feeType }, ['tokenName', 'isReIssuable', 'maxSupply', 'ownerBurnOnly', 'totalSupply', 'decimals', 'tokenSymbol'], [{
                        name: 'feeType',
                        func: function (type) { return type === 'burn' || type === 'stake'; }
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                spendAmount = '100000000000000000000000';
                spendFee = '1000000000000000000000';
                feeType = feeType === 'burn' ? 'fee' : 'amount';
                requestBlock = {
                    abi: vitejs_constant_1.Mint_Abi,
                    toAddress: vitejs_constant_1.Mintage_Addr,
                    params: [isReIssuable, tokenName, tokenSymbol, totalSupply, decimals, maxSupply, ownerBurnOnly],
                    accountAddress: accountAddress,
                    height: height,
                    prevHash: prevHash
                };
                requestBlock[feeType] = feeType === 'fee' ? spendFee : spendAmount;
                return [2, this.callContract(requestBlock, requestType)];
            });
        });
    };
    Tx.prototype.mintageCancelPledge = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ tokenId: tokenId }, ['tokenId']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: vitejs_constant_1.CancelMintPledge_Abi,
                        params: [tokenId],
                        toAddress: vitejs_constant_1.Mintage_Addr,
                        accountAddress: accountAddress,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.mintageIssue = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, amount = _a.amount, beneficial = _a.beneficial, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ tokenId: tokenId, amount: amount, beneficial: beneficial }, ['tokenId', 'amount', 'beneficial']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: vitejs_constant_1.Issue_Abi,
                        toAddress: vitejs_constant_1.Mintage_Addr,
                        params: [tokenId, amount, beneficial],
                        accountAddress: accountAddress,
                        amount: '0',
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.mintageBurn = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, amount = _a.amount, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ amount: amount }, ['amount']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: vitejs_constant_1.Burn_Abi,
                        toAddress: vitejs_constant_1.Mintage_Addr,
                        fee: '0',
                        amount: amount,
                        tokenId: tokenId,
                        accountAddress: accountAddress,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.changeTokenType = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2, this.callContract({
                        abi: vitejs_constant_1.ChangeTokenType_Abi,
                        params: [tokenId],
                        toAddress: vitejs_constant_1.Mintage_Addr,
                        accountAddress: accountAddress,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.changeTransferOwner = function (_a, requestType) {
        var accountAddress = _a.accountAddress, ownerAddress = _a.ownerAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ tokenId: tokenId, ownerAddress: ownerAddress }, ['tokenId', 'ownerAddress']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: vitejs_constant_1.TransferOwner_Abi,
                        toAddress: vitejs_constant_1.Mintage_Addr,
                        params: [tokenId, ownerAddress],
                        accountAddress: accountAddress,
                        height: height,
                        prevHash: prevHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.dexFundUserDeposit = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, amount = _a.amount;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        toAddress: vitejs_constant_1.DexFund_Addr,
                        abi: vitejs_constant_1.DexFundUserDeposit_Abi,
                        tokenId: tokenId,
                        amount: amount,
                        params: []
                    }, requestType)];
            });
        });
    };
    Tx.prototype.dexFundUserWithdraw = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, amount = _a.amount;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        toAddress: vitejs_constant_1.DexFund_Addr,
                        abi: vitejs_constant_1.DexFundUserWithdraw_Abi,
                        params: [tokenId, amount],
                        tokenId: tokenId,
                        amount: '0'
                    }, requestType)];
            });
        });
    };
    Tx.prototype.dexTradeCancelOrder = function (_a, requestType) {
        var accountAddress = _a.accountAddress, orderId = _a.orderId, tradeToken = _a.tradeToken, side = _a.side, quoteToken = _a.quoteToken;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        tokenId: tradeToken,
                        toAddress: vitejs_constant_1.DexTrade_Addr,
                        abi: vitejs_constant_1.DexTradeCancelOrder_Abi,
                        params: ["0x" + Buffer.from(orderId, 'base64').toString('hex'), tradeToken, quoteToken, side]
                    }, requestType)];
            });
        });
    };
    Tx.prototype.dexFundNewOrder = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tradeToken = _a.tradeToken, quoteToken = _a.quoteToken, side = _a.side, price = _a.price, quantity = _a.quantity;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err, orderId;
            return __generator(this, function (_b) {
                err = vitejs_utils_1.checkParams({ tradeToken: tradeToken, quoteToken: quoteToken, side: side, price: price, quantity: quantity }, ['tradeToken', 'quoteToken', 'side', 'price', 'quantity']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                orderId = getOrderId();
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        toAddress: vitejs_constant_1.DexFund_Addr,
                        abi: vitejs_constant_1.DexFundNewOrder_Abi,
                        params: ["0x" + orderId, tradeToken, quoteToken, side, 0, price, quantity],
                        tokenId: tradeToken
                    }, requestType)];
            });
        });
    };
    Tx.prototype.dexFundNewMarket = function (_a, requestType) {
        var accountAddress = _a.accountAddress, _b = _a.tokenId, tokenId = _b === void 0 ? vitejs_constant_1.Vite_TokenId : _b, amount = _a.amount, tradeToken = _a.tradeToken, quoteToken = _a.quoteToken;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_d) {
                err = vitejs_utils_1.checkParams({ tradeToken: tradeToken, quoteToken: quoteToken }, ['tradeToken', 'quoteToken']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        toAddress: vitejs_constant_1.DexFund_Addr,
                        abi: vitejs_constant_1.DexFundNewMarket_Abi,
                        params: [tradeToken, quoteToken],
                        tokenId: tokenId,
                        amount: amount
                    }, requestType)];
            });
        });
    };
    return Tx;
}());
exports.default = Tx;
function getOrderId() {
    return vitejs_privtoaddr_1.newHexAddr().addr;
}
function validReqType(type) {
    return type === 'async' || type === 'sync';
}
