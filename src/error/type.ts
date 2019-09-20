export declare type Hex = string;
export declare type Address = string;
export declare type Base64 = string;
export declare type TokenId = string;
export declare type Int64 = number;
export declare type Uint8 = string;
export declare type Uint64 = string;
export declare type BigInt = string;

export enum TxType {
    'SBPreg' = 1,
    'UpdateReg',
    'RevokeReg',
    'RetrieveReward',
    'Voting',
    'RevokeVoting',
    'GetQuota',
    'WithdrawalOfQuota',
    'Mintage',
    'MintageIssue',
    'MintageBurn',
    'MintageTransferOwner',
    'MintageChangeTokenType',
    'MintageCancelPledge',
    'DexFundUserDeposit',
    'DexFundUserWithdraw',
    'DexFundNewOrder',
    'DexTradeCancelOrder',
    'DexFundNewMarket',
    'DexFundPledgeForVx',
    'DexFundPledgeForVip',
    'DexFundBindInviteCode',
    'DexFundPledgeForSuperVip',
    'DexFundConfigMarketsAgent',
    'DexFundNewInviter',
    'DexFundTransferTokenOwner',
    'DexFundMarketOwnerConfig',
    'CreateContractRequest',
    'TransferRequest',
    'ClaimSBPRewardsRequest',
    'Response',
    'ResponseFail',
    'RefundByContractRequest',
    'GenesisResponse'
}

export declare type SignBlock = {
    accountAddress: Address;
    blockType: BlockType;
    prevHash: Hex;
    height: Uint64;
    fee?: BigInt;
    fromBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    data?: Base64;
    nonce?: Base64;
    logHash?: Hex;
    sendBlockList?: Array<any>;
}

export declare type AccountBlock = {
    accountAddress: Address;
    blockType: BlockType;
    prevHash: Hex;
    height: Uint64;
    hash: Hex;
    signature: Base64;
    publicKey: Base64;
    fee?: BigInt;
    fromBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    data?: Base64;
    nonce?: Base64;
    logHash?: Hex;
}

export declare type SBPregBlock = {
    accountAddress: Address;
    nodeName: string;
    toAddress: Address;
    tokenId: TokenId;
    amount: BigInt;

    Gid?: string;
    prevHash?: Hex;
    height?: Uint64;
};

