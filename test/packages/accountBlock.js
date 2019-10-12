const assert = require('assert');

import { BlockType } from '../../src/type.ts';
import { Contracts } from '../../src/constant/index';
import { encodeFunctionSignature, encodeFunctionCall } from '../../src/abi/index';
import { Default_Hash, getTransactionType, getCreateContractData, encodeContractList, decodeAccountBlockByContract, getAccountBlockHash, signAccountBlock } from '../../src/accountBlock/index';

import config from '../config';


it('Default_Hash', function () {
    assert.equal(Default_Hash, '0000000000000000000000000000000000000000000000000000000000000000');
});

describe('getTransactionType', function () {
    for (const transactionType in config.blockList) {
        it(transactionType, function () {
            assert.equal(getTransactionType(config.blockList[transactionType]).transactionType, transactionType);
        });
    }
    it('getTransactionType custom', function () {
        const abi = { methodName: 'hello', inputs: [] };
        const contractAddress = 'vite_0000000000000000000000000000000000000003f6af7459b9';

        const signFunc = encodeFunctionSignature(abi);
        const key = `${ signFunc }_${ contractAddress }`;

        const customTxType = {};
        customTxType[key] = {
            transactionType: 'helloWorld',
            abi,
            contractAddress
        };

        const txtypeObj = getTransactionType({
            blockType: 2,
            data: Buffer.from(encodeFunctionCall(abi), 'hex').toString('base64'),
            toAddress: contractAddress
        }, customTxType);
        assert.deepEqual(txtypeObj, customTxType[key]);
    });
});

