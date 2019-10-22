const config = require('../../rpcConfig.js');

import HTTP_RPC from '../../src/HTTP/index';
import ViteAPI from '../../src/viteAPI/index';
import walletUtils from '../../src/wallet/index';
import Transaction from '../../src/accountBlock/transaction';
import { createAccountBlock } from '../../src/accountBlock/index';
import { Vite_TokenId } from '../../src/constant/index';
import GetViteFromWorld from './getViteFromWorld';

const viteProvider = new ViteAPI(new HTTP_RPC(config.http), () => {
    console.log('Connetct');
});

const myWallet = walletUtils.getWallet(config.myMnemonic);
const { privateKey, address }  = myWallet.deriveAddress(0);
const addr2  = myWallet.deriveAddress(1);
const tx = new Transaction(address).setProvider(viteProvider).setPrivateKey(privateKey);

TestFunc().then(() => {
    console.log('Test Finish');
}).catch(err => {
    console.log('Test Error', err);
});


async function TestFunc() {
    console.log('Step 0 CheckHeight. \n');
    await CheckHeight();

    let accountBlock = null;

    console.log('Step 1 CheckMyBalance. \n');
    accountBlock = await CheckMyBalance();

    await sleep(2000);
    console.log('Step 2 SendTxToMyself. \n');
    accountBlock = await SendTxToMyself(accountBlock);

    await sleep(2000);
    console.log('Step 3 ReceiveTx. \n');
    accountBlock = await ReceiveTx(accountBlock);

    await sleep(2000);
    console.log('Step 4 getQuota. \n');
    accountBlock = await checkQuota(accountBlock);

    await sleep(1000);
    console.log('Step 5 SBPreg. \n');
    accountBlock = await SBPreg(accountBlock);

    await sleep(2000);
    console.log('Step 6 updateReg. \n');
    accountBlock = await updateReg(accountBlock);

    await sleep(2000);
    console.log('Step 7 withdrawSBPReward. \n');
    accountBlock = await withdrawSBPReward(accountBlock);

    await sleep(2000);
    console.log('Step 10 voting. \n');
    accountBlock = await voting(accountBlock);

    console.log('Step 12 getVoteList. \n');
    await getVoteList();

    await sleep(2000);
    console.log('Step 11 revokeVoting. \n');
    accountBlock = await revokeVoting(accountBlock);

    console.log('Step 9 getSBPList. \n');
    await getSBPList();

    await sleep(2000);
    console.log('Step 8 revokeSBP. \n');
    accountBlock = await revokeSBP(accountBlock);

    await sleep(2000);
    console.log('Step 14 createContract. \n');
    accountBlock = await createContract(accountBlock);

    await checkMyTokenList(accountBlock);

    await sleep(2000);
    console.log('Step 13 withdrawalOfQuota. \n');
    accountBlock = await withdrawalOfQuota(accountBlock);

    console.log('Last One CheckMyTxList. \n');
    await CheckMyTxList(10);

    return null;
}


async function CheckHeight() {
    const height = await viteProvider.request('ledger_getSnapshotChainHeight');
    console.log('[LOG] CheckHeight', height, '\n');
    return height;
}

async function CheckMyBalance() {
    const data = await viteProvider.getBalanceInfo(address);

    const balance = data.balance;
    const unreceived = data.unreceived;
    
    console.log('[LOG] CheckMyBalance unreceived', unreceived, '\n');

    if (balance && Number(balance.totalNumber)) {
        console.log('[LOG] CheckMyBalance', balance.tokenBalanceInfoMap[Vite_TokenId], '\n');
        return null;
    }

    await GetViteFromWorld(address);
    return ReceiveTx();
}

async function checkQuota(previousAccountBlock) {
    const quotaResult = await viteProvider.request('contract_getQuotaByAccount', address);
    console.log('[LOG] contract_getQuotaByAccount', quotaResult, '\n');
    
    if (Number(quotaResult.currentQuota)) {
        return previousAccountBlock;
    }

    const accountBlock = await tx.stakeForQuota({
        beneficiaryAddress: address,
        amount: '1000000000000000000000'
    });

    if (previousAccountBlock) {
        await accountBlock.setPreviousAccountBlock(previousAccountBlock).PoW();
        const result = await accountBlock.sign().send();
        console.log('[LOG] stakeForQuota', result, '\n');
        return result;
    }

    const result = await accountBlock.autoSendByPoW(privateKey);
    console.log('[LOG] stakeForQuota', result, '\n');
    return result;
}

