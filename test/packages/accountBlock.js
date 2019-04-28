const assert = require('assert');

import { getAccountBlock, getSendTxBlock, getReceiveTxBlock, getBuiltinTxType, signAccountBlock, getBlockHash } from '../../src/accountBlock/index';
import { getCreateContractData, getAbi } from '../../src/accountBlock/builtin';

import { BlockType } from '../../src/type';
import { Default_Hash } from '../../src/constant/index';

describe('getAccountBlock', function () {
    const reqAccBlock = [ {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        blockType: 2
    }, {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        blockType: 2,
        amount: '0',
        toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
        tokenId: 'tti_5649544520544f4b454e6e40'
    }, {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        blockType: 4,
        fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046',
        amount: '0',
        toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
        tokenId: 'tti_5649544520544f4b454e6e40',
        height: '19',
        prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7'
    }, {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        blockType: 4,
        fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046',
        amount: '0',
        toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
        tokenId: 'tti_5649544520544f4b454e6e40',
        height: '19',
        prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7'
    }, {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        blockType: 2,
        height: '19',
        prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7',
        message: '2123'
    }, {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        blockType: 4,
        fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046',
        height: '19',
        prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7',
        data: 'MjEyMw==',
        nonce: 'MjEyMw=='
    } ];

    testAccBlockCase(reqAccBlock, getAccountBlock);
});

describe('getSendTxBlock', function () {
    const reqAccBlock = [ {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        amount: '0',
        toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
        tokenId: 'tti_5649544520544f4b454e6e40'
    }, {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        amount: '0',
        toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
        tokenId: 'tti_5649544520544f4b454e6e40',
        height: '19',
        prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7',
        message: '2123'
    } ];

    testAccBlockCase(reqAccBlock, getSendTxBlock, resBlock => {
        it('send tx: blockType = 2', function () {
            assert.equal(resBlock.blockType, 2);
        });
    });
});

describe('getReceiveTxBlock', function () {
    const reqAccBlock = [ {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046'
    }, {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046',
        height: '19',
        prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7'
    } ];

    testAccBlockCase(reqAccBlock, getReceiveTxBlock, resBlock => {
        it('receive tx: blockType = 4', function () {
            assert.equal(resBlock.blockType, 4);
        });
    });
});

