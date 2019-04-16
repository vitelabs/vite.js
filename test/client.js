const assert = require('assert');

import Client from '../src/client/index';
import { methods } from '../src/constant';
import HTTP_RPC from '../src/HTTP';

const myWSClient = new Client({ type: 'ws' });
const myHTTPClient = new Client(new HTTP_RPC());
const myIPCClient = new Client({ type: 'ipc' });

describe('WS Client property', function () {
    testFunc(['wallet'], myWSClient);
});

describe('HTTP Client property', function () {
    testFunc(['wallet'], myHTTPClient);
});

describe('IPC Client property', function () {
    testFunc([], myIPCClient);
});


function testFunc(notIncluded, client) {
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
                assert.equal(!!client[namespace][method], true);
            });
        }
    }
}
