const assert = require('assert');
import * as constant from '../../src/constant/index';

const property = { 'Vite_TokenId': 'tti_5649544520544f4b454e6e40' };

const required = [
    'Snapshot_Gid',
    'Delegate_Gid',
    'Staking_ContractAddress',
    'ConsensusGroup_ContractAddress',
    'TokenIssuance_ContractAddress',
    'DexFund_ContractAddress',
    'DexTrade_ContractAddress',
    'RegisterSBP_Abi',
    'UpdateBlockProducingAddress_Abi',
    'RevokeSBP_Abi',
    'WithdrawSBPReward_Abi',
    'VoteForSBP_Abi',
    'CancelVote_Abi',
    'StakeForQuota_Abi',
    'CancelStake_Abi',
    'IssueToken_Abi',
    'ReIssueToken_Abi',
    'BurnToken_Abi',
    'TransferTokenOwnership_Abi',
    'DisableReIssue_Abi',
    'DexDeposit_Abi',
    'DexWithdraw_Abi',
    'DexCancelOrder_Abi',
    'DexCreateOrder_Abi',
    'DexOpenNewMarket_Abi',
    'Contracts'
];

const enumType = { 'BlockType': 7 * 2 };

describe('constant enumType and property', function () {
    for (const key in property) {
        assert.equal(constant[key], property[key]);
    }

    for (const key in enumType) {
        it(key, function () {
            assert.equal(!!constant[key], true);
        });
        constant[key] && it(`${ key } length`, function () {
            assert.equal(Object.keys(constant[key]).length, enumType[key]);
        });
    }
});

describe('constant required keys', function () {
    required.forEach(key => {
        it(key, function () {
            assert.equal(!!constant[key], true);
        });
    });
});
