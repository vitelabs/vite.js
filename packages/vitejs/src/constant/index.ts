export const Vite_TokenId = 'tti_5649544520544f4b454e6e40';
export const Vite_Token_Info = {
    decimals: 18,
    tokenId: Vite_TokenId,
    tokenName: 'Vite Token',
    tokenSymbol: 'VITE'
};

export const VX_TokenId = 'tti_564954455820434f494e69b5';
export const VX_Token_Info = {
    decimals: 18,
    tokenId: VX_TokenId,
    tokenName: 'ViteX Coin',
    tokenSymbol: 'VX'
};

export const Snapshot_Gid = '00000000000000000001';
export const Delegate_Gid = '00000000000000000002';

export const Staking_ContractAddress = 'vite_0000000000000000000000000000000000000003f6af7459b9';
export const ConsensusGroup_ContractAddress = 'vite_0000000000000000000000000000000000000004d28108e76b';
export const TokenIssuance_ContractAddress = 'vite_000000000000000000000000000000000000000595292d996d';
export const DexFund_ContractAddress = 'vite_0000000000000000000000000000000000000006e82b8ba657';
export const DexTrade_ContractAddress = 'vite_00000000000000000000000000000000000000079710f19dc7';

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
    RegisterSBP_V1: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'Register', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' }, { 'name': 'blockProducingAddress', 'type': 'address' } ] }
    },
    UpdateSBPBlockProducingAddress_V1: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'UpdateRegistration', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'name', 'type': 'string' }, { 'name': 'nodeAddr', 'type': 'address' } ] }
    },
    UpdateSBPBlockProducingAddress_V2: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'UpdateBlockProducingAddress', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' }, { 'name': 'newBlockProducingAddress', 'type': 'address' } ] }
    },
    RevokeSBP_V1: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'CancelRegister', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'name', 'type': 'string' } ] }
    },
    RevokeSBP_V2: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'Revoke', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' } ] }
    },
    WithdrawSBPReward_V1: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'Reward', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'name', 'type': 'string' }, { 'name': 'beneficialAddr', 'type': 'address' } ] }
    },
    WithdrawSBPReward_V2: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'WithdrawReward', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' }, { 'name': 'receiveAddress', 'type': 'address' } ] }
    },
    VoteForSBP_V1: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'Vote', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' } ] }
    },
    CancelSBPVoting_V1: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'CancelVote', 'inputs': [{ 'name': 'gid', 'type': 'gid' }] }
    },
    StakeForQuota_V1: {
        contractAddress: Staking_ContractAddress,
        abi: { 'type': 'function', 'name': 'Pledge', 'inputs': [{ 'name': 'beneficial', 'type': 'address' }] }
    },
    StakeForQuota_V2: {
        contractAddress: Staking_ContractAddress,
        abi: { 'type': 'function', 'name': 'Stake', 'inputs': [{ 'name': 'beneficiary', 'type': 'address' }] }
    },
    CancelQuotaStake_V1: {
        contractAddress: Staking_ContractAddress,
        abi: { 'type': 'function', 'name': 'CancelPledge', 'inputs': [ { 'name': 'beneficial', 'type': 'address' }, { 'name': 'amount', 'type': 'uint256' } ] }
    },
    CancelQuotaStake_V2: {
        contractAddress: Staking_ContractAddress,
        abi: { 'type': 'function', 'name': 'CancelStake', 'inputs': [ { 'name': 'beneficiary', 'type': 'address' }, { 'name': 'amount', 'type': 'uint256' } ] }
    },
    IssueToken_V1: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: { 'type': 'function', 'name': 'Mint', 'inputs': [ { 'name': 'isReIssuable', 'type': 'bool' }, { 'name': 'tokenName', 'type': 'string' }, { 'name': 'tokenSymbol', 'type': 'string' }, { 'name': 'totalSupply', 'type': 'uint256' }, { 'name': 'decimals', 'type': 'uint8' }, { 'name': 'maxSupply', 'type': 'uint256' }, { 'name': 'ownerBurnOnly', 'type': 'bool' } ] }
    },
    ReIssueToken_V1: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: { 'type': 'function', 'name': 'Issue', 'inputs': [ { 'name': 'tokenId', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' }, { 'name': 'beneficial', 'type': 'address' } ] }
    },
    TransferTokenOwnership_V1: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: { 'type': 'function', 'name': 'TransferOwner', 'inputs': [ { 'name': 'tokenId', 'type': 'tokenId' }, { 'name': 'newOwner', 'type': 'address' } ] }
    },
    DisableReIssue_V1: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: { 'type': 'function', 'name': 'ChangeTokenType', 'inputs': [{ 'name': 'tokenId', 'type': 'tokenId' }] }
    },
    DexDeposit_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundUserDeposit', 'inputs': [] }
    },
    DexWithdraw_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundUserWithdraw', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' } ] }
    },
    DexPlaceOrder_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundNewOrder', 'inputs': [ { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'side', 'type': 'bool' }, { 'name': 'orderType', 'type': 'uint8' }, { 'name': 'price', 'type': 'string' }, { 'name': 'quantity', 'type': 'uint256' } ] }
    },
    DexCancelOrder_V1: {
        contractAddress: DexTrade_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexTradeCancelOrder', 'inputs': [{ 'name': 'orderId', 'type': 'bytes' }] }
    },
    DexOpenNewMarket_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundNewMarket', 'inputs': [ { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' } ] }
    },
    DexStakeForMining_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundPledgeForVx', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'amount', 'type': 'uint256' } ] }
    },
    DexStakeForVIP_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundPledgeForVip', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] }
    },
    DexBindInviteCode_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundBindInviteCode', 'inputs': [{ 'name': 'code', 'type': 'uint32' }] }
    },
    DexCreateNewInviter_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundNewInviter', 'inputs': [] }
    },
    DexTransferTokenOwnership_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundTransferTokenOwner', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'owner', 'type': 'address' } ] }
    },
    DexMarketAdminConfig_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundMarketOwnerConfig', 'inputs': [ { 'name': 'operationCode', 'type': 'uint8' }, { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'owner', 'type': 'address' }, { 'name': 'takerFeeRate', 'type': 'int32' }, { 'name': 'makerFeeRate', 'type': 'int32' }, { 'name': 'stopMarket', 'type': 'bool' } ] }
    },
    DexStakeForSuperVIP_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundPledgeForSuperVip', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] }
    },
    DexConfigMarketAgents_V1: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'DexFundConfigMarketsAgent', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'agent', 'type': 'address' }, { 'name': 'tradeTokens', 'type': 'tokenId[]' }, { 'name': 'quoteTokens', 'type': 'tokenId[]' } ] }
    },

    RegisterSBP: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'RegisterSBP', 'inputs': [ { 'name': 'sbpName', 'type': 'string' }, { 'name': 'blockProducingAddress', 'type': 'address' }, { 'name': 'rewardWithdrawAddress', 'type': 'address' } ] }
    },
    UpdateSBPBlockProducingAddress: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'UpdateSBPBlockProducingAddress', 'inputs': [ { 'name': 'sbpName', 'type': 'string' }, { 'name': 'blockProducingAddress', 'type': 'address' } ] }
    },
    UpdateSBPRewardWithdrawAddress: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'UpdateSBPRewardWithdrawAddress', 'inputs': [ { 'name': 'sbpName', 'type': 'string' }, { 'name': 'rewardWithdrawAddress', 'type': 'address' } ] }
    },
    RevokeSBP: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'RevokeSBP', 'inputs': [{ 'name': 'sbpName', 'type': 'string' }] }
    },
    WithdrawSBPReward: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'WithdrawSBPReward', 'inputs': [ { 'name': 'sbpName', 'type': 'string' }, { 'name': 'receiveAddress', 'type': 'address' } ] }
    },
    VoteForSBP: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'VoteForSBP', 'inputs': [{ 'name': 'sbpName', 'type': 'string' }] }
    },
    CancelSBPVoting: {
        contractAddress: ConsensusGroup_ContractAddress,
        abi: { 'type': 'function', 'name': 'CancelSBPVoting', 'inputs': [] }
    },
    StakeForQuota: {
        contractAddress: Staking_ContractAddress,
        abi: { 'type': 'function', 'name': 'StakeForQuota', 'inputs': [{ 'name': 'beneficiary', 'type': 'address' }] }
    },
    CancelQuotaStake: {
        contractAddress: Staking_ContractAddress,
        abi: { 'type': 'function', 'name': 'CancelQuotaStaking', 'inputs': [{ 'name': 'id', 'type': 'bytes32' }] }
    },
    IssueToken: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: { 'type': 'function', 'name': 'IssueToken', 'inputs': [ { 'name': 'isReIssuable', 'type': 'bool' }, { 'name': 'tokenName', 'type': 'string' }, { 'name': 'tokenSymbol', 'type': 'string' }, { 'name': 'totalSupply', 'type': 'uint256' }, { 'name': 'decimals', 'type': 'uint8' }, { 'name': 'maxSupply', 'type': 'uint256' }, { 'name': 'isOwnerBurnOnly', 'type': 'bool' } ] }
    },
    ReIssueToken: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: { 'type': 'function', 'name': 'ReIssue', 'inputs': [ { 'name': 'tokenId', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' }, { 'name': 'receiveAddress', 'type': 'address' } ] }
    },
    BurnToken: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: { 'type': 'function', 'name': 'Burn', 'inputs': [] }
    },
    TransferTokenOwnership: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: { 'type': 'function', 'name': 'TransferOwnership', 'inputs': [ { 'name': 'tokenId', 'type': 'tokenId' }, { 'name': 'newOwner', 'type': 'address' } ] }
    },
    DisableReIssue: {
        contractAddress: TokenIssuance_ContractAddress,
        abi: { 'type': 'function', 'name': 'DisableReIssue', 'inputs': [{ 'name': 'tokenId', 'type': 'tokenId' }] }
    },
    DexDeposit: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'Deposit', 'inputs': [] }
    },
    DexWithdraw: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'Withdraw', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'amount', 'type': 'uint256' } ] }
    },
    DexOpenNewMarket: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'OpenNewMarket', 'inputs': [ { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' } ] }
    },
    DexPlaceOrder: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'PlaceOrder', 'inputs': [ { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'side', 'type': 'bool' }, { 'name': 'orderType', 'type': 'uint8' }, { 'name': 'price', 'type': 'string' }, { 'name': 'quantity', 'type': 'uint256' } ] }
    },
    DexCancelOrder: {
        contractAddress: DexTrade_ContractAddress,
        abi: { 'type': 'function', 'name': 'CancelOrder', 'inputs': [{ 'name': 'orderId', 'type': 'bytes' }] }
    },
    DexStakeForMining: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'StakeForMining', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'amount', 'type': 'uint256' } ] }
    },
    DexStakeForVIP: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'StakeForVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] }
    },
    DexMarketAdminConfig: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'MarketAdminConfig', 'inputs': [ { 'name': 'operationCode', 'type': 'uint8' }, { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'marketOwner', 'type': 'address' }, { 'name': 'takerFeeRate', 'type': 'int32' }, { 'name': 'makerFeeRate', 'type': 'int32' }, { 'name': 'stopMarket', 'type': 'bool' } ] }
    },
    DexTransferTokenOwnership: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'TransferTokenOwnership', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'newOwner', 'type': 'address' } ] }
    },
    DexCreateNewInviter: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'CreateNewInviter', 'inputs': [] }
    },
    DexBindInviteCode: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'BindInviteCode', 'inputs': [{ 'name': 'code', 'type': 'uint32' }] }
    },
    DexStakeForSuperVIP: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'StakeForSVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] }
    },
    DexConfigMarketAgents: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'ConfigMarketAgents', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'agent', 'type': 'address' }, { 'name': 'tradeTokens', 'type': 'tokenId[]' }, { 'name': 'quoteTokens', 'type': 'tokenId[]' } ] }
    },
    DexLockVxForDividend: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'LockVxForDividend', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'amount', 'type': 'uint256' } ] }
    },
    DexSwitchConfig: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'SwitchConfig', 'inputs': [ { 'name': 'switchType', 'type': 'uint8' }, { 'name': 'enable', 'type': 'bool' } ] }
    },
    DexStakeForPrincipalSVIP: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'StakeForPrincipalSVIP', 'inputs': [{ 'name': 'principal', 'type': 'address' }] }
    },
    DexCancelStakeById: {
        contractAddress: DexFund_ContractAddress,
        abi: { 'type': 'function', 'name': 'CancelStakeById', 'inputs': [{ 'name': 'id', 'type': 'bytes32' }] }
    }
};
