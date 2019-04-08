const assert = require('assert');

import { getAccountBlock, getSendTxBlock, getReceiveTxBlock, getBuiltinTxType, signAccountBlock, getBlockHash } from '../src/accountBlock/index';
import { BlockType } from '../src/type';
import { Default_Hash } from '../src/constant/index';

// const block = {
//     accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//     amount: '0',
//     blockType: 2,
//     confirmedTimes: '279',
//     data: 'pinFMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB',
//     difficulty: null,
//     fee: '0',
//     fromAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//     fromBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
//     hash: '35a17f1919f3c95c5ecb710c97fca0a0c4049fa8cb9c64e3b475769450498bf1',
//     height: '19',
//     logHash: null,
//     nonce: null,
//     prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7',
//     publicKey: 'Kn+xAEkrRm/KSsfE38htuM5P6NCwsp1x70/yya+ZIJ0=',
//     quota: '62000',
//     signature: 'DPiaz3ZjGzXrycnjXdmXgr823J/4zv1MB1yoDQRaIkCZkLlwM6V8AzekqHjhveWz+ymM57X3royv5FtpfdKcCA==',
//     toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
//     tokenId: 'tti_5649544520544f4b454e6e40'
// };

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
    const RevokeVoting = {
        blockType: 2,
        data: 'pinFMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB',
        toAddress: 'vite_000000000000000000000000000000000000000270a48cc491'
    };
    const Voting = {
        blockType: 2,
        data: '/cF/JQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0hhbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        toAddress: 'vite_000000000000000000000000000000000000000270a48cc491'
    };
    const TxRes = {
        blockType: 4,
        data: 'MjEyMw==',
        toAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8'
    };
    const WithdrawalOfQuota = {
        blockType: 2,
        data: 'n/nHtgAAAAAAAAAAAAAAABVeToP7BJncwwR+BFi7+ud/KsEnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPzBqJAn8AAA=',
        toAddress: 'vite_000000000000000000000000000000000000000309508ba646'
    };
    const TxReq = {
        blockType: 2,
        data: null,
        toAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8'
    };
    const GetQuota = {
        blockType: 2,
        data: 'jefc/QAAAAAAAAAAAAAAABVeToP7BJncwwR+BFi7+ud/KsEn',
        toAddress: 'vite_000000000000000000000000000000000000000309508ba646'
    };
    const SBPreg = {
        blockType: 2,
        data: '8pxs4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAABwv7dBTikKqChmXMP0/IEF0NQACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHMjMyMzIzMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
        toAddress: 'vite_0000000000000000000000000000000000000001c9e9f25417'
    };
    const RevokeReg = {
        blockType: 2,
        data: 'YIYv4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIzMjMyMzIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        toAddress: 'vite_0000000000000000000000000000000000000001c9e9f25417'
    };
    const UpdateReg = {
        blockType: 2,
        data: 'O3vfdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAADF4fUrf0FtM5BYUSzVPhltH5VHKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHMjMyMzIzMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=/IEF0NQACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHMjMyMzIzMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
        toAddress: 'vite_0000000000000000000000000000000000000001c9e9f25417'
    };
    const CreateContractReq = {
        blockType: 1,
        data: '',
        toAddress: 'vite_0000000000000000000000000000000000000001c9e9f25417'
    };
    const RewardReq = {
        blockType: 3,
        data: '',
        toAddress: 'vite_0000000000000000000000000000000000000001c9e9f25417'
    };
    const TxResFail = {
        blockType: 5,
        data: '',
        toAddress: 'vite_0000000000000000000000000000000000000001c9e9f25417'
    };
    const Mintage = {
        blockType: 2,
        data: 'J62HLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyRFUj9g6iwVfcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHNzc3MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        toAddress: 'vite_00000000000000000000000000000000000000056ad6d26692'
    };
    const DexFundNewOrder = {
        blockType: 2,
        data: 'QnapywAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJpWDkEPPlm83AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVklURSBUT0tFTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTl1L8Zdh6mfYIzQeegkraivGtApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACMTUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
        toAddress: 'vite_000000000000000000000000000000000000000617d47459a8'
    };
    const DexTradeCancelOrder = {
        blockType: 2,
        data: '8tmWHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJpWDkEPPlm83AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVklURSBUT0tFTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTjcaJPGE2zj/epXeg2UNZEzi7HBAAAAAAAAAAAAAAAAA==',
        toAddress: 'vite_000000000000000000000000000000000000000768ef0e6238'
    };
    const DexFundUserWithdraw = {
        blockType: 2,
        data: 'zDKRaQAAAAAAAAAAAAAAAAAAAAAAAAAAAABWSVRFIFRPS0VOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfOZsUOKEAAA=',
        toAddress: 'vite_000000000000000000000000000000000000000617d47459a8'
    };
    const DexFundUserDeposit = {
        blockType: 2,
        data: 'nftn/w==',
        toAddress: 'vite_000000000000000000000000000000000000000617d47459a8'
    };
    const DexFundNewMarket = {
        blockType: 2,
        data: 'Kuf4wQAAAAAAAAAAAAAAAAAAAAAAAAAAAAC29wGYeP37IZCKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFZJVEUgVE9LRU4=',
        toAddress: 'vite_000000000000000000000000000000000000000617d47459a8'
    };

    it('RevokeVoting', function () {
        assert.equal(getBuiltinTxType(RevokeVoting.toAddress, RevokeVoting.data, RevokeVoting.blockType), 'RevokeVoting');
    });
    it('Voting', function () {
        assert.equal(getBuiltinTxType(Voting.toAddress, Voting.data, Voting.blockType), 'Voting');
    });
    it('TxRes', function () {
        assert.equal(getBuiltinTxType(TxRes.toAddress, TxRes.data, TxRes.blockType), 'TxRes');
    });
    it('WithdrawalOfQuota', function () {
        assert.equal(getBuiltinTxType(WithdrawalOfQuota.toAddress, WithdrawalOfQuota.data, WithdrawalOfQuota.blockType), 'WithdrawalOfQuota');
    });
    it('TxReq', function () {
        assert.equal(getBuiltinTxType(TxReq.toAddress, TxReq.data, TxReq.blockType), 'TxReq');
    });
    it('GetQuota', function () {
        assert.equal(getBuiltinTxType(GetQuota.toAddress, GetQuota.data, GetQuota.blockType), 'GetQuota');
    });
    it('SBPreg', function () {
        assert.equal(getBuiltinTxType(SBPreg.toAddress, SBPreg.data, SBPreg.blockType), 'SBPreg');
    });
    it('RevokeReg', function () {
        assert.equal(getBuiltinTxType(RevokeReg.toAddress, RevokeReg.data, RevokeReg.blockType), 'RevokeReg');
    });
    it('UpdateReg', function () {
        assert.equal(getBuiltinTxType(UpdateReg.toAddress, UpdateReg.data, UpdateReg.blockType), 'UpdateReg');
    });
    it('CreateContractReq', function () {
        assert.equal(getBuiltinTxType(CreateContractReq.toAddress, CreateContractReq.data, CreateContractReq.blockType), 'CreateContractReq');
    });
    it('RewardReq', function () {
        assert.equal(getBuiltinTxType(RewardReq.toAddress, RewardReq.data, RewardReq.blockType), 'RewardReq');
    });
    it('TxResFail', function () {
        assert.equal(getBuiltinTxType(TxResFail.toAddress, TxResFail.data, TxResFail.blockType), 'TxResFail');
    });
    it('Mintage', function () {
        assert.equal(getBuiltinTxType(Mintage.toAddress, Mintage.data, Mintage.blockType), 'Mintage');
    });
    it('DexFundNewOrder', function () {
        assert.equal(getBuiltinTxType(DexFundNewOrder.toAddress, DexFundNewOrder.data, DexFundNewOrder.blockType), 'DexFundNewOrder');
    });
    it('DexTradeCancelOrder', function () {
        assert.equal(getBuiltinTxType(DexTradeCancelOrder.toAddress, DexTradeCancelOrder.data, DexTradeCancelOrder.blockType), 'DexTradeCancelOrder');
    });
    it('DexFundUserWithdraw', function () {
        assert.equal(getBuiltinTxType(DexFundUserWithdraw.toAddress, DexFundUserWithdraw.data, DexFundUserWithdraw.blockType), 'DexFundUserWithdraw');
    });
    it('DexFundUserDeposit', function () {
        assert.equal(getBuiltinTxType(DexFundUserDeposit.toAddress, DexFundUserDeposit.data, DexFundUserDeposit.blockType), 'DexFundUserDeposit');
    });
    it('DexFundNewMarket', function () {
        assert.equal(getBuiltinTxType(DexFundNewMarket.toAddress, DexFundNewMarket.data, DexFundNewMarket.blockType), 'DexFundNewMarket');
    });
});

