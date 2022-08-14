const assert = require('assert');

import { Contracts } from '../../../src/constant/index';
import { encodeFunctionSignature, encodeFunctionCall } from '../../../src/abi/index';
import {
    Default_Hash, Default_Contract_TransactionType,
    getTransactionType, encodeContractList, decodeContractAccountBlock, decodeAccountBlockDataByContract,
    getAccountBlockHash, signAccountBlock,
    createContractAddress, getCreateContractData, getCallContractData, messageToData,
    AccountBlockStatus, isRequestBlock, isResponseBlock,
    checkAccountBlock, isValidAccountBlockWithoutHash, isValidAccountBlockWithoutSignature, isValidAccountBlock
} from '../../../src/accountBlock/utils';

import config from '../../config';


it('Default_Hash', function () {
    assert.equal(Default_Hash, '0000000000000000000000000000000000000000000000000000000000000000');
});

const accountBlock = {
    accountAddress: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    amount: '0',
    blockType: 2,
    confirmedHash: '1a861628e070e47f07ca3b7eedafe1f814a4d185f2b156923a5b1fa4775ceff0',
    confirmedTimes: '223404',
    confirmations: '223404',
    data: 'pinFMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB',
    difficulty: null,
    fee: '0',
    fromAddress: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    fromBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
    sendBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '156a47de8b5a690562278360e41e337ee4f1b4aa8d979f377beb0cc70f939032',
    height: '105',
    logHash: null,
    vmlogHash: null,
    nonce: null,
    prevHash: '558c6873d27c903ec9067cf54432e9d16d9b31474adab165ad1f6cc392beeb8d',
    previousHash: '558c6873d27c903ec9067cf54432e9d16d9b31474adab165ad1f6cc392beeb8d',
    producer: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    publicKey: '8Np6DQ78vi8A/QnuvbMWta8QGK7ZThBgxpRGR1QoWDo=',
    quota: '62000',
    quotaUsed: '62000',
    receiveBlockHash: '4a884aeec5f90072a056ac25f796debad0c9dafc63ff23d5dc2e3cdb9dcf8f03',
    receiveBlockHeight: '23',
    sendBlockList: null,
    triggeredSendBlockList: null,
    signature: 'FLhv2LCWYHnchw1meqShryTIStI0H9089RL27We+TNMjMro0G+EsOZ8pwCaFpr7mpOKpMp2N4T5WIwavUQ5YDQ==',
    timestamp: 1560161202,
    toAddress: 'vite_0000000000000000000000000000000000000004d28108e76b',
    tokenId: 'tti_5649544520544f4b454e6e40'
};
const wrongAccountBlock = {
    accountAddress: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    amount: '0',
    blockType: 2,
    confirmedHash: '1a861628e070e47f07ca3b7eedafe1f814a4d185f2b156923a5b1fa4775ceff0',
    confirmedTimes: '223404',
    confirmations: '223404'
};

it('isValidAccountBlockWithoutHash', function () {
    assert.equal(isValidAccountBlockWithoutHash(accountBlock), true);
    assert.equal(isValidAccountBlockWithoutHash(wrongAccountBlock), false);
    assert.equal(!!checkAccountBlock(accountBlock, AccountBlockStatus.Before_Hash), false);
    assert.equal(!!checkAccountBlock(wrongAccountBlock, AccountBlockStatus.Before_Hash), true);
});

it('isValidAccountBlockWithoutSignature', function () {
    assert.equal(isValidAccountBlockWithoutSignature(accountBlock), true);
    assert.equal(isValidAccountBlockWithoutSignature(wrongAccountBlock), false);
    assert.equal(!!checkAccountBlock(accountBlock, AccountBlockStatus.Before_Signature), false);
    assert.equal(!!checkAccountBlock(wrongAccountBlock, AccountBlockStatus.Before_Signature), true);
});

it('isValidAccountBlock', function () {
    assert.equal(isValidAccountBlock(accountBlock), true);
    assert.equal(isValidAccountBlock(wrongAccountBlock), false);
    assert.equal(!!checkAccountBlock(accountBlock, AccountBlockStatus.Complete), false);
    assert.equal(!!checkAccountBlock(wrongAccountBlock, AccountBlockStatus.Complete), true);
});

