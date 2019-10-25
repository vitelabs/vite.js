const assert = require('assert');

import { BlockType, Vite_TokenId, Contracts } from '../../../src/constant';
import Transaction from '../../../src/accountBlock/transaction';
import { getCreateContractData, getCallContractData, messageToData } from '../../../src/accountBlock/utils';

const address = 'vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689';
const myTransaction = new Transaction(address);

it('address', function () {
    assert.equal(address, myTransaction.address);
});

it('receive', function () {
    const sendBlockHash = '18095215a419e346dde2f678180382b65146502fb543a7e96c41b141136b47d9';
    const receiveAccountBlock = myTransaction.receive({ sendBlockHash });

    assert.equal(receiveAccountBlock.blockType, BlockType.Response);
    assert.equal(receiveAccountBlock.address, address);
    assert.equal(receiveAccountBlock.sendBlockHash, sendBlockHash);
});

it('send', function () {
    const data = 'jefc/QAAAAAAAAAAAAAAVTRivKE3usKfRA6a9KsuLBu4JJMA';
    const sendAccountBlock = myTransaction.send({
        toAddress: address,
        amount: 0,
        data
    });

    assert.equal(sendAccountBlock.blockType, BlockType.TransferRequest);
    assert.equal(sendAccountBlock.address, address);
    assert.equal(sendAccountBlock.toAddress, address);
    assert.equal(Number(sendAccountBlock.amount), 0);
    assert.equal(sendAccountBlock.tokenId, Vite_TokenId);
    assert.equal(sendAccountBlock.data, data);
});

it('send 2', function () {
    const sendAccountBlock = myTransaction.send({
        toAddress: address,
        data: messageToData('121212')
    });

    assert.equal(sendAccountBlock.blockType, BlockType.TransferRequest);
    assert.equal(sendAccountBlock.address, address);
    assert.equal(sendAccountBlock.toAddress, address);
    assert.equal(Number(sendAccountBlock.amount), 0);
    assert.equal(sendAccountBlock.tokenId, Vite_TokenId);
});

it('createContract', function () {
    const d = {
        'responseLatency': 3,
        'randomDegree': 4,
        'quotaMultiplier': 30,
        'code': '608060405234801561001057600080fd5b506101ca806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806380ae0ea114610046575b600080fd5b6100bd6004803603602081101561005c57600080fd5b810190808035906020019064010000000081111561007957600080fd5b82018360208201111561008b57600080fd5b803590602001918460208302840111640100000000831117156100ad57600080fd5b90919293919293905050506100bf565b005b60006002838390508115156100d057fe5b061415156100dd57600080fd5b600080905060008090505b8383905081101561018a576000848483818110151561010357fe5b9050602002013590506000858560018501818110151561011f57fe5b905060200201359050808401935080841015151561013c57600080fd5b600081111561017d578173ffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff168260405160405180820390838587f1505050505b50506002810190506100e8565b50348114151561019957600080fd5b50505056fea165627a7a723058203cef4a3f93b33e64e99e0f88f586121282084394f6d4b70f1030ca8c360b74620029',
        'params': ''
    };

    const data = getCreateContractData(d);
    const accountBlock = myTransaction.createContract(d);

    assert.equal(accountBlock.blockType, BlockType.CreateContractRequest);
    assert.equal(accountBlock.address, address);
    assert.equal(accountBlock.tokenId, Vite_TokenId);
    assert.equal(accountBlock.data, data);
    assert.equal(accountBlock.fee, '10000000000000000000');
});

it('callContract', function () {
    const d = {
        toAddress: Contracts.StakeForQuota.contractAddress,
        abi: Contracts.StakeForQuota.abi,
        params: [address]
    };

    const data = getCallContractData(d);
    const amount = '239283472429';
    const accountBlock = myTransaction.callContract({
        ...d,
        amount
    });

    assert.equal(accountBlock.blockType, BlockType.TransferRequest);
    assert.equal(accountBlock.address, address);
    assert.equal(accountBlock.toAddress, d.toAddress);
    assert.equal(accountBlock.tokenId, Vite_TokenId);
    assert.equal(accountBlock.data, data);
    assert.equal(accountBlock.amount, amount);
});
