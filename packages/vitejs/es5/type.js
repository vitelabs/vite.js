"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var BlockType;
(function (BlockType) {
    BlockType[BlockType["CreateContractReq"] = 1] = "CreateContractReq";
    BlockType[BlockType["TxReq"] = 2] = "TxReq";
    BlockType[BlockType["RewardReq"] = 3] = "RewardReq";
    BlockType[BlockType["TxRes"] = 4] = "TxRes";
    BlockType[BlockType["TxResFail"] = 5] = "TxResFail";
})(BlockType = exports.BlockType || (exports.BlockType = {}));
var wallet;
(function (wallet) {
    wallet["listEntropyFilesInStandardDir"] = "wallet_listEntropyFilesInStandardDir";
    wallet["listAllEntropyFiles"] = "wallet_listAllEntropyFiles";
    wallet["unlock"] = "wallet_unlock";
    wallet["lock"] = "wallet_lock";
    wallet["listEntropyStoreAddresses"] = "wallet_listEntropyStoreAddresses";
    wallet["newMnemonicAndEntropyStore"] = "wallet_newMnemonicAndEntropyStore";
    wallet["deriveByIndex"] = "wallet_deriveByIndex";
    wallet["deriveByFullPath"] = "wallet_deriveByFullPath";
    wallet["recoverEntropyStoreFromMnemonic"] = "wallet_recoverEntropyStoreFromMnemonic";
    wallet["globalCheckAddrUnlocked"] = "wallet_globalCheckAddrUnlocked";
    wallet["isAddrUnlocked"] = "wallet_isAddrUnlocked";
    wallet["isUnlocked"] = "wallet_isUnlocked";
    wallet["findAddr"] = "wallet_findAddr";
    wallet["globalFindAddr"] = "wallet_globalFindAddr";
    wallet["createTxWithPassphrase"] = "wallet_createTxWithPassphrase";
    wallet["addEntropyStore"] = "wallet_addEntropyStore";
})(wallet = exports.wallet || (exports.wallet = {}));
var onroad;
(function (onroad) {
    onroad["getOnroadBlocksByAddress"] = "onroad_getOnroadBlocksByAddress";
    onroad["getAccountOnroadInfo"] = "onroad_getAccountOnroadInfo";
    onroad["listWorkingAutoReceiveWorker"] = "onroad_listWorkingAutoReceiveWorker";
    onroad["startAutoReceive"] = "onroad_startAutoReceive";
    onroad["stopAutoReceive"] = "onroad_stopAutoReceive";
})(onroad = exports.onroad || (exports.onroad = {}));
var tx;
(function (tx) {
    tx["sendRawTx"] = "tx_sendRawTx";
})(tx = exports.tx || (exports.tx = {}));
var ledger;
(function (ledger) {
    ledger["getBlocksByAccAddr"] = "ledger_getBlocksByAccAddr";
    ledger["getAccountByAccAddr"] = "ledger_getAccountByAccAddr";
    ledger["getLatestSnapshotChainHash"] = "ledger_getLatestSnapshotChainHash";
    ledger["getLatestBlock"] = "ledger_getLatestBlock";
    ledger["getTokenMintage"] = "ledger_getTokenMintage";
    ledger["getBlockByHeight"] = "ledger_getBlockByHeight";
    ledger["getBlocksByHash"] = "ledger_getBlocksByHash";
    ledger["getBlocksByHashInToken"] = "ledger_getBlocksByHashInToken";
    ledger["getSnapshotChainHeight"] = "ledger_getSnapshotChainHeight";
    ledger["getVmLogList"] = "ledger_getVmLogList";
    ledger["getFittestSnapshotHash"] = "ledger_getFittestSnapshotHash";
})(ledger = exports.ledger || (exports.ledger = {}));
var consensusGroup;
(function (consensusGroup) {
    consensusGroup["getConditionRegisterOfPledge"] = "consensusGroup_getConditionRegisterOfPledge";
    consensusGroup["getConditionVoteOfKeepToken"] = "consensusGroup_getConditionVoteOfKeepToken";
    consensusGroup["getCreateConsensusGroupData"] = "consensusGroup_getCreateConsensusGroupData";
    consensusGroup["getCancelConsensusGroupData"] = "consensusGroup_getCancelConsensusGroupData";
    consensusGroup["getReCreateConsensusGroupData"] = "consensusGroup_getReCreateConsensusGroupData";
})(consensusGroup = exports.consensusGroup || (exports.consensusGroup = {}));
var contract;
(function (contract) {
    contract["getCreateContractToAddress"] = "contract_getCreateContractToAddress";
    contract["getCreateContractData"] = "contract_getCreateContractData";
    contract["getCallContractData"] = "contract_getCallContractData";
})(contract = exports.contract || (exports.contract = {}));
var pledge;
(function (pledge) {
    pledge["getPledgeData"] = "pledge_getPledgeData";
    pledge["getCancelPledgeData"] = "pledge_getCancelPledgeData";
    pledge["getPledgeQuota"] = "pledge_getPledgeQuota";
    pledge["getPledgeList"] = "pledge_getPledgeList";
})(pledge = exports.pledge || (exports.pledge = {}));
var register;
(function (register) {
    register["getRegisterData"] = "register_getRegisterData";
    register["getCancelRegisterData"] = "register_getCancelRegisterData";
    register["getRewardData"] = "register_getRewardData";
    register["getUpdateRegistrationData"] = "register_getUpdateRegistrationData";
    register["getRegistrationList"] = "register_getRegistrationList";
    register["getCandidateList"] = "register_getCandidateList";
})(register = exports.register || (exports.register = {}));
var vote;
(function (vote) {
    vote["getVoteData"] = "vote_getVoteData";
    vote["getCancelVoteData"] = "vote_getCancelVoteData";
    vote["getVoteInfo"] = "vote_getVoteInfo";
})(vote = exports.vote || (exports.vote = {}));
var mintage;
(function (mintage) {
    mintage["getMintageData"] = "mintage_getMintageData";
    mintage["getMintageCancelPledgeData"] = "mintage_getMintageCancelPledgeData";
    mintage["getTokenInfoList"] = "mintage_getTokenInfoList";
    mintage["getTokenInfoById"] = "mintage_getTokenInfoById";
    mintage["getTokenInfoListByOwner"] = "mintage_getTokenInfoListByOwner";
    mintage["newTokenId"] = "mintage_newTokenId";
})(mintage = exports.mintage || (exports.mintage = {}));
var net;
(function (net) {
    net["syncInfo"] = "net_syncInfo";
    net["peers"] = "net_peers";
    net["peersCount"] = "net_peersCount";
})(net = exports.net || (exports.net = {}));
var subscribe;
(function (subscribe) {
    subscribe["newAccountBlocksFilter"] = "subscribe_newAccountBlocksFilter";
    subscribe["newLogsFilter"] = "subscribe_newLogsFilter";
    subscribe["uninstallFilter"] = "subscribe_uninstallFilter";
    subscribe["getFilterChanges"] = "subscribe_getFilterChanges";
    subscribe["newAccountBlocks"] = "subscribe_newAccountBlocks";
    subscribe["newLogs"] = "subscribe_newLogs";
})(subscribe = exports.subscribe || (exports.subscribe = {}));
exports._methods = { wallet: wallet, onroad: onroad, tx: tx, ledger: ledger, consensusGroup: consensusGroup, contract: contract, pledge: pledge, register: register, vote: vote, mintage: mintage, net: net, subscribe: subscribe };
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
