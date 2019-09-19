const assert = require('assert');

import Subscription from '../../src/subscription/index';
import HTTP_RPC from '../../src/HTTP';

const provider = new HTTP_RPC();
const mySubscription = new Subscription(provider, () => {
    it('connected callback', function () {
        assert.equal(true, true);
    });
});

it('property _provider', function () {
    assert.deepEqual(provider, mySubscription._provider);
});

it('property http isConnected', function () {
    assert.deepEqual(true, mySubscription.isConnected);
});

[ '_setProvider', 'unSubscribe', 'clearSubscriptions', 'request', 'notification', 'batch', 'subscribe' ].forEach(key => {
    assert.equal(typeof mySubscription[key], 'function');
});

