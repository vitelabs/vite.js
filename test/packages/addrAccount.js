const assert = require('assert');

import HTTP_RPC from '../../src/HTTP';
import Client from '../../src/client/index';
import AddrAccount from '../../src/addrAccount/index';
import { newHexAddr } from '../../src/privToAddr/index';
import config from '../config.js';

const addrObj = newHexAddr();
const myHTTPClient = new Client(new HTTP_RPC());

const myAddrAccount = new AddrAccount({
    address: addrObj.hexAddr,
    client: myHTTPClient
});

describe('New AddrAccount: property', function () {
    it('address', function () {
        assert(myAddrAccount.address, addrObj.hexAddr);
    });

    it('realAddress', function () {
        assert(myAddrAccount.realAddress, addrObj.addr);
    });

    it('_client', function () {
        assert.deepEqual(myAddrAccount._client, myHTTPClient);
    });
});

describe('New AddrAccount: function', function () {
    for (const key in myHTTPClient.builtinTxBlock) {
        if (key === '_client') {
            continue;
        }

        it(`getBlock.${ key }`, function () {
            assert(typeof myAddrAccount.getBlock[key], 'function');
        });
    }

    config.addrAccountFuncList.forEach(key => {
        it(key, function () {
            assert(typeof myAddrAccount[key], 'function');
        });
    });
});
