"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitejs_constant_1 = require("./../constant");
var address_1 = require("./../wallet/address");
var vitejs_utils_1 = require("./../utils");
var accountBlock_1 = require("./accountBlock");
var utils_1 = require("./utils");
var TransactionClass = (function () {
    function TransactionClass(address) {
        var err = vitejs_utils_1.checkParams({ address: address }, ['address'], [{
                name: 'address',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        this.address = address;
    }
    TransactionClass.prototype.setProvider = function (provider) {
        this.provider = provider;
        return this;
    };
    TransactionClass.prototype.setPrivateKey = function (privateKey) {
        var err = vitejs_utils_1.checkParams({ privateKey: privateKey }, ['privateKey'], [{
                name: 'privateKey',
                func: vitejs_utils_1.isHexString
            }]);
        if (err) {
            throw err;
        }
        var address = address_1.createAddressByPrivateKey(privateKey).address;
        if (address !== this.address) {
            throw new Error('PrivateKey is wrong');
        }
        this.privateKey = privateKey;
        return this;
    };
    TransactionClass.prototype.receive = function (_b) {
        var sendBlockHash = _b.sendBlockHash;
        var err = vitejs_utils_1.checkParams({ sendBlockHash: sendBlockHash }, ['sendBlockHash']);
        if (err) {
            throw err;
        }
        var accountBlock = new accountBlock_1.default({
            blockType: vitejs_constant_1.BlockType.Response,
            address: this.address,
            sendBlockHash: sendBlockHash
        }, this.provider, this.privateKey);
        return accountBlock;
    };
    TransactionClass.prototype.send = function (_b) {
        var toAddress = _b.toAddress, _c = _b.tokenId, tokenId = _c === void 0 ? vitejs_constant_1.Vite_TokenId : _c, _d = _b.amount, amount = _d === void 0 ? '0' : _d, data = _b.data;
        var err = vitejs_utils_1.checkParams({ toAddress: toAddress }, ['toAddress']);
        if (err) {
            throw err;
        }
        var accountBlock = new accountBlock_1.default({
            blockType: vitejs_constant_1.BlockType.TransferRequest,
            address: this.address,
            toAddress: toAddress,
            tokenId: tokenId,
            amount: amount,
            data: data
        }, this.provider, this.privateKey);
        return accountBlock;
    };
    TransactionClass.prototype.createContract = function (_b) {
        var _c = _b.responseLatency, responseLatency = _c === void 0 ? '0' : _c, _d = _b.quotaMultiplier, quotaMultiplier = _d === void 0 ? '10' : _d, _e = _b.randomDegree, randomDegree = _e === void 0 ? '0' : _e, code = _b.code, abi = _b.abi, params = _b.params;
        var err = vitejs_utils_1.checkParams({ abi: abi, responseLatency: responseLatency, quotaMultiplier: quotaMultiplier, randomDegree: randomDegree }, ['responseLatency', 'quotaMultiplier', 'randomDegree'], [{
                name: 'abi',
                func: function (_a) { return vitejs_utils_1.isArray(_a) || vitejs_utils_1.isObject(_a); }
            }]);
        if (err) {
            throw err;
        }
        var data = utils_1.getCreateContractData({
            abi: abi,
            code: code,
            params: params,
            responseLatency: responseLatency,
            quotaMultiplier: quotaMultiplier,
            randomDegree: randomDegree
        });
        return new accountBlock_1.default({
            blockType: vitejs_constant_1.BlockType.CreateContractRequest,
            address: this.address,
            data: data,
            fee: '10000000000000000000',
            tokenId: vitejs_constant_1.Vite_TokenId
        }, this.provider, this.privateKey);
    };
    TransactionClass.prototype.callContract = function (_b) {
        var toAddress = _b.toAddress, _c = _b.tokenId, tokenId = _c === void 0 ? vitejs_constant_1.Vite_TokenId : _c, _d = _b.amount, amount = _d === void 0 ? '0' : _d, _e = _b.fee, fee = _e === void 0 ? '0' : _e, abi = _b.abi, methodName = _b.methodName, _f = _b.params, params = _f === void 0 ? [] : _f;
        var err = vitejs_utils_1.checkParams({ toAddress: toAddress, abi: abi }, ['toAddress', 'abi'], [{
                name: 'address',
                func: function (_a) { return address_1.isValidAddress(_a) === address_1.AddressType.Contract; }
            }]);
        if (err) {
            throw err;
        }
        return new accountBlock_1.default({
            blockType: vitejs_constant_1.BlockType.TransferRequest,
            address: this.address,
            toAddress: toAddress,
            tokenId: tokenId,
            amount: amount,
            fee: fee,
            data: utils_1.getCallContractData({ abi: abi, params: params, methodName: methodName })
        }, this.provider, this.privateKey);
    };
    TransactionClass.prototype.registerSBP = function (_b) {
        var sbpName = _b.sbpName, blockProducingAddress = _b.blockProducingAddress, rewardWithdrawAddress = _b.rewardWithdrawAddress, _c = _b.amount, amount = _c === void 0 ? '1000000000000000000000000' : _c;
        var err = vitejs_utils_1.checkParams({ blockProducingAddress: blockProducingAddress, sbpName: sbpName, rewardWithdrawAddress: rewardWithdrawAddress }, ['blockProducingAddress', 'sbpName', 'rewardWithdrawAddress'], [{
                name: 'sbpName',
                func: vitejs_utils_1.isValidSBPName
            }, {
                name: 'blockProducingAddress',
                func: address_1.isValidAddress
            }, {
                name: 'rewardWithdrawAddress',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.RegisterSBP.abi,
            toAddress: vitejs_constant_1.Contracts.RegisterSBP.contractAddress,
            params: [sbpName, blockProducingAddress, rewardWithdrawAddress],
            tokenId: vitejs_constant_1.Vite_TokenId,
            amount: amount
        });
    };
    TransactionClass.prototype.updateSBPBlockProducingAddress = function (_b) {
        var sbpName = _b.sbpName, blockProducingAddress = _b.blockProducingAddress;
        var err = vitejs_utils_1.checkParams({ blockProducingAddress: blockProducingAddress, sbpName: sbpName }, ['blockProducingAddress', 'sbpName'], [{
                name: 'sbpName',
                func: vitejs_utils_1.isValidSBPName
            }, {
                name: 'blockProducingAddress',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.UpdateSBPBlockProducingAddress.abi,
            toAddress: vitejs_constant_1.Contracts.UpdateSBPBlockProducingAddress.contractAddress,
            params: [sbpName, blockProducingAddress]
        });
    };
    TransactionClass.prototype.UpdateSBPRewardWithdrawAddress = function (_b) {
        var sbpName = _b.sbpName, rewardWithdrawAddress = _b.rewardWithdrawAddress;
        var err = vitejs_utils_1.checkParams({ rewardWithdrawAddress: rewardWithdrawAddress, sbpName: sbpName }, ['rewardWithdrawAddress', 'sbpName'], [{
                name: 'sbpName',
                func: vitejs_utils_1.isValidSBPName
            }, {
                name: 'rewardWithdrawAddress',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.UpdateSBPRewardWithdrawAddress.abi,
            toAddress: vitejs_constant_1.Contracts.UpdateSBPRewardWithdrawAddress.contractAddress,
            params: [sbpName, rewardWithdrawAddress]
        });
    };
    TransactionClass.prototype.revokeSBP = function (_b) {
        var sbpName = _b.sbpName;
        var err = vitejs_utils_1.checkParams({ sbpName: sbpName }, ['sbpName'], [{
                name: 'sbpName',
                func: vitejs_utils_1.isValidSBPName
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.RevokeSBP.abi,
            toAddress: vitejs_constant_1.Contracts.RevokeSBP.contractAddress,
            params: [sbpName]
        });
    };
    TransactionClass.prototype.withdrawSBPReward = function (_b) {
        var sbpName = _b.sbpName, receiveAddress = _b.receiveAddress;
        var err = vitejs_utils_1.checkParams({ sbpName: sbpName, receiveAddress: receiveAddress }, ['sbpName', 'receiveAddress'], [{
                name: 'sbpName',
                func: vitejs_utils_1.isValidSBPName
            }, {
                name: 'receiveAddress',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.WithdrawSBPReward.abi,
            toAddress: vitejs_constant_1.Contracts.WithdrawSBPReward.contractAddress,
            params: [sbpName, receiveAddress]
        });
    };
    TransactionClass.prototype.voteForSBP = function (_b) {
        var sbpName = _b.sbpName;
        var err = vitejs_utils_1.checkParams({ sbpName: sbpName }, ['sbpName'], [{
                name: 'sbpName',
                func: vitejs_utils_1.isValidSBPName
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.VoteForSBP.abi,
            toAddress: vitejs_constant_1.Contracts.VoteForSBP.contractAddress,
            params: [sbpName]
        });
    };
    TransactionClass.prototype.cancelSBPVoting = function () {
        return this.callContract({
            abi: vitejs_constant_1.Contracts.CancelSBPVoting.abi,
            toAddress: vitejs_constant_1.Contracts.CancelSBPVoting.contractAddress,
            params: []
        });
    };
    TransactionClass.prototype.stakeForQuota = function (_b) {
        var beneficiaryAddress = _b.beneficiaryAddress, amount = _b.amount;
        var err = vitejs_utils_1.checkParams({ beneficiaryAddress: beneficiaryAddress, amount: amount }, ['beneficiaryAddress', 'amount'], [{
                name: 'beneficiaryAddress',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.StakeForQuota.abi,
            toAddress: vitejs_constant_1.Contracts.StakeForQuota.contractAddress,
            params: [beneficiaryAddress],
            tokenId: vitejs_constant_1.Vite_TokenId,
            amount: amount
        });
    };
    TransactionClass.prototype.stakeForQuota_V2 = function (_b) {
        var beneficiaryAddress = _b.beneficiaryAddress, amount = _b.amount;
        var err = vitejs_utils_1.checkParams({ beneficiaryAddress: beneficiaryAddress, amount: amount }, ['beneficiaryAddress', 'amount'], [{
                name: 'beneficiaryAddress',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.StakeForQuota_V2.abi,
            toAddress: vitejs_constant_1.Contracts.StakeForQuota_V2.contractAddress,
            params: [beneficiaryAddress],
            tokenId: vitejs_constant_1.Vite_TokenId,
            amount: amount
        });
    };
    TransactionClass.prototype.cancelQuotaStake = function (_b) {
        var id = _b.id;
        var err = vitejs_utils_1.checkParams({ id: id }, ['id']);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.CancelQuotaStake.abi,
            toAddress: vitejs_constant_1.Contracts.CancelQuotaStake.contractAddress,
            params: [id]
        });
    };
    TransactionClass.prototype.cancelQuotaStake_V2 = function (_b) {
        var beneficiaryAddress = _b.beneficiaryAddress, amount = _b.amount;
        var err = vitejs_utils_1.checkParams({ beneficiaryAddress: beneficiaryAddress, amount: amount }, ['beneficiaryAddress', 'amount'], [{
                name: 'beneficiaryAddress',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.CancelQuotaStake_V2.abi,
            toAddress: vitejs_constant_1.Contracts.CancelQuotaStake_V2.contractAddress,
            params: [beneficiaryAddress, amount]
        });
    };
    TransactionClass.prototype.issueToken = function (_b) {
        var tokenName = _b.tokenName, isReIssuable = _b.isReIssuable, maxSupply = _b.maxSupply, isOwnerBurnOnly = _b.isOwnerBurnOnly, totalSupply = _b.totalSupply, decimals = _b.decimals, tokenSymbol = _b.tokenSymbol;
        var err = vitejs_utils_1.checkParams({ tokenName: tokenName, tokenSymbol: tokenSymbol, decimals: decimals }, ['tokenName', 'tokenSymbol', 'decimals']);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.IssueToken.abi,
            toAddress: vitejs_constant_1.Contracts.IssueToken.contractAddress,
            params: [isReIssuable, tokenName, tokenSymbol, totalSupply, decimals, maxSupply, isOwnerBurnOnly],
            fee: '1000000000000000000000'
        });
    };
    TransactionClass.prototype.reIssueToken = function (_b) {
        var tokenId = _b.tokenId, amount = _b.amount, receiveAddress = _b.receiveAddress;
        var err = vitejs_utils_1.checkParams({ tokenId: tokenId, amount: amount, receiveAddress: receiveAddress }, ['tokenId', 'amount', 'receiveAddress'], [{
                name: 'receiveAddress',
                func: address_1.isValidAddress
            }, {
                name: 'amount',
                func: vitejs_utils_1.isNonNegativeInteger,
                msg: 'Amount must be an non-negative integer string.'
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.ReIssueToken.abi,
            toAddress: vitejs_constant_1.Contracts.ReIssueToken.contractAddress,
            params: [tokenId, amount, receiveAddress],
            tokenId: tokenId
        });
    };
    TransactionClass.prototype.burnToken = function (_b) {
        var tokenId = _b.tokenId, amount = _b.amount;
        var err = vitejs_utils_1.checkParams({ tokenId: tokenId, amount: amount }, ['tokenId', 'amount']);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.BurnToken.abi,
            toAddress: vitejs_constant_1.Contracts.BurnToken.contractAddress,
            params: [],
            tokenId: tokenId,
            amount: amount
        });
    };
    TransactionClass.prototype.disableReIssueToken = function (_b) {
        var tokenId = _b.tokenId;
        var err = vitejs_utils_1.checkParams({ tokenId: tokenId }, ['tokenId']);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DisableReIssue.abi,
            toAddress: vitejs_constant_1.Contracts.DisableReIssue.contractAddress,
            params: [tokenId],
            tokenId: tokenId
        });
    };
    TransactionClass.prototype.transferTokenOwnership = function (_b) {
        var newOwnerAddress = _b.newOwnerAddress, tokenId = _b.tokenId;
        var err = vitejs_utils_1.checkParams({ tokenId: tokenId, newOwnerAddress: newOwnerAddress }, ['tokenId', 'newOwnerAddress'], [{
                name: 'newOwnerAddress',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.TransferTokenOwnership.abi,
            toAddress: vitejs_constant_1.Contracts.TransferTokenOwnership.contractAddress,
            params: [tokenId, newOwnerAddress],
            tokenId: tokenId
        });
    };
    TransactionClass.prototype.dexDeposit = function (_b) {
        var tokenId = _b.tokenId, amount = _b.amount;
        var err = vitejs_utils_1.checkParams({ tokenId: tokenId, amount: amount }, ['tokenId', 'amount']);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexDeposit.abi,
            toAddress: vitejs_constant_1.Contracts.DexDeposit.contractAddress,
            params: [],
            tokenId: tokenId,
            amount: amount
        });
    };
    TransactionClass.prototype.dexWithdraw = function (_b) {
        var tokenId = _b.tokenId, amount = _b.amount;
        var err = vitejs_utils_1.checkParams({ tokenId: tokenId, amount: amount }, ['tokenId', 'amount']);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexWithdraw.abi,
            toAddress: vitejs_constant_1.Contracts.DexWithdraw.contractAddress,
            params: [tokenId, amount],
            tokenId: tokenId
        });
    };
    TransactionClass.prototype.dexOpenNewMarket = function (_b) {
        var tradeToken = _b.tradeToken, quoteToken = _b.quoteToken;
        var err = vitejs_utils_1.checkParams({ tradeToken: tradeToken, quoteToken: quoteToken }, ['tradeToken', 'quoteToken'], [{
                name: 'tradeToken',
                func: vitejs_utils_1.isValidTokenId
            }, {
                name: 'quoteToken',
                func: vitejs_utils_1.isValidTokenId
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            toAddress: vitejs_constant_1.Contracts.DexOpenNewMarket.contractAddress,
            abi: vitejs_constant_1.Contracts.DexOpenNewMarket.abi,
            params: [tradeToken, quoteToken]
        });
    };
    TransactionClass.prototype.dexPlaceOrder = function (_b) {
        var tradeToken = _b.tradeToken, quoteToken = _b.quoteToken, side = _b.side, price = _b.price, quantity = _b.quantity, _c = _b.orderType, orderType = _c === void 0 ? '0' : _c;
        var err = vitejs_utils_1.checkParams({ tradeToken: tradeToken, quoteToken: quoteToken, side: side, price: price, quantity: quantity }, ['tradeToken', 'quoteToken', 'side', 'price', 'quantity'], [{
                name: 'tradeToken',
                func: vitejs_utils_1.isValidTokenId
            }, {
                name: 'quoteToken',
                func: vitejs_utils_1.isValidTokenId
            }, {
                name: 'side',
                func: function (_s) { return "" + _s === '1' || "" + _s === '0'; }
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexPlaceOrder.abi,
            toAddress: vitejs_constant_1.Contracts.DexPlaceOrder.contractAddress,
            params: [tradeToken, quoteToken, side, orderType, price, quantity],
            tokenId: tradeToken
        });
    };
    TransactionClass.prototype.dexCancelOrder = function (_b) {
        var orderId = _b.orderId;
        var err = vitejs_utils_1.checkParams({ orderId: orderId }, ['orderId'], [{
                name: 'orderId',
                func: function (_o) { return vitejs_utils_1.isHexString(_o) || vitejs_utils_1.isBase64String(_o); }
            }]);
        if (err) {
            throw err;
        }
        if (vitejs_utils_1.isBase64String(orderId)) {
            orderId = Buffer.from(orderId, 'base64').toString('hex');
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexCancelOrder.abi,
            toAddress: vitejs_constant_1.Contracts.DexCancelOrder.contractAddress,
            params: ["0x" + orderId]
        });
    };
    TransactionClass.prototype.dexStakeForMining = function (_b) {
        var actionType = _b.actionType, amount = _b.amount;
        var err = vitejs_utils_1.checkParams({ actionType: actionType, amount: amount }, ['actionType', 'amount'], [{
                name: 'actionType',
                func: function (_a) { return Number(actionType) === 1 || Number(actionType) === 2; }
            }, {
                name: 'amount',
                func: vitejs_utils_1.isNonNegativeInteger,
                msg: 'Amount must be an non-negative integer string.'
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexStakeForMining.abi,
            toAddress: vitejs_constant_1.Contracts.DexStakeForMining.contractAddress,
            params: [actionType, amount]
        });
    };
    TransactionClass.prototype.dexStakeForVIP = function (_b) {
        var actionType = _b.actionType;
        var err = vitejs_utils_1.checkParams({ actionType: actionType }, ['actionType'], [{
                name: 'actionType',
                func: function (_a) { return Number(actionType) === 1 || Number(actionType) === 2; }
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexStakeForVIP.abi,
            toAddress: vitejs_constant_1.Contracts.DexStakeForVIP.contractAddress,
            params: [actionType]
        });
    };
    TransactionClass.prototype.dexMarketAdminConfig = function (_b) {
        var operationCode = _b.operationCode, tradeToken = _b.tradeToken, quoteToken = _b.quoteToken, marketOwner = _b.marketOwner, takerFeeRate = _b.takerFeeRate, makerFeeRate = _b.makerFeeRate, _c = _b.stopMarket, stopMarket = _c === void 0 ? false : _c;
        var err = vitejs_utils_1.checkParams({ operationCode: operationCode, tradeToken: tradeToken, quoteToken: quoteToken, marketOwner: marketOwner, takerFeeRate: takerFeeRate, makerFeeRate: makerFeeRate }, ['operationCode', 'tradeToken', 'quoteToken', 'marketOwner', 'takerFeeRate', 'makerFeeRate'], [{
                name: 'tradeToken',
                func: vitejs_utils_1.isValidTokenId
            }, {
                name: 'quoteToken',
                func: vitejs_utils_1.isValidTokenId
            }, {
                name: 'marketOwner',
                func: address_1.isValidAddress
            }, {
                name: 'operationCode',
                func: function (_o) { return _o >= 1 && _o <= 15; }
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexMarketAdminConfig.abi,
            toAddress: vitejs_constant_1.Contracts.DexMarketAdminConfig.contractAddress,
            params: [operationCode, tradeToken, quoteToken, marketOwner, takerFeeRate, makerFeeRate, !!stopMarket],
            tokenId: quoteToken
        });
    };
    TransactionClass.prototype.dexTransferTokenOwnership = function (_b) {
        var tokenId = _b.tokenId, newOwner = _b.newOwner;
        var err = vitejs_utils_1.checkParams({ tokenId: tokenId, newOwner: newOwner }, ['tokenId', 'newOwner'], [{
                name: 'newOwner',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexTransferTokenOwnership.abi,
            toAddress: vitejs_constant_1.Contracts.DexTransferTokenOwnership.contractAddress,
            params: [tokenId, newOwner],
            tokenId: tokenId
        });
    };
    TransactionClass.prototype.dexCreateNewInviter = function () {
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexCreateNewInviter.abi,
            toAddress: vitejs_constant_1.Contracts.DexCreateNewInviter.contractAddress,
            params: []
        });
    };
    TransactionClass.prototype.dexBindInviteCode = function (_b) {
        var code = _b.code;
        var err = vitejs_utils_1.checkParams({ code: code }, ['code']);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexBindInviteCode.abi,
            toAddress: vitejs_constant_1.Contracts.DexBindInviteCode.contractAddress,
            params: [code]
        });
    };
    TransactionClass.prototype.dexStakeForSuperVIP = function (_b) {
        var actionType = _b.actionType;
        var err = vitejs_utils_1.checkParams({ actionType: actionType }, ['actionType'], [{
                name: 'actionType',
                func: function (_a) { return Number(_a) === 1 || Number(_a) === 2; }
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexStakeForSuperVIP.abi,
            toAddress: vitejs_constant_1.Contracts.DexStakeForSuperVIP.contractAddress,
            params: [actionType]
        });
    };
    TransactionClass.prototype.dexConfigMarketAgents = function (_b) {
        var actionType = _b.actionType, agent = _b.agent, tradeTokens = _b.tradeTokens, quoteTokens = _b.quoteTokens;
        var err = vitejs_utils_1.checkParams({ actionType: actionType, agent: agent, tradeTokens: tradeTokens, quoteTokens: quoteTokens }, ['actionType', 'agent', 'tradeTokens', 'quoteTokens'], [{
                name: 'actionType',
                func: function (_a) { return Number(_a) === 1 || Number(_a) === 2; }
            }, {
                name: 'agent',
                func: address_1.isValidAddress
            }, {
                name: 'tradeTokens',
                func: function (_t) {
                    for (var i = 0; i < _t.length; i++) {
                        if (!vitejs_utils_1.isValidTokenId(_t[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }, {
                name: 'quoteTokens',
                func: function (_t) {
                    for (var i = 0; i < _t.length; i++) {
                        if (!vitejs_utils_1.isValidTokenId(_t[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexConfigMarketAgents.abi,
            toAddress: vitejs_constant_1.Contracts.DexConfigMarketAgents.contractAddress,
            params: [actionType, agent, tradeTokens, quoteTokens]
        });
    };
    TransactionClass.prototype.dexLockVxForDividend = function (_b) {
        var actionType = _b.actionType, amount = _b.amount;
        var err = vitejs_utils_1.checkParams({ actionType: actionType, amount: amount }, ['actionType', 'amount'], [{
                name: 'actionType',
                func: function (_a) { return Number(actionType) === 1 || Number(actionType) === 2; }
            }, {
                name: 'amount',
                func: vitejs_utils_1.isNonNegativeInteger,
                msg: 'Amount must be an non-negative integer string.'
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexLockVxForDividend.abi,
            toAddress: vitejs_constant_1.Contracts.DexLockVxForDividend.contractAddress,
            params: [actionType, amount]
        });
    };
    TransactionClass.prototype.dexSwitchConfig = function (_b) {
        var switchType = _b.switchType, enable = _b.enable;
        var err = vitejs_utils_1.checkParams({ switchType: switchType, enable: enable }, ['switchType', 'enable']);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexSwitchConfig.abi,
            toAddress: vitejs_constant_1.Contracts.DexSwitchConfig.contractAddress,
            params: [switchType, enable]
        });
    };
    TransactionClass.prototype.dexStakeForPrincipalSVIP = function (_b) {
        var principal = _b.principal;
        var err = vitejs_utils_1.checkParams({ principal: principal }, ['principal'], [{
                name: 'principal',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexStakeForPrincipalSVIP.abi,
            toAddress: vitejs_constant_1.Contracts.DexStakeForPrincipalSVIP.contractAddress,
            params: [principal]
        });
    };
    TransactionClass.prototype.dexCancelStakeById = function (_b) {
        var id = _b.id;
        var err = vitejs_utils_1.checkParams({ id: id }, ['id'], [{
                name: 'id',
                func: vitejs_utils_1.isHexString
            }]);
        if (err) {
            throw err;
        }
        return this.callContract({
            abi: vitejs_constant_1.Contracts.DexCancelStakeById.abi,
            toAddress: vitejs_constant_1.Contracts.DexCancelStakeById.contractAddress,
            params: [id]
        });
    };
    return TransactionClass;
}());
exports.Transaction = TransactionClass;
exports.default = TransactionClass;
