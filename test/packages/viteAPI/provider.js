const assert = require('assert');

import Provider from '../../../src/viteAPI/provider';
import HTTP_RPC from '../../../src/HTTP';

const httpServer = new HTTP_RPC();
const viteProvider = new Provider(httpServer, () => {
    it('connected callback', function () {
        assert.equal(true, true);
    });
});

it('property _provider', function () {
    assert.deepEqual(httpServer, viteProvider._provider);
});

it('property http isConnected', function () {
    assert.deepEqual(true, viteProvider.isConnected);
});

[ 'setProvider', 'unsubscribe', 'unsubscribeAll', 'request', 'notification', 'batch', 'subscribe' ].forEach(key => {
    assert.equal(typeof viteProvider[key], 'function');
});
