const config = require('../../rpcConfig.js');

import HTTP_RPC from '../../src/HTTP/index';
import ViteAPI from '../../src/viteAPI/index';
import hdWallet from '../../src/hdWallet/index';
import Transaction from '../../src/transaction/index';
import { Vite_TokenId } from '../../src/constant/index';
import GetViteFromWorld from './getViteFromWorld';

const viteProvider = new ViteAPI(new HTTP_RPC(config.http), () => {
    console.log('Connetct');
});

const myHDWallet = hdWallet.getHDWallet(config.myMnemonic);
const myWallet  = myHDWallet.deriveWallet(0);
const privateKey = myWallet.privateKey;

const tx = new Transaction(myWallet.address);

tx.setProvider(viteProvider);
tx.setPrivateKey(privateKey);


TestFunc().then(() => {
    console.log('Test Finish');
}).catch(err => {
    console.log('Test Error', err);
});


async function TestFunc() {
    console.log('Step 0 CheckHeight. \n');
    await CheckHeight();

    console.log('Step 1 CheckMyBalance. \n');
    await CheckMyBalance();

    // console.log('Step 2 SendTxToMyself. \n');
    // await SendTxToMyself();

    // console.log('Step 3 ReceiveTx. \n');
    // await ReceiveTx();

    console.log('Step 4 getQuota. \n');
    await checkQuota();

    // console.log('Step 5 SBPreg. \n');
    // await SBPreg();

    // console.log('Step 6 updateReg. \n');
    // await updateReg();

    // console.log('Step 7 withdrawSBPReward. \n');
    // await withdrawSBPReward();

    // console.log('Step 8 revokeSBP. \n');
    // await revokeSBP();

    // console.log('Step 9 getSBPList. \n');
    // await getSBPList();

    // console.log('Step 10 voting. \n');
    // await voting();

    // console.log('Step 11 revokeVoting. \n');
    // await revokeVoting();

    // console.log('Step 12 getVoteList. \n');
    // await getVoteList();

    // console.log('Step 13 withdrawalOfQuota. \n');
    // await withdrawalOfQuota();

    // console.log('Step 14 createContract. \n');
    // await createContract();

    // console.log('Last One CheckMyTxList. \n');
    // await CheckMyTxList();

    return null;
}


async function CheckHeight() {
    const height = await viteProvider.request('ledger_getSnapshotChainHeight');
    console.log('[LOG] CheckHeight', height, '\n');
    return height;
}

async function CheckMyBalance() {
    const data = await viteProvider.getBalanceInfo(myWallet.address);

    const balance = data.balance;
    const unreceived = data.unreceived;
    
    console.log('[LOG] CheckMyBalance unreceived', unreceived, '\n');

    if (balance && Number(balance.totalNumber)) {
        console.log('[LOG] CheckMyBalance', balance.tokenBalanceInfoMap[Vite_TokenId], '\n');
        return null;
    }

    await GetViteFromWorld(myWallet.address);

    return null;
}

async function checkQuota() {
    const quotaResult = await viteProvider.request('contract_getQuotaByAccount', myWallet.address);
    console.log('[LOG] contract_getQuotaByAccount', quotaResult, '\n');
    
    if (Number(quotaResult.currentQuota)) {
        return quotaResult;
    }

    const result = await tx.stakeForQuota({
        beneficiaryAddress: myWallet.address,
        amount: '1000000000000000000000'
    }).autoPoWSend(privateKey);

    console.log('[LOG] stakeForQuota', result, '\n');
    return result;
}

async function SendTxToMyself() {
    const data = await tx.sendTransaction({
        toAddress: myWallet.address, 
        tokenId: Vite_TokenId,
        amount: '10000000000000000000'
    }).autoPoWSend();

    console.log('[LOG] SendTxToMyself', data, '\n');
    return data;
}

async function ReceiveTx() {
    const data = await viteProvider.request('ledger_getUnreceivedBlocksByAddress', myWallet.address, 0, 10);

    if (!data || !data.length) {
        console.log('[LOG] ReceiveTx 1', null, '\n');
        return null;
    }

    const result = await tx.receive({
        sendBlockHash: data[0].hash
    }).autoSend(privateKey);

    console.log('[LOG] ReceiveTx 2', result, '\n');
    return result;
}

