const assert = require('assert');

import { privToAddr, hdAddr } from 'utils/address/index.ts';
const { newHexAddr, isValidHexAddr, getAddrFromHexAddr } = privToAddr;

describe('newHexAddr', function () {
    it('test', function () {
        let privKey = 'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951';
        let k = newHexAddr(privKey);
        assert.equal(k.privKey, privKey);
    });
});

describe('isValidHexAddr', function () {
    it('test-viteJS', function () {
        let k = newHexAddr();
        assert.equal( isValidHexAddr(k.hexAddr), true );
    });

    it('test-go-vite-1', function () {
        assert.equal( isValidHexAddr('vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689'), true );
    });

    it('test-go-vite-2', function () {
        assert.equal( isValidHexAddr('vite_c18cadb085fc4e291469106e5a3f197aef87f96cd297eb6b46'), true );
    });
});

describe('getAddrFromHexAddr', function () {
    it('test-real', function () {
        let addr = getAddrFromHexAddr('vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689');
        assert.equal(addr, '69f3bdb5cdcfa145ae6cc42593a89088ff3dac58');
    });
});

describe('HD_Address', function () {
    it('test_getAddrsFromMnemonic', function () {
        let as = hdAddr.getAddrsFromMnemonic('horn equal mystery success pride regret renew great witness hire man moon');
        let arr = [];
        as.forEach((item)=>{
            arr.push(item.hexAddr);
        });

        assert.deepEqual(arr, [
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
        ]);
    });
});