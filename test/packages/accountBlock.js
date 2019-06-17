const assert = require('assert');

import { getAccountBlock, getSendTxBlock, getReceiveTxBlock, getTxType, decodeBlockByContract, signAccountBlock, getBlockHash } from '../../src/accountBlock/index';
import { getCreateContractData, getAbi, getContractTxType } from '../../src/accountBlock/builtin';
import { BlockType } from '../../src/type';
import { Default_Hash, Contracts } from '../../src/constant/index';

import config from '../config';


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

describe('getTxType', function () {
    for (const txType in config.blockList) {
        it(txType, function () {
            assert.equal(getTxType(config.blockList[txType]).txType, txType);
        });
    }
});

describe('decodeBlockByContract', function () {
    for (const txType in config.blockList) {
        if (!Contracts[txType]) {
            continue;
        }

        describe(txType, function () {
            const abi = Contracts[txType].abi;
            const decodeRes = decodeBlockByContract({
                accountBlock: config.blockList[txType],
                contractAddr: Contracts[txType].contractAddr,
                abi
            });

            it(`${ txType } have decodeRes`, function () {
                assert.equal(!!decodeRes, true);
            });

            for (let i = 0; i < (abi.inputs || []).length; i++) {
                const item = abi.inputs[i];
                it(`${ txType } ${ item.name }`, function () {
                    assert.equal(!!decodeRes[item.name], true);
                });
            }
        });
    }
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
    it('encodeCreateContruct case 1', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor', 'inputs': [{ 'type': 'address' }] }],
            hexCode: '6080',
            params: ['vite_0000000000000000000000000000000000000000a4f3a0cb58'],
            confirmTimes: 10
        });

        assert.equal('AAAAAAAAAAAAAgEKCmCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', _data);
    });

    it('encodeCreateContruct case 2', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor', 'inputs': [] }],
            hexCode: '6080',
            confirmTimes: 10
        });

        assert.equal('AAAAAAAAAAAAAgEKCmCA', _data);
    });


    it('encodeCreateContruct case 3', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor' }],
            hexCode: '6080',
            confirmTimes: 10
        });

        assert.equal('AAAAAAAAAAAAAgEKCmCA', _data);
    });

    it('encodeCreateContruct case 4', function () {
        const _data = getCreateContractData({
            hexCode: '6080',
            confirmTimes: 10,
            times: 1.5
        });

        assert.equal('AAAAAAAAAAAAAgEKAWCA', _data);
    });

    it('getAbi', function () {
        const type = 'offchain';
        const _data = getAbi([
            { 'type': 'offchain', 'inputs': [{ 'type': 'address' }] },
            { 'type': 'constructor', 'inputs': [{ 'type': 'address' }] }
        ], type);

        assert.equal(_data.type, type);
    });

    describe('getContractTxType', function () {
        const res = getContractTxType(Contracts);
        for (const key in res) {
            const _res = res[key];
            it(`Contracts have type ${ _res.txType }`, function () {
                assert(!!Contracts[_res.txType], true);
            });
            it(`key have contractAddr ${ _res.contractAddr }`, function () {
                assert(key.indexOf(Contracts[_res.txType].contractAddr) === 9, true);
            });
            it(`${ _res.txType } have abi`, function () {
                assert(!!_res.abi, true);
            });
            it(`${ _res.txType } have contractAddr`, function () {
                assert(!!_res.abi, true);
            });
        }
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
            if (reqBlock.message) {
                const msgHex = `0002${ Buffer.from(reqBlock.message).toString('hex') }`;
                const msgBase64 = Buffer.from(msgHex, 'hex').toString('base64');
                assert.equal(resBlock.data, msgBase64);
            }
            reqBlock.data && assert.equal(resBlock.data, reqBlock.data);
        });
    });
}
