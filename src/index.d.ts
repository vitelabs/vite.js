import methods from "./const/method";

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
    Method: methods;
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
    createContractReq = 1,
    txReq,
    rewardReq,
    txRes,
    txResFail
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
    createContractReq,
    txReq,
    rewardReq,
    txRes,
    txResFail
}

export declare type SignBlock = {
    accountAddress: Address,
    blockType: BlockType,
    prevHash: Hex,
    snapshotHash: Hex,
    timestamp: Int64,
    height: Uint64,
    fee: BigInt,
    fromBlockHash?: Hex,
    toAddress?: Address,
    tokenId?: TokenId,
    amount?: BigInt,
    data?: Base64,
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
    fee: BigInt,
    hash: Hex,
    signature: Base64,
    publicKey: Base64,
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

