const assert = require('assert');

import ViteAPI from '../../../src/viteAPI/index';
import Provider from '../../../src/viteAPI/provider';
import HTTP_RPC from '../../../src/HTTP';
import { encodeFunctionSignature } from '../../../src/abi/index';

const httpServer = new HTTP_RPC();
const myViteAPI = new ViteAPI(httpServer, () => {
    it('connected callback', function () {
        assert.equal(true, true);
    });
});

it('extends of ViteAPI/Provider', function () {
    assert.equal(myViteAPI instanceof Provider, true);
});

describe('ViteAPI addTxType', function () {
    const contractLists = {
        helloWorld: {
            contractAddress: 'vite_0000000000000000000000000000000000000003f6af7459b9',
            abi: { type: 'function', name: 'hello', inputs: [] }
        },
        FullNodeStake: {
            contractAddress: 'vite_8cf2663cc949442db2d3f78f372621733292d1fb0b846f1651',
            abi: { 'inputs': [], 'name': 'stake', 'outputs': [], 'payable': true, 'type': 'function' }
        },
        FullNodeCancelStake: {
            contractAddress: 'vite_b3b6335ef23ef3826cff125b81efd158dac3c2209748e0601a',
            abi: { 'inputs': [{ 'name': 'id', 'type': 'bytes32' }], 'name': 'cancelStake', 'payable': false, 'type': 'function' }
        }
    };

    myViteAPI.addTransactionType(contractLists);
    for (const name in contractLists) {
        const signFunc = encodeFunctionSignature(contractLists[name].abi);
        const key = `${ signFunc }_${ contractLists[name].contractAddress }`;

        it('isHaveTxType', function () {
            assert.equal(myViteAPI.transactionType[key].transactionType, name);
        });
    }

    it('add default type', function () {
        assert.throws(() => myViteAPI.addTransactionType({
            RegisterSBP_V1: {
                contractAddress: 'vite_0000000000000000000000000000000000000003f6af7459b9',
                abi: { 'type': 'function', 'name': 'Register', 'inputs': [ { 'name': 'gid', 'type': 'gid' }, { 'name': 'sbpName', 'type': 'string' }, { 'name': 'blockProducingAddress', 'type': 'address' } ] }
            }
        }), new Error('Please rename it. Your transactionType RegisterSBP_V1 conflicts with default transactionType.'));
    });
});
