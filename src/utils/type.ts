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
export declare type Bytes32 = string;

export enum TransactionType {
    'RegisterSBP' = 1,
    'UpdateSBPBlockProducingAddress',
    'UpdateSBPRewardWithdrawAddress',
    'RevokeSBP',
    'WithdrawSBPReward',
    'VoteForSBP',
    'CancelSBPVoting',
    'StakeForQuota',
    'CancelQuotaStake',
    'IssueToken',
    'ReIssueToken',
    'BurnToken',
    'TransferTokenOwnership',
    'DisableReIssue',
    'CreateContractRequest',
    'TransferRequest',
    'ReIssueRequest',
    'Response',
    'ResponseFail',
    'RefundByContractRequest',
    'GenesisResponse',
    'RegisterSBP_V1',
    'UpdateSBPBlockProducingAddress_V1',
    'UpdateSBPBlockProducingAddress_V2',
    'RevokeSBP_V1',
    'RevokeSBP_V2',
    'WithdrawSBPReward_V1',
    'WithdrawSBPReward_V2',
    'VoteForSBP_V1',
    'CancelSBPVoting_V1',
    'StakeForQuota_V1',
    'StakeForQuota_V2',
    'CancelQuotaStake_V1',
    'CancelQuotaStake_V2',
    'IssueToken_V1',
    'ReIssueToken_V1',
    'TransferTokenOwnership_V1',
    'DisableReIssue_V1',
    'DexDeposit_V1',
    'DexWithdraw_V1',
    'DexPlaceOrder_V1',
    'DexCancelOrder_V1',
    'DexOpenNewMarket_V1',
    'DexStakeForMining_V1',
    'DexStakeForVIP_V1',
    'DexBindInviteCode_V1',
    'DexCreateNewInviter_V1',
    'DexTransferTokenOwnership_V1',
    'DexMarketAdminConfig_V1',
    'DexStakeForSuperVIP_V1',
    'DexConfigMarketAgents_V1',
    'DexDeposit',
    'DexWithdraw',
    'DexPlaceOrder',
    'DexCancelOrder',
    'DexOpenNewMarket',
    'DexStakeForMining',
    'DexStakeForVIP',
    'DexBindInviteCode',
    'DexCreateNewInviter',
    'DexTransferTokenOwnership',
    'DexMarketAdminConfig',
    'DexStakeForSuperVIP',
    'DexConfigMarketAgents',
    'DexLockVxForDividend',
    'DexSwitchConfig',
    'DexStakeForPrincipalSVIP',
    'DexCancelStakeById'
}

export declare type TokenInfo = {
    tokenName: string;
    tokenSymbol: string;
    totalSupply: BigInt;
    decimals: Uint8;
    owner: Address;
    tokenId: TokenId;
    isReIssuable: boolean;
    maxSupply: BigInt;
    isOwnerBurnOnly: boolean;
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
    transactionType?: string;
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

export declare type Methods = string |
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
'subscribe_newSnapshotBlockFilter' |
'subscribe_newAccountBlockFilter' |
'subscribe_newAccountBlockByAddressFilter' |
'subscribe_newUnreceivedBlockByAddressFilter' |
'subscribe_newVmLogFilter' |
'subscribe_uninstallFilter' |
'subscribe_getChangesByFilterId' |
'subscribe_newSnapshotBlock' |
'subscribe_newAccountBlock' |
'subscribe_newAccountBlockByAddress' |
'subscribe_newUnreceivedBlockByAddress' |
'subscribe_newVmLog';

export declare interface RPCRequest {
    type?: string;
    methodName: Methods;
    params: any[];
}

export declare interface RPCResponse {
    jsonrpc?: string;
    id?: number;
    result?: any;
    error?: RPCError;
}

export declare interface RPCError {
    code: number;
    message: string;
}

export declare class ProviderType {
    isConnected: boolean;

    constructor(provider: any, onInitCallback: Function)

    setProvider(provider, onInitCallback, abort)
    unsubscribe(event)
    unsubscribeAll()
    request(methods: Methods, ...args: any[])
    sendNotification(methods: Methods, ...args: any[])
    batch(reqs: RPCRequest[])
    subscribe(methodName, ...args)
}

export declare class ViteAPI extends ProviderType {
    transactionType: Object;

    constructor(provider: any, onInitCallback: Function)

    addTransactionType(contractList: Object)
    getBalanceInfo(address: Address)
    getTransactionList({ address, pageIndex, pageSize }: {
        address: Address; pageIndex: number; pageSize?: number;
    }, decodeTxTypeList: 'all' | string[])

    callOffChainContract({ address, abi, code, params })
    queryContractState({ address, abi, methodName, params })
    getNonce({ difficulty, previousHash, address }: {
        difficulty: BigInt;
        previousHash: Hex;
        address: Address;
    }): Promise<Base64>
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

    isRequestBlock: boolean;
    isResponseBlock: boolean;

    accountBlock: AccountBlockBlock;

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
