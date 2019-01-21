export const enum wallet {
    listEntropyFilesInStandardDir = "wallet_listEntropyFilesInStandardDir", 
    listAllEntropyFiles = "wallet_listAllEntropyFiles", 
    unlock = "wallet_unlock", 
    lock = "wallet_lock", 
    listEntropyStoreAddresses = "wallet_listEntropyStoreAddresses", 
    newMnemonicAndEntropyStore = "wallet_newMnemonicAndEntropyStore", 
    deriveForIndexPath = "wallet_deriveForIndexPath", 
    recoverEntropyStoreFromMnemonic = "wallet_recoverEntropyStoreFromMnemonic", 
    globalCheckAddrUnlocked = "wallet_globalCheckAddrUnlocked", 
    isAddrUnlocked = "wallet_isAddrUnlocked", 
    isUnlocked = "wallet_isUnlocked", 
    findAddr = "wallet_findAddr", 
    globalFindAddr = "wallet_globalFindAddr", 
    createTxWithPassphrase = "wallet_createTxWithPassphrase", 
    addEntropyStore = "wallet_addEntropyStore" 
}
export const enum net { 
    syncInfo = "net_syncInfo", 
    peers = "net_peers" 
}
export const enum onroad { 
    getOnroadBlocksByAddress = "onroad_getOnroadBlocksByAddress", 
    getAccountOnroadInfo = "onroad_getAccountOnroadInfo", 
    listWorkingAutoReceiveWorker = "onroad_listWorkingAutoReceiveWorker", 
    startAutoReceive = "onroad_startAutoReceive", 
    stopAutoReceive = "onroad_stopAutoReceive" 
}
export const enum contract { 
    getCreateContractToAddress = "contract_getCreateContractToAddress" ,
    getCreateContractData = "contract_getCreateContractData",
    getCallContractData = "contract_getCallContractData"
}
export const enum pledge { 
    getPledgeData = "pledge_getPledgeData", 
    getCancelPledgeData = "pledge_getCancelPledgeData", 
    getPledgeQuota = "pledge_getPledgeQuota", 
    getPledgeList = "pledge_getPledgeList" 
}
export const enum register { 
    getRegistrationList = "register_getRegistrationList", 
    getRegisterData = "register_getRegisterData", 
    getCancelRegisterData = "register_getCancelRegisterData", 
    getRewardData = "register_getRewardData", 
    getUpdateRegistrationData = "register_getUpdateRegistrationData", 
    getCandidateList = "register_getCandidateList" 
}
export const enum vote { 
    getVoteData = "vote_getVoteData", 
    getCancelVoteData = "vote_getCancelVoteData", 
    getVoteInfo = "vote_getVoteInfo" 
}
export const enum mintage { 
    getMintageData = "mintage_getMintageData", 
    getMintageCancelPledgeData = "mintage_getMintageCancelPledgeData" 
}
export const enum consensusGroup { 
    getConditionRegisterOfPledge = "consensusGroup_getConditionRegisterOfPledge",
    getConditionVoteOfKeepToken = "consensusGroup_getConditionVoteOfKeepToken", 
    getCreateConsensusGroupData = "consensusGroup_getCreateConsensusGroupData", 
    getCancelConsensusGroupData = "consensusGroup_getCancelConsensusGroupData", 
    getReCreateConsensusGroupData = "consensusGroup_getReCreateConsensusGroupData" 
}
export const enum ledger { 
    getBlocksByAccAddr = "ledger_getBlocksByAccAddr", 
    getAccountByAccAddr = "ledger_getAccountByAccAddr", 
    getLatestSnapshotChainHash = "ledger_getLatestSnapshotChainHash", 
    getLatestBlock = "ledger_getLatestBlock", 
    getTokenMintage = "ledger_getTokenMintage", 
    getBlocksByHash = "ledger_getBlocksByHash", 
    getSnapshotChainHeight = "ledger_getSnapshotChainHeight", 
    getFittestSnapshotHash = "ledger_getFittestSnapshotHash" 
}
export const enum tx { 
    sendRawTx = "tx_sendRawTx" 
}

export type walletFunc = {
    listEntropyFilesInStandardDir: Function
    listAllEntropyFiles: Function
    unlock: Function
    lock: Function
    listEntropyStoreAddresses: Function
    newMnemonicAndEntropyStore: Function
    deriveForIndexPath: Function
    recoverEntropyStoreFromMnemonic: Function
    globalCheckAddrUnlocked: Function
    isAddrUnlocked: Function
    isUnlocked: Function
    findAddr: Function
    globalFindAddr: Function
    createTxWithPassphrase: Function
    addEntropyStore: Function
}
export type netFunc = { 
    syncInfo: Function
    peers: Function
}
export type onroadFunc = { 
    getOnroadBlocksByAddress: Function
    getAccountOnroadInfo: Function
    listWorkingAutoReceiveWorker: Function
    startAutoReceive: Function
    stopAutoReceive: Function
}
export type contractFunc = { 
    getCreateContractToAddress: Function
    getCreateContractData: Function
    getCallContractData: Function
}
export type pledgeFunc = { 
    getPledgeData: Function
    getCancelPledgeData: Function
    getPledgeQuota: Function
    getPledgeList: Function
}
export type registerFunc = { 
    getRegistrationList: Function
    getRegisterData: Function
    getCancelRegisterData: Function
    getRewardData: Function
    getUpdateRegistrationData: Function
    getCandidateList: Function
}
export type voteFunc = { 
    getVoteData: Function
    getCancelVoteData: Function
    getVoteInfo: Function
}
export type mintageFunc = { 
    getMintageData: Function
    getMintageCancelPledgeData: Function
}
export type consensusGroupFunc = { 
    getConditionRegisterOfPledge: Function
    getConditionVoteOfKeepToken: Function
    getCreateConsensusGroupData: Function
    getCancelConsensusGroupData: Function
    getReCreateConsensusGroupData: Function
}
export type ledgerFunc = { 
    getBlocksByAccAddr: Function
    getAccountByAccAddr: Function
    getLatestSnapshotChainHash: Function
    getLatestBlock: Function
    getTokenMintage: Function
    getBlocksByHash: Function
    getSnapshotChainHeight: Function
    getFittestSnapshotHash: Function
}
export type txFunc = { 
    sendRawTx: Function
}

type methods = wallet | net | onroad | contract | pledge | contract | register | vote | mintage | consensusGroup | ledger | tx

export default methods;