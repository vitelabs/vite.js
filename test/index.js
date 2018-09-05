// describe('IPC_RPC Base Library Test: libs/HTTP/index.js', function () {
//     require('./IPC_RPC/request');
//     require('./IPC_RPC/notification');
//     require('./IPC_RPC/batch');
//     require('./IPC_RPC/reset');
// });

// describe('HTTP_RPC Base Library Test: libs/HTTP/index.js', function () {
//     require('./HTTP_RPC/request');
//     require('./HTTP_RPC/notification');
//     require('./HTTP_RPC/batch');
//     require('./HTTP_RPC/reset');
// });

describe('Communication Base Library Test: libs/Communication/index.js', function() {
    require('./Communication/index');
});

describe('Wallet Test: src/Wallet', function () {
    require('./Wallet/keystore');
    require('./Wallet/hd');
    require('./Wallet/memory');
});

describe('Account Test: src/Vite/account/index.js', function () {
    require('./Account/newAddress');
});
