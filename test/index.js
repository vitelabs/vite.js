import './cover';

describe('Account Test: src/account', function () {
    require('./account');
});

describe('AddrAccount Test: src/addrAccount', function () {
    require('./addrAccount');
});

describe('Client Test: src/client', function () {
    require('./client');
});

describe('HdAccount Test: src/hdAccount', function () {
    require('./hdAccount');
});

describe('Communication Test: src/communication', function () {
    require('./communication');
});


// netProcessor
// http
// ipc
// ws
require('./RPC/http/index');