describe('signAccountBlock', function () {
    it('test_signTX_receive', function () {
        const privKey = 'dcb735c454777a697c417472a5dc46333fd738c062c26f2dc6bce8a972dece1f79e0fbc083681e636fef9b389d91c5700ae5d401438158e5c7798b76232cdf88';
        const accountBlock = {
            'accountAddress': 'vite_a17465557d554fd27ff958887082f147054e0d6f75762e25cb',
            'height': '1',
            'fee': '0',
            'prevHash': '0000000000000000000000000000000000000000000000000000000000000000',
            'blockType': 4,
            'fromBlockHash': '382c9d11894aa45d18bb02edf4b520a281341e686915c750adbbb0655c8ba6ec',
            'nonce': 'xjpCTkxYBfA=',
            'publicKey': 'eeD7wINoHmNv75s4nZHFcArl1AFDgVjlx3mLdiMs34g=',
            'hash': '3bdbbc9e1c4ea2b52afadb841fdf97de55daa77e671a2c417e83bfb25b7682a9',
            'signature': 'XP3jYE7rq1tby7fCZ9wpU9fX1TpLHxtAHRmy5wNiWra7bfyMOIZgS89FW2UacrA1dSIlv3pGuG33pGV43+AtCg=='
        };

        const { hash, signature, publicKey } = signAccountBlock(accountBlock, privKey);
        assert.equal(hash, accountBlock.hash);
        assert.equal(publicKey, accountBlock.publicKey);
        assert.equal(signature, accountBlock.signature);
    });

    it('test_signTX_send', function () {
        const privKey = '39ad24b209000da30661d62b017e61640ae6c44531b6d603131477bd2f4841d6e91c860c63d01f6d4a92901971907a72103e8baa87f8878665f5a4def9ec7a36';
        const accountBlock = {
            'accountAddress': 'vite_aac0d5bb7d5585716a8d9a0ee600d6d28cb52d6695673e8f50',
            'height': '1',
            'fee': '0',
            'prevHash': 'a574cef0e2a22978f194e8ac818cb7ca4c14ea3b5d14649e4c4f0723c27b1bf6',
            'data': 'MTI=',
            'tokenId': 'tti_5649544520544f4b454e6e40',
            'toAddress': 'vite_aac0d5bb7d5585716a8d9a0ee600d6d28cb52d6695673e8f50',
            'amount': '1000000000000000000',
            'blockType': 2,
            'nonce': 'jnrqnJpfOb4=',
            'hash': '361a92a5ddaa4bbc55348e0e047d53ab7f677325bd8ddef4963f8a712d3309ed',
            'publicKey': '6RyGDGPQH21KkpAZcZB6chA+i6qH+IeGZfWk3vnsejY=',
            'signature': 'I6WxxwjkTEYjXMw9uGNMwVQPpteEUdr5/D7w/sHIm4Gg/4mbqNl7vyBSkIXRdi2JxVaIpr/hIHigr6llz/UZDQ=='
        };

        const { hash, signature, publicKey } = signAccountBlock(accountBlock, privKey);

        assert.equal(hash, accountBlock.hash);
        assert.equal(publicKey, accountBlock.publicKey);
        assert.equal(signature, accountBlock.signature);
    });
});

