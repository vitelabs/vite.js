const assert = require('assert');

const { client } = require('../../src/vitejs');
const { WS_RPC } = require('../../src/WS');
const { HTTP_RPC } = require('../../src/HTTP');
const { IPC_RPC } = require('../../src/IPC');
const { addrAccount } = require('../../src/addrAccount');
const { account } = require('../../src/account');
const { hdAccount } = require('../../src/hdAccount');
const { netProcessor } = require('../../src/netProcessor');

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
