const assert = require('assert');

import HTTP_RPC from '../src/HTTP';
import Client from '../src/client/index';
import Account from '../src/account/index';
import { newHexAddr } from '../src/privToAddr/index';

const addrObj = newHexAddr();
const myHTTPClient = new Client(new HTTP_RPC());
const myAccount = new Account({
    privateKey: addrObj.privKey,
    client: myHTTPClient
});

it('test realAddress', function () {
    assert(myAccount.realAddress, addrObj.addr);
});

it('test privateKey', function () {
    assert(myAccount.privateKey, addrObj.privKey);
});

it('test getPublicKey', function () {
    assert(myAccount.getPublicKey(), addrObj.pubKey);
});

it('test _client', function () {
    assert.deepEqual(myAccount._client, myHTTPClient);
});

const requiredFuncList = [
    'getBalance', 'getOnroad', 'getOnroadBlocks', 'getBlocks',
    'getAccountBalance', 'getLatestBlock', 'getBlockByHeight',
    'getBlocksByHash', 'getBlocksByHashInToken', 'getPledgeQuota',
    'getPledgeList', 'getRegistrationList', 'getVoteInfo', 'getTxList',
    'activate', 'freeze', 'autoReceiveTx', 'stopAutoReceiveTx',
    'sendRawTx', 'sendTx', 'receiveTx', 'SBPreg', 'updateReg',
    'revokeReg', 'retrieveReward', 'voting', 'revokeVoting', 'getQuota',
    'withdrawalOfQuota', 'createContract', 'callContract', 'mintage',
    'mintageCancelPledge', 'mintageIssue', 'mintageBurn', 'changeTokenType',
    'changeTransferOwner', 'sign'
];

requiredFuncList.forEach(key => {
    it(`Account must have function ${ key }`, function () {
        assert(typeof myAccount[key], 'function');
    });
});