describe('decodeAccountBlockByContract', function () {
    for (const txType in config.blockList) {
        if (!Contracts[txType]) {
            continue;
        }

        describe(txType, function () {
            const abi = Contracts[txType].abi;
            const decodeRes = decodeAccountBlockByContract({
                accountBlock: config.blockList[txType],
                contractAddress: Contracts[txType].contractAddress,
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

describe('getAccountBlockHash', function () {
    it('test_hash_1', function () {
        const accountBlock = {
            address: 'vite_ab24ef68b84e642c0ddca06beec81c9acb1977bbd7da27a87a',
            blockType: 2,
            previousHash: 'd517e8d4dc9c676876b72ad0cbb4c45890804aa438edd1f171ffc66276202a95',
            height: '2',
            tokenId: 'tti_5649544520544f4b454e6e40',
            toAddress: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            amount: '1000000000000000000000000',
            hash: '9c3f2b59408aa6a5c76f6f30cab40085eb181d200d574a029323b0822f54eef1',
            signature: 'sGELMXeZ/ZTvwec5n2kvo2hz/i824QTadKHC35sQcdVhSAPS6+uzanfcjPqp7qaQFEEorTfFNnd90hgbJpSNCw==',
            publicKey: 'WHZinxslscE+WaIqrUjGu2scOvorgD4Q+DQOOcDBv4M='
        };

        const hash = getAccountBlockHash(accountBlock);
        assert.equal(accountBlock.hash, hash);
    });

    it('test_hash_2', function () {
        const accountBlock = {
            address: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            blockType: 4,
            previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
            height: '1',
            sendBlockHash: '0d77c5cc1260df614fe3b17343e246f983eb5587f9e687b7c7b036eefada40e9',
            nonce: 'hz75z75TMr0=',
            difficulty: '65534',
            hash: '1761ee3d33c1f5f1920d8315bf5e76a47f9fb0bb2f8c6933cd8105fc9445db85',
            signature: 'xbkjsVzfqoCkUwnU4VktTqs3//XiuLSQtmWcSS+H+FELqwm26ckkxgJBOn68VpdSTEBFmFiJTA2enqiVoKuhDA==',
            publicKey: 'iE0KOlLusSBOImOb6BA/tTzocFgtW2q0iHVM1WsFkuA='
        };

        const hash = getAccountBlockHash(accountBlock);
        assert.equal(hash, accountBlock.hash);
    });

    it('test_hash_3', function () {
        const accountBlock = {
            address: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            blockType: 4,
            previousHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
            height: '4',
            sendBlockHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
            nonce: 'Sg0sdhyaEus=',
            difficulty: '65534',
            hash: '23b9a085f0280eb5309f27094bd00420ba2e2c5b16ef98dc40b1c778820f31a7',
            signature: 'kuspOXODnp6MlJ7hAYb6YBexDCBhbTAaJ0u660OvTuOrviqWtKb3PzE+XV6XroUXhxuDvNB5U+IK8s93n4n7Cg==',
            publicKey: 'iE0KOlLusSBOImOb6BA/tTzocFgtW2q0iHVM1WsFkuA='
        };

        const hash = getAccountBlockHash(accountBlock);
        assert.equal(hash, accountBlock.hash);
    });
});

describe('signAccountBlock', function () {
    describe('test_signTX_receive', function () {
        const privKey = '36509ee50210a386f6ac082b21f72a7021a986a7f3406b4f70745b5260d0b4c0884d0a3a52eeb1204e22639be8103fb53ce870582d5b6ab488754cd56b0592e0';
        const accountBlock = {
            address: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            blockType: 4,
            previousHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
            height: '4',
            sendBlockHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
            nonce: 'Sg0sdhyaEus=',
            difficulty: '65534',
            hash: '23b9a085f0280eb5309f27094bd00420ba2e2c5b16ef98dc40b1c778820f31a7',
            signature: 'kuspOXODnp6MlJ7hAYb6YBexDCBhbTAaJ0u660OvTuOrviqWtKb3PzE+XV6XroUXhxuDvNB5U+IK8s93n4n7Cg==',
            publicKey: 'iE0KOlLusSBOImOb6BA/tTzocFgtW2q0iHVM1WsFkuA='
        };

        const { signature, publicKey } = signAccountBlock(accountBlock, privKey);
        it('publicKey', function () {
            assert.equal(publicKey, accountBlock.publicKey);
        });
        it('signature', function () {
            assert.equal(signature, accountBlock.signature);
        });
    });

    describe('test_signTX_send', function () {
        const privKey = '36509ee50210a386f6ac082b21f72a7021a986a7f3406b4f70745b5260d0b4c0884d0a3a52eeb1204e22639be8103fb53ce870582d5b6ab488754cd56b0592e0';
        const accountBlock = {
            address: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
            blockType: 2,
            previousHash: 'd61d7939d4f2a184cd1cbee2d3d5dbcad999c8fd6e3d4f2fb5c71a04d3554a5d',
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

        const { signature, publicKey } = signAccountBlock(accountBlock, privKey);
        it('publicKey', function () {
            assert.equal(publicKey, accountBlock.publicKey);
        });
        it('signature', function () {
            assert.equal(signature, accountBlock.signature);
        });
    });
});

describe('getCreateContractData', function () {
    it('getCreateContractData case 0', function () {
        const _data = getCreateContractData({
            'responseLatency': 2,
            'randomDegree': 1,
            'quotaMultiplier': 10,
            'code': '608060405234801561001057600080fd5b506101ca806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806380ae0ea114610046575b600080fd5b6100bd6004803603602081101561005c57600080fd5b810190808035906020019064010000000081111561007957600080fd5b82018360208201111561008b57600080fd5b803590602001918460208302840111640100000000831117156100ad57600080fd5b90919293919293905050506100bf565b005b60006002838390508115156100d057fe5b061415156100dd57600080fd5b600080905060008090505b8383905081101561018a576000848483818110151561010357fe5b9050602002013590506000858560018501818110151561011f57fe5b905060200201359050808401935080841015151561013c57600080fd5b600081111561017d578173ffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff168260405160405180820390838587f1505050505b50506002810190506100e8565b50348114151561019957600080fd5b50505056fea165627a7a723058203cef4a3f93b33e64e99e0f88f586121282084394f6d4b70f1030ca8c360b74620029',
            'params': ''
        });

        assert.equal('AAAAAAAAAAAAAgECAQpggGBAUjSAFWEAEFdgAID9W1BhAcqAYQAgYAA5YADz/mCAYEBSYAQ2EGEAQVdgADV8AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQBGP/////FoBjgK4OoRRhAEZXW2AAgP1bYQC9YASANgNgIIEQFWEAXFdgAID9W4EBkICANZBgIAGQZAEAAAAAgREVYQB5V2AAgP1bggGDYCCCAREVYQCLV2AAgP1bgDWQYCABkYRgIIMChAERZAEAAAAAgxEXFWEArVdgAID9W5CRkpORkpOQUFBQYQC/VlsAW2AAYAKDg5BQgRUVYQDQV/5bBhQVFWEA3VdgAID9W2AAgJBQYACAkFBbg4OQUIEQFWEBildgAISEg4GBEBUVYQEDV/5bkFBgIAIBNZBQYACFhWABhQGBgRAVFWEBH1f+W5BQYCACATWQUICEAZNQgIQQFRUVYQE8V2AAgP1bYACBERVhAX1XgXP//////////////////////////xZGaf////////////8WgmBAUWBAUYCCA5CDhYfxUFBQUFtQUGACgQGQUGEA6FZbUDSBFBUVYQGZV2AAgP1bUFBQVv6hZWJ6enIwWCA870o/k7M+ZOmeD4j1hhISgghDlPbUtw8QMMqMNgt0YgAp', _data);
    });

    it('getCreateContractData case 1', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor', 'inputs': [{ 'type': 'address' }] }],
            code: '6080',
            params: ['vite_0000000000000000000000000000000000000000a4f3a0cb58']
        });

        assert.equal('AAAAAAAAAAAAAgEAAApggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', _data);
    });

    it('getCreateContractData case 2', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor', 'inputs': [] }],
            code: '6080',
            responseLatency: 10
        });

        assert.equal('AAAAAAAAAAAAAgEKAApggA==', _data);
    });

    it('getCreateContractData case 3', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor' }],
            code: '6080',
            responseLatency: 10
        });

        assert.equal('AAAAAAAAAAAAAgEKAApggA==', _data);
    });

    it('getCreateContractData case 4', function () {
        const _data = getCreateContractData({
            code: '6080',
            responseLatency: 10,
            quotaMultiplier: 15
        });

        assert.equal('AAAAAAAAAAAAAgEKAA9ggA==', _data);
    });
});

