export declare type Hex = string;
export declare type Address = string;
export declare type Base64 = string;
export declare type TokenId = string;
export declare type Int32 = string;
export declare type Int64 = string;
export declare type Uint8 = string;
export declare type Uint16 = string;
export declare type Uint32 = string;
export declare type Uint64 = string;
export declare type Uint256 = string;
export declare type BigInt = string;

export enum TransactionType {
    'RegisterSBP' = 1,
    'UpdateBlockProducingAddress',
    'RevokeSBP',
    'WithdrawSBPReward',
    'VoteForSBP',
    'CancelVote',
    'StakeForQuota',
    'CancelStake',
    'IssueToken',
    'ReIssueToken',
    'BurnToken',
    'TransferTokenOwnership',
    'DisableReIssue',
    'DexDeposit',
    'DexWithdraw',
    'DexCreateOrder',
    'DexCancelOrder',
    'DexOpenNewMarket',
    'DexStakeForMining',
    'DexStakeForVIP',
    'DexBindInviteCode',
    'DexStakeForSuperVIP',
    'DexConfigMarketAgents',
    'DexCreateInviteCode',
    'DexTransferTokenOwnership',
    'DexMarketAdminConfig',
    'CreateContractRequest',
    'TransferRequest',
    'ReIssueRequest',
    'Response',
    'ResponseFail',
    'RefundByContractRequest',
    'GenesisResponse',
    'UpdateReg',
    'RevokeReg',
    'RetrieveReward',
    'GetQuota',
    'WithdrawalOfQuota',
    'Mintage',
    'MintageIssue',
    'MintageTransferOwner',
    'MintageChangeTokenType',
    'DexFundUserDeposit',
    'DexFundUserWithdraw',
    'DexFundNewOrder',
    'DexTradeCancelOrder',
    'DexFundNewMarket',
    'DexFundPledgeForVx',
    'DexFundPledgeForVip',
    'DexFundBindInviteCode',
    'DexFundNewInviter',
    'DexFundTransferTokenOwner',
    'DexFundMarketOwnerConfig',
    'DexFundPledgeForSuperVip',
    'DexFundConfigMarketsAgent'
}

export declare type TokenInfo = {
    tokenName: String;
    tokenSymbol: String;
    totalSupply: BigInt;
    decimals: Uint8;
    owner: Address;
    tokenId: TokenId;
    isReIssuable: Boolean;
    maxSupply: BigInt;
    isOwnerBurnOnly: Boolean;
    index: Uint16;
}

export declare type AccountBlockType = {
    blockType: BlockType;
    height: Uint64;
    hash: Hex;
    previousHash: Hex;
    address: Address;
    publicKey: Base64;
    producer?: Address;
    fromAddress?: Address;
    toAddress: Address;
    sendBlockHash?: Hex;
    tokenId?: TokenId;
    amount?: BigInt;
    tokenInfo?: TokenInfo;
    fee?: BigInt;
    data?: Base64;
    difficulty?: BigInt;
    nonce?: Base64;
    signature: Base64;
    quotaByStake?: Uint64;
    totalQuota?: Uint64;
    vmlogHash?: Hex;
    
    triggeredSendBlockList?: AccountBlockType[]
    confirmations?: Uint64;
    firstSnapshotHash?: Hex;
    timestamp?: Uint64;
    receiveBlockHeight?: Uint64;
    receiveBlockHash?: Hex;
}

export declare type Transaction = {
    blockType: BlockType;
    height: Uint64;
    hash: Hex;
    previousHash: Hex;
    address: Address;
    publicKey: Base64;
    producer?: Address;
    fromAddress?: Address;
    toAddress?: Address;
    sendBlockHash?: Hex;
    tokenId?: TokenId;
    amount?: BigInt;
    tokenInfo?: TokenInfo;
    fee?: BigInt;
    data?: Base64;
    difficulty?: BigInt;
    nonce?: Base64;
    signature?: Base64;
    quotaByStake?: Uint64;
    totalQuota?: Uint64;
    confirmations?: Uint64;
    firstSnapshotHash?: Hex;
    timestamp?: Uint64;
    receiveBlockHeight?: Uint64;
    receiveBlockHash?: Hex;
    transationType?: String;
    contractParams?: Object;
}

export declare type AddressObj = {
    originalAddress: Hex;
    publicKey: Hex;
    privateKey: Hex;
    address: Address;
}

export enum BlockType {
    'CreateContractRequest' = 1,
    'TransferRequest',
    'ReIssueRequest',
    'Response',
    'ResponseFail',
    'RefundByContractRequest',
    'GenesisResponse'
}

