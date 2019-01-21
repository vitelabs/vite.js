import * as _method from "./method";

export const Snapshot_Gid = '00000000000000000001';
export const Delegate_Gid = "00000000000000000002";
export const Default_Hash = '0000000000000000000000000000000000000000000000000000000000000000'; // A total of 64 0
export const Quota_Addr = 'vite_000000000000000000000000000000000000000309508ba646';
export const Vote_Addr = 'vite_000000000000000000000000000000000000000270a48cc491';
export const Register_Addr = 'vite_0000000000000000000000000000000000000001c9e9f25417';

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

export const method = _method;
