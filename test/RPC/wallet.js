const config = require('../../rpcConfig.js');

import HTTP_RPC from '../../src/HTTP';
import Client from '../../src/client/index';
import HdAccount from '../../src/hdAccount/index';
import { Vite_TokenId } from '../../src/constant/index';
import GetViteFromWorld from './getViteFromWorld';

const provider = new Client(new HTTP_RPC(config.http), () => {
    console.log('Connetct');
}, {
    isDecodeTx: true
});

const myHdAccount = new HdAccount({
    mnemonic: config.myMnemonic,
    client: provider
});

const myAccount = myHdAccount.getAccount({ autoPow: true });
myHdAccount.addAddr();

TestFunc().then(() => {
    console.log('Test Finish');
}).catch(err => {
    console.log('Test Error', err);
});


async function TestFunc() {
    console.log('Step 0 CheckHeight. \n');
    await CheckHeight();

    // console.log('Step 1 CheckMyBalance. \n');
    // await CheckMyBalance();

    // console.log('Step 2 SendTxToMyself. \n');
    // await SendTxToMyself();

    // console.log('Step 3 ReceiveTx. \n');
    // await ReceiveTx();

    // console.log('Step 4 SBPreg. \n');
    // await SBPreg();

    // console.log('Step 5 updateReg. \n');
    // await updateReg();

    // console.log('Step 6 revokeReg. \n');
    // await revokeReg();

    // console.log('Step 7 voting. \n');
    // await voting();

    // console.log('Step 8 revokeVoting. \n');
    // await revokeVoting();

    // console.log('Step 9 getQuota. \n');
    // await checkQuota();

    // console.log('Step 10 withdrawalOfQuota. \n');
    // await withdrawalOfQuota();

    // console.log('Step 11 createContract. \n');
    // await createContract();

    console.log('Step 12 callOffChainContract. \n');
    await callOffChainContract();

    console.log('Step 13 getSBPList. \n');
    await getSBPList();

    console.log('Step 14 getVoteList. \n');
    await getVoteList();

    console.log('Last One CheckMyTxList. \n');
    await CheckMyTxList();

    return null;
}


async function callOffChainContract() {
    const result = await myAccount.callOffChainContract({
        offChainCode: '608060405260043610610050576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063be46813a14610054578063f1271e08146100b157610050565b5b5b005b61008d6004803603602081101561006b5760006000fd5b81019080803569ffffffffffffffffffff169060200190929190505050610111565b60405180848152602001838152602001828152602001935050505060405180910390f35b6100b96101d1565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156100fd5780820151818401525b6020810190506100e1565b505050509050019250505060405180910390f35b600060006000600260005060008569ffffffffffffffffffff1669ffffffffffffffffffff16815260200190815260200160002160005060000160005054600260005060008669ffffffffffffffffffff1669ffffffffffffffffffff16815260200190815260200160002160005060010160005054600260005060008769ffffffffffffffffffff1669ffffffffffffffffffff168152602001908152602001600021600050600201600050549250925092506101ca565b9193909250565b6060600160005080548060200260200160405190810160405280929190818152602001828054801561025a57602002820191906000526020600021906000905b82829054906101000a900469ffffffffffffffffffff1669ffffffffffffffffffff16815260200190600a01906020826009010492830192600103820291508084116102115790505b50505050509050610266565b9056fea165627a7a72305820f495f61f697f25e46caa868c09b35b575ab331e3c608179880e1932b5848abaa0029',
        abi: [{
            'constant': true,
            'inputs': [],
            'name': 'getTokenList',
            'outputs': [{ 'name': '', 'type': 'tokenId[]' }],
            'payable': false,
            'stateMutability': 'view',
            'type': 'offchain'
        }]
    });

    console.log('[LOG] callOffChainContract', result, '\n');
    return result;
}