it('isRequestBlock', function () {
    assert.equal(isRequestBlock(1), true);
    assert.equal(isRequestBlock(2), true);
    assert.equal(isRequestBlock(3), true);
    assert.equal(isRequestBlock(4), false);
    assert.equal(isRequestBlock(5), false);
    assert.equal(isRequestBlock(6), true);
    assert.equal(isRequestBlock(7), false);
});

it('isResponseBlock', function () {
    assert.equal(isResponseBlock(1), false);
    assert.equal(isResponseBlock(2), false);
    assert.equal(isResponseBlock(3), false);
    assert.equal(isResponseBlock(4), true);
    assert.equal(isResponseBlock(5), true);
    assert.equal(isResponseBlock(6), false);
    assert.equal(isResponseBlock(7), true);
});

describe('createContractAddress', function () {
    it('case 1', function () {
        const toAddress = createContractAddress({
            address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
            height: 117,
            previousHash: 'e0cea481593649f6117c648e35cfd1b1ced91f1a6b37de37257e6be11215289d'
        });
        assert.equal('vite_b671995ad63fd0426eb93000bb266a7be748f6502f437ea817', toAddress);
    });

    it('case 2', function () {
        const toAddress = createContractAddress({
            address: 'vite_ab24ef68b84e642c0ddca06beec81c9acb1977bbd7da27a87a',
            height: 10,
            previousHash: 'd7dac74e9d297f52f880402f5590fff28705952627770c9d426540c81360eb3e'
        });
        assert.equal('vite_b778133ae2a8d95254e93ba57b6fb26121aaa433703e8e074f', toAddress);
    });
});

describe('getCreateContractData', function () {
    it('case 1', function () {
        const _data = getCreateContractData({
            'responseLatency': 2,
            'randomDegree': 1,
            'quotaMultiplier': 10,
            'code': '608060405234801561001057600080fd5b506101ca806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806380ae0ea114610046575b600080fd5b6100bd6004803603602081101561005c57600080fd5b810190808035906020019064010000000081111561007957600080fd5b82018360208201111561008b57600080fd5b803590602001918460208302840111640100000000831117156100ad57600080fd5b90919293919293905050506100bf565b005b60006002838390508115156100d057fe5b061415156100dd57600080fd5b600080905060008090505b8383905081101561018a576000848483818110151561010357fe5b9050602002013590506000858560018501818110151561011f57fe5b905060200201359050808401935080841015151561013c57600080fd5b600081111561017d578173ffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff168260405160405180820390838587f1505050505b50506002810190506100e8565b50348114151561019957600080fd5b50505056fea165627a7a723058203cef4a3f93b33e64e99e0f88f586121282084394f6d4b70f1030ca8c360b74620029',
            'params': ''
        });
        assert.equal('AAAAAAAAAAAAAgECAQpggGBAUjSAFWEAEFdgAID9W1BhAcqAYQAgYAA5YADz/mCAYEBSYAQ2EGEAQVdgADV8AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQBGP/////FoBjgK4OoRRhAEZXW2AAgP1bYQC9YASANgNgIIEQFWEAXFdgAID9W4EBkICANZBgIAGQZAEAAAAAgREVYQB5V2AAgP1bggGDYCCCAREVYQCLV2AAgP1bgDWQYCABkYRgIIMChAERZAEAAAAAgxEXFWEArVdgAID9W5CRkpORkpOQUFBQYQC/VlsAW2AAYAKDg5BQgRUVYQDQV/5bBhQVFWEA3VdgAID9W2AAgJBQYACAkFBbg4OQUIEQFWEBildgAISEg4GBEBUVYQEDV/5bkFBgIAIBNZBQYACFhWABhQGBgRAVFWEBH1f+W5BQYCACATWQUICEAZNQgIQQFRUVYQE8V2AAgP1bYACBERVhAX1XgXP//////////////////////////xZGaf////////////8WgmBAUWBAUYCCA5CDhYfxUFBQUFtQUGACgQGQUGEA6FZbUDSBFBUVYQGZV2AAgP1bUFBQVv6hZWJ6enIwWCA870o/k7M+ZOmeD4j1hhISgghDlPbUtw8QMMqMNgt0YgAp', _data);
    });
    it('case 2', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor', 'inputs': [{ 'type': 'address' }] }],
            code: '6080',
            params: ['vite_0000000000000000000000000000000000000000a4f3a0cb58']
        });
        assert.equal('AAAAAAAAAAAAAgEAAApggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', _data);
    });
    it('case 3', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor', 'inputs': [] }],
            code: '6080',
            responseLatency: 10
        });
        assert.equal('AAAAAAAAAAAAAgEKAApggA==', _data);
    });
    it('case 4', function () {
        const _data = getCreateContractData({
            abi: [{ 'type': 'constructor' }],
            code: '6080',
            responseLatency: 10
        });
        assert.equal('AAAAAAAAAAAAAgEKAApggA==', _data);
    });
    it('case 5', function () {
        const _data = getCreateContractData({
            code: '6080',
            responseLatency: 10,
            quotaMultiplier: 15
        });
        assert.equal('AAAAAAAAAAAAAgEKAA9ggA==', _data);
    });
});

