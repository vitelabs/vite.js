import './cover';

describe('Require package', function () {
    require('./envTest/es5');
});

describe('Communication Test: src/communication', function () {
    require('./packages/communication');
});

describe('ViteAPI Test: src/viteAPI', function () {
    require('./packages/viteAPI/provider');
    require('./packages/viteAPI/index');
    require('./packages/viteAPI/ws');
});

require('./packages/accountBlock/account');

// viteAPI
// http
// ipc
// ws
require('./RPC/index.js');
