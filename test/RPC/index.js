// [NOTICE] At the first, npm run rpc && start go-vite server

describe('Communication Base Library Test: libs/Communication/index.js', function() {
    require('./Communication/index');
});

// describe('IPC_RPC Base Library Test: libs/IPC/index.js', function () {
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

describe('WS_RPC Base Library Test: libs/WS/index.js', function () {
    require('./WS_RPC/request');
    require('./WS_RPC/notification');
    require('./WS_RPC/batch');
    require('./WS_RPC/reset');
});

describe('HTTP_VITE Base Library Test: libs/HTTP/index.js', function () {
    require('./HTTP_VITE');
});
