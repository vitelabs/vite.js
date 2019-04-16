const assert = require('assert');

import HTTP_RPC from '../src/HTTP';
import Client from '../src/client/index';
import AddrAccount from '../src/addrAccount/index';
import { newHexAddr } from '../src/privToAddr/index';

const addrObj = newHexAddr();
const myHTTPClient = new Client(new HTTP_RPC());
const myAddrAccount = new AddrAccount({
    address: addrObj.hexAddr,
    client: myHTTPClient
});

const requiredFuncList = [ 'getBalance', 'getOnroad', 'getOnroadBlocks', 'getBlocks', 'getAccountBalance', 'getLatestBlock', 'getBlockByHeight', 'getBlocksByHash', 'getBlocksByHashInToken', 'getPledgeQuota', 'getPledgeList', 'getRegistrationList', 'getVoteInfo', 'getTxList' ];

it('test realAddress', function () {
    assert(myAddrAccount.realAddress, addrObj.addr);
});

it('test _client', function () {
    assert.deepEqual(myAddrAccount._client, myHTTPClient);
});

requiredFuncList.forEach(key => {
    it(`addrAccount must have function ${ key }`, function () {
        assert(typeof myAddrAccount[key], 'function');
    });
});
