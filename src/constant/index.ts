import { _methods } from './type';

export const Vite_TokenId = 'tti_5649544520544f4b454e6e40';
export const Vite_Token_Info = {
    decimals: 18,
    tokenId: Vite_TokenId,
    tokenName: 'Vite Token',
    tokenSymbol: 'VITE'
};

export const Default_Hash = '0000000000000000000000000000000000000000000000000000000000000000'; // A total of 64 0

export const Snapshot_Gid = '00000000000000000001';
export const Delegate_Gid = '00000000000000000002';

export const Pledge_Addr = 'vite_0000000000000000000000000000000000000003f6af7459b9';
export const Vote_Addr = 'vite_0000000000000000000000000000000000000004d28108e76b';
export const Register_Addr = 'vite_0000000000000000000000000000000000000004d28108e76b';
export const Mintage_Addr = 'vite_000000000000000000000000000000000000000595292d996d';
export const DexFund_Addr = 'vite_0000000000000000000000000000000000000006e82b8ba657';
export const DexTrade_Addr = 'vite_00000000000000000000000000000000000000079710f19dc7';

// SBP
export const Register_Abi = { 'type': 'function', 'name': 'Register', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'name', 'type': 'string' }, { 'name': 'nodeAddr', 'type': 'address' } ] };
export const UpdateRegistration_Abi = { 'type': 'function', 'name': 'UpdateRegistration', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'name', 'type': 'string' }, { 'name': 'nodeAddr', 'type': 'address' } ] };
export const CancelRegister_Abi = { 'type': 'function', 'name': 'CancelRegister', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'name', 'type': 'string' } ] };
export const Reward_Abi = { 'type': 'function', 'name': 'Reward', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'name', 'type': 'string' }, { 'name': 'beneficialAddr', 'type': 'address' } ] };

// Vote
export const Vote_Abi = { 'type': 'function', 'name': 'Vote', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'nodeName', 'type': 'string' } ] };
export const CancelVote_Abi = { 'type': 'function', 'name': 'CancelVote', 'inputs': [{ 'name': 'gid', 'type': 'gid' }] };

// Pledge
export const Pledge_Abi = { 'type': 'function', 'name': 'Pledge', 'inputs': [{ 'name': 'beneficial', 'type': 'address' }] };
export const CancelPledge_Abi = { 'type': 'function', 'name': 'CancelPledge', 'inputs': [ { 'name': 'beneficial', 'type': 'address' }, { 'name': 'amount', 'type': 'uint256' } ] };

