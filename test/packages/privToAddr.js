const assert = require('assert');

import { newHexAddr, isValidHexAddr, getAddrFromHexAddr, getHexAddrFromAddr, newHexAddrFromPub } from '../../src/privToAddr/index';

const privKey = 'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951';

const addr = newHexAddr();
const addrContract = newHexAddr(null, true);
const addrPriv = newHexAddr(privKey);
const addrPrivContract = newHexAddr(privKey, true);


describe('newHexAddr', function () {
    it('with privateKey, isContract = false', function () {
        assert.equal(addrPriv.privKey, privKey);
    });

    it('with privateKey, isContract = true', function () {
        assert.equal(addrPrivContract.privKey, privKey);
    });

    it('without privateKey, isContract = false', function () {
        assert.equal(typeof addr.privKey, 'string');
    });

    it('without privateKey, isContract = true', function () {
        assert.equal(typeof addrContract.privKey, 'string');
    });
});

describe('isValidHexAddr', function () {
    it('newHexAddr addr', function () {
        assert.equal(isValidHexAddr(addr.hexAddr), 1);
    });

    it('newHexAddr addrContract', function () {
        assert.equal(isValidHexAddr(addrContract.hexAddr), 2);
    });

    it('newHexAddr addrPriv', function () {
        assert.equal(isValidHexAddr(addrPriv.hexAddr), 1);
    });

    it('newHexAddr addrPrivContract', function () {
        assert.equal(isValidHexAddr(addrPrivContract.hexAddr), 2);
    });

    it('Old user address: case 1', function () {
        assert.equal(isValidHexAddr('vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689'), 1);
    });

    it('Old user address: case 2', function () {
        assert.equal(isValidHexAddr('vite_c18cadb085fc4e291469106e5a3f197aef87f96cd297eb6b46'), 1);
    });

    it('New user address', function () {
        assert.equal(isValidHexAddr('vite_010203040506070809080706050403020102030412227c8b71'), 1);
    });

    it('New contract address', function () {
        assert.equal(isValidHexAddr('vite_0102030405060708090807060504030201020304eddd83748e'), 2);
    });
});

describe('getAddrFromHexAddr', function () {
    it('newHexAddr', function () {
        assert.equal(getAddrFromHexAddr(addr.hexAddr), addr.addr);
    });

    it('user address 1', function () {
        const addr = getAddrFromHexAddr('vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689');
        assert.equal(addr, '69f3bdb5cdcfa145ae6cc42593a89088ff3dac5800');
    });


    it('user address 2', function () {
        const addr = getAddrFromHexAddr('vite_010203040506070809080706050403020102030412227c8b71');
        assert.equal(addr, '010203040506070809080706050403020102030400');
    });

    it('contract address', function () {
        const addr = getAddrFromHexAddr('vite_0102030405060708090807060504030201020304eddd83748e');
        assert.equal(addr, '010203040506070809080706050403020102030401');
    });
});

describe('getHexAddrFromAddr', function () {
    it('newHexAddr', function () {
        assert.equal(getHexAddrFromAddr(addr.addr), addr.hexAddr);
    });

    it('case 1', function () {
        const addr = getHexAddrFromAddr('69f3bdb5cdcfa145ae6cc42593a89088ff3dac5800');
        assert.equal(addr, 'vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689');
    });
});

describe('newHexAddrFromPub', function () {
    it('newHexAddr', function () {
        assert.equal(newHexAddrFromPub(addr.pubKey), addr.hexAddr);
    });
});
