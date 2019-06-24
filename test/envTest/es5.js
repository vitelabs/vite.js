const assert = require('assert');

const { account } = require('../../src/account/index');
const { addrAccount } = require('../../src/addrAccount/index');
const { client } = require('../../src/vitejs/index');
const { WS_RPC } = require('../../src/WS/index');
const { HTTP_RPC } = require('../../src/HTTP/index');
const { IPC_RPC } = require('../../src/IPC/index');
const { hdAccount } = require('../../src/hdAccount/index');
const { netProcessor } = require('../../src/netProcessor/index');

it('client', function () {
    assert(typeof client, 'function');
});
it('WS_RPC', function () {
    assert(typeof WS_RPC, 'function');
});
it('HTTP_RPC', function () {
    assert(typeof HTTP_RPC, 'function');
});
it('IPC_RPC', function () {
    assert(typeof IPC_RPC, 'function');
});
it('addrAccount', function () {
    assert(typeof addrAccount, 'function');
});
it('account', function () {
    assert(typeof account, 'function');
});
it('hdAccount', function () {
    assert(typeof hdAccount, 'function');
});
it('netProcessor', function () {
    assert(typeof netProcessor, 'function');
});
