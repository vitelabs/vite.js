const assert = require('assert');
const config = require('../../rpcConfig.js');

import { getTxType as _getTxType } from '../../src/accountBlock/index';
import HTTP_RPC from '../../src/HTTP/index';
import Client from '../../src/client/index';
import HdAccount from '../../src/hdAccount/index';
import { Vite_TokenId } from '../../src/constant/index';

const provider = new Client(new HTTP_RPC(config.http));
const myHdAccount = new HdAccount({
    mnemonic: config.myMnemonic,
    client: provider
});
myHdAccount.addAddr();

const myAccount = myHdAccount.getAccount({ autoPow: true });
let height;
let prevHash;

it('createContract', function(done) {
    myAccount.getBlock.createContract({
        abi: [{
            'inputs': [{ 'name': 'proposalNames', 'type': 'uint256[]' }],
            'payable': false,
            'stateMutability': 'nonpayable',
            'type': 'constructor'
        }],
        hexCode: '608060405234801561001057600080fd5b506101ca806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806380ae0ea114610046575b600080fd5b6100bd6004803603602081101561005c57600080fd5b810190808035906020019064010000000081111561007957600080fd5b82018360208201111561008b57600080fd5b803590602001918460208302840111640100000000831117156100ad57600080fd5b90919293919293905050506100bf565b005b60006002838390508115156100d057fe5b061415156100dd57600080fd5b600080905060008090505b8383905081101561018a576000848483818110151561010357fe5b9050602002013590506000858560018501818110151561011f57fe5b905060200201359050808401935080841015151561013c57600080fd5b600081111561017d578173ffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff168260405160405180820390838587f1505050505b50506002810190506100e8565b50348114151561019957600080fd5b50505056fea165627a7a723058203cef4a3f93b33e64e99e0f88f586121282084394f6d4b70f1030ca8c360b74620029',
        confirmTimes: 2,
        params: [[ '232323', '4577' ]]
    }).then((block) => {
        height = block.height;
        prevHash = block.prevHash;
        done(assert.equal(getTxType(block), 'CreateContractReq'));
    }).catch(err => {
        done(err);
    });
});

it('SBPreg', function(done) {
    myAccount.getBlock.SBPreg({
        nodeName: 'CS_TEST_NODE',
        toAddress: myAccount.address,
        amount: '100000000000000000000000',
        tokenId: Vite_TokenId,
        height, prevHash
    }).then((block) => {
        done(assert.equal(getTxType(block), 'SBPreg'));
    }).catch(err => {
        done(err);
    });
})

it('updateReg', function(done) {
    myAccount.getBlock.updateReg({
        nodeName: 'CS_TEST_NODE',
        toAddress: myHdAccount.addrList[1].hexAddr,
        height, prevHash
    }).then((block) => {
        done(assert.equal(getTxType(block), 'UpdateReg'));
    }).catch(err => {
        done(err);
    });
})

it('revokeReg', function(done) {
    myAccount.getBlock.revokeReg({
        nodeName: 'CS_TEST_NODE',
        height, prevHash
    }).then((block) => {
        done(assert.equal(getTxType(block), 'RevokeReg'));
    }).catch(err => {
        done(err);
    });
})

it('retrieveReward', function(done) {
    myAccount.getBlock.retrieveReward({
        nodeName: 'CS_TEST_NODE',
        toAddress: myHdAccount.addrList[1].hexAddr,
        height, prevHash
    }).then((block) => {
        done(assert.equal(getTxType(block), 'RetrieveReward'));
    }).catch(err => {
        done(err);
    });
})

it('voting', function(done) {
    myAccount.getBlock.voting({
        nodeName: 'CS_TEST_NODE',
        height, prevHash
    }).then((block) => {
        done(assert.equal(getTxType(block), 'Voting'));
    }).catch(err => {
        done(err);
    });
})

it('revokeVoting', function(done) {
    myAccount.getBlock.revokeVoting({
        height, prevHash
    }).then((block) => {
        done(assert.equal(getTxType(block), 'RevokeVoting'));
    }).catch(err => {
        done(err);
    });
})

it('getQuota', function(done) {
    myAccount.getBlock.getQuota({
        toAddress: myAccount.address,
        tokenId: Vite_TokenId,
        amount: '10000000000000000000000',
        height, prevHash
    }).then((block) => {
        done(assert.equal(getTxType(block), 'GetQuota'));
    }).catch(err => {
        done(err);
    });
})

it('withdrawalOfQuota', function(done) {
    myAccount.getBlock.withdrawalOfQuota({
        toAddress: myAccount.address,
        tokenId: Vite_TokenId,
        amount: '10000000000000000000000',
        height, prevHash
    }).then((block) => {
        done(assert.equal(getTxType(block), 'WithdrawalOfQuota'));
    }).catch(err => {
        done(err);
    });
})


function getTxType(block) {
    return _getTxType(block).txType
}