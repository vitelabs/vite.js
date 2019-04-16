const assert = require('assert');

import HTTP_RPC from '../src/HTTP';
import Client from '../src/client/index';
import HdAccount from '../src/hdAccount/index';
import { newAddr } from '../src/hdAddr/index';

const addrObj = newAddr();
const myHTTPClient = new Client(new HTTP_RPC());

const myHdAccount = new HdAccount({
    mnemonic: addrObj.mnemonic,
    client: myHTTPClient
});
const _myHdAccount = new HdAccount({ client: myHTTPClient });

it('test genorate mnemonic', function () {
    assert(typeof _myHdAccount.mnemonic, 'string');
});

it('test genorate entropy', function () {
    assert(typeof _myHdAccount.entropy, 'string');
});

it('test mnemonic', function () {
    assert(myHdAccount.mnemonic, addrObj.mnemonic);
});

it('test entropy', function () {
    assert(myHdAccount.entropy, addrObj.entropy);
});

it('test addrList.length <= 10', function () {
    assert(myHdAccount.addrList.length <= 10, true);
    assert(_myHdAccount.addrList.length <= 10, true);
});

it('test addAddr', function () {
    assert(!!myHdAccount.addAddr(), true);
});

it('test _client', function () {
    assert.deepEqual(myHdAccount._client, myHTTPClient);
});

it('test id', function () {
    assert.equal(typeof myHdAccount.id, 'string');
});

it('test id', function () {
    assert.equal(typeof myHdAccount.id, 'string');
});

const requiredFuncList = [ 'activateAccount', 'freezeAccount' ];

requiredFuncList.forEach(key => {
    it(`Account must have function ${ key }`, function () {
        assert(typeof myHdAccount[key], 'function');
    });
});
