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

export const Staking_ContractAddress = 'vite_0000000000000000000000000000000000000003f6af7459b9';
export const ConsensusGroup_ContractAddress = 'vite_0000000000000000000000000000000000000004d28108e76b';
export const TokenIssuance_ContractAddress = 'vite_000000000000000000000000000000000000000595292d996d';
export const DexFund_ContractAddress = 'vite_0000000000000000000000000000000000000006e82b8ba657';
export const DexTrade_ContractAddress = 'vite_00000000000000000000000000000000000000079710f19dc7';

// SBP
export const RegisterSBP_Abi = { 'type': 'function', 'name': 'Register', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' }, { 'name': 'blockProducingAddress', 'type': 'address' } ] };
export const UpdateBlockProducingAddress_Abi = { 'type': 'function', 'name': 'UpdateBlockProducingAddress', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' }, { 'name': 'newBlockProducingAddress', 'type': 'address' } ] };
export const RevokeSBP_Abi = { 'type': 'function', 'name': 'Revoke', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' } ] };
export const WithdrawSBPReward_Abi = { 'type': 'function', 'name': 'WithdrawReward', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' }, { 'name': 'receiveAddress', 'type': 'address' } ] };

// Vote
export const VoteForSBP_Abi = { 'type': 'function', 'name': 'Vote', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' } ] };
export const CancelVote_Abi = { 'type': 'function', 'name': 'CancelVote', 'inputs': [{ 'name': 'gid', 'type': 'gid' }] };

// Stake
export const StakeForQuota_Abi = { 'type': 'function', 'name': 'Stake', 'inputs': [{ 'name': 'beneficiary', 'type': 'address' }] };
export const CancelStake_Abi = { 'type': 'function', 'name': 'CancelStake', 'inputs': [ { 'name': 'beneficiary', 'type': 'address' }, { 'name': 'amount', 'type': 'uint256' } ] };

// Mintage
export const IssueToken_Abi = { 'type': 'function', 'name': 'IssueToken', 'inputs': [ { 'name': 'isReIssuable', 'type': 'bool' }, { 'name': 'tokenName', 'type': 'string' }, { 'name': 'tokenSymbol', 'type': 'string' }, { 'name': 'totalSupply', 'type': 'uint256' }, { 'name': 'decimals', 'type': 'uint8' }, { 'name': 'maxSupply', 'type': 'uint256' }, { 'name': 'isOwnerBurnOnly', 'type': 'bool' } ] };
export const ReIssueToken_Abi = { 'type': 'function', 'name': 'ReIssue', 'inputs': [ { 'name': 'tokenId', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' }, { 'name': 'receiveAddress', 'type': 'address' } ] };
export const BurnToken_Abi = { 'type': 'function', 'name': 'Burn', 'inputs': [] };
export const TransferTokenOwnership_Abi = { 'type': 'function', 'name': 'TransferOwnership', 'inputs': [ { 'name': 'tokenId', 'type': 'tokenId' }, { 'name': 'newOwner', 'type': 'address' } ] };
export const DisableReIssue_Abi = { 'type': 'function', 'name': 'DisableReIssue', 'inputs': [{ 'name': 'tokenId', 'type': 'tokenId' }] };

// DEX
export const DexDeposit_Abi = { 'type': 'function', 'name': 'Deposit', 'inputs': [] };
export const DexWithdraw_Abi = { 'type': 'function', 'name': 'Withdraw', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' } ] };
export const DexCreateOrder_Abi = { 'type': 'function', 'name': 'PlaceOrder', 'inputs': [ { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'side', 'type': 'bool' }, { 'name': 'orderType', 'type': 'uint8' }, { 'name': 'price', 'type': 'string' }, { 'name': 'quantity', 'type': 'uint256' } ] };
export const DexCancelOrder_Abi =  { 'type': 'function', 'name': 'CancelOrder', 'inputs': [{ 'name': 'orderId', 'type': 'bytes' }] };
export const DexOpenNewMarket_Abi =  { 'type': 'function', 'name': 'OpenNewMarket', 'inputs': [ { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' } ] };
export const DexStakeForMining_Abi = { 'type': 'function', 'name': 'StakeForMining', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'amount', 'type': 'uint256' } ] };
export const DexStakeForVIP_Abi = { 'type': 'function', 'name': 'StakeForVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };
export const DexBindInviteCode_Abi = { 'type': 'function', 'name': 'BindInviteCode', 'inputs': [{ 'name': 'code', 'type': 'uint32' }] };
export const DexCreateInviteCode_Abi = { 'type': 'function', 'name': 'CreateInviteCode', 'inputs': [] };
export const DexTransferTokenOwnership_Abi = { 'type': 'function', 'name': 'TransferTokenOwnership', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'newOwner', 'type': 'address' } ] };
export const DexMarketAdminConfig_Abi = { 'type': 'function', 'name': 'MarketAdminConfig', 'inputs': [ { 'name': 'operationCode', 'type': 'uint8' }, { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'marketOwner', 'type': 'address' }, { 'name': 'takerFeeRate', 'type': 'int32' }, { 'name': 'makerFeeRate', 'type': 'int32' }, { 'name': 'stopMarket', 'type': 'bool' } ] };
export const DexStakeForSuperVIP_Abi = { 'type': 'function', 'name': 'StakeForSuperVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };
export const DexConfigMarketAgents_Abi = { 'type': 'function', 'name': 'ConfigMarketAgents', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'agent', 'type': 'address' }, { 'name': 'tradeTokens', 'type': 'tokenId[]' }, { 'name': 'quoteTokens', 'type': 'tokenId[]' } ] };

export enum BlockType {
    'CreateContractRequest' = 1,
    'TransferRequest',
    'ReIssueRequest',
    'Response',
    'ResponseFail',
    'RefundByContractRequest',
    'GenesisResponse'
}

export const Contracts = {
    RegisterSBP: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: RegisterSBP_Abi
    },
    UpdateBlockProducingAddress: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: UpdateBlockProducingAddress_Abi
    },
    RevokeSBP: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: RevokeSBP_Abi
    },
    WithdrawSBPReward: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: WithdrawSBPReward_Abi
    },
    VoteForSBP: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: VoteForSBP_Abi
    },
    CancelVote: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: CancelVote_Abi
    },
    StakeForQuota: {
        contractAddress: Staking_ContractAddress,
        abi: StakeForQuota_Abi
    },
    CancelStake: {
        contractAddress: Staking_ContractAddress,
        abi: CancelStake_Abi
    },
    IssueToken: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: IssueToken_Abi
    },
    ReIssueToken: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: ReIssueToken_Abi
    },
    BurnToken: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: BurnToken_Abi
    },
    TransferTokenOwnership: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: TransferTokenOwnership_Abi
    },
    DisableReIssue: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: DisableReIssue_Abi
    },
    DexDeposit: {
        contractAddress: DexFund_ContractAddress,
        abi: DexDeposit_Abi
    },
    DexWithdraw: {
        contractAddress: DexFund_ContractAddress,
        abi: DexWithdraw_Abi
    },
    DexCreateOrder: {
        contractAddress: DexFund_ContractAddress,
        abi: DexCreateOrder_Abi
    },
    DexCancelOrder: {
        contractAddress: DexTrade_ContractAddress,
        abi: DexCancelOrder_Abi
    },
    DexOpenNewMarket: {
        contractAddress: DexFund_ContractAddress,
        abi: DexOpenNewMarket_Abi
    },
    DexStakeForMining: {
        contractAddress: DexFund_ContractAddress,
        abi: DexStakeForMining_Abi
    },
    DexStakeForVIP: {
        contractAddress: DexFund_ContractAddress,
        abi: DexStakeForVIP_Abi
    },
    DexBindInviteCode: {
        contractAddress: DexFund_ContractAddress,
        abi: DexBindInviteCode_Abi
    },
    DexCreateInviteCode: {
        contractAddress: DexFund_ContractAddress,
        abi: DexCreateInviteCode_Abi
    },
    DexTransferTokenOwnership: {
        contractAddress: DexFund_ContractAddress,
        abi: DexTransferTokenOwnership_Abi
    },
    DexMarketAdminConfig: {
        contractAddress: DexFund_ContractAddress,
        abi: DexMarketAdminConfig_Abi
    },
    DexStakeForSuperVIP: {
        contractAddress: DexFund_ContractAddress,
        abi: DexStakeForSuperVIP_Abi
    },
    DexConfigMarketAgents: {
        contractAddress: DexFund_ContractAddress,
        abi: DexConfigMarketAgents_Abi
    }
};
