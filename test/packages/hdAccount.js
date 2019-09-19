const assert = require('assert');

import HTTP_RPC from '../../src/HTTP';
import Client from '../../src/client/index';
import HdAccount from '../../src/hdAccount/index';
import { createAddress, getId, getAddrFromMnemonic, getEntropyFromMnemonic } from '../../src/hdAddr/index';
import Account from '../../src/account/index';

const myHTTPClient = new Client(new HTTP_RPC());

describe('New HdAccount with mnemonic', function () {
    const addrObj = createAddress();
    const myHdAccount = new HdAccount({
        mnemonic: addrObj.mnemonic,
        client: myHTTPClient
    });

    it('property mnemonic', function () {
        assert.equal(myHdAccount.mnemonic, addrObj.mnemonic);
    });
    it('property entropy', function () {
        assert.equal(myHdAccount.entropy, addrObj.entropy);
    });
    it('property addrList.length === 1', function () {
        assert.equal(myHdAccount.addrList.length, 1);
    });
    it('property addrList[0].address', function () {
        assert.equal(myHdAccount.addrList[0].address, addrObj.addr.address);
    });
    it('property id', function () {
        assert.equal(myHdAccount.id, getId(addrObj.mnemonic));
    });

    commonTest(myHdAccount);
});


describe('New HdAccount without mnemonic', function () {
    const _myHdAccount = new HdAccount({ client: myHTTPClient });

    it('property mnemonic', function () {
        assert.equal(!!_myHdAccount.mnemonic, true);
    });
    it('property entropy', function () {
        assert.equal(_myHdAccount.entropy, getEntropyFromMnemonic(_myHdAccount.mnemonic));
    });
    it('property addrList.length === 1', function () {
        assert.equal(_myHdAccount.addrList.length, 1);
    });
    it('property addrList[0]', function () {
        assert.deepStrictEqual(_myHdAccount.addrList[0], getAddrFromMnemonic(_myHdAccount.mnemonic));
    });
    it('property id', function () {
        assert.equal(_myHdAccount.id, getId(_myHdAccount.mnemonic));
    });

    commonTest(_myHdAccount);
});



function commonTest(_hdAccount) {
    it('property _client', function () {
        assert.deepEqual(_hdAccount._client, myHTTPClient);
    });

    it('function addAddr', function () {
        const addr = _hdAccount.addAddr();
        const _addr = getAddrFromMnemonic(_hdAccount.mnemonic, 1);
        assert.deepEqual(_addr, addr);
    });

    it('property addrList.length === 2', function () {
        assert.equal(_hdAccount.addrList.length, 2);
    });

    const requiredFuncList = [ 'activateAccount', 'freezeAccount' ];

    requiredFuncList.forEach(key => {
        it(`function ${ key }`, function () {
            assert.equal(typeof _hdAccount[key], 'function');
        });
    });

    const myAccount = _hdAccount.getAccount();
    it('getAccount', function () {
        assert.equal(myAccount instanceof Account, true);
    });
}