async function SBPreg() {
    const result = await tx.registerSBP({
        sbpName: 'CS_TEST_NODE',
        blockProducingAddress: myWallet.address,
    }).autoPoWSend(privateKey);

    console.log('[LOG] SBPreg', result, '\n');
    return result;
}

async function updateReg() {
    const result = await tx.updateSBPBlockProducingAddress({
        sbpName: 'CS_TEST_NODE',
        newBlockProducingAddress: 'vite_869a06b8963bd5d88a004723ad5d45f345a71c0884e2c80e88'
    }).autoPoWSend(privateKey);

    console.log('[LOG] updateReg', result, '\n');
    return result;
}

async function withdrawSBPReward() {
    const result = await tx.withdrawSBPReward({
        sbpName:'CS_TEST_NODE',
        receiveAddress: myWallet.address    
    }).autoPoWSend(privateKey)

    console.log('[LOG] withdrawSBPReward', result, '\n');
    return result;
}

async function revokeSBP() {
    const result = await tx.revokeSBP({
        sbpName:'CS_TEST_NODE'  
    }).autoPoWSend(privateKey)

    console.log('[LOG] revokeSBP', result, '\n');
    return result;
}

async function getSBPList() {
    const result = await viteProvider.request('contract_getSBPList', myWallet.address);

    console.log('[LOG] getSBPList', result, '\n');
    return result;
}

async function voting() {
    const result = await tx.VoteForSBP({
        sbpName: 'CS_TEST_NODE'
    }).autoPoWSend(privateKey);

    console.log('[LOG] voting', result, '\n');
    return result;
}

async function revokeVoting() {
    const result = await tx.cancelVote().autoPoWSend(privateKey);

    console.log('[LOG] revokeVoting', result, '\n');
    return result;
}

async function getVoteList() {
    const result = await viteProvider.request('contract_getSBPVoteList');

    console.log('[LOG] getVoteList', result, '\n');
    return result;
}

async function withdrawalOfQuota() {
    const result = await tx.cancelStake({
        beneficiaryAddress: myWallet.address,
        amount: '134000000000000000000'
    }).autoPoWSend(privateKey);

    console.log('[LOG] cancelStake', result, '\n');
    return result;
}

async function createContract() {
    const result = await tx.createContract({
        abi:[{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"SayHello","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"transfer","type":"event"}],
        code: '608060405234801561001057600080fd5b50610141806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806391a6cb4b14610046575b600080fd5b6100896004803603602081101561005c57600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff16906020019092919050505061008b565b005b8074ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f1505050508074ffffffffffffffffffffffffffffffffffffffffff167faa65281f5df4b4bd3c71f2ba25905b907205fce0809a816ef8e04b4d496a85bb346040518082815260200191505060405180910390a25056fea165627a7a7230582023e9669dd6fec3b6b2a84a1fd7c9939f49197203d0e1db312278e633c219c2480029',
        responseLatency: 2,
        params: ['vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9']
    }).autoPoWSend(privateKey);

    console.log('[LOG] createContract', result, '\n');

    const result2 = await viteProvider.callOffChainContract({
        address: result.toAddress,
        offChainCode: '608060405260043610600f57600f565b00fea165627a7a7230582023e9669dd6fec3b6b2a84a1fd7c9939f49197203d0e1db312278e633c219c2480029',
        abi: [{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"SayHello","outputs":[],"payable":true,"stateMutability":"payable","type":"offchain"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"transfer","type":"event"}],
        params: [myWallet.address]
    });
    console.log('[LOG] callOffChainContract', result2, '\n');

    return result;
}

async function CheckMyTxList() {
    const data = await viteProvider.getTransactionList({
        address: myWallet.address,
        pageIndex: 0,
        pageCount: 50
    });

    // console.log('[LOG] CheckMyTxList', data, '\n');

    data.forEach((ele, i) => {
        console.log(`[LOG] CheckMyTxList TxType ${ i }: ${ ele.transationType } \n`);
        console.log(`[LOG] CheckMyTxList Contract ${ i }: ${ JSON.stringify(ele.contractParams) } \n`);
    });
    return data;
}