async function createContract() {
    const result = await myAccount.createContract({
        abi: [{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"SayHello","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"transfer","type":"event"}],
        hexCode: '608060405234801561001057600080fd5b50610141806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806391a6cb4b14610046575b600080fd5b6100896004803603602081101561005c57600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff16906020019092919050505061008b565b005b8074ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f1505050508074ffffffffffffffffffffffffffffffffffffffffff167faa65281f5df4b4bd3c71f2ba25905b907205fce0809a816ef8e04b4d496a85bb346040518082815260200191505060405180910390a25056fea165627a7a72305820da1bbae8f5925c429c375fcf55aac29491b0f293b7ec93440ba20078751ff2720029',
        confirmTimes: 2,
        params: ['vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9']
    }, true, true);

    console.log('[LOG] createContract', result, '\n');
    return result;
}

async function withdrawalOfQuota() {
    const result = await myAccount.withdrawalOfQuota({
        toAddress: myAccount.address,
        tokenId: Vite_TokenId,
        amount: '10000000000000000000000'
    });

    console.log('[LOG] withdrawalOfQuota', result, '\n');
    return result;
}

async function checkQuota() {
    const quotaResult = await myAccount.getPledgeQuota();
    console.log('[LOG] getPledgeQuota', quotaResult, '\n');

    if (Number(quotaResult.utps)) {
        return quotaResult;
    }

    const result = await myAccount.getQuota({
        toAddress: myAccount.address,
        tokenId: Vite_TokenId,
        amount: '10000000000000000000000'
    });

    console.log('[LOG] getQuota', result, '\n');
    return result;
}

async function revokeVoting() {
    const result = await myAccount.revokeVoting();

    console.log('[LOG] revokeVoting', result, '\n');
    return result;
}

async function voting() {
    const result = await myAccount.voting({ nodeName: 'CS_TEST_NODE' });

    console.log('[LOG] voting', result, '\n');
    return result;
}

async function getVoteList() {
    const result = await myAccount.getVoteInfo();

    console.log('[LOG] getVoteList', result, '\n');
    return result;
}

async function revokeReg() {
    const result = await myAccount.revokeReg({ nodeName: 'CS_TEST_NODE' });

    console.log('[LOG] revokeReg', result, '\n');
    return result;
}

async function updateReg() {
    const result = await myAccount.updateReg({
        nodeName: 'CS_TEST_NODE',
        toAddress: myHdAccount.addrList[1].hexAddr
    });

    console.log('[LOG] updateReg', result, '\n');
    return result;
}

async function getSBPList() {
    const result = await myAccount.getRegistrationList();

    console.log('[LOG] getSBPList', result, '\n');
    return result;
}

async function SBPreg() {
    const result = await myAccount.SBPreg({
        nodeName: 'CS_TEST_NODE',
        toAddress: myAccount.address,
        amount: '100000000000000000000000',
        tokenId: Vite_TokenId
    });

    console.log('[LOG] SBPreg', result, '\n');
    return result;
}

async function CheckHeight() {
    const height = await provider.ledger.getSnapshotChainHeight();
    console.log('[LOG] CheckHeight', height, '\n');
    return height;
}

async function ReceiveTx() {
    const data = await myAccount.getOnroadBlocks({
        index: 0,
        pageCount: 10
    });

    if (!data || !data.length) {
        console.log('[LOG] ReceiveTx 1', null, '\n');
        return;
    }

    const result = await myAccount.receiveTx({fromBlockHash: data[0].hash});

    console.log('[LOG] ReceiveTx 2', result, '\n');
    return result;
}

async function SendTxToMyself() {
    const result = await myAccount.sendPowTx({
        methodName: 'asyncSendTx',
        params: [{
            toAddress: myAccount.address,
            tokenId: Vite_TokenId,
            amount: '100'
        }],
        beforeCheckPow: (accountBlock, next) => {
            console.log('[beforeCheckPow]', accountBlock);
            return next();
        },
        beforePow: (accountBlock, checkPowResult, next) => {
            console.log('[beforePow]', accountBlock, checkPowResult);
            return next(false);
        },
        beforeSignTx: (accountBlock, checkPowResult, next) => {
            console.log('[beforeSignTx]', accountBlock, checkPowResult);
            return next(false);
        },
        beforeSendTx: (accountBlock, checkPowResult, next) => {
            console.log('[beforeSendTx]', accountBlock, checkPowResult);
            return next(false);
        }
    });

    console.log('[LOG] SendTxToMyself', result, '\n');

    // const accountBlock = result.accountBlock;
    // setTimeout(async () => {
    //     await myAccount.receiveTx({
    //         fromBlockHash: accountBlock.hash
    //     });
    // }, 2000);

    return result;
}

async function CheckMyBalance() {
    const data = await myAccount.getBalance();

    if (data.balance && Number(data.balance.totalNumber)) {
        console.log('[LOG] CheckMyBalance', data.balance.tokenBalanceInfoMap[Vite_TokenId], '\n');
        return null;
    }

    await GetViteFromWorld(myAccount.address);

    myAccount.autoReceiveTx(1000, true, true);
    setTimeout(() => {
        myAccount.stopAutoReceiveTx();
    }, 3000);

    return null;
}

async function CheckMyTxList() {
    const data = await myAccount.getTxList({
        index: 0,
        pageCount: 50
    });

    // console.log('[LOG] CheckMyTxList', data, '\n');

    data.list.forEach((ele, i) => {
        console.log(`[LOG] CheckMyTxList TxType ${ i }: ${ ele.txType } \n`);
        console.log(`[LOG] CheckMyTxList Contract ${ i }: ${ JSON.stringify(ele.contract) } \n`);
    });
    return data;
}