// Mintage
export const Mint_Abi = { 'type': 'function', 'name': 'Mint', 'inputs': [ { 'name': 'isReIssuable', 'type': 'bool' }, { 'name': 'tokenName', 'type': 'string' }, { 'name': 'tokenSymbol', 'type': 'string' }, { 'name': 'totalSupply', 'type': 'uint256' }, { 'name': 'decimals', 'type': 'uint8' }, { 'name': 'maxSupply', 'type': 'uint256' }, { 'name': 'ownerBurnOnly', 'type': 'bool' } ] };
export const Issue_Abi = { 'type': 'function', 'name': 'Issue', 'inputs': [ { 'name': 'tokenId', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' }, { 'name': 'beneficial', 'type': 'address' } ] };
export const Burn_Abi = { 'type': 'function', 'name': 'Burn', 'inputs': [] };
export const TransferOwner_Abi = { 'type': 'function', 'name': 'TransferOwner', 'inputs': [ { 'name': 'tokenId', 'type': 'tokenId' }, { 'name': 'newOwner', 'type': 'address' } ] };
export const ChangeTokenType_Abi = { 'type': 'function', 'name': 'ChangeTokenType', 'inputs': [{ 'name': 'tokenId', 'type': 'tokenId' }] };

// DEX
export const DexTradeCancelOrder_Abi = { 'type': 'function', 'name': 'DexTradeCancelOrder', 'inputs': [{ 'name': 'orderId', 'type': 'bytes' }] };
export const DexFundUserDeposit_Abi = { 'type': 'function', 'name': 'DexFundUserDeposit', 'inputs': [] };
export const DexFundUserWithdraw_Abi = { 'type': 'function', 'name': 'DexFundUserWithdraw', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' } ] };
export const DexFundNewOrder_Abi = { 'type': 'function', 'name': 'DexFundNewOrder', 'inputs': [ { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'side', 'type': 'bool' }, { 'name': 'orderType', 'type': 'uint8' }, { 'name': 'price', 'type': 'string' }, { 'name': 'quantity', 'type': 'uint256' } ] };
export const DexFundNewMarket_Abi = { 'type': 'function', 'name': 'DexFundNewMarket', 'inputs': [ { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' } ] };
export const DexFundPledgeForVx_Abi = { 'type': 'function', 'name': 'DexFundPledgeForVx', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'amount', 'type': 'uint256' } ] };
export const DexFundPledgeForVip_Abi = { 'type': 'function', 'name': 'DexFundPledgeForVip', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };
export const DexFundBindInviteCode_Abi = { 'type': 'function', 'name': 'DexFundBindInviteCode', 'inputs': [{ 'name': 'code', 'type': 'uint32' }] };
export const DexFundNewInviter_Abi = { 'type': 'function', 'name': 'DexFundNewInviter', 'inputs': [] };
export const DexFundTransferTokenOwner_Abi = { 'type': 'function', 'name': 'DexFundTransferTokenOwner', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'owner', 'type': 'address' } ] };
export const DexFundMarketOwnerConfig_Abi = { 'type': 'function', 'name': 'DexFundMarketOwnerConfig', 'inputs': [ { 'name': 'operationCode', 'type': 'uint8' }, { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'owner', 'type': 'address' }, { 'name': 'takerFeeRate', 'type': 'int32' }, { 'name': 'makerFeeRate', 'type': 'int32' }, { 'name': 'stopMarket', 'type': 'bool' } ] };
export const DexFundPledgeForSuperVip_Abi = { 'type': 'function', 'name': 'DexFundPledgeForSuperVip', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };
export const DexFundConfigMarketsAgent_Abi = { 'type': 'function', 'name': 'DexFundConfigMarketsAgent', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'agent', 'type': 'address' }, { 'name': 'tradeTokens', 'type': 'tokenId[]' }, { 'name': 'quoteTokens', 'type': 'tokenId[]' } ] };

export enum BlockType {
    'CreateContractRequest' = 1,
    'TransferRequest',
    'ClaimSBPRewardsRequest',
    'Response',
    'ResponseFail',
    'RefundByContractRequest',
    'GenesisResponse'
}

export const Contracts = {
    SBPreg: {
        contractAddr: Register_Addr,
        abi: Register_Abi
    },
    UpdateReg: {
        contractAddr: Register_Addr,
        abi: UpdateRegistration_Abi
    },
    RevokeReg: {
        contractAddr: Register_Addr,
        abi: CancelRegister_Abi
    },
    RetrieveReward: {
        contractAddr: Register_Addr,
        abi: Reward_Abi
    },
    Voting: {
        contractAddr: Vote_Addr,
        abi: Vote_Abi
    },
    RevokeVoting: {
        contractAddr: Vote_Addr,
        abi: CancelVote_Abi
    },
    GetQuota: {
        contractAddr: Pledge_Addr,
        abi: Pledge_Abi
    },
    WithdrawalOfQuota: {
        contractAddr: Pledge_Addr,
        abi: CancelPledge_Abi
    },
    Mintage: {
        contractAddr: Mintage_Addr,
        abi: Mint_Abi
    },
    MintageIssue: {
        contractAddr: Mintage_Addr,
        abi: Issue_Abi
    },
    MintageBurn: {
        contractAddr: Mintage_Addr,
        abi: Burn_Abi
    },
    MintageTransferOwner: {
        contractAddr: Mintage_Addr,
        abi: TransferOwner_Abi
    },
    MintageChangeTokenType: {
        contractAddr: Mintage_Addr,
        abi: ChangeTokenType_Abi
    },
    DexFundUserDeposit: {
        contractAddr: DexFund_Addr,
        abi: DexFundUserDeposit_Abi
    },
    DexFundUserWithdraw: {
        contractAddr: DexFund_Addr,
        abi: DexFundUserWithdraw_Abi
    },
    DexFundNewOrder: {
        contractAddr: DexFund_Addr,
        abi: DexFundNewOrder_Abi
    },
    DexTradeCancelOrder: {
        contractAddr: DexTrade_Addr,
        abi: DexTradeCancelOrder_Abi
    },
    DexFundNewMarket: {
        contractAddr: DexFund_Addr,
        abi: DexFundNewMarket_Abi
    },
    DexFundPledgeForVx: {
        contractAddr: DexFund_Addr,
        abi: DexFundPledgeForVx_Abi
    },
    DexFundPledgeForVip: {
        contractAddr: DexFund_Addr,
        abi: DexFundPledgeForVip_Abi
    },
    DexFundBindInviteCode: {
        contractAddr: DexFund_Addr,
        abi: DexFundBindInviteCode_Abi
    },
    DexFundNewInviter: {
        contractAddr: DexFund_Addr,
        abi: DexFundNewInviter_Abi
    },
    DexFundTransferTokenOwner: {
        contractAddr: DexFund_Addr,
        abi: DexFundTransferTokenOwner_Abi
    },
    DexFundMarketOwnerConfig: {
        contractAddr: DexFund_Addr,
        abi: DexFundMarketOwnerConfig_Abi
    },
    DexFundPledgeForSuperVip: {
        contractAddr: DexFund_Addr,
        abi: DexFundPledgeForSuperVip_Abi
    },
    DexFundConfigMarketsAgent: {
        contractAddr: DexFund_Addr,
        abi: DexFundConfigMarketsAgent_Abi
    }
};

export const methods = _methods;