it('getCallContractData', function () {
    const data = '8pxs4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAFU0YryhN7rCn0QOmvSrLiwbuCSTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACc3MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    const params = [ '00000000000000000001', 'ss', 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2' ];
    const abi = Contracts.RegisterSBP_V1.abi;
    assert.equal(getCallContractData({ params, abi }), data);
});

it('messageToData', function () {
    const message = '121212';

    const messageHex = Buffer.from(message).toString('hex');
    const data = Buffer.from(messageHex, 'hex').toString('base64');

    assert.equal(data, messageToData(message));
});


describe('getAccountBlockHash', function () {
    it('hash 1', function () {
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

    it('hash 2', function () {
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

    it('hash 3', function () {
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
    describe('receive', function () {
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

    describe('send', function () {
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


describe('decodeContractAccountBlock decodeAccountBlockDataByContract', function () {
    for (const txType in config.blockList) {
        if (!Contracts[txType]) {
            continue;
        }

        const abi = Contracts[txType].abi;
        const accountBlock = config.blockList[txType];

        const decodeRes = decodeContractAccountBlock({
            accountBlock,
            contractAddress: Contracts[txType].contractAddress,
            abi
        });

        const decodeDataRes = decodeAccountBlockDataByContract({
            data: accountBlock.data,
            abi
        });

        describe(txType, function () {
            it('decodeResult', function () {
                assert.deepEqual(decodeRes, decodeDataRes);
            });

            for (let i = 0; i < (abi.inputs || []).length; i++) {
                const item = abi.inputs[i];
                it(item.name, function () {
                    assert.ok(decodeRes[item.name] != null);
                });
            }
        });
    }
});

describe('encodeContractList', function () {
    const res = encodeContractList(Contracts);

    it('Default_Contract_TransactionType', function () {
        assert.deepEqual(Default_Contract_TransactionType, res);
    });

    for (const key in res) {
        const result = res[key];
        const transactionType = result.transactionType;

        it(`Contracts have type ${ transactionType }`, function () {
            assert.equal(!!Contracts[transactionType], true);
        });

        const contract = Contracts[transactionType];
        const abi = contract.abi;
        const funsign = encodeFunctionSignature(abi);

        describe(transactionType, function () {
            it('key', function () {
                assert.equal(key, `${ funsign }_${ contract.contractAddress }`);
            });
            it('abi', function () {
                assert.deepEqual(result.abi, contract.abi);
            });
            it('contranctAddress', function () {
                assert.deepEqual(result.contranctAddress, contract.contranctAddress);
            });
        });
    }
});

describe('getTransactionType', function () {
    for (const transactionType in config.blockList) {
        it(transactionType, function () {
            assert.equal(getTransactionType(config.blockList[transactionType]).transactionType, transactionType);
        });
    }
    it('customTransactionType helloWorld', function () {
        const abi = { type: 'function', name: 'hello', inputs: [] };
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