describe('accountBlockHash', function () {
    it('test_hash_1', function () {
        const accountBlock = {
            sendBlockList: null,
            accountAddress: 'vite_40ecd068e6919694d989866e3362c557984fd2637671219def',
            amount: '1000',
            blockType: 2,
            data: 'dGVzdCBkYXRhIHRlc3QgZGF0YQ==',
            difficulty: '10',
            fee: '10',
            fromBlockHash: '837fca7bc93835c635551971dc06abd440e2c590ec6f478847e3be392bb694bd',
            hash: '1e25ac8dac6945afc84e3361d2d011046d9966603981fd8d1a78eeb32cef34f5',
            height: '123',
            logHash: '89a90cd8db754fb56fd41475cdc9abdc01c272d18b41cd5699a4e92c65623632',
            nonce: 'dGVzdCBub25jZSB0ZXN0IG5vbmNl',
            prevHash: 'e9a5907a2781708c2b6154b070aa543b788cdf50cc46701a36703952339b64f0',
            publicKey: 'kgRm0vB5ErdlkUoKKtZ4wYOIoSINDadMjtP2um/I2UU=',
            quota: '1234',
            signature: null,
            toAddress: 'vite_aa01c78289d51862026d93c98115e4b540b800a877aa98a76b',
            tokenId: 'tti_5649544520544f4b454e6e40'
        };

        const hash = getBlockHash(accountBlock);
        assert.equal(accountBlock.hash, hash);
    });
    // it('test_hash_2', function () {
    //     const accountBlock = {
    //         accountAddress: 'vite_17db10f302569b79adbb31f7dd96a11f09f740459c2e0d8638',
    //         blockType: 4,
    //         difficulty: '67108864',
    //         fromBlockHash: '2d920fc4b216e495ea95cdfd5c73a4e88fcad9770a08b017e92868c72cf6164c',
    //         hash: '3bfe4a1e4093d3a7a0195d1042e65008d03d202b03aaa4e2a18cb10dbd03325b',
    //         height: '5',
    //         nonce: '8UwDEt0cBsE=',
    //         prevHash: 'd855cbfe45c6b5f7eec3c42ba68735b11e580733ba04b6b813103e2e5917973a',
    //         publicKey: 'kuzthX/o/WfqSQy+cA+TFFPIrJpaf6+74LAnQhUmoVM=',
    //         signature: 'PpVUN7xpbBoHSUovJGry8FN/J3+TGXA/QadjKrbdKS4X4Y/2rJWvPBbXuvB3wrvgRSbYz+8048i8QXPHnHbnDA=='
    //     };
    //     const hash = getBlockHash(accountBlock);
    //     assert.equal(hash, accountBlock.hash);
    // });
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