async function SendTxToMyself(previousAccountBlock) {
    const accountBlock = await tx.sendWithMessage({
        toAddress: address, 
        tokenId: Vite_TokenId,
        amount: '10000000000000000000'
    });

    if (!previousAccountBlock) {
        const data = await accountBlock.autoSendByPoW();;
        console.log('[LOG] SendTxToMyself', data, '\n');
        return data;
    }

    const data = await accountBlock.setPreviousAccountBlock(previousAccountBlock).sendByPoW(privateKey);
    console.log('[LOG] SendTxToMyself', data, '\n');
    return data;
}

async function ReceiveTx(previousAccountBlock) {
    const data = await viteProvider.request('ledger_getUnreceivedBlocksByAddress', address, 0, 10);

    if (!data || !data.length) {
        console.log('[LOG] ReceiveTx 1', null, '\n');
        return previousAccountBlock;
    }

    const accountBlock = createAccountBlock('receive', {
        address,
        sendBlockHash: data[0].hash
    });

    accountBlock.setProvider(viteProvider);
    accountBlock.setPrivateKey(privateKey);

    if (!previousAccountBlock) {
        await accountBlock.autoSetPreviousAccountBlock();
    } else {
        accountBlock.setPreviousAccountBlock(previousAccountBlock);
    }

    const result = await accountBlock.sendByPoW();

    console.log('[LOG] ReceiveTx 2', result, '\n');
    return result;
}

async function SBPreg(previousAccountBlock) {
    const accountBlock = tx.registerSBP({
        sbpName: 'CS_TEST_NODE',
        blockProducingAddress: address,
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] SBPreg', result, '\n');
    return result;
}

async function updateReg(previousAccountBlock) {
    const accountBlock = tx.updateSBPBlockProducingAddress({
        sbpName: 'CS_TEST_NODE',
        newBlockProducingAddress: 'vite_869a06b8963bd5d88a004723ad5d45f345a71c0884e2c80e88'
    });
    
    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] updateReg', result, '\n');
    return result;
}