describe('getBuiltinTxType', function () {
    it('SBPreg', function () {
        const SBPreg = {
            blockType: 2,
            data: '8pxs4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAABPx+OIw8v+h4DDmZOUlAz/5ldbCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQ1NfVEVTVF9OT0RFAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
            toAddress: 'vite_0000000000000000000000000000000000000004d28108e76b'
        };
        assert.equal(getBuiltinTxType(SBPreg.toAddress, SBPreg.data, SBPreg.blockType), 'SBPreg');
    });
    it('UpdateReg', function () {
        const UpdateReg = {
            blockType: 2,
            data: 'O3vfdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAO5nE1iOcnqWSo9HQOJ92+alKJz2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQ1NfVEVTVF9OT0RFAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
            toAddress: 'vite_0000000000000000000000000000000000000004d28108e76b'
        };
        assert.equal(getBuiltinTxType(UpdateReg.toAddress, UpdateReg.data, UpdateReg.blockType), 'UpdateReg');
    });
    it('RevokeReg', function () {
        const RevokeReg = {
            blockType: 2,
            data: 'YIYv4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADENTX1RFU1RfTk9ERQAAAAAAAAAAAAAAAAAAAAAAAAAA',
            toAddress: 'vite_0000000000000000000000000000000000000004d28108e76b'
        };
        assert.equal(getBuiltinTxType(RevokeReg.toAddress, RevokeReg.data, RevokeReg.blockType), 'RevokeReg');
    });
    // RetrieveReward
    it('Voting', function () {
        const Voting = {
            blockType: 2,
            data: '/cF/JQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADENTX1RFU1RfTk9ERQAAAAAAAAAAAAAAAAAAAAAAAAAA',
            toAddress: 'vite_0000000000000000000000000000000000000004d28108e76b'
        };
        assert.equal(getBuiltinTxType(Voting.toAddress, Voting.data, Voting.blockType), 'Voting');
    });
    it('RevokeVoting', function () {
        const RevokeVoting = {
            blockType: 2,
            data: 'pinFMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB',
            toAddress: 'vite_0000000000000000000000000000000000000004d28108e76b'
        };
        assert.equal(getBuiltinTxType(RevokeVoting.toAddress, RevokeVoting.data, RevokeVoting.blockType), 'RevokeVoting');
    });
    it('GetQuota', function () {
        const GetQuota = {
            blockType: 2,
            data: 'jefc/QAAAAAAAAAAAAAAE/H44jDy/6HgMOZk5SUDP/mV1sIA',
            toAddress: 'vite_0000000000000000000000000000000000000003f6af7459b9'
        };
        assert.equal(getBuiltinTxType(GetQuota.toAddress, GetQuota.data, GetQuota.blockType), 'GetQuota');
    });
    it('WithdrawalOfQuota', function () {
        const WithdrawalOfQuota = {
            blockType: 2,
            data: 'n/nHtgAAAAAAAAAAAAAAE/H44jDy/6HgMOZk5SUDP/mV1sIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIeGeDJurJAAAA=',
            toAddress: 'vite_0000000000000000000000000000000000000003f6af7459b9'
        };
        assert.equal(getBuiltinTxType(WithdrawalOfQuota.toAddress, WithdrawalOfQuota.data, WithdrawalOfQuota.blockType), 'WithdrawalOfQuota');
    });
    // it('Mintage', function () {
    //     const Mintage = {
    //         blockType: 2,
    //         data: 'J62HLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyRFUj9g6iwVfcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHNzc3MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
    //         toAddress: 'vite_00000000000000000000000000000000000000056ad6d26692'
    //     };
    //     assert.equal(getBuiltinTxType(Mintage.toAddress, Mintage.data, Mintage.blockType), 'Mintage');
    // });
    // MintageIssue
    // MintageBurn
    // MintageTransferOwner
    // MintageChangeTokenType
    // MintageCancelPledge
    it('DexFundNewOrder', function () {
        const DexFundNewOrder = {
            blockType: 2,
            data: 'QnapywAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJpWDkEPPlm83AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVklURSBUT0tFTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTl1L8Zdh6mfYIzQeegkraivGtApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACMTUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
            toAddress: 'vite_000000000000000000000000000000000000000617d47459a8'
        };
        assert.equal(getBuiltinTxType(DexFundNewOrder.toAddress, DexFundNewOrder.data, DexFundNewOrder.blockType), 'DexFundNewOrder');
    });
    it('DexTradeCancelOrder', function () {
        const DexTradeCancelOrder = {
            blockType: 2,
            data: '8tmWHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJpWDkEPPlm83AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVklURSBUT0tFTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTjcaJPGE2zj/epXeg2UNZEzi7HBAAAAAAAAAAAAAAAAA==',
            toAddress: 'vite_000000000000000000000000000000000000000768ef0e6238'
        };
        assert.equal(getBuiltinTxType(DexTradeCancelOrder.toAddress, DexTradeCancelOrder.data, DexTradeCancelOrder.blockType), 'DexTradeCancelOrder');
    });
    it('DexFundUserWithdraw', function () {
        const DexFundUserWithdraw = {
            blockType: 2,
            data: 'zDKRaQAAAAAAAAAAAAAAAAAAAAAAAAAAAABWSVRFIFRPS0VOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfOZsUOKEAAA=',
            toAddress: 'vite_000000000000000000000000000000000000000617d47459a8'
        };
        assert.equal(getBuiltinTxType(DexFundUserWithdraw.toAddress, DexFundUserWithdraw.data, DexFundUserWithdraw.blockType), 'DexFundUserWithdraw');
    });
    it('DexFundUserDeposit', function () {
        const DexFundUserDeposit = {
            blockType: 2,
            data: 'nftn/w==',
            toAddress: 'vite_000000000000000000000000000000000000000617d47459a8'
        };
        assert.equal(getBuiltinTxType(DexFundUserDeposit.toAddress, DexFundUserDeposit.data, DexFundUserDeposit.blockType), 'DexFundUserDeposit');
    });
    it('DexFundNewMarket', function () {
        const DexFundNewMarket = {
            blockType: 2,
            data: 'Kuf4wQAAAAAAAAAAAAAAAAAAAAAAAAAAAAC29wGYeP37IZCKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFZJVEUgVE9LRU4=',
            toAddress: 'vite_000000000000000000000000000000000000000617d47459a8'
        };
        assert.equal(getBuiltinTxType(DexFundNewMarket.toAddress, DexFundNewMarket.data, DexFundNewMarket.blockType), 'DexFundNewMarket');
    });
    it('CreateContractReq', function () {
        const CreateContractReq = {
            blockType: 1,
            data: '',
            toAddress: 'vite_4f18fea624550533edcda473ae2dbdb6bf7e41d6016e260ab2'
        };
        assert.equal(getBuiltinTxType(CreateContractReq.toAddress, CreateContractReq.data, CreateContractReq.blockType), 'CreateContractReq');
    });
    it('TxReq', function () {
        const TxReq = {
            blockType: 2,
            data: null,
            toAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8'
        };
        assert.equal(getBuiltinTxType(TxReq.toAddress, TxReq.data, TxReq.blockType), 'TxReq');
    });
    it('RewardReq', function () {
        const RewardReq = {
            blockType: 3,
            data: '',
            toAddress: 'vite_0000000000000000000000000000000000000001c9e9f25417'
        };
        assert.equal(getBuiltinTxType(RewardReq.toAddress, RewardReq.data, RewardReq.blockType), 'RewardReq');
    });
    it('TxRes', function () {
        const TxRes = {
            blockType: 4,
            data: 'MjEyMw==',
            toAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8'
        };
        assert.equal(getBuiltinTxType(TxRes.toAddress, TxRes.data, TxRes.blockType), 'TxRes');
    });
    it('TxResFail', function () {
        const TxResFail = {
            blockType: 5,
            data: '',
            toAddress: 'vite_0000000000000000000000000000000000000001c9e9f25417'
        };
        assert.equal(getBuiltinTxType(TxResFail.toAddress, TxResFail.data, TxResFail.blockType), 'TxResFail');
    });
    // SendRefund
    // GenesisReceive
});

