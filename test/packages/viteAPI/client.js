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



// function testFunc(notIncluded, client) {
//     it('extends of ViteAPI', function () {
//         assert.equal(client instanceof ViteAPI, true);
//     });

//     for (const space in methods) {
//         if (notIncluded.indexOf(space) !== -1) {
//             it(`client.${ space } null`, function () {
//                 assert.equal(!!client[space], false);
//             });
//             continue;
//         }

//         it(`client.${ space }`, function () {
//             assert.equal(!!client[space], true);
//         });

//         const namespace = space === 'subscribe' ? 'subscribeFunc' : space;

//         for (const method in methods[space]) {
//             it(`client.${ namespace }.${ method }`, function () {
//                 assert.equal(typeof client[namespace][method], 'function');
//             });
//         }
//     }
// }
