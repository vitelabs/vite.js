describe('Type Test: src/type', function () {
    require('./packages/type');
});

describe('Abi Test: src/abi', function () {
    require('./packages/abi');
});

describe('Keystore Test: src/keystore', function () {
    require('./packages/keystore');
});

describe('Utils Test: src/utils', function () {
    require('./packages/utils');
});

describe('Constant Test: src/constant', function () {
    require('./packages/constant');
});

describe('AccountBlock Test: src/accountBlock', function () {
    require('./packages/accountBlock/utils');
    require('./packages/accountBlock/transaction');
});

describe('wallet Test: src/wallet', function () {
    require('./packages/wallet/hdKey');
    require('./packages/wallet/address');
    require('./packages/wallet/index');
});
