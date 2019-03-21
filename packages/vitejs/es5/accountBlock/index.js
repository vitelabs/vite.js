"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BigNumber = require('bn.js');
var utils_1 = require("utils");
var privToAddr_1 = require("privToAddr");
var error_1 = require("error");
var constant_1 = require("constant");
var builtin_1 = require("./builtin");
var type_1 = require("../type");
var getPublicKey = utils_1.ed25519.getPublicKey, sign = utils_1.ed25519.sign;
var bytesToHex = utils_1.encoder.bytesToHex, blake2b = utils_1.encoder.blake2b;
var checkParams = utils_1.tools.checkParams, getRawTokenid = utils_1.tools.getRawTokenid;
var txType = enumTxType();
function getAccountBlock(_a) {
    var blockType = _a.blockType, fromBlockHash = _a.fromBlockHash, accountAddress = _a.accountAddress, message = _a.message, data = _a.data, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, nonce = _a.nonce;
    var reject = function (error, errMsg) {
        if (errMsg === void 0) { errMsg = ''; }
        var message = (error.message || '') + " " + errMsg;
        console.error(new Error(message));
        return null;
    };
    var err = exports.validReqAccountBlock({ blockType: blockType, fromBlockHash: fromBlockHash, accountAddress: accountAddress, message: message, data: data, toAddress: toAddress, amount: amount });
    if (err) {
        return reject(err);
    }
    if (!snapshotHash) {
        return reject(error_1.paramsMissing, 'SnapshotHash.');
    }
    if (!height && prevHash) {
        return reject(error_1.paramsFormat, 'No height but prevHash.');
    }
    if (height && !prevHash) {
        return reject(error_1.paramsFormat, 'No prevHash but height.');
    }
    return exports.formatAccountBlock({ blockType: blockType, fromBlockHash: fromBlockHash, accountAddress: accountAddress, message: message, data: data, height: height, prevHash: prevHash, snapshotHash: snapshotHash, toAddress: toAddress, tokenId: tokenId, amount: amount, nonce: nonce });
}
exports.getAccountBlock = getAccountBlock;
function getSendTxBlock(_a) {
    var accountAddress = _a.accountAddress, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, message = _a.message, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
    var err = checkParams({ toAddress: toAddress, tokenId: tokenId, amount: amount }, ['toAddress', 'tokenId', 'amount']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    return getAccountBlock({
        blockType: 2,
        accountAddress: accountAddress,
        toAddress: toAddress,
        tokenId: tokenId,
        amount: amount,
        message: message,
        height: height,
        prevHash: prevHash,
        snapshotHash: snapshotHash
    });
}
exports.getSendTxBlock = getSendTxBlock;
function getReceiveTxBlock(_a) {
    var accountAddress = _a.accountAddress, fromBlockHash = _a.fromBlockHash, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash;
    var err = checkParams({ fromBlockHash: fromBlockHash }, ['fromBlockHash']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    return getAccountBlock({
        blockType: 4,
        fromBlockHash: fromBlockHash,
        accountAddress: accountAddress,
        height: height,
        prevHash: prevHash,
        snapshotHash: snapshotHash
    });
}
exports.getReceiveTxBlock = getReceiveTxBlock;
function getBuiltinTxType(toAddress, data, blockType) {
    var defaultType = type_1.BlockType[blockType];
    if (blockType !== 2) {
        return defaultType;
    }
    var _data = Buffer.from(data || '', 'base64').toString('hex');
    var dataPrefix = _data.slice(0, 8);
    var key = dataPrefix + "_" + toAddress;
    var type = txType[key] || defaultType;
    return type;
}
exports.getBuiltinTxType = getBuiltinTxType;
function getBlockHash(accountBlock) {
    var source = '';
    var blockType = Buffer.from([accountBlock.blockType]).toString('hex');
    source += blockType;
    source += accountBlock.prevHash || constant_1.Default_Hash;
    source += accountBlock.height ? bytesToHex(new BigNumber(accountBlock.height).toArray('big', 8)) : '';
    source += accountBlock.accountAddress ? privToAddr_1.getAddrFromHexAddr(accountBlock.accountAddress) : '';
    if (accountBlock.toAddress) {
        source += privToAddr_1.getAddrFromHexAddr(accountBlock.toAddress);
        var amount = new BigNumber(accountBlock.amount);
        source += accountBlock.amount && !amount.isZero() ? bytesToHex(amount.toArray('big')) : '';
        source += accountBlock.tokenId ? getRawTokenid(accountBlock.tokenId) || '' : '';
    }
    else {
        source += accountBlock.fromBlockHash || constant_1.Default_Hash;
    }
    var fee = new BigNumber(accountBlock.fee);
    source += accountBlock.fee && !fee.isZero() ? bytesToHex(fee.toArray('big')) : '';
    source += accountBlock.snapshotHash || '';
    if (accountBlock.data) {
        var hex = Buffer.from(accountBlock.data, 'base64').toString('hex');
        source += hex;
    }
    source += accountBlock.timestamp ? bytesToHex(new BigNumber(accountBlock.timestamp).toArray('big', 8)) : '';
    source += accountBlock.logHash || '';
    source += accountBlock.nonce ? Buffer.from(accountBlock.nonce, 'base64').toString('hex') : '';
    var sourceHex = Buffer.from(source, 'hex');
    var hash = blake2b(sourceHex, null, 32);
    var hashHex = Buffer.from(hash).toString('hex');
    return hashHex;
}
exports.getBlockHash = getBlockHash;
function signAccountBlock(accountBlock, privKey) {
    var hashHex = getBlockHash(accountBlock);
    var _privKey = Buffer.from(privKey, 'hex');
    var pubKey = getPublicKey(_privKey);
    var signature = sign(hashHex, _privKey);
    var _accountBlock = Object.assign({}, accountBlock, {
        hash: hashHex,
        signature: Buffer.from(signature, 'hex').toString('base64'),
        publicKey: Buffer.from(pubKey).toString('base64')
    });
    return _accountBlock;
}
exports.signAccountBlock = signAccountBlock;
exports.formatAccountBlock = builtin_1.formatAccountBlock;
exports.validReqAccountBlock = builtin_1.validReqAccountBlock;
exports.getCreateContractData = builtin_1.getCreateContractData;
function enumTxType() {
    var txType = {};
    txType[constant_1.abiFuncSignature.Register + "_" + constant_1.contractAddrs.Register] = 'SBPreg';
    txType[constant_1.abiFuncSignature.UpdateRegistration + "_" + constant_1.contractAddrs.Register] = 'UpdateReg';
    txType[constant_1.abiFuncSignature.CancelRegister + "_" + constant_1.contractAddrs.Register] = 'RevokeReg';
    txType[constant_1.abiFuncSignature.Reward + "_" + constant_1.contractAddrs.Register] = 'RetrieveReward';
    txType[constant_1.abiFuncSignature.Vote + "_" + constant_1.contractAddrs.Vote] = 'Voting';
    txType[constant_1.abiFuncSignature.CancelVote + "_" + constant_1.contractAddrs.Vote] = 'RevokeVoting';
    txType[constant_1.abiFuncSignature.Pledge + "_" + constant_1.contractAddrs.Quota] = 'GetQuota';
    txType[constant_1.abiFuncSignature.CancelPledge + "_" + constant_1.contractAddrs.Quota] = 'WithdrawalOfQuota';
    txType[constant_1.abiFuncSignature.Mint + "_" + constant_1.contractAddrs.Mintage] = 'Mintage';
    txType[constant_1.abiFuncSignature.Issue + "_" + constant_1.contractAddrs.Mintage] = 'MintageIssue';
    txType[constant_1.abiFuncSignature.Burn + "_" + constant_1.contractAddrs.Mintage] = 'MintageBurn';
    txType[constant_1.abiFuncSignature.TransferOwner + "_" + constant_1.contractAddrs.Mintage] = 'MintageTransferOwner';
    txType[constant_1.abiFuncSignature.ChangeTokenType + "_" + constant_1.contractAddrs.Mintage] = 'MintageChangeTokenType';
    txType[constant_1.abiFuncSignature.Mint_CancelPledge + "_" + constant_1.contractAddrs.Mintage] = 'MintageCancelPledge';
    txType[constant_1.abiFuncSignature.DexFundUserDeposit + "_" + constant_1.contractAddrs.DexFund] = 'DexFundUserDeposit';
    txType[constant_1.abiFuncSignature.DexFundUserWithdraw + "_" + constant_1.contractAddrs.DexFund] = 'DexFundUserWithdraw';
    txType[constant_1.abiFuncSignature.DexFundNewOrder + "_" + constant_1.contractAddrs.DexFund] = 'DexFundNewOrder';
    txType[constant_1.abiFuncSignature.DexTradeCancelOrder + "_" + constant_1.contractAddrs.DexTrade] = 'DexTradeCancelOrder';
    txType[constant_1.abiFuncSignature.DexFundNewMarket + "_" + constant_1.contractAddrs.DexFund] = 'DexFundNewMarket';
    return txType;
}
