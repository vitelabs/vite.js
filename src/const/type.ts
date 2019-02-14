import methods from "const/method";

export declare type Hex = string;
export declare type Address = string;
export declare type Base64 = string;
export declare type TokenId = string;
export declare type Int64 = number;
export declare type Uint64 = string;
export declare type BigInt = string;

export type Methods = methods;

export declare interface RPCrequest {
    type?: string;
    methodName: methods;
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
    TxResFail,
    SendRefund
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
    TxResFail,
    SendRefund
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
    fee?: BigInt,
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
    fee?: BigInt,
    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex,
    nonce?: Base64
}

export declare type createContractBlock = {
    accountAddress: Address, 
    hexCode: Hex, 
    abi: string, 
    tokenId: TokenId,
    amount: BigInt,
    fee: BigInt,
    params?: string,
    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex
}

export declare type callContractBlock = {
    accountAddress: Address, 
    toAddress: Address,
    jsonInterface: object, 
    tokenId: TokenId,
    amount: BigInt,
    params?: [],
    prevHash?: Hex,
    height?: Uint64,
    snapshotHash?: Hex
}

export declare type AddrObj = {
    addr: string, 
    pubKey: Hex, 
    privKey: Hex, 
    hexAddr: Address
}
