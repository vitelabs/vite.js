const assert = require('assert');

import Provider from '../../../src/viteAPI/provider';
import HTTP_RPC from '../../../src/HTTP';

describe('test ws provider', () => {
    it('should trigger event when connect successfully', done => {
        const httpServer = new HTTP_RPC('https://node.vite.net/gvite', 2000);
        const viteClient = new Provider(httpServer, () => {
            done();
        });
    });

    it('trigger abort when connect successfully', done => {
        const httpServer = new HTTP_RPC('https://node.vite.net/gvite', 2000);
        const viteClient = new Provider(httpServer, () => {
            httpServer.abort();
            done();
        });
    });
});
