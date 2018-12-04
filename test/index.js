describe('Base Libs Test', function() {
    describe('Mnemonic Test: bip39', function () {
        require('./base/bip39');
    });
    
    describe('Ed25519 blake2b Test: tweetnale-blake2b', function () {
        require('./base/ed25519');
    });
});

describe('Vite Test: src/Vite', function () {
    require('./Vite/account');
});

describe('Utils Test: src/utils', function () {
    require('./utils/encoder');
    require('./utils/address');
    require('./utils/keystore');
});