describe('getBlockHash', function () {
    it('test_hash_1', function () {
        const accountBlock = {
            accountAddress: 'vite_ab24ef68b84e642c0ddca06beec81c9acb1977bbd7da27a87a',
            blockType: 2,
            prevHash: 'd517e8d4dc9c676876b72ad0cbb4c45890804aa438edd1f171ffc66276202a95',
            height: '2',
            tokenId: 'tti_5649544520544f4b454e6e40',
            toAddress: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            amount: '1000000000000000000000000',
            hash:
            '9c3f2b59408aa6a5c76f6f30cab40085eb181d200d574a029323b0822f54eef1',
            signature:
            'sGELMXeZ/ZTvwec5n2kvo2hz/i824QTadKHC35sQcdVhSAPS6+uzanfcjPqp7qaQFEEorTfFNnd90hgbJpSNCw==',
            publicKey: 'WHZinxslscE+WaIqrUjGu2scOvorgD4Q+DQOOcDBv4M='
        };

        const hash = getBlockHash(accountBlock);
        assert.equal(accountBlock.hash, hash);
    });

    it('test_hash_2', function () {
        const accountBlock = {
            accountAddress: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            blockType: 4,
            prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
            height: '1',
            fromBlockHash: '0d77c5cc1260df614fe3b17343e246f983eb5587f9e687b7c7b036eefada40e9',
            nonce: 'hz75z75TMr0=',
            difficulty: '65534',
            hash: '1761ee3d33c1f5f1920d8315bf5e76a47f9fb0bb2f8c6933cd8105fc9445db85',
            signature: 'xbkjsVzfqoCkUwnU4VktTqs3//XiuLSQtmWcSS+H+FELqwm26ckkxgJBOn68VpdSTEBFmFiJTA2enqiVoKuhDA==',
            publicKey: 'iE0KOlLusSBOImOb6BA/tTzocFgtW2q0iHVM1WsFkuA='
        };

        const hash = getBlockHash(accountBlock);
        assert.equal(hash, accountBlock.hash);
    });

    it('test_hash_3', function () {
        const accountBlock = {
            accountAddress: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            blockType: 4,
            prevHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
            height: '4',
            fromBlockHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
            nonce: 'Sg0sdhyaEus=',
            difficulty: '65534',
            hash: '23b9a085f0280eb5309f27094bd00420ba2e2c5b16ef98dc40b1c778820f31a7',
            signature: 'kuspOXODnp6MlJ7hAYb6YBexDCBhbTAaJ0u660OvTuOrviqWtKb3PzE+XV6XroUXhxuDvNB5U+IK8s93n4n7Cg==',
            publicKey: 'iE0KOlLusSBOImOb6BA/tTzocFgtW2q0iHVM1WsFkuA='
        };

        const hash = getBlockHash(accountBlock);
        assert.equal(hash, accountBlock.hash);
    });
});

