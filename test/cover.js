describe('Type Test: src/type', function () {
    require('./packages/type');
});

describe('Abi Test: src/abi', function () {
    require('./packages/abi');
});

describe('AccountBlock Test: src/accountBlock', function () {
    require('./packages/accountBlock');
});

describe('Constant Test: src/constant', function () {
    require('./packages/constant');
});

describe('Keystore Test: src/keystore', function () {
    require('./packages/keystore');
});

describe('Address Test: src/hdWallet', function () {
    require('./packages/hdWallet/hdKey');
    require('./packages/hdWallet/address');
    require('./packages/hdWallet/index');
});

describe('Utils Test: src/utils', function () {
    require('./packages/utils');
});
