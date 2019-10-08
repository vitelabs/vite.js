export declare type Uint64 = String;
export declare type Uint8 = String;
export declare type Uint16 = String;
export declare type Hex = String;
export declare type Address = String;
export declare type Base64 = String;
export declare type TokenId = String;
export declare type BigInt = String;

export enum BlockType {
    'CreateContractRequest' = 1,
    'TransferRequest',
    'ReIssueRequest',
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

export declare type AccountBlock = {
    blockType: BlockType;
    height: Uint64;
    hash: Hex;
    previousHash: Hex;
    address: Address;
    publicKey: Base64;
    producer: Address;
    fromAddress: Address;
    toAddress: Address;
    sendBlockHash: Hex;
    tokenId: TokenId;
    amount: BigInt;
    tokenInfo: TokenInfo;
    fee: BigInt;
    data: Base64;
    difficulty: BigInt;
    nonce: Base64;
    signature: Base64;
    quotaByStake: Uint64;
    totalQuota: Uint64;
    vmlogHash: Hex;
    triggeredSendBlockList: Array<AccountBlock>;
    confirmations: Uint64;
    firstSnapshotHash: Hex;
    timestamp: Uint64;
    receiveBlockHeight: Uint64;
    receiveBlockHash: Hex;
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
