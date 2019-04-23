const assert = require('assert');

import NetProcessor from '../../src/netProcessor/index';
import HTTP_RPC from '../../src/HTTP';

const provider = new HTTP_RPC();
const myNetProcessor = new NetProcessor(provider, () => {
    it('connected callback', function () {
        assert.equal(true, true);
    });
});

it('property _provider', function () {
    assert.deepEqual(provider, myNetProcessor._provider);
});

it('property http isConnected', function () {
    assert.deepEqual(true, myNetProcessor.isConnected);
});

[ '_setProvider', 'unSubscribe', 'clearSubscriptions', 'request', 'notification', 'batch', 'subscribe' ].forEach(key => {
    assert.equal(typeof myNetProcessor[key], 'function');
});

