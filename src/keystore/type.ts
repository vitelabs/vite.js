export declare type Hex = string;
export declare type Address = string;
export declare type Base64 = string;
export declare type TokenId = string;
export declare type Int64 = number;
export declare type Uint8 = string;
export declare type Uint16 = string;
export declare type Uint64 = string;
export declare type BigInt = string;

export enum TransactionType {
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
    contractResult?: Object;
}

// export declare type AccountBlock = {
//     accountAddress: Address;
//     blockType: BlockType;
//     prevHash: Hex;
//     height: Uint64;
//     hash: Hex;
//     signature: Base64;
//     publicKey: Base64;
//     fee?: BigInt;
//     fromBlockHash?: Hex;
//     toAddress?: Address;
//     tokenId?: TokenId;
//     amount?: BigInt;
//     data?: Base64;
//     nonce?: Base64;
// }

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
    address: Address;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
}

export declare type afterHeightAccountBlock = {
    blockType: BlockType;
    address: Address;
    height: Uint64;
    previousHash: Hex;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
}

export declare type afterPOWAccountBlock = {
    blockType: BlockType;
    address: Address;
    height: Uint64;
    previousHash: Hex;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    difficulty?: BigInt;
    nonce?: Base64;
}

export declare type afterHashAccountBlock = {
    blockType: BlockType;
    address: Address;
    height: Uint64;
    previousHash: Hex;
    hash: Hex;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    difficulty?: BigInt;
    nonce?: Base64;
}

export declare type afterSignAccountBlock = {
    blockType: BlockType;
    address: Address;
    height: Uint64;
    previousHash: Hex;
    hash: Hex;
    publicKey: Base64;
    signature: Base64;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    difficulty?: BigInt;
    nonce?: Base64;
}

export declare type AllAccountBlock = {
    blockType: BlockType;
    address: Address;
    height?: Uint64;
    previousHash?: Hex;
    hash?: Hex;
    publicKey?: Base64;
    signature?: Base64;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    difficulty?: BigInt;
    nonce?: Base64;
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

export declare class EventEmitter {
    readonly id: string
    readonly viteAPI: ViteAPI
    readonly isSubscribe: boolean

    constructor(id:string, subscription: ViteAPI, isSubscribe:Boolean);

    on(callback: Function);
    off();
    emit(result:any);
    startLoop(cb: Function, time: number)
    stopLoop()
}

export declare class ViteAPI {
    _provider: any;
    isConnected: Boolean;

    constructor(provider: any, firstConnect: Function)

    addTransactionType(contractList: Object)
    getBalanceAndUnreceived(address: Address)
    getTransactionList({ address, pageIndex, pageCount }: {
        address: Address; pageIndex: number; pageCount?: number;
    }, decodeTxTypeList: 'all' | String[])
    setProvider(provider, firstConnect, abort)
    unSubscribe(event)
    clearSubscriptions()
    request(methods: Methods, ...args: any[])
    notification(methods: Methods, ...args: any[])
    batch(reqs: RPCrequest[])
    subscribe(methodName, ...args) 
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
    
    realAddress: Hex;
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
    })

    getHeight(viteAPI: ViteAPI): Promise<{height: Uint64, previousHash: Hex }>
    setHeight({ height, previousHash }: {
        height: Uint64;
        previousHash: Hex;
    })
    getDifficulty(viteAPI: ViteAPI): Promise<{
        requiredQuota: Uint64;
        difficulty: BigInt;
        qc: BigInt;
        isCongestion: Boolean;
    }>;
    setDifficulty(difficulty: BigInt)
    getNonce(viteAPI: ViteAPI): Promise<Base64>
    setNonce(nonce: Base64)
    autoSetNonce(viteAPI: ViteAPI): Promise<{difficulty: BigInt, nonce: Base64}>
    setPublicKey(publicKey: Buffer | Hex)
    setSignature(signature: Base64)
    sign(privateKey: Buffer | Hex): AccountBlockBlock
}
