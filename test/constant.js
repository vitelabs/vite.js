const assert = require('assert');
import * as constant from '../src/constant';

const property = {
    'Vite_TokenId': 'tti_5649544520544f4b454e6e40',
    'Default_Hash': '0000000000000000000000000000000000000000000000000000000000000000'
};

const required = [
    'Snapshot_Gid',
    'Delegate_Gid',
    'Quota_Addr',
    'Vote_Addr',
    'Register_Addr',
    'Mintage_Addr',
    'DexFund_Addr',
    'DexTrade_Addr',
    'Register_Abi',
    'UpdateRegistration_Abi',
    'CancelRegister_Abi',
    'Reward_Abi',
    'Vote_Abi',
    'CancelVote_Abi',
    'Pledge_Abi',
    'CancelPledge_Abi',
    'Mint_Abi',
    'Issue_Abi',
    'Burn_Abi',
    'TransferOwner_Abi',
    'ChangeTokenType_Abi',
    'CancelMintPledge_Abi',
    'DexFundUserDeposit_Abi',
    'DexFundUserWithdraw_Abi',
    'DexTradeCancelOrder_Abi',
    'DexFundNewOrder_Abi',
    'DexFundNewMarket_Abi',
    'contractAddrs',
    'abiFuncSignature',
    'methods'
];

const enumType = {
    'BlockType': 7 * 2,
    'BuiltinTxType': 26 * 2,
    'LangList': 8
};


it('constant.key is error', function () {
    for (const key in property) {
        assert.equal(constant[key], property[key]);
    }

    for (const key in enumType) {
        assert.equal(!!constant[key], true);
        constant[key] && assert.equal(Object.keys(constant[key]).length, enumType[key]);
    }
});

it('constant.key is null', function () {
    required.forEach(key => {
        assert.equal(!!constant[key], true);
    });
});
