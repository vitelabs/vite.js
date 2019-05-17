import './cover';

describe('Require package', function () {
    require('./envTest/es5');
});

describe('Account Test: src/account', function () {
    require('./packages/account');
});

describe('AddrAccount Test: src/addrAccount', function () {
    require('./packages/addrAccount');
});

describe('Client Test: src/client', function () {
    require('./packages/client');
});

describe('Communication Test: src/communication', function () {
    require('./packages/communication');
});

describe('HdAccount Test: src/hdAccount', function () {
    require('./packages/hdAccount');
});

describe('NetProcessor Test: src/netProcessor', function () {
    require('./packages/netProcessor');
});

// netProcessor
// http
// ipc
// ws
require('./RPC/index.js');
