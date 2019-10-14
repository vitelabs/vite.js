const assert = require('assert');

import Client from '../../../src/viteAPI/client';
import HTTP_RPC from '../../../src/HTTP';

const provider = new HTTP_RPC();
const myClient = new Client(provider, () => {
    it('connected callback', function () {
        assert.equal(true, true);
    });
});

it('property _provider', function () {
    assert.deepEqual(provider, myClient._provider);
});

it('property http isConnected', function () {
    assert.deepEqual(true, myClient.isConnected);
});

[ 'setProvider', 'unsubscribe', 'unsubscribeAll', 'request', 'notification', 'batch', 'subscribe' ].forEach(key => {
    assert.equal(typeof myClient[key], 'function');
});
