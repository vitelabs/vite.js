const assert = require('assert');

const { WS_RPC } = require('../../src/WS/index');
const { HTTP_RPC } = require('../../src/HTTP/index');
const { IPC_RPC } = require('../../src/IPC/index');
const { ViteAPI } = require('../../src/viteAPI/index');

it('WS_RPC', function () {
    assert.equal(typeof WS_RPC, 'function');
});
it('HTTP_RPC', function () {
    assert.equal(typeof HTTP_RPC, 'function');
});
it('IPC_RPC', function () {
    assert.equal(typeof IPC_RPC, 'function');
});
it('ViteAPI', function () {
    assert.equal(typeof ViteAPI, 'function');
});
