describe('Base Libs Test', function() {
    describe('Mnemonic Test: bip39', function () {
        require('./base/bip39');
    });
    
    describe('Ed25519 blake2b Test: tweetnale-blake2b', function () {
        require('./base/ed25519');
    });
});

describe('Address Test: src/utils/address', function () {
    require('./address');
});

describe('Vite Test: src/Vite', function () {
    require('./Vite/account');
});

describe('Wallet Test: src/Wallet', function () {
    require('./Wallet/keystore');
    require('./Wallet/address');
    require('./Wallet/account');
});

describe('Utils Test: libs/utils', function () {
    require('./utils');
});
