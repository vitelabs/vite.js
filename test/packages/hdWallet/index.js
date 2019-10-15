const assert = require('assert');

import hdWalletUtils from '../../../src/hdWallet/index.ts';

const mnemonics = 'horn equal mystery success pride regret renew great witness hire man moon';
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

describe('deriveAddresses', function () {
    it('deriveAddress', function () {
        const index = 0;

        const addrObj = hdWalletUtils.deriveAddress({
            mnemonics,
            startIndex: index
        });
        const { seedHex } = hdWalletUtils.getSeedFromMnemonics(mnemonics);
        const keypair = hdWalletUtils.deriveKeyPair(seedHex, index);

        assert.equal(addrObj.address, addrList[index]);
        assert.equal(addrObj.privateKey, keypair.privateKey);
        assert.equal(addrObj.publicKey, keypair.publicKey);
    });

    it('deriveAddressList', function () {
        const as = hdWalletUtils.deriveAddressList({
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
});

describe('hdWallet', function () {
    describe('createHDWallet', function () {
        const hdWallet = hdWalletUtils.createHDWallet();
        it('test mnemonics', () => {
            assert(hdWallet.mnemonics.split(' ').length, 24);
        });
        it('test entropy', () => {
            assert(hdWallet.entropy.length, 512);
        });
        it('deriveWallet 0', () => {
            const wallet = hdWallet.deriveWallet(0);
            const addrObj = hdWalletUtils.deriveAddress({
                mnemonics: hdWallet.mnemonics,
                index: 0
            });
            const path = hdWalletUtils.getPath(0);

            assert.equal(addrObj.address, wallet.address);
            assert.equal(addrObj.originalAddress, wallet.originalAddress);
            assert.equal(addrObj.privateKey, wallet.privateKey);
            assert.equal(addrObj.publicKey, wallet.publicKey);
            assert.equal(path, wallet.path);
        });
    });

    describe('getHDWallet', function () {
        const hdWallet = hdWalletUtils.getHDWallet(mnemonics);
        const entropy = hdWalletUtils.getEntropyFromMnemonics(mnemonics);
        const walletList = hdWallet.deriveWalletList(0, 9);

        it('test mnemonics', () => {
            assert(hdWallet.mnemonics, mnemonics);
        });
        it('test entropy', () => {
            assert(hdWallet.entropy, entropy);
        });
        it('deriveWalletList', () => {
            const arr = [];
            walletList.forEach(item => {
                arr.push(item.address);
            });

            assert.deepEqual(addrList, arr);
        });
        it('getWalletList', () => {
            const _walletList = hdWallet.getWalletList();
            assert.deepEqual(walletList, _walletList);
        });
    });
});