describe('encodeContractList', function () {
    const res = encodeContractList(Contracts);
    for (const key in res) {
        const _res = res[key];
        it(`Contracts have type ${ _res.transactionType }`, function () {
            assert(!!Contracts[_res.transactionType], true);
        });
        it(`key have contractAddress ${ _res.contractAddress }`, function () {
            assert(key.indexOf(Contracts[_res.transactionType].contractAddress) === 9, true);
        });
        it(`${ _res.transactionType } have abi`, function () {
            assert(!!_res.abi, true);
        });
        it(`${ _res.transactionType } have contractAddress`, function () {
            assert(!!_res.abi, true);
        });
    }
});


// describe('getAccountBlock', function () {
//     const reqAccBlock = [ {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         blockType: 2
//     }, {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         blockType: 2,
//         amount: '0',
//         toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
//         tokenId: 'tti_5649544520544f4b454e6e40'
//     }, {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         blockType: 4,
//         fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046',
//         amount: '0',
//         toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
//         tokenId: 'tti_5649544520544f4b454e6e40',
//         height: '19',
//         prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7'
//     }, {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         blockType: 4,
//         fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046',
//         amount: '0',
//         toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
//         tokenId: 'tti_5649544520544f4b454e6e40',
//         height: '19',
//         prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7'
//     }, {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         blockType: 2,
//         height: '19',
//         prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7',
//         message: '2123'
//     }, {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         blockType: 4,
//         fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046',
//         height: '19',
//         prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7',
//         data: 'MjEyMw==',
//         nonce: 'MjEyMw=='
//     } ];

//     testAccBlockCase(reqAccBlock, getAccountBlock);
// });

// describe('getSendTxBlock', function () {
//     const reqAccBlock = [ {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         amount: '0',
//         toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
//         tokenId: 'tti_5649544520544f4b454e6e40'
//     }, {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         amount: '0',
//         toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
//         tokenId: 'tti_5649544520544f4b454e6e40',
//         height: '19',
//         prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7',
//         message: '2123'
//     } ];

//     testAccBlockCase(reqAccBlock, getSendTxBlock, resBlock => {
//         it('send tx: blockType = 2', function () {
//             assert.equal(resBlock.blockType, 2);
//         });
//     });
// });

// describe('getReceiveTxBlock', function () {
//     const reqAccBlock = [ {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046'
//     }, {
//         accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
//         fromBlockHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046',
//         height: '19',
//         prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7'
//     } ];

//     testAccBlockCase(reqAccBlock, getReceiveTxBlock, resBlock => {
//         it('receive tx: blockType = 4', function () {
//             assert.equal(resBlock.blockType, 4);
//         });
//     });
// });

// function testAccBlockCase(reqAccBlock, func, validFunc) {
//     reqAccBlock.forEach(reqBlock => {
//         const resBlock = func(reqBlock);
//         validFunc && validFunc(resBlock);

//         it('required params', function () {
//             assert.equal(resBlock.accountAddress, reqBlock.accountAddress);
//             reqBlock.blockType && assert.equal(resBlock.blockType, reqBlock.blockType);
//             reqBlock.nonce && assert.equal(resBlock.nonce, reqBlock.nonce);
//         });

//         it('prevHash and height', function () {
//             reqBlock.prevHash && assert.equal(resBlock.prevHash, reqBlock.prevHash);
//             reqBlock.height && assert.equal(resBlock.height, Number(reqBlock.height) + 1);
//             !reqBlock.height && assert.equal(resBlock.height, '1');
//             !reqBlock.prevHash && assert.equal(resBlock.prevHash, Default_Hash);
//         });

//         resBlock.blockType === BlockType.Response
//         && it('receiveBlock don\'t have tokenInfo', function () {
//             assert.equal(resBlock.fromBlockHash, reqBlock.fromBlockHash);
//             assert.equal(typeof resBlock.tokenId, 'undefined');
//             assert.equal(typeof resBlock.amount, 'undefined');
//             assert.equal(typeof resBlock.toAddress, 'undefined');
//         });

//         resBlock.blockType === BlockType.TransferRequest
//         && it('sendBlock need have tokenInfo', function () {
//             reqBlock.tokenId && assert.equal(resBlock.tokenId, reqBlock.tokenId);
//             reqBlock.amount && assert.equal(resBlock.amount, reqBlock.amount);
//             reqBlock.toAddress && assert.equal(resBlock.toAddress, reqBlock.toAddress);
//         });

//         (reqBlock.message || reqBlock.data)
//         && it('message to base64 string, data is not change.', function () {
//             if (reqBlock.message) {
//                 const msgHex = `${ Buffer.from(reqBlock.message).toString('hex') }`;
//                 const msgBase64 = Buffer.from(msgHex, 'hex').toString('base64');
//                 assert.equal(resBlock.data, msgBase64);
//             }
//             reqBlock.data && assert.equal(resBlock.data, reqBlock.data);
//         });
//     });
// }
