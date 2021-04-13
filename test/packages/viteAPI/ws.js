const assert = require('assert');

import Provider from '../../../src/viteAPI/provider';
import WS_RPC from '../../../src/WS';

describe('test ws provider', () => {
    it('should trigger event when connect successfully', (done) => {
        const wsServer = new WS_RPC('wss://node-tokyo.vite.net/ws', 2000, {
            retryInterval: 1,
            retryTimes: -1
        });
        const viteClient = new Provider(wsServer, () => {
            done();
        });
    });

    it('should trigger error event when connected failed', (done) => {
        const wsServer = new WS_RPC('wss://no.vite.net/ws', 2000, {
            retryInterval: 1,
            retryTimes: -1
        });
        wsServer.on('error', (err) => {
            done();
        });
    });
});