async function withdrawSBPReward(previousAccountBlock) {
    const accountBlock = tx.withdrawSBPReward({
        sbpName:'CS_TEST_NODE',
        receiveAddress: address    
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] withdrawSBPReward', result, '\n');
    return result;
}

async function revokeSBP(previousAccountBlock) {
    const accountBlock = tx.revokeSBP({
        sbpName:'CS_TEST_NODE'  
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] revokeSBP', result, '\n');
    return result;
}

async function getSBPList() {
    const result = await viteProvider.request('contract_getSBPList', address);

    console.log('[LOG] getSBPList', result, '\n');
    return result;
}

async function voting(previousAccountBlock) {
    const accountBlock = tx.voteForSBP({
        sbpName: 'CS_TEST_NODE'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] voting', result, '\n');
    return result;
}

async function revokeVoting(previousAccountBlock) {
    const accountBlock = tx.cancelVote();

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] revokeVoting', result, '\n');
    return result;
}

async function getVoteList() {
    const result = await viteProvider.request('contract_getSBPVoteList');

    console.log('[LOG] getVoteList', result, '\n');
    return result;
}

async function withdrawalOfQuota(previousAccountBlock) {
    const accountBlock = tx.cancelStake({
        beneficiaryAddress: address,
        amount: '134000000000000000000'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] withdrawalOfQuota', result, '\n');
    return result;
}

async function createContract(previousAccountBlock) {
    const accountBlock = await tx.createContract({
        abi:[{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"SayHello","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"transfer","type":"event"}],
        code: '608060405234801561001057600080fd5b50610141806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806391a6cb4b14610046575b600080fd5b6100896004803603602081101561005c57600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff16906020019092919050505061008b565b005b8074ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f1505050508074ffffffffffffffffffffffffffffffffffffffffff167faa65281f5df4b4bd3c71f2ba25905b907205fce0809a816ef8e04b4d496a85bb346040518082815260200191505060405180910390a25056fea165627a7a7230582023e9669dd6fec3b6b2a84a1fd7c9939f49197203d0e1db312278e633c219c2480029',
        responseLatency: 2,
        params: ['vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9']
    });

    let result = null;
    if (!previousAccountBlock) {
        result = await accountBlock.autoSendByPoW(privateKey);
        console.log('[LOG] createContract', result, '\n');
    } else {
        await accountBlock.setPreviousAccountBlock(previousAccountBlock).autoSetToAddress();
        result = await accountBlock.sendByPoW(privateKey);
        console.log('[LOG] createContract', result, '\n');
    }

    // const result2 = await viteProvider.callOffChainContract({
    //     address: result.toAddress,
    //     code: '608060405260043610600f57600f565b00fea165627a7a7230582023e9669dd6fec3b6b2a84a1fd7c9939f49197203d0e1db312278e633c219c2480029',
    //     abi: [{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"SayHello","outputs":[],"payable":true,"stateMutability":"payable","type":"offchain"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"transfer","type":"event"}],
    //     params: [address]
    // });
    // console.log('[LOG] callOffChainContract', result2, '\n');

    return result;
}

async function CheckMyTxList(pageSize) {
    const data = await viteProvider.getTransactionList({
        address,
        pageIndex: 0,
        pageSize
    });

    // console.log('[LOG] CheckMyTxList', data, '\n');

    data.forEach((ele, i) => {
        console.log(`[LOG] CheckMyTxList TxType ${ i }: ${ ele.transationType } \n`);
        console.log(`[LOG] CheckMyTxList Contract ${ i }: ${ JSON.stringify(ele.contractParams) } \n`);
    });
    return data;
}

async function checkMyTokenList(previousAccountBlock) {
    let tokens = await viteProvider.request('contract_getTokenInfoListByOwner', address);
    console.log('[LOG] checkMyTokenList', tokens, '\n');

    if (!tokens || !tokens.length) {
        await sleep(2000);
        console.log('Step 13 issueToken. \n');
        previousAccountBlock = await issueToken(accountBlock);

        await sleep(2000);
        console.log('Step 13 issueToken. \n');
        previousAccountBlock = await issueToken(accountBlock);

        await sleep(2000);
        console.log('Step 13 issueToken. \n');
        previousAccountBlock = await issueToken(accountBlock);

        await sleep(2000);
        tokens = await viteProvider.request('contract_getTokenInfoListByOwner', address);
        console.log('[LOG] checkMyTokenList Again', tokens, '\n');
    }

    let disableToken = null;
    let toChangeTransferShipOne = null;
    let reIssueOne = null;

    tokens.forEach(async (token) => {
        if (!token.isReIssuable) {
            return;
        }
        disableToken = token;
        if (reIssueOne) {
            toChangeTransferShipOne = token;
            return;
        }
        reIssueOne = token;
    })

    if (reIssueOne) {
        await sleep(2000);
        previousAccountBlock = await reIssueToken(previousAccountBlock, reIssueOne);
    
        await sleep(2000);
        previousAccountBlock = await burnToken(previousAccountBlock, reIssueOne);
    }

    if (disableToken) {
        await sleep(2000);
        previousAccountBlock = await disableReIssueToken(previousAccountBlock, disableToken);
    }

    if (toChangeTransferShipOne) {
        await sleep(2000);
        previousAccountBlock = await transferTokenOwnership(previousAccountBlock, toChangeTransferShipOne);
    }

    return previousAccountBlock;
}

async function issueToken(previousAccountBlock) {
    const accountBlock = await tx.issueToken({
        tokenName: 'cstestToken', 
        isReIssuable: true, 
        maxSupply: '10000000000000000000000000', 
        isOwnerBurnOnly: false, 
        totalSupply: '100000000000000000000000', 
        decimals: 2, 
        tokenSymbol: 'CSTT'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] issueToken', result, '\n');

    return result;
}

async function disableReIssueToken(previousAccountBlock, token) {
    const accountBlock = tx.disableReIssueToken(token);

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] disableReIssueToken', result, '\n');

    return result;
}

async function reIssueToken(previousAccountBlock, token) {
    const accountBlock = tx.reIssueToken({
        tokenId: token.tokenId,
        amount: '100',
        receiveAddress: address
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] reIssueToken', result, '\n');

    return result;
}

async function burnToken(previousAccountBlock, token) {
    const accountBlock = tx.burnToken({
        tokenId: token.tokenId,
        amount: '100',
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] reIssueToken', result, '\n');

    return result;
}

async function transferTokenOwnership(previousAccountBlock, token) {
    const accountBlock = tx.transferTokenOwnership({
        tokenId: token.tokenId,
        newOwnerAddress: addr2.address
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] reIssueToken', result, '\n');

    return result;
}

function SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock) {
    if (previousAccountBlock) {
        return accountBlock.setPreviousAccountBlock(previousAccountBlock).sendByPoW();
    }
    return accountBlock.autoSendByPoW(privateKey);
}

function sleep(ms) {
    return new Promise((res, rej) => {
        setTimeout(res, ms);
    });
}