export declare type Methods = String |
'wallet_getEntropyFilesInStandardDir' |
'wallet_getAllEntropyFiles' |
'wallet_exportMnemonics' |
'wallet_unlock' |
'wallet_lock' |
'wallet_deriveAddressesByIndexRange' |
'wallet_createEntropyFile' |
'wallet_deriveAddressByIndex' |
'wallet_deriveAddressByPath' |
'wallet_recoverEntropyFile' |
'wallet_isUnlocked' |
'wallet_findAddr' |
'wallet_globalFindAddr' |
'wallet_createTxWithPassphrase' |
'wallet_addEntropyStore' |
'ledger_getUnreceivedBlocksByAddress' |
'ledger_getUnreceivedBlocksInBatch' |
'ledger_getUnreceivedTransactionSummaryByAddress' |
'ledger_getUnreceivedTransactionSummaryInBatch' |
'ledger_getVmlogsByFilter' |
'ledger_getPoWDifficulty' |
'contract_createContractAddress' |
'contract_getContractInfo' |
'contract_callOffChainMethod' |
'contract_getContractStorage' |
'contract_getQuotaByAccount' |
'contract_getStakeList' |
'contract_getRequiredStakeAmount' |
'contract_getDelegatedStakeInfo' |
'contract_getSBPList' |
'contract_getSBPRewardPendingWithdrawal' |
'contract_getSBPRewardByTimestamp' |
'contract_getSBPRewardByCycle' |
'contract_getSBP' |
'contract_getSBPVoteList' |
'contract_getVotedSBP' |
'vote_getVoteDetails' |
'contract_getTokenInfoList' |
'contract_getTokenInfoById' |
'contract_getTokenInfoListByOwner' |
'net_syncInfo' |
'net_syncDetail' |
'net_nodeInfo' |
'net_peers' |
'util_getPoWNonce' |
'subscribe_createSnapshotBlockFilter' |
'subscribe_createAccountBlockFilter' |
'subscribe_createAccountBlockFilterByAddress' |
'subscribe_createUnreceivedBlockFilterByAddress' |
'subscribe_createVmlogFilter' |
'subscribe_uninstallFilter' |
'subscribe_getChangesByFilterId' |
'subscribe_createSnapshotBlockSubscription' |
'subscribe_createAccountBlockSubscription' |
'subscribe_createAccountBlockSubscriptionByAddress' |
'subscribe_createUnreceivedBlockSubscriptionByAddress' |
'subscribe_createVmlogSubscription';

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

export declare class ProviderType {
    isConnected: Boolean;

    constructor(provider: any, firstConnect: Function)

    setProvider(provider, firstConnect, abort)
    unsubscribe(event)
    unsubscribeAll()
    request(methods: Methods, ...args: any[])
    notification(methods: Methods, ...args: any[])
    batch(reqs: RPCrequest[])
    subscribe(methodName, ...args) 
}

export declare class ViteAPI extends ProviderType {
    transactionType: Object
    
    constructor(provider: any, firstConnect: Function)

    addTransactionType(contractList: Object)
    getBalanceInfo(address: Address)
    getTransactionList({ address, pageIndex, pageCount }: {
        address: Address; pageIndex: number; pageCount?: number;
    }, decodeTxTypeList: 'all' | String[])
}


export declare type AccountBlockBlock = {
    blockType: BlockType;
    address: Address;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    height?: Uint64;
    previousHash?: Hex;
    difficulty?: BigInt;
    nonce?: Base64;
    signature?: Base64;
    publicKey?: Base64;
    hash?: Hex
}

export declare class AccountBlockClassType {
    blockType: BlockType;
    address: Address;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    height?: Uint64;
    previousHash?: Hex;
    difficulty?: BigInt;
    nonce?: Base64;
    signature?: Base64;
    publicKey?: Base64;
    
    originalAddress: Hex;
    blockTypeHex: Hex;
    previousHashHex: Hex;
    heightHex: Hex;
    addressHex: Hex;
    toAddressHex: Hex;
    amountHex: Hex;
    tokenIdHex: Hex;
    sendBlockHashHex: Hex;
    dataHex: Hex;
    feeHex: Hex;
    nonceHex: Hex;
    hash: Hex;

    isRequestBlock: Boolean
    isResponseBlock: Boolean

    accountBlock: AccountBlockBlock

    constructor({ blockType, address, fee, data, sendBlockHash, amount, toAddress, tokenId }: {
        blockType: BlockType;
        address: Address;
        fee?: BigInt;
        data?: Base64;
        sendBlockHash?: Hex;
        amount?: BigInt;
        toAddress?: Address;
        tokenId?: TokenId;
    }, provider?: ProviderType, privateKey?: Hex)

    setProvider(provider: ProviderType)
    setPrivateKey(privateKey: Hex)

    getPreviousAccountBlock(): Promise<AccountBlockType>
    setHeight(height: Uint64): AccountBlockClassType
    setPreviousHash(previousHash: Hex): AccountBlockClassType
    setPreviousAccountBlock(previousAccountBlock: AccountBlockType): AccountBlockClassType
    autoSetPreviousAccountBlock(): Promise<{
        height: Uint64;
        previousHash: Hex;
    }>
    getToAddress(): Promise<Address>
    setToAddress(address: Address): AccountBlockClassType
    autoSetToAddress(): Promise<Address>
    autoSetProperty(): Promise<{
        height: Uint64;
        previousHash: Hex;
        toAddress: Address;
    }>

    getDifficulty(): Promise<BigInt>
    setDifficulty(difficulty: BigInt): AccountBlockClassType
    autoSetDifficulty(): Promise<BigInt> 
    getNonce(): Promise<Base64>
    setNonce(nonce: Base64): AccountBlockClassType
    autoSetNonce(): Promise<Base64>
    PoW(difficulty?: BigInt): Promise<{difficulty: BigInt; nonce: Base64}>

    setPublicKey(publicKey: Hex | Base64): AccountBlockClassType
    setSignature(signature: Hex | Base64): AccountBlockClassType
    sign(privateKey?: Hex): AccountBlockClassType

    send(): Promise<AccountBlockBlock>
    sendByPoW(privateKey?: Hex): Promise<AccountBlockBlock>
    
    autoSendByPoW(privateKey?: Hex): Promise<AccountBlockBlock>
    autoSend(privateKey?: Hex): Promise<AccountBlockBlock>
}
