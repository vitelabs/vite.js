const assert = require('assert');

import { encodeFunctionSignature, encodeFunctionCall } from '../../src/abi/index';
import Client from '../../src/client/index';
import netProcessor from '../../src/netProcessor/index';
import { methods } from '../../src/constant/index';
import HTTP_RPC from '../../src/HTTP/index';
import { getTxType } from '../../src/accountblock/index';

const myWSClient = new Client({ type: 'ws' });
const myHTTPClient = new Client(new HTTP_RPC());
const myIPCClient = new Client({ type: 'ipc' });

describe('WS Client', function () {
    testFunc(['wallet'], myWSClient);
});

describe('HTTP Client', function () {
    testFunc(['wallet'], myHTTPClient);
});

describe('IPC Client', function () {
    testFunc([], myIPCClient);
});


function testFunc(notIncluded, client) {
    it('extends of netProcessor', function () {
        assert.equal(client instanceof netProcessor, true);
    });

    for (const space in methods) {
        if (notIncluded.indexOf(space) !== -1) {
            it(`client.${ space } null`, function () {
                assert.equal(!!client[space], false);
            });
            continue;
        }

        it(`client.${ space }`, function () {
            assert.equal(!!client[space], true);
        });

        const namespace = space === 'subscribe' ? 'subscribeFunc' : space;

        for (const method in methods[space]) {
            it(`client.${ namespace }.${ method }`, function () {
                assert.equal(typeof client[namespace][method], 'function');
            });
        }
    }
}

describe('Client addTxType', function () {
    const abi = { methodName: 'hello', inputs: [] };
    const contractAddr = 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2';

    myHTTPClient.addTxType({ helloWorld: { contractAddr, abi }});
    const signFunc = encodeFunctionSignature(abi);
    const key = `${ signFunc }_${ contractAddr }`;

    it('isHaveTxType', function () {
        assert(myHTTPClient.customTxType[key].txType, 'helloWorld');
    });

    it('getTxType custom', function () {
        const txtypeObj = getTxType({
            blockType: 2,
            data: Buffer.from(encodeFunctionCall(abi), 'hex').toString('base64'),
            toAddress: contractAddr // [TODO] Whether is contractAddress or not
        }, myHTTPClient.customTxType);
        assert.deepEqual(txtypeObj, myHTTPClient.customTxType[key]);
    });
});

