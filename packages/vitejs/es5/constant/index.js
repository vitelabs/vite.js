"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var abi_1 = require("abi");
var type_1 = require("../type");
exports.Vite_TokenId = 'tti_5649544520544f4b454e6e40';
exports.Default_Hash = '0000000000000000000000000000000000000000000000000000000000000000';
exports.Snapshot_Gid = '00000000000000000001';
exports.Delegate_Gid = "00000000000000000002";
exports.Quota_Addr = 'vite_000000000000000000000000000000000000000309508ba646';
exports.Vote_Addr = 'vite_000000000000000000000000000000000000000270a48cc491';
exports.Register_Addr = 'vite_0000000000000000000000000000000000000001c9e9f25417';
exports.Mintage_Addr = 'vite_00000000000000000000000000000000000000056ad6d26692';
exports.DexFund_Addr = 'vite_000000000000000000000000000000000000000617d47459a8';
exports.DexTrade_Addr = 'vite_000000000000000000000000000000000000000768ef0e6238';
exports.Register_Abi = { "type": "function", "name": "Register", "inputs": [{ "name": "gid", "type": "gid" }, { "name": "name", "type": "string" }, { "name": "nodeAddr", "type": "address" }] };
exports.UpdateRegistration_Abi = { "type": "function", "name": "UpdateRegistration", "inputs": [{ "name": "gid", "type": "gid" }, { "Name": "name", "type": "string" }, { "name": "nodeAddr", "type": "address" }] };
exports.CancelRegister_Abi = { "type": "function", "name": "CancelRegister", "inputs": [{ "name": "gid", "type": "gid" }, { "name": "name", "type": "string" }] };
exports.Reward_Abi = { "type": "function", "name": "Reward", "inputs": [{ "name": "gid", "type": "gid" }, { "name": "name", "type": "string" }, { "name": "beneficialAddr", "type": "address" }] };
exports.Vote_Abi = { "type": "function", "name": "Vote", "inputs": [{ "name": "gid", "type": "gid" }, { "name": "nodeName", "type": "string" }] };
exports.CancelVote_Abi = { "type": "function", "name": "CancelVote", "inputs": [{ "name": "gid", "type": "gid" }] };
exports.Pledge_Abi = { "type": "function", "name": "Pledge", "inputs": [{ "name": "beneficial", "type": "address" }] };
exports.CancelPledge_Abi = { "type": "function", "name": "CancelPledge", "inputs": [{ "name": "beneficial", "type": "address" }, { "name": "amount", "type": "uint256" }] };
exports.Mint_Abi = { "type": "function", "name": "Mint", "inputs": [{ "name": "isReIssuable", "type": "bool" }, { "name": "tokenId", "type": "tokenId" }, { "name": "tokenName", "type": "string" }, { "name": "tokenSymbol", "type": "string" }, { "name": "totalSupply", "type": "uint256" }, { "name": "decimals", "type": "uint8" }, { "name": "maxSupply", "type": "uint256" }, { "name": "ownerBurnOnly", "type": "bool" }] };
exports.Issue_Abi = { "type": "function", "name": "Issue", "inputs": [{ "name": "tokenId", "type": "tokenId" }, { "name": "amount", "type": "uint256" }, { "name": "beneficial", "type": "address" }] };
exports.Burn_Abi = { "type": "function", "name": "Burn", "inputs": [] };
exports.TransferOwner_Abi = { "type": "function", "name": "TransferOwner", "inputs": [{ "name": "tokenId", "type": "tokenId" }, { "name": "newOwner", "type": "address" }] };
exports.ChangeTokenType_Abi = { "type": "function", "name": "ChangeTokenType", "inputs": [{ "name": "tokenId", "type": "tokenId" }] };
exports.Mint_CancelPledge_Abi = { "type": "function", "name": "CancelPledge", "inputs": [{ "name": "tokenId", "type": "tokenId" }] };
exports.DexFundUserDeposit_Abi = { 'type': 'function', 'name': 'DexFundUserWithdraw', 'inputs': [{ 'name': 'token', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' }] };
exports.DexFundUserWithdraw_Abi = { 'type': 'function', 'name': 'DexFundUserWithdraw', 'inputs': [{ 'name': 'token', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' }] };
exports.DexTradeCancelOrder_Abi = { 'type': 'function', 'name': 'DexTradeCancelOrder', 'inputs': [{ 'name': 'orderId', 'type': 'bytes' }, { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': ',quoteToken', 'type': 'tokenId' }, { 'name': 'side', 'type': 'bool' }] };
exports.DexFundNewOrder_Abi = { 'type': 'function', 'name': 'DexFundNewOrder', 'inputs': [{ 'name': 'orderId', 'type': 'bytes' }, { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'side', 'type': 'bool' }, { 'name': 'orderType', 'type': 'uint32' }, { 'name': 'price', 'type': 'string' }, { 'name': 'quantity', 'type': 'uint256' }] };
var BlockType;
(function (BlockType) {
    BlockType[BlockType["CreateContractReq"] = 1] = "CreateContractReq";
    BlockType[BlockType["TxReq"] = 2] = "TxReq";
    BlockType[BlockType["RewardReq"] = 3] = "RewardReq";
    BlockType[BlockType["TxRes"] = 4] = "TxRes";
    BlockType[BlockType["TxResFail"] = 5] = "TxResFail";
})(BlockType = exports.BlockType || (exports.BlockType = {}));
var BuiltinTxType;
(function (BuiltinTxType) {
    BuiltinTxType[BuiltinTxType["SBPreg"] = 0] = "SBPreg";
    BuiltinTxType[BuiltinTxType["UpdateReg"] = 1] = "UpdateReg";
    BuiltinTxType[BuiltinTxType["RevokeReg"] = 2] = "RevokeReg";
    BuiltinTxType[BuiltinTxType["RetrieveReward"] = 3] = "RetrieveReward";
    BuiltinTxType[BuiltinTxType["Voting"] = 4] = "Voting";
    BuiltinTxType[BuiltinTxType["RevokeVoting"] = 5] = "RevokeVoting";
    BuiltinTxType[BuiltinTxType["GetQuota"] = 6] = "GetQuota";
    BuiltinTxType[BuiltinTxType["WithdrawalOfQuota"] = 7] = "WithdrawalOfQuota";
    BuiltinTxType[BuiltinTxType["Mintage"] = 8] = "Mintage";
    BuiltinTxType[BuiltinTxType["MintageIssue"] = 9] = "MintageIssue";
    BuiltinTxType[BuiltinTxType["MintageBurn"] = 10] = "MintageBurn";
    BuiltinTxType[BuiltinTxType["MintageTransferOwner"] = 11] = "MintageTransferOwner";
    BuiltinTxType[BuiltinTxType["MintageChangeTokenType"] = 12] = "MintageChangeTokenType";
    BuiltinTxType[BuiltinTxType["MintageCancelPledge"] = 13] = "MintageCancelPledge";
    BuiltinTxType[BuiltinTxType["DexFundUserDeposit"] = 14] = "DexFundUserDeposit";
    BuiltinTxType[BuiltinTxType["DexFundUserWithdraw"] = 15] = "DexFundUserWithdraw";
    BuiltinTxType[BuiltinTxType["DexFundNewOrder"] = 16] = "DexFundNewOrder";
    BuiltinTxType[BuiltinTxType["DexTradeCancelOrder"] = 17] = "DexTradeCancelOrder";
    BuiltinTxType[BuiltinTxType["CreateContractReq"] = 18] = "CreateContractReq";
    BuiltinTxType[BuiltinTxType["TxReq"] = 19] = "TxReq";
    BuiltinTxType[BuiltinTxType["RewardReq"] = 20] = "RewardReq";
    BuiltinTxType[BuiltinTxType["TxRes"] = 21] = "TxRes";
    BuiltinTxType[BuiltinTxType["TxResFail"] = 22] = "TxResFail";
})(BuiltinTxType = exports.BuiltinTxType || (exports.BuiltinTxType = {}));
var LangList;
(function (LangList) {
    LangList["english"] = "english";
    LangList["japanese"] = "japanese";
    LangList["chineseSimplified"] = "chinese_simplified";
    LangList["chineseTraditional"] = "chinese_traditional";
    LangList["french"] = "french";
    LangList["italian"] = "italian";
    LangList["korean"] = "korean";
    LangList["spanish"] = "spanish";
})(LangList = exports.LangList || (exports.LangList = {}));
exports.contractAddrs = {
    Quota: exports.Quota_Addr,
    Vote: exports.Vote_Addr,
    Register: exports.Register_Addr,
    Mintage: exports.Mintage_Addr,
    DexFund: exports.DexFund_Addr,
    DexTrade: exports.DexTrade_Addr
};
exports.abiFuncSignature = {
    Register: abi_1.encodeFunctionSignature(exports.Register_Abi),
    UpdateRegistration: abi_1.encodeFunctionSignature(exports.UpdateRegistration_Abi),
    CancelRegister: abi_1.encodeFunctionSignature(exports.CancelRegister_Abi),
    Reward: abi_1.encodeFunctionSignature(exports.Reward_Abi),
    Vote: abi_1.encodeFunctionSignature(exports.Vote_Abi),
    CancelVote: abi_1.encodeFunctionSignature(exports.CancelVote_Abi),
    Pledge: abi_1.encodeFunctionSignature(exports.Pledge_Abi),
    CancelPledge: abi_1.encodeFunctionSignature(exports.CancelPledge_Abi),
    Mint: abi_1.encodeFunctionSignature(exports.Mint_Abi),
    Issue: abi_1.encodeFunctionSignature(exports.Issue_Abi),
    Burn: abi_1.encodeFunctionSignature(exports.Burn_Abi),
    TransferOwner: abi_1.encodeFunctionSignature(exports.TransferOwner_Abi),
    ChangeTokenType: abi_1.encodeFunctionSignature(exports.ChangeTokenType_Abi),
    Mint_CancelPledge: abi_1.encodeFunctionSignature(exports.Mint_CancelPledge_Abi),
    DexFundUserDeposit: abi_1.encodeFunctionSignature(exports.DexFundUserDeposit_Abi),
    DexFundUserWithdraw: abi_1.encodeFunctionSignature(exports.DexFundUserWithdraw_Abi),
    DexFundNewOrder: abi_1.encodeFunctionSignature(exports.DexFundNewOrder_Abi),
    DexTradeCancelOrder: abi_1.encodeFunctionSignature(exports.DexTradeCancelOrder_Abi)
};
exports.methods = type_1._methods;
