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
var constant_1 = require("constant");
var utils_1 = require("utils");
var error_1 = require("error");
var accountBlock_1 = require("accountBlock");
var abi_1 = require("abi");
var checkParams = utils_1.tools.checkParams, validNodeName = utils_1.tools.validNodeName;
var Tx = (function () {
    function Tx(client) {
        this._client = client;
        this.getAccountBlock = {
            sync: accountBlock_1.getAccountBlock,
            async: this.asyncAccountBlock.bind(this)
        };
        this.receiveTx = {
            sync: accountBlock_1.getReceiveTxBlock,
            async: this.asyncReceiveTx.bind(this)
        };
        this.sendTx = {
            sync: accountBlock_1.getSendTxBlock,
            async: this.asyncSendTx.bind(this)
        };
    }
    Tx.prototype.asyncAccountBlock = function (_a) {
        var blockType = _a.blockType, fromBlockHash = _a.fromBlockHash, accountAddress = _a.accountAddress, message = _a.message, data = _a.data, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash, toAddress = _a.toAddress, _b = _a.tokenId, tokenId = _b === void 0 ? constant_1.Vite_TokenId : _b, amount = _a.amount, fee = _a.fee;
        return __awaiter(this, void 0, void 0, function () {
            var reject, err, requests, req, latestBlock;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reject = function (error, errMsg) {
                            if (errMsg === void 0) { errMsg = ''; }
                            var message = error.msg + " " + errMsg;
                            return Promise.reject({
                                code: error.code,
                                message: message
                            });
                        };
                        err = accountBlock_1.validReqAccountBlock({ blockType: blockType, fromBlockHash: fromBlockHash, accountAddress: accountAddress, message: message, data: data, toAddress: toAddress, amount: amount });
                        if (err) {
                            return [2, reject(err)];
                        }
                        requests = [];
                        if (!height || !prevHash) {
                            requests.push({
                                methodName: 'ledger_getLatestBlock',
                                params: [accountAddress]
                            });
                        }
                        if (!snapshotHash) {
                            requests.push({
                                methodName: 'ledger_getFittestSnapshotHash',
                                params: [accountAddress, fromBlockHash]
                            });
                        }
                        if (!requests) {
                            return [2, reject(error_1.no)];
                        }
                        return [4, this._client.batch(requests)];
                    case 1:
                        req = _c.sent();
                        requests.forEach(function (_r, index) {
                            if (_r.methodName === 'ledger_getLatestBlock') {
                                latestBlock = req[index].result;
                                return;
                            }
                            snapshotHash = req[index].result;
                        });
                        height = latestBlock && latestBlock.height ? latestBlock.height : '';
                        prevHash = latestBlock && latestBlock.hash ? latestBlock.hash : '';
                        return [2, accountBlock_1.formatAccountBlock({ blockType: blockType, fromBlockHash: fromBlockHash, accountAddress: accountAddress, message: message, data: data, height: height, prevHash: prevHash, snapshotHash: snapshotHash, toAddress: toAddress, tokenId: tokenId, amount: amount, fee: fee })];
                }
            });
        });
    };
    Tx.prototype.createContract = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, amount = _a.amount, fee = _a.fee, hexCode = _a.hexCode, abi = _a.abi, params = _a.params, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err, block, _b, toAddress;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        err = checkParams({ hexCode: hexCode, abi: abi, tokenId: tokenId, amount: amount, fee: fee }, ['hexCode', 'abi', 'tokenId', 'amount', 'fee']);
                        if (err) {
                            return [2, Promise.reject(err)];
                        }
                        if (!(requestType === 'async')) return [3, 2];
                        return [4, this.asyncAccountBlock({ blockType: 1, accountAddress: accountAddress, height: height, prevHash: prevHash, snapshotHash: snapshotHash, tokenId: tokenId, amount: amount, fee: fee })];
                    case 1:
                        _b = _c.sent();
                        return [3, 3];
                    case 2:
                        _b = accountBlock_1.getAccountBlock({ blockType: 1, accountAddress: accountAddress, height: height, prevHash: prevHash, snapshotHash: snapshotHash, tokenId: tokenId, amount: amount, fee: fee });
                        _c.label = 3;
                    case 3:
                        block = _b;
                        return [4, this._client.contract.getCreateContractToAddress(accountAddress, block.height, block.prevHash, block.snapshotHash)];
                    case 4:
                        toAddress = _c.sent();
                        block.toAddress = toAddress;
                        block.data = accountBlock_1.getCreateContractData({ abi: abi, hexCode: hexCode, params: params });
                        return [2, block];
                }
            });
        });
    };
    Tx.prototype.callContract = function (_a, requestType) {
        var accountAddress = _a.accountAddress, toAddress = _a.toAddress, _b = _a.tokenId, tokenId = _b === void 0 ? constant_1.Vite_TokenId : _b, amount = _a.amount, abi = _a.abi, methodName = _a.methodName, _c = _a.params, params = _c === void 0 ? [] : _c, fee = _a.fee, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err, data;
            return __generator(this, function (_d) {
                err = checkParams({ toAddress: toAddress, abi: abi }, ['toAddress', 'abi']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                data = abi_1.encodeFunctionCall(abi, params, methodName);
                return [2, this[requestType + "AccountBlock"]({
                        blockType: 2,
                        accountAddress: accountAddress,
                        toAddress: toAddress,
                        data: Buffer.from(data, 'hex').toString('base64'),
                        height: height,
                        fee: fee,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash,
                        tokenId: tokenId,
                        amount: amount
                    })];
            });
        });
    };
    Tx.prototype.asyncSendTx = function (_a) {
        var accountAddress = _a.accountAddress, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, message = _a.message, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ toAddress: toAddress, tokenId: tokenId, amount: amount }, ['toAddress', 'tokenId', 'amount']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.asyncAccountBlock({
                        blockType: 2,
                        accountAddress: accountAddress,
                        toAddress: toAddress,
                        tokenId: tokenId,
                        amount: amount,
                        message: message,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    })];
            });
        });
    };
    Tx.prototype.asyncReceiveTx = function (_a) {
        var accountAddress = _a.accountAddress, fromBlockHash = _a.fromBlockHash, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ fromBlockHash: fromBlockHash }, ['fromBlockHash']);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.asyncAccountBlock({
                        blockType: 4,
                        fromBlockHash: fromBlockHash,
                        accountAddress: accountAddress,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    })];
            });
        });
    };
    Tx.prototype.SBPreg = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, toAddress = _a.toAddress, amount = _a.amount, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ toAddress: toAddress, nodeName: nodeName, tokenId: tokenId, amount: amount, requestType: requestType }, ['toAddress', 'nodeName', 'tokenId', 'amount'], [{
                        name: 'nodeName',
                        func: validNodeName
                    }, {
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: constant_1.Register_Abi,
                        toAddress: constant_1.Register_Addr,
                        params: [constant_1.Snapshot_Gid, nodeName, toAddress],
                        tokenId: tokenId,
                        amount: amount,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.updateReg = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, toAddress = _a.toAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ toAddress: toAddress, nodeName: nodeName, tokenId: tokenId, requestType: requestType }, ['toAddress', 'nodeName', 'tokenId'], [{
                        name: 'nodeName',
                        func: validNodeName
                    }, {
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: constant_1.UpdateRegistration_Abi,
                        toAddress: constant_1.Register_Addr,
                        params: [constant_1.Snapshot_Gid, nodeName, toAddress],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.revokeReg = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ nodeName: nodeName, tokenId: tokenId, requestType: requestType }, ['nodeName', 'tokenId'], [{
                        name: 'nodeName',
                        func: validNodeName
                    }, {
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: constant_1.CancelRegister_Abi,
                        toAddress: constant_1.Register_Addr,
                        params: [constant_1.Snapshot_Gid, nodeName],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.retrieveReward = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, toAddress = _a.toAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ toAddress: toAddress, nodeName: nodeName, tokenId: tokenId, requestType: requestType }, ['toAddress', 'nodeName', 'tokenId'], [{
                        name: 'nodeName',
                        func: validNodeName
                    }, {
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: constant_1.Reward_Abi,
                        toAddress: constant_1.Register_Addr,
                        params: [constant_1.Snapshot_Gid, nodeName, toAddress],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.voting = function (_a, requestType) {
        var accountAddress = _a.accountAddress, nodeName = _a.nodeName, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ nodeName: nodeName, tokenId: tokenId, requestType: requestType }, ['nodeName', 'tokenId'], [{
                        name: 'nodeName',
                        func: validNodeName
                    }, {
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: constant_1.Vote_Abi,
                        toAddress: constant_1.Vote_Addr,
                        params: [constant_1.Snapshot_Gid, nodeName],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.revokeVoting = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ tokenId: tokenId, requestType: requestType }, ['tokenId'], [{
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        accountAddress: accountAddress,
                        abi: constant_1.CancelVote_Abi,
                        toAddress: constant_1.Vote_Addr,
                        params: [constant_1.Snapshot_Gid],
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.getQuota = function (_a, requestType) {
        var accountAddress = _a.accountAddress, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ toAddress: toAddress, tokenId: tokenId, amount: amount, requestType: requestType }, ['toAddress', 'tokenId', 'amount'], [{
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: constant_1.Pledge_Abi,
                        toAddress: constant_1.Quota_Addr,
                        params: [toAddress],
                        accountAddress: accountAddress,
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash,
                        amount: amount
                    }, requestType)];
            });
        });
    };
    Tx.prototype.withdrawalOfQuota = function (_a, requestType) {
        var accountAddress = _a.accountAddress, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ toAddress: toAddress, tokenId: tokenId, amount: amount, requestType: requestType }, ['toAddress', 'tokenId', 'amount'], [{
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: constant_1.CancelPledge_Abi,
                        toAddress: constant_1.Quota_Addr,
                        params: [toAddress, amount],
                        accountAddress: accountAddress,
                        tokenId: tokenId,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.mintage = function (_a, requestType) {
        var accountAddress = _a.accountAddress, _b = _a.feeType, feeType = _b === void 0 ? 'burn' : _b, tokenName = _a.tokenName, isReIssuable = _a.isReIssuable, maxSupply = _a.maxSupply, ownerBurnOnly = _a.ownerBurnOnly, totalSupply = _a.totalSupply, decimals = _a.decimals, tokenSymbol = _a.tokenSymbol, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err, spendAmount, spendFee, requestBlock, block, _c, tokenId, data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        err = checkParams({ tokenName: tokenName, isReIssuable: isReIssuable, maxSupply: maxSupply, ownerBurnOnly: ownerBurnOnly, totalSupply: totalSupply, decimals: decimals, tokenSymbol: tokenSymbol, requestType: requestType, feeType: feeType }, ['tokenName', 'isReIssuable', 'maxSupply', 'ownerBurnOnly', 'totalSupply', 'decimals', 'tokenSymbol'], [{ name: 'requestType', func: validReqType },
                            {
                                name: 'feeType',
                                func: function (type) { return type === 'burn' || type === 'stake'; }
                            }
                        ]);
                        if (err) {
                            return [2, Promise.reject(err)];
                        }
                        spendAmount = '100000000000000000000000';
                        spendFee = '1000000000000000000000';
                        feeType = feeType === 'burn' ? 'fee' : 'amount';
                        requestBlock = { blockType: 2, toAddress: constant_1.Mintage_Addr, accountAddress: accountAddress, height: height, prevHash: prevHash, snapshotHash: snapshotHash };
                        requestBlock[feeType] = feeType === 'fee' ? spendFee : spendAmount;
                        if (!(requestType === 'async')) return [3, 2];
                        return [4, this.asyncAccountBlock(requestBlock)];
                    case 1:
                        _c = _d.sent();
                        return [3, 3];
                    case 2:
                        _c = accountBlock_1.getAccountBlock(requestBlock);
                        _d.label = 3;
                    case 3:
                        block = _c;
                        return [4, this._client.mintage.newTokenId({
                                selfAddr: accountAddress,
                                height: block.height,
                                prevHash: block.prevHash,
                                snapshotHash: block.snapshotHash
                            })];
                    case 4:
                        tokenId = _d.sent();
                        data = abi_1.encodeFunctionCall(constant_1.Mint_Abi, [isReIssuable, tokenId, tokenName, tokenSymbol, totalSupply, decimals, maxSupply, ownerBurnOnly]);
                        block.data = Buffer.from(data, 'hex').toString('base64');
                        return [2, block];
                }
            });
        });
    };
    Tx.prototype.mintageCancelPledge = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ tokenId: tokenId }, ['tokenId'], [{ name: 'requestType', func: validReqType }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: constant_1.Mint_CancelPledge_Abi,
                        params: [tokenId],
                        toAddress: constant_1.Mintage_Addr,
                        accountAddress: accountAddress,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.mintageIssue = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, amount = _a.amount, beneficial = _a.beneficial, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ tokenId: tokenId, amount: amount, beneficial: beneficial, requestType: requestType }, ['tokenId', 'amount', 'beneficial'], [{
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: constant_1.Issue_Abi,
                        toAddress: constant_1.Mintage_Addr,
                        params: [tokenId, amount, beneficial],
                        accountAddress: accountAddress,
                        amount: '0',
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.mintageBurn = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, amount = _a.amount, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ amount: amount, requestType: requestType }, ['amount'], [{ name: 'requestType', func: validReqType }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: constant_1.Burn_Abi,
                        toAddress: constant_1.Mintage_Addr,
                        fee: '0',
                        amount: amount,
                        tokenId: tokenId,
                        accountAddress: accountAddress,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.changeTokenType = function (_a, requestType) {
        var accountAddress = _a.accountAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2, this.callContract({
                        abi: constant_1.ChangeTokenType_Abi,
                        params: [tokenId],
                        toAddress: constant_1.Mintage_Addr,
                        accountAddress: accountAddress,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    Tx.prototype.changeTransferOwner = function (_a, requestType) {
        var accountAddress = _a.accountAddress, ownerAddress = _a.ownerAddress, tokenId = _a.tokenId, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
        if (requestType === void 0) { requestType = 'async'; }
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_b) {
                err = checkParams({ tokenId: tokenId, ownerAddress: ownerAddress, requestType: requestType }, ['tokenId', 'ownerAddress'], [{
                        name: 'requestType',
                        func: validReqType
                    }]);
                if (err) {
                    return [2, Promise.reject(err)];
                }
                return [2, this.callContract({
                        abi: constant_1.TransferOwner_Abi,
                        toAddress: constant_1.Mintage_Addr,
                        params: [tokenId, ownerAddress],
                        accountAddress: accountAddress,
                        height: height,
                        prevHash: prevHash,
                        snapshotHash: snapshotHash
                    }, requestType)];
            });
        });
    };
    return Tx;
}());
exports.default = Tx;
function validReqType(type) {
    return type === 'async' || type === 'sync';
}
