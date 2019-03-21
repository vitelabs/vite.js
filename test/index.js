describe('Mnemonic Test: bip39', function () {
    require('./bip39');
});

describe('Utils Test: packages/utils', function () {
    require('./utils/ed25519');
    require('./utils/encoder');
    require('./utils/tools');
});

describe('Utils Test: packages/abi', function () {
    require('./abi');
});

describe('AccountBlock Test: packages/accountBlock', function () {
    require('./accountBlock');
});

describe('Address Test', function () {
    require('./address');
});

describe('Keystore Test: packages/keystore', function () {
    require('./keystore');
});

describe('Client Test: packages/client', function () {
    require('./client');
});
