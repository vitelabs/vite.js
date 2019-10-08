const assert = require('assert');

import ViteAPI from '../../src/viteAPI/index';
import HTTP_RPC from '../../src/HTTP';

const provider = new HTTP_RPC();
const myViteAPI = new ViteAPI(provider, () => {
    it('connected callback', function () {
        assert.equal(true, true);
    });
});

it('property _provider', function () {
    assert.deepEqual(provider, myViteAPI._provider);
});

it('property http isConnected', function () {
    assert.deepEqual(true, myViteAPI.isConnected);
});

[ 'setProvider', 'unsubscribe', 'unsubscribeAll', 'request', 'notification', 'batch', 'subscribe' ].forEach(key => {
    assert.equal(typeof myViteAPI[key], 'function');
});

