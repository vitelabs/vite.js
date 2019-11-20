const assert = require('assert');
const bip39 = require('bip39');

import walletUtils from '../../../src/wallet/index.ts';

const mnemonics = 'horn equal mystery success pride regret renew great witness hire man moon';
const id = '714f0048664984b8459cbb522f49591e4d026406db2a692cad10e328776359f9';
const addrList = [
    'vite_0c27e431629b49fad8fcc87d33123dd70d6a73657c60cd8cb4',
    'vite_9e406fd75463a232f00f5c3bf51d0c49561d6c2ec119ce3f3c',
    'vite_bf56e382349867441f1f52ab55661c0ff0786204444fa10ee2',
    'vite_fb61bb0a65ac4141aeddfa247c808ded1ab4ea53ef10eef644',
    'vite_8cf0c68cea2988d14e30d133baa2b279ccc4b4011263d74bd0',
    'vite_25b07769690f8e897e0289907a7117d063614c7fe698648e21',
    'vite_aec7c83a130617fef863723cf731aed0426d45a2227268b1e0',
    'vite_00b2aed4102dfc97b6a322c73ae1158d024fe5444213ac1a10',
    'vite_889ba379a0390843fd18f8f89ed8ae268bd2bfdbb48f96c57a',
    'vite_97692d152d969bddaedaddcd58baa996fe913d912b2875c35c'
];

it('deriveAddress', function () {
    const index = 0;

    const AddressObj = walletUtils.deriveAddress({ mnemonics, index });
    const { seedHex } = walletUtils.getSeedFromMnemonics(mnemonics);
    const keypair = walletUtils.deriveKeyPairByIndex(seedHex, index);

    assert.equal(AddressObj.address, addrList[index]);
    assert.equal(AddressObj.privateKey, keypair.privateKey);
    assert.equal(AddressObj.publicKey, keypair.publicKey);
});

it('deriveAddressList', function () {
    const as = walletUtils.deriveAddressList({
        mnemonics,
        startIndex: 0,
        endIndex: 9
    });

    const arr = [];
    as.forEach(item => {
        arr.push(item.address);
    });

    assert.deepEqual(arr, addrList);
});

describe('createWallet', function () {
    describe('256', function () {
        const wallet = walletUtils.createWallet();

        it('wallet.rootPath', () => {
            assert.deepEqual(walletUtils.ROOT_PATH, wallet.rootPath);
        });
        it('wallet.wordlist', () => {
            assert.deepEqual(wallet.wordlist, bip39.wordlists.EN);
        });
        it('wallet.mnemonics', () => {
            assert.equal(wallet.mnemonics.split(' ').length, 24);
        });
        it('wallet.entropy', () => {
            assert.equal(wallet.entropy.length, 64);
        });
        it('wallt.seed wallet.seedHex', function () {
            const { seed, seedHex } = walletUtils.getSeedFromMnemonics(wallet.mnemonics);
            assert.deepEqual(seed, wallet.seed);
            assert.equal(seedHex, wallet.seedHex);
        });
        it('wallet.deriveAddress', () => {
            const account = wallet.deriveAddress(0);
            const AddressObj = walletUtils.deriveAddress({
                mnemonics: wallet.mnemonics,
                index: 0
            });
            const path = walletUtils.getPath(0);

            assert.equal(AddressObj.address, account.address);
            assert.equal(AddressObj.originalAddress, account.originalAddress);
            assert.equal(AddressObj.privateKey, account.privateKey);
            assert.equal(AddressObj.publicKey, account.publicKey);
            assert.equal(path, account.path);
        });
    });
    describe('128', function () {
        const wallet = walletUtils.createWallet(128, bip39.wordlists.japanese);
        it('wallet.wordlist', () => {
            assert.deepEqual(wallet.wordlist, bip39.wordlists.japanese);
        });
        it('wallet.mnemonics', () => {
            assert.equal(wallet.mnemonics.split('　').length, 12);
        });
        it('wallet.entropy', () => {
            assert.equal(wallet.entropy.length, 32);
        });
        it('wallet.deriveAddress', () => {
            const account = wallet.deriveAddress(0);
            const AddressObj = walletUtils.deriveAddress({
                mnemonics: wallet.mnemonics,
                index: 0,
                wordlist: bip39.wordlists.japanese
            });
            const path = walletUtils.getPath(0);

            assert.equal(AddressObj.address, account.address);
            assert.equal(AddressObj.originalAddress, account.originalAddress);
            assert.equal(AddressObj.privateKey, account.privateKey);
            assert.equal(AddressObj.publicKey, account.publicKey);
            assert.equal(path, account.path);
        });
    });
});

describe('getWallet', function () {
    const wallet = walletUtils.getWallet(mnemonics);
    const entropy = walletUtils.getEntropyFromMnemonics(mnemonics);
    const addressList = wallet.deriveAddressList(0, 9);

    it('wallet.mnemonics', () => {
        assert.equal(wallet.mnemonics, mnemonics);
    });
    it('wallet.id', () => {
        assert.equal(wallet.id, id);
    });
    it('wallet.entropy', () => {
        assert.equal(wallet.entropy, entropy);
    });

    it('wallt.seed wallet.seedHex', function () {
        const { seed, seedHex } = walletUtils.getSeedFromMnemonics(wallet.mnemonics);
        assert.deepEqual(seed, wallet.seed);
        assert.equal(seedHex, wallet.seedHex);
    });
    it('wallet.deriveAddressList', () => {
        const arr = [];
        addressList.forEach(item => {
            arr.push(item.address);
        });
        assert.deepEqual(addrList, arr);
    });
    it('wallet.getAddressList', () => {
        const _addressList = wallet.getAddressList();
        for (let i = 0; i < addressList.length; i++) {
            assert.deepEqual(addressList[i], _addressList[i]);
        }
    });
});
