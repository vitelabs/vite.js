
const assert = require('assert');
import address from '../src/utils/address';

describe('newHexAddr', function () {
    it('test', function () {
        let privKey = 'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951';
        let k = address.newHexAddr(privKey);
        assert.equal(k.privKey, privKey);
    });
});

describe('isValidHexAddr', function () {
    it('test-viteJS', function () {
        let k = address.newHexAddr();
        assert.equal( address.isValidHexAddr(k.hexAddr), true );
    });

    it('test-go-vite-1', function () {
        assert.equal( address.isValidHexAddr('vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689'), true );
    });

    it('test-go-vite-2', function () {
        assert.equal( address.isValidHexAddr('vite_c18cadb085fc4e291469106e5a3f197aef87f96cd297eb6b46'), true );
    });
});

describe('getAddrFromHexAddr', function () {
    it('test-real', function () {
        let addr = address.getAddrFromHexAddr('vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689');
        assert.equal(addr, '69f3bdb5cdcfa145ae6cc42593a89088ff3dac58');
    });
    it('test-illegalAddr', function () {
        let addr = address.getAddrFromHexAddr('cfa145ae6cc42593a89088ff3dac587eb692d689');
        assert.equal(addr, null);
    });
});