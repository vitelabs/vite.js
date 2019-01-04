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
    getCreateContractToAddress = "contract_getCreateContractToAddress" 
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
    getConditionVoteOfDefault = "consensusGroup_getConditionVoteOfDefault", 
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

export declare type Methods = wallet | net | onroad | contract | pledge | contract | register | vote | mintage | consensusGroup | ledger | tx

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
    getConditionVoteOfDefault: Function
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

export declare type Hex = string;
export declare type Address = string;
export declare type Base64 = string;
export declare type TokenId = string;
export declare type Int64 = number;
export declare type Uint64 = string;
export declare type BigInt = string;

export declare interface RPCrequest {
    type?: string;
    methodName: Methods;
    params: any[];
}

export declare interface RPCresponse {
    jsonrpc?: string;
    id?: number;
    result?: any;
    error?: RPCerror
}

export declare interface RPCerror {
    code: number,
    message: string
}

export enum BlockType {
    CreateContractReq = 1,
    TxReq,
    RewardReq,
    TxRes,
    TxResFail
}

export enum BuiltinTxType {
    SBPreg = 0,
    UpdateReg,
    RevokeReg,
    RetrieveReward,
    Voting,
    RevokeVoting,
    GetQuota,
    WithdrawalOfQuota,
    TokenIssuance,
    WithdrawalOfToken,
    CreateContractReq,
    TxReq,
    RewardReq,
    TxRes,
    TxResFail
}

export enum LangList {
    english = 'english',
    japanese = 'japanese',
    chineseSimplified = 'chinese_simplified',
    chineseTraditional = 'chinese_traditional',
    french = 'french',
    italian = 'italian',
    korean = 'korean',
    spanish = 'spanish'
}

export declare type SignBlock = {
    accountAddress: Address
    blockType: BlockType
    prevHash: Hex
    snapshotHash: Hex
    timestamp: Int64
    height: Uint64
    fee?: BigInt
    fromBlockHash?: Hex
    toAddress?: Address
    tokenId?: TokenId
    amount?: BigInt
    data?: Base64
    nonce?: Base64
    logHash?: Hex
}

export declare type AccountBlock = {
    accountAddress: Address,
    blockType: BlockType,
    prevHash: Hex,
    snapshotHash: Hex,
    timestamp: Int64,
    height: Uint64,
    hash: Hex,
    signature: Base64,
    publicKey: Base64,
    fee?: BigInt,
    fromBlockHash?: Hex,
    toAddress?: Address,
    tokenId?: TokenId,
    amount?: BigInt,
    data?: Base64,
    nonce?: Base64,
    logHash?: Hex
}

export declare type SBPregBlock = {
    accountAddress: Address,
    nodeName: string,
    toAddress: Address,
    tokenId: TokenId,
    amount: BigInt,

    Gid?: string,
    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex
};

export declare type block8 = {
    accountAddress: Address,
    nodeName: string,
    toAddress: Address,
    tokenId: TokenId,

    Gid?: string,
    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex
}

export declare type block7 = {
    accountAddress: Address,
    nodeName: string,
    tokenId: TokenId,

    Gid?: string,
    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex
}

export declare type revokeVotingBlock = {
    accountAddress: Address,
    tokenId: TokenId,

    Gid?: string,
    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex
}

export declare type quotaBlock = {
    accountAddress: Address,
    toAddress: Address,
    tokenId: TokenId,
    amount: BigInt,

    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex
}

export declare type sendTxBlock = {
    accountAddress: Address,
    toAddress: Address,
    tokenId: TokenId,
    amount: BigInt,

    message?: string,
    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex
}

export declare type receiveTxBlock = {
    accountAddress: Address,
    fromBlockHash: Hex,

    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex
}

export declare type syncFormatBlock = {
    blockType: BlockType
    accountAddress: Address
    snapshotHash: Hex
    prevHash?: Hex
    height?: Uint64
    fromBlockHash?: Hex
    data?: Base64
    message?: string
    toAddress?: Address
    tokenId?: TokenId
    amount?: BigInt,
    nonce?: Base64
}

export declare type formatBlock = {
    blockType: BlockType,
    accountAddress: Address,
    fromBlockHash?: Hex,
    data?: Base64,
    message?: string,
    toAddress?: Address,
    tokenId?: TokenId,
    amount?: BigInt,
    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex,
    nonce?: Base64
}

export declare type AddrObj = {
    addr: string, 
    pubKey: Hex, 
    privKey: Hex, 
    hexAddr: Address
}
