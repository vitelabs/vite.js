const assert = require('assert');
import * as constant from '../../src/constant/index';

const property = {
    'Vite_TokenId': 'tti_5649544520544f4b454e6e40',
    'Default_Hash': '0000000000000000000000000000000000000000000000000000000000000000'
};

const required = [
    'Snapshot_Gid',
    'Delegate_Gid',
    'Pledge_Addr',
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
    'DexFundUserDeposit_Abi',
    'DexFundUserWithdraw_Abi',
    'DexTradeCancelOrder_Abi',
    'DexFundNewOrder_Abi',
    'DexFundNewMarket_Abi',
    'Contracts',
    'methods'
];

const enumType = {'BlockType': 7 * 2};

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