export declare type block8 = {
    accountAddress: Address;
    nodeName: string;
    toAddress: Address;
    tokenId: TokenId;

    Gid?: string;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type block7 = {
    accountAddress: Address;
    nodeName: string;
    tokenId: TokenId;

    Gid?: string;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type revokeVotingBlock = {
    accountAddress: Address;
    tokenId: TokenId;

    Gid?: string;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type quotaBlock = {
    accountAddress: Address;
    toAddress: Address;
    tokenId: TokenId;
    amount: BigInt;

    prevHash?: Hex;
    height?: Uint64;
}

export declare type sendTxBlock = {
    accountAddress: Address;
    toAddress: Address;
    tokenId: TokenId;
    amount: BigInt;

    data?: Base64;
    message?: string;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type receiveTxBlock = {
    accountAddress: Address;
    fromBlockHash: Hex;

    prevHash?: Hex;
    height?: Uint64;
}

export declare type syncFormatBlock = {
    blockType: BlockType;
    accountAddress: Address;
    prevHash?: Hex;
    height?: Uint64;
    fromBlockHash?: Hex;
    data?: Base64;
    message?: string;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    fee?: BigInt;
    nonce?: Base64;
}

export declare type formatBlock = {
    blockType: BlockType;
    accountAddress: Address;
    fromBlockHash?: Hex;
    data?: Base64;
    message?: string;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    fee?: BigInt;
    prevHash?: Hex;
    height?: Uint64;
    nonce?: Base64;
}
export declare type createContractBlock = {
    accountAddress: Address;
    hexCode: Hex;
    abi: string;
    amount: BigInt;
    fee: BigInt;
    confirmTime: Uint8;
    quotaRatio: Uint8;
    seedCount: Uint8;
    tokenId?: TokenId;
    params?: string;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type callContractBlock = {
    accountAddress: Address;
    toAddress: Address;
    abi: object;
    methodName?: string;
    fee?: BigInt;
    tokenId?: TokenId;
    amount?: BigInt;
    params?: Array<string | boolean>;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type mintageBlock = {
    accountAddress: Address;
    tokenName: string;
    isReIssuable: boolean;
    maxSupply: string;
    ownerBurnOnly: string;
    totalSupply: BigInt;
    decimals: string;
    tokenSymbol: string;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type mintageIssueBlock = {
    accountAddress: Address;
    tokenId: TokenId;
    amount: BigInt;
    beneficial: Address;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type mintageBurnBlock = {
    accountAddress: Address;
    amount: BigInt;
    tokenId: TokenId;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type changeTokenTypeBlock = {
    accountAddress: Address;
    tokenId: TokenId;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type changeTransferOwnerBlock = {
    accountAddress: Address;
    tokenId: TokenId;
    newOwner: Address;
    prevHash?: Hex;
    height?: Uint64;
}

export declare type AddrObj = {
    realAddress: Hex;
    publicKey: Buffer;
    privateKey: Buffer;
    address: Address;
}

export enum BlockType {
    'CreateContractRequest' = 1,
    'TransferRequest',
    'ClaimSBPRewardsRequest',
    'Response',
    'ResponseFail',
    'RefundByContractRequest',
    'GenesisResponse'
}

export declare type requiredAccountBlock = {
    blockType: BlockType;
    height?: Uint64;
    hash?: Hex;
    previousHash?: Hex;
    address?: Address;
    publicKey?: Base64;
    toAddress?: Address;
    sendBlockHash?: Hex;
    tokenId?: TokenId;
    amount?: BigInt;
    fee?: BigInt;
    data?: Base64;
    difficulty?: BigInt;
    nonce?: Base64;
    signature?: Base64;
}

export enum wallet {
    'listEntropyFilesInStandardDir' = 'wallet_listEntropyFilesInStandardDir',
    'listAllEntropyFiles' = 'wallet_listAllEntropyFiles',
    'extractMnemonic' = 'wallet_extractMnemonic',
    'unlock' = 'wallet_unlock',
    'lock' = 'wallet_lock',
    'listEntropyStoreAddresses' = 'wallet_listEntropyStoreAddresses',
    'newMnemonicAndEntropyStore' = 'wallet_newMnemonicAndEntropyStore',
    'deriveByIndex' = 'wallet_deriveByIndex',
    'deriveByFullPath' = 'wallet_deriveByFullPath',
    'recoverEntropyStoreFromMnemonic' = 'wallet_recoverEntropyStoreFromMnemonic',
    'globalCheckAddrUnlocked' = 'wallet_globalCheckAddrUnlocked',
    'isAddrUnlocked' = 'wallet_isAddrUnlocked',
    'isUnlocked' = 'wallet_isUnlocked',
    'findAddr' = 'wallet_findAddr',
    'globalFindAddr' = 'wallet_globalFindAddr',
    'createTxWithPassphrase' = 'wallet_createTxWithPassphrase',
    'addEntropyStore' = 'wallet_addEntropyStore'
}

export enum onroad {
    'getOnroadBlocksByAddress' = 'onroad_getOnroadBlocksByAddress',
    'getOnroadInfoByAddress' = 'onroad_getOnroadInfoByAddress',
    'getOnroadBlocksInBatch' = 'onroad_getOnroadBlocksInBatch',
    'getOnroadInfoInBatch' = 'onroad_getOnroadInfoInBatch',
    'getContractOnRoadTotalNum' = 'onroad_getContractOnRoadTotalNum',
    'getContractOnRoadFrontBlocks' = 'onroad_getContractOnRoadFrontBlocks'
}

export enum tx {
    'sendRawTx' = 'tx_sendRawTx',
    'calcPoWDifficulty' = 'tx_calcPoWDifficulty'
}

export enum ledger {
    'getBlocksByAccAddr' = 'ledger_getBlocksByAccAddr',
    'getAccountByAccAddr' = 'ledger_getAccountByAccAddr',
    'getLatestSnapshotChainHash' = 'ledger_getLatestSnapshotChainHash',
    'getLatestBlock' = 'ledger_getLatestBlock',
    'getBlockByHeight' = 'ledger_getBlockByHeight',
    'getBlockByHash' = 'ledger_getBlockByHash',
    'getBlocksByHash' = 'ledger_getBlocksByHash',
    'getBlocksByHashInToken' = 'ledger_getBlocksByHashInToken',
    'getSnapshotChainHeight' = 'ledger_getSnapshotChainHeight',
    'getSnapshotBlockByHash' = 'ledger_getSnapshotBlockByHash',
    'getSnapshotBlockByHeight' = 'ledger_getSnapshotBlockByHeight',
    'getVmLogList' = 'ledger_getVmLogList',
    'getFittestSnapshotHash' = 'ledger_getFittestSnapshotHash'
}

export enum contract {
    'getCreateContractToAddress' = 'contract_getCreateContractToAddress',
    'getCreateContractData' = 'contract_getCreateContractData',
    'getCreateContractParams' = 'contract_getCreateContractParams',
    'getCallContractData' = 'contract_getCallContractData',
    'getContractInfo' = 'contract_getContractInfo',
    'getCallOffChainData' = 'contract_getCallOffChainData',
    'callOffChainMethod' = 'contract_callOffChainMethod'
}

export enum pledge {
    'getPledgeData' = 'pledge_getPledgeData',
    'getCancelPledgeData' = 'pledge_getCancelPledgeData',
    'getPledgeQuota' = 'pledge_getPledgeQuota',
    'getPledgeList' = 'pledge_getPledgeList',
    'getAgentPledgeData' = 'pledge_getAgentPledgeData',
    'getAgentCancelPledgeData' = 'pledge_getAgentCancelPledgeData'
}

export enum register {
    'getRegisterData' = 'register_getRegisterData',
    'getCancelRegisterData' = 'register_getCancelRegisterData',
    'getRewardData' = 'register_getRewardData',
    'getUpdateRegistrationData' = 'register_getUpdateRegistrationData',
    'getRegistrationList' = 'register_getRegistrationList',
    'getAvailableReward' = 'register_getAvailableReward',
    'getRewardByDay' = 'register_getRewardByDay',
    'getCandidateList' = 'register_getCandidateList'
}

export enum vote {
    'getVoteData' = 'vote_getVoteData',
    'getCancelVoteData' = 'vote_getCancelVoteData',
    'getVoteInfo' = 'vote_getVoteInfo'
}

export enum mintage {
    'getMintData' = 'mintage_getMintData',
    'getIssueData' = 'mintage_getIssueData',
    'getBurnData' = 'mintage_getBurnData',
    'getTransferOwnerData' = 'mintage_getTransferOwnerData',
    'getChangeTokenTypeData' = 'mintage_getChangeTokenTypeData',
    'getTokenInfoList' = 'mintage_getTokenInfoList',
    'getTokenInfoById' = 'mintage_getTokenInfoById',
    'getTokenInfoListByOwner' = 'mintage_getTokenInfoListByOwner'
}

export enum dexfund {
    'getAccountFundInfo' = 'dexfund_getAccountFundInfo',
    'getAccountFundInfoByStatus' = 'dexfund_getAccountFundInfoByStatus',
    'isPledgeVip' = 'dexfund_isPledgeVip',
    'getMarketInfo' = 'dexfund_getMarketInfo',
    'getCurrentDividendPools' = 'dexfund_getCurrentDividendPools'
}

export enum net {
    'syncInfo' = 'net_syncInfo',
    'peers' = 'net_peers',
    'peersCount' = 'net_peersCount'
}

export enum testapi {
    'getTestToken' = 'testapi_getTestToken'
}

export enum pow {
    'getPowNonce' = 'pow_getPowNonce'
}

export enum subscribe {
    'newSnapshotBlocksFilter' = 'subscribe_newSnapshotBlocksFilter',
    'newAccountBlocksFilter' = 'subscribe_newAccountBlocksFilter',
    'newLogsFilter' = 'subscribe_newLogsFilter',
    'uninstallFilter' = 'subscribe_uninstallFilter',
    'getFilterChanges' = 'subscribe_getFilterChanges',
    'subscribe' = 'subscribe_subscribe'
}

export const _methods = { testapi, pow, dexfund, wallet, onroad, tx, ledger, contract, pledge, register, vote, mintage, net, subscribe };

export declare type Methods = String | testapi | pow | dexfund | wallet | onroad | tx | ledger | contract | pledge | register | vote | mintage | net | subscribe;

export type walletFunc = {
    listEntropyFilesInStandardDir: Function;
    extractMnemonic: Function;
    listAllEntropyFiles: Function;
    unlock: Function;
    lock: Function;
    listEntropyStoreAddresses: Function;
    newMnemonicAndEntropyStore: Function;
    deriveForIndexPath: Function;
    recoverEntropyStoreFromMnemonic: Function;
    globalCheckAddrUnlocked: Function;
    isAddrUnlocked: Function;
    isUnlocked: Function;
    findAddr: Function;
    globalFindAddr: Function;
    createTxWithPassphrase: Function;
    addEntropyStore: Function;
}

export type onroadFunc = {
    getOnroadBlocksByAddress: Function;
    getOnroadInfoByAddress: Function;
    getOnroadBlocksInBatch: Function;
    getOnroadInfoInBatch: Function;
}

export type txFunc = {
    sendRawTx: Function;
    calcPoWDifficulty: Function;
}

export type ledgerFunc = {
    getBlocksByAccAddr: Function;
    getAccountByAccAddr: Function;
    getLatestSnapshotChainHash: Function;
    getLatestBlock: Function;
    getBlockByHeight: Function;
    getBlockByHash: Function;
    getBlocksByHashInToken: Function;
    getBlocksByHash: Function;
    getSnapshotChainHeight: Function;
    getSnapshotBlockByHash: Function;
    getSnapshotBlockByHeight: Function;
    getVmLogList: Function;
    getFittestSnapshotHash: Function;
}

export type contractFunc = {
    getCreateContractToAddress: Function;
    getCreateContractData: Function;
    getCreateContractParams: Function;
    getCallContractData: Function;
    getContractInfo: Function;
    getCallOffChainData: Function;
    callOffChainMethod: Function;
}

export type pledgeFunc = {
    getPledgeData: Function;
    getCancelPledgeData: Function;
    getPledgeQuota: Function;
    getPledgeList: Function;
}

export type registerFunc = {
    getRegistrationList: Function;
    getRegisterData: Function;
    getCancelRegisterData: Function;
    getRewardData: Function;
    getUpdateRegistrationData: Function;
    getCandidateList: Function;
}

export type voteFunc = {
    getVoteData: Function;
    getCancelVoteData: Function;
    getVoteInfo: Function;
}

export type mintageFunc = {
    getMintData: Function;
    getMintageCancelPledgeData: Function;
    getIssueData: Function;
    getBurnData: Function;
    getTransferOwnerData: Function;
    getChangeTokenTypeData: Function;
    getTokenInfoList: Function;
    getTokenInfoById: Function;
    getTokenInfoListByOwner: Function;
}

export type dexfundFunc = {
    getAccountFundInfo: Function;
    getAccountFundInfoByStatus: Function;
    isPledgeVip: Function;
    getMarketInfo: Function;
}

export type netFunc = {
    syncInfo: Function;
    peers: Function;
    peersCount: Function;
}

export type testapiFunc = {
    getTestToken: Function;
}

export type powFunc = {
    getPowNonce: Function;
}

export type subscribeFunc = {
    newSnapshotBlocksFilter: Function;
    newAccountBlocksFilter: Function;
    newLogsFilter: Function;
    uninstallFilter: Function;
    getFilterChanges: Function;
    subscribe: Function;
}

export declare interface RPCrequest {
    type?: string;
    methodName: Methods;
    params: any[];
}

export declare interface RPCresponse {
    jsonrpc?: string;
    id?: number;
    result?: any;
    error?: RPCerror;
}

export declare interface RPCerror {
    code: number;
    message: string;
}
