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
    require('./packages/accountBlock');
});

describe('HdWallet Test: src/hdWallet', function () {
    require('./packages/hdWallet/hdKey');
    require('./packages/hdWallet/address');
    require('./packages/hdWallet/index');
});

// describe('Transaction Test: src/transaction', function () {
//     require('./packages/transaction/index');
// });
