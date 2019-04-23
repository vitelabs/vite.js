const assert = require('assert');

import { newHexAddr, isValidHexAddr, getAddrFromHexAddr, getHexAddrFromAddr, newHexAddrFromPub } from '../../src/privToAddr/index';

const k = newHexAddr();

describe('newHexAddr', function () {
    it('with privateKey', function () {
        const privKey = 'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951';
        const k = newHexAddr(privKey);
        assert.equal(k.privKey, privKey);
    });

    it('without privateKey', function () {
        const k = newHexAddr();
        assert.equal(typeof k.privKey, 'string');
    });
});

describe('isValidHexAddr', function () {
    it('newHexAddr', function () {
        assert.equal(isValidHexAddr(k.hexAddr), true);
    });

    it('case 1', function () {
        assert.equal(isValidHexAddr('vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689'), true);
    });

    it('case 2', function () {
        assert.equal(isValidHexAddr('vite_c18cadb085fc4e291469106e5a3f197aef87f96cd297eb6b46'), true);
    });
});

describe('getAddrFromHexAddr', function () {
    it('newHexAddr', function () {
        assert.equal(getAddrFromHexAddr(k.hexAddr), k.addr);
    });

    it('case 1', function () {
        const addr = getAddrFromHexAddr('vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689');
        assert.equal(addr, '69f3bdb5cdcfa145ae6cc42593a89088ff3dac58');
    });
});

describe('getHexAddrFromAddr', function () {
    it('newHexAddr', function () {
        assert.equal(getHexAddrFromAddr(k.addr), k.hexAddr);
    });

    it('case 1', function () {
        const addr = getHexAddrFromAddr('69f3bdb5cdcfa145ae6cc42593a89088ff3dac58');
        assert.equal(addr, 'vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689');
    });
});

describe('newHexAddrFromPub', function () {
    it('newHexAddr', function () {
        assert.equal(newHexAddrFromPub(k.pubKey), k.hexAddr);
    });
});