describe('signAccountBlock', function () {
    it('test_signTX_receive', function () {
        const privKey = '36509ee50210a386f6ac082b21f72a7021a986a7f3406b4f70745b5260d0b4c0884d0a3a52eeb1204e22639be8103fb53ce870582d5b6ab488754cd56b0592e0';
        const accountBlock = {
            accountAddress: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            blockType: 4,
            prevHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
            height: '4',
            fromBlockHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
            nonce: 'Sg0sdhyaEus=',
            difficulty: '65534',
            hash: '23b9a085f0280eb5309f27094bd00420ba2e2c5b16ef98dc40b1c778820f31a7',
            signature: 'kuspOXODnp6MlJ7hAYb6YBexDCBhbTAaJ0u660OvTuOrviqWtKb3PzE+XV6XroUXhxuDvNB5U+IK8s93n4n7Cg==',
            publicKey: 'iE0KOlLusSBOImOb6BA/tTzocFgtW2q0iHVM1WsFkuA='
        };

        const { hash, signature, publicKey } = signAccountBlock(accountBlock, privKey);
        assert.equal(hash, accountBlock.hash);
        assert.equal(publicKey, accountBlock.publicKey);
        assert.equal(signature, accountBlock.signature);
    });

    it('test_signTX_send', function () {
        const privKey = '36509ee50210a386f6ac082b21f72a7021a986a7f3406b4f70745b5260d0b4c0884d0a3a52eeb1204e22639be8103fb53ce870582d5b6ab488754cd56b0592e0';
        const accountBlock = {
            accountAddress: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            blockType: 2,
            prevHash: 'd61d7939d4f2a184cd1cbee2d3d5dbcad999c8fd6e3d4f2fb5c71a04d3554a5d',
            height: '3',
            tokenId: 'tti_5649544520544f4b454e6e40',
            toAddress: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            amount: '100',
            nonce: 'N1kP4gl3dVU=',
            difficulty: '65534',
            hash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
            signature: 'kVDk2uR5wJOSl6GGNQasAXsnyF/6bBxhYieMceX6mskvIAJ6saboxcIkCeeOgWPAmN5rMtDc2WfJyiD7BXhFAg==',
            publicKey: 'iE0KOlLusSBOImOb6BA/tTzocFgtW2q0iHVM1WsFkuA='
        };

        const { hash, signature, publicKey } = signAccountBlock(accountBlock, privKey);

        assert.equal(hash, accountBlock.hash);
        assert.equal(publicKey, accountBlock.publicKey);
        assert.equal(signature, accountBlock.signature);
    });
});

describe('accountBlock builtin function', function () {
    it('encodeCreateContruct', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor', 'inputs': [{ 'type': 'address' }] }],
            hexCode: '6080',
            params: ['vite_0000000000000000000000000000000000000000a4f3a0cb58'],
            confirmTimes: 10
        });

        assert.equal('AAAAAAAAAAAAAgEKYIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==', _data);
    });

    it('getAbi', function () {
        const type = 'offchain';
        const _data = getAbi([
            { 'type': 'offchain', 'inputs': [{ 'type': 'address' }] },
            { 'type': 'constructor', 'inputs': [{ 'type': 'address' }] }
        ], type);

        assert.equal(_data.type, type);
    });
});


function testAccBlockCase(reqAccBlock, func, validFunc) {
    reqAccBlock.forEach(reqBlock => {
        const resBlock = func(reqBlock);
        validFunc && validFunc(resBlock);

        it('required params', function () {
            assert.equal(resBlock.accountAddress, reqBlock.accountAddress);
            reqBlock.blockType && assert.equal(resBlock.blockType, reqBlock.blockType);
            reqBlock.nonce && assert.equal(resBlock.nonce, reqBlock.nonce);
        });

        it('prevHash and height', function () {
            reqBlock.prevHash && assert.equal(resBlock.prevHash, reqBlock.prevHash);
            reqBlock.height && assert.equal(resBlock.height, Number(reqBlock.height) + 1);
            !reqBlock.height && assert.equal(resBlock.height, '1');
            !reqBlock.prevHash && assert.equal(resBlock.prevHash, Default_Hash);
        });

        resBlock.blockType === BlockType.TxRes
        && it('receiveBlock don\'t have tokenInfo', function () {
            assert.equal(resBlock.fromBlockHash, reqBlock.fromBlockHash);
            assert.equal(typeof resBlock.tokenId, 'undefined');
            assert.equal(typeof resBlock.amount, 'undefined');
            assert.equal(typeof resBlock.toAddress, 'undefined');
        });

        resBlock.blockType === BlockType.TxReq
        && it('sendBlock need have tokenInfo', function () {
            reqBlock.tokenId && assert.equal(resBlock.tokenId, reqBlock.tokenId);
            reqBlock.amount && assert.equal(resBlock.amount, reqBlock.amount);
            reqBlock.toAddress && assert.equal(resBlock.toAddress, reqBlock.toAddress);
        });

        (reqBlock.message || reqBlock.data)
        && it('message to base64 string, data is not change.', function () {
            reqBlock.message && assert.equal(resBlock.data, Buffer.from(reqBlock.message).toString('base64'));
            reqBlock.data && assert.equal(resBlock.data, reqBlock.data);
        });
    });
}
