"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BigNumber = require('bn.js');
var vitejs_utils_1 = require("./../utils");
var vitejs_privtoaddr_1 = require("./../privtoaddr");
var vitejs_error_1 = require("./../error");
var vitejs_constant_1 = require("./../constant");
var builtin_1 = require("./builtin");
var type_1 = require("../type");
var getPublicKey = vitejs_utils_1.ed25519.getPublicKey, sign = vitejs_utils_1.ed25519.sign;
var txType = enumTxType();
function getAccountBlock(_a) {
    var blockType = _a.blockType, fromBlockHash = _a.fromBlockHash, accountAddress = _a.accountAddress, message = _a.message, data = _a.data, height = _a.height, prevHash = _a.prevHash, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, nonce = _a.nonce;
    var reject = function (error, errMsg) {
        if (errMsg === void 0) { errMsg = ''; }
        var message = (error.message || '') + " " + errMsg;
        throw new Error(message);
    };
    var err = builtin_1.validReqAccountBlock({ blockType: blockType, fromBlockHash: fromBlockHash, accountAddress: accountAddress, message: message, data: data, toAddress: toAddress, amount: amount });
    if (err) {
        return reject(err);
    }
    if (!height && prevHash) {
        return reject(vitejs_error_1.paramsFormat, 'No height but prevHash.');
    }
    if (height && !prevHash) {
        return reject(vitejs_error_1.paramsFormat, 'No prevHash but height.');
    }
    return builtin_1.formatAccountBlock({ blockType: blockType, fromBlockHash: fromBlockHash, accountAddress: accountAddress, message: message, data: data, height: height, prevHash: prevHash, toAddress: toAddress, tokenId: tokenId, amount: amount, nonce: nonce });
}
exports.getAccountBlock = getAccountBlock;
function getSendTxBlock(_a) {
    var accountAddress = _a.accountAddress, toAddress = _a.toAddress, tokenId = _a.tokenId, amount = _a.amount, message = _a.message, data = _a.data, height = _a.height, prevHash = _a.prevHash;
    var err = vitejs_utils_1.checkParams({ toAddress: toAddress, tokenId: tokenId, amount: amount }, ['toAddress', 'tokenId', 'amount']);
    if (err) {
        throw new Error(err.message);
    }
    return getAccountBlock({
        blockType: 2,
        accountAddress: accountAddress,
        toAddress: toAddress,
        tokenId: tokenId,
        amount: amount,
        message: message,
        data: data,
        height: height,
        prevHash: prevHash
    });
}
exports.getSendTxBlock = getSendTxBlock;
function getReceiveTxBlock(_a) {
    var accountAddress = _a.accountAddress, fromBlockHash = _a.fromBlockHash, height = _a.height, prevHash = _a.prevHash;
    var err = vitejs_utils_1.checkParams({ fromBlockHash: fromBlockHash }, ['fromBlockHash']);
    if (err) {
        throw new Error(err.message);
    }
    return getAccountBlock({
        blockType: 4,
        fromBlockHash: fromBlockHash,
        accountAddress: accountAddress,
        height: height,
        prevHash: prevHash
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
    source += accountBlock.prevHash || vitejs_constant_1.Default_Hash;
    source += accountBlock.height ? vitejs_utils_1.bytesToHex(new BigNumber(accountBlock.height).toArray('big', 8)) : '';
    source += accountBlock.accountAddress ? vitejs_privtoaddr_1.getAddrFromHexAddr(accountBlock.accountAddress) : '';
    if (accountBlock.toAddress) {
        source += vitejs_privtoaddr_1.getAddrFromHexAddr(accountBlock.toAddress);
        source += getNumberHex(accountBlock.amount);
        source += accountBlock.tokenId ? vitejs_utils_1.getRawTokenId(accountBlock.tokenId) || '' : '';
    }
    else {
        source += accountBlock.fromBlockHash || vitejs_constant_1.Default_Hash;
    }
    if (accountBlock.data) {
        var hex = vitejs_utils_1.blake2bHex(Buffer.from(accountBlock.data, 'base64'), null, 32);
        source += hex;
    }
    source += getNumberHex(accountBlock.fee);
    source += accountBlock.logHash || '';
    source += getNonceHex(accountBlock.nonce);
    var sendBlockList = accountBlock.sendBlockList || [];
    sendBlockList.forEach(function (block) {
        source += block.hash;
    });
    var sourceHex = Buffer.from(source, 'hex');
    var hash = vitejs_utils_1.blake2b(sourceHex, null, 32);
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
function enumTxType() {
    var txType = {};
    txType[vitejs_constant_1.abiFuncSignature.Register + "_" + vitejs_constant_1.contractAddrs.Register] = 'SBPreg';
    txType[vitejs_constant_1.abiFuncSignature.UpdateRegistration + "_" + vitejs_constant_1.contractAddrs.Register] = 'UpdateReg';
    txType[vitejs_constant_1.abiFuncSignature.CancelRegister + "_" + vitejs_constant_1.contractAddrs.Register] = 'RevokeReg';
    txType[vitejs_constant_1.abiFuncSignature.Reward + "_" + vitejs_constant_1.contractAddrs.Register] = 'RetrieveReward';
    txType[vitejs_constant_1.abiFuncSignature.Vote + "_" + vitejs_constant_1.contractAddrs.Vote] = 'Voting';
    txType[vitejs_constant_1.abiFuncSignature.CancelVote + "_" + vitejs_constant_1.contractAddrs.Vote] = 'RevokeVoting';
    txType[vitejs_constant_1.abiFuncSignature.Pledge + "_" + vitejs_constant_1.contractAddrs.Pledge] = 'GetQuota';
    txType[vitejs_constant_1.abiFuncSignature.CancelPledge + "_" + vitejs_constant_1.contractAddrs.Pledge] = 'WithdrawalOfQuota';
    txType[vitejs_constant_1.abiFuncSignature.Mint + "_" + vitejs_constant_1.contractAddrs.Mintage] = 'Mintage';
    txType[vitejs_constant_1.abiFuncSignature.Issue + "_" + vitejs_constant_1.contractAddrs.Mintage] = 'MintageIssue';
    txType[vitejs_constant_1.abiFuncSignature.Burn + "_" + vitejs_constant_1.contractAddrs.Mintage] = 'MintageBurn';
    txType[vitejs_constant_1.abiFuncSignature.TransferOwner + "_" + vitejs_constant_1.contractAddrs.Mintage] = 'MintageTransferOwner';
    txType[vitejs_constant_1.abiFuncSignature.ChangeTokenType + "_" + vitejs_constant_1.contractAddrs.Mintage] = 'MintageChangeTokenType';
    txType[vitejs_constant_1.abiFuncSignature.CancelMintPledge + "_" + vitejs_constant_1.contractAddrs.Mintage] = 'MintageCancelPledge';
    txType[vitejs_constant_1.abiFuncSignature.DexFundUserDeposit + "_" + vitejs_constant_1.contractAddrs.DexFund] = 'DexFundUserDeposit';
    txType[vitejs_constant_1.abiFuncSignature.DexFundUserWithdraw + "_" + vitejs_constant_1.contractAddrs.DexFund] = 'DexFundUserWithdraw';
    txType[vitejs_constant_1.abiFuncSignature.DexFundNewOrder + "_" + vitejs_constant_1.contractAddrs.DexFund] = 'DexFundNewOrder';
    txType[vitejs_constant_1.abiFuncSignature.DexTradeCancelOrder + "_" + vitejs_constant_1.contractAddrs.DexTrade] = 'DexTradeCancelOrder';
    txType[vitejs_constant_1.abiFuncSignature.DexFundNewMarket + "_" + vitejs_constant_1.contractAddrs.DexFund] = 'DexFundNewMarket';
    return txType;
}
function leftPadBytes(bytesData, len) {
    if (bytesData && len - bytesData.length < 0) {
        return bytesData.toString('hex');
    }
    var result = new Uint8Array(len);
    if (bytesData) {
        result.set(bytesData, len - bytesData.length);
    }
    return Buffer.from(result).toString('hex');
}
function getNumberHex(amount) {
    var bigAmount = new BigNumber(amount);
    var amountBytes = amount && !bigAmount.isZero() ? bigAmount.toArray('big') : '';
    return leftPadBytes(amountBytes, 32);
}
function getNonceHex(nonce) {
    var nonceBytes = nonce ? Buffer.from(nonce, 'base64') : '';
    return leftPadBytes(nonceBytes, 8);
}
