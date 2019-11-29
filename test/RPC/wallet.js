import { createAccountBlock } from '../../src/accountBlock/index';
import { Vite_TokenId } from '../../src/constant/index';
import GetViteFromWorld from './getViteFromWorld';
import { sleep, SendTXByPreviousAccountBlock, viteProvider, privateKey, address, addr2, tx } from './utils';

export default async function TestFunc() {
    console.log('Step 0 CheckHeight. \n');
    await CheckHeight();

    let accountBlock = null;

    console.log('Step 1 CheckBalance. \n');
    accountBlock = await CheckBalance();

    await sleep(2000);
    console.log('Step 2 SendTxToMyself. \n');
    accountBlock = await SendTxToMyself(accountBlock);

    await sleep(2000);
    console.log('Step 3 ReceiveTx. \n');
    accountBlock = await ReceiveTx(accountBlock);

    await sleep(2000);
    console.log('Step 4 CheckQuota. \n');
    accountBlock = await CheckQuota(accountBlock);

    await sleep(2000);
    console.log('Step 5 RegisterSBP. \n');
    accountBlock = await RegisterSBP(accountBlock);

    await sleep(2000);
    console.log('Step 6 UpdateSBPBlockProducingAddress. \n');
    accountBlock = await UpdateSBPBlockProducingAddress(accountBlock);

    await sleep(2000);
    console.log('Step 7 WithdrawSBPReward. \n');
    accountBlock = await WithdrawSBPReward(accountBlock);

    await sleep(2000);
    console.log('Step 8 VoteForSBP. \n');
    accountBlock = await VoteForSBP(accountBlock);

    console.log('Step 9 GetSBPVoteList. \n');
    await GetSBPVoteList();

    await sleep(2000);
    console.log('Step 10 CancelSBPVoting. \n');
    accountBlock = await CancelSBPVoting(accountBlock);

    console.log('Step 11 GetSBPList. \n');
    await GetSBPList();

    await sleep(2000);
    console.log('Step 12 RevokeSBP. \n');
    accountBlock = await RevokeSBP(accountBlock);

    await sleep(2000);
    console.log('Step 13 CreateContract. \n');
    accountBlock = await CreateContract(accountBlock);

    await CheckTokenList(accountBlock);

    await sleep(2000);
    console.log('Step 14 CancelQuotaStake. \n');
    accountBlock = await CancelQuotaStake(accountBlock);

    console.log('Last One CheckTxList. \n');
    await CheckTxList(10);

    return null;
}


async function CheckHeight() {
    const height = await viteProvider.request('ledger_getSnapshotChainHeight');
    console.log('[LOG] CheckHeight', height, '\n');
    return height;
}

async function CheckBalance() {
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

async function CheckQuota(previousAccountBlock) {
    const quotaResult = await viteProvider.request('contract_getQuotaByAccount', address);
    console.log('[LOG] contract_getQuotaByAccount', quotaResult, '\n');
    
    if (Number(quotaResult.currentQuota)) {
        return previousAccountBlock;
    }

    const accountBlock = tx.stakeForQuota({
        beneficiaryAddress: address,
        amount: '1000000000000000000000'
    });

    // const accountBlock = tx.stakeForQuota_V2({
    //     beneficiaryAddress: address,
    //     amount: '1000000000000000000000'
    // });

    if (previousAccountBlock) {
        await accountBlock.setPreviousAccountBlock(previousAccountBlock).PoW();
        const result = await accountBlock.sign().send();
        console.log('[LOG] StakeForQuota', result, '\n');
        return result;
    }

    const result = await accountBlock.autoSendByPoW(privateKey);
    console.log('[LOG] StakeForQuota', result, '\n');
    return result;
}

async function SendTxToMyself(previousAccountBlock) {
    const accountBlock = await tx.send({
        toAddress: address, 
        tokenId: Vite_TokenId,
        amount: '10000000000000000000'
    });

    if (!previousAccountBlock) {
        const data = await accountBlock.autoSendByPoW();
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
        console.log('[LOG] No Unreceived Blocks', null, '\n');
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

    console.log('[LOG] Receive Tx', result, '\n');
    return result;
}

async function RegisterSBP(previousAccountBlock) {
    const accountBlock = tx.registerSBP({
        sbpName: 'CS_TEST_NODE',
        blockProducingAddress: address,
        rewardWithdrawAddress: address
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] RegisterSBP', result, '\n');
    return result;
}

async function UpdateSBPBlockProducingAddress(previousAccountBlock) {
    const accountBlock = tx.updateSBPBlockProducingAddress({
        sbpName: 'CS_TEST_NODE',
        blockProducingAddress: 'vite_869a06b8963bd5d88a004723ad5d45f345a71c0884e2c80e88'
    });
    
    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] UpdateSBPBlockProducingAddress', result, '\n');
    return result;
}

async function WithdrawSBPReward(previousAccountBlock) {
    const accountBlock = tx.withdrawSBPReward({
        sbpName:'CS_TEST_NODE',
        receiveAddress: address    
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] WithdrawSBPReward', result, '\n');
    return result;
}

async function RevokeSBP(previousAccountBlock) {
    const accountBlock = tx.revokeSBP({
        sbpName:'CS_TEST_NODE'  
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] RevokeSBP', result, '\n');
    return result;
}

async function GetSBPList() {
    const result = await viteProvider.request('contract_getSBPList', address);

    console.log('[LOG] GetSBPList', result, '\n');
    return result;
}

async function VoteForSBP(previousAccountBlock) {
    const accountBlock = tx.voteForSBP({
        sbpName: 'CS_TEST_NODE'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] VoteForSBP', result, '\n');
    return result;
}

async function CancelSBPVoting(previousAccountBlock) {
    const accountBlock = tx.cancelSBPVoting();

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] CancelSBPVoting', result, '\n');
    return result;
}

async function GetSBPVoteList() {
    const result = await viteProvider.request('contract_getSBPVoteList');

    console.log('[LOG] getVoteList', result, '\n');
    return result;
}

async function CancelQuotaStake(previousAccountBlock) {
    const list = await viteProvider.request('contract_getStakeList', address, 0, 10);
    console.log('[LOG] contract_getStakeList', list, '\n');

    if (!list || !list.stakeList || !list.stakeList.length) {
        return;
    }

    let backQuota = list.stakeList[0];

    const accountBlock = null;
    if (!backQuota.id) {
        console.log('[LOG] cancelQuotaStake_V2 no id', backQuota, '\n');

        accountBlock = tx.cancelQuotaStake_V2({
            beneficiaryAddress: address,
            amount: '134000000000000000000'
        });
    } else {
        console.log('[LOG] cancelQuotaStake', backQuota, '\n');
        accountBlock = tx.cancelQuotaStake({
            id: backQuota.id
        });
    }

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] CancelQuotaStake', result, '\n');
    return result;
}

async function CreateContract(previousAccountBlock) {
    const accountBlock = await tx.createContract({
        abi:[{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"SayHello","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"transfer","type":"event"}],
        code: '608060405234801561001057600080fd5b50610141806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806391a6cb4b14610046575b600080fd5b6100896004803603602081101561005c57600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff16906020019092919050505061008b565b005b8074ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f1505050508074ffffffffffffffffffffffffffffffffffffffffff167faa65281f5df4b4bd3c71f2ba25905b907205fce0809a816ef8e04b4d496a85bb346040518082815260200191505060405180910390a25056fea165627a7a7230582023e9669dd6fec3b6b2a84a1fd7c9939f49197203d0e1db312278e633c219c2480029',
        responseLatency: 2,
        params: ['vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9']
    });

    let result = null;
    if (!previousAccountBlock) {
        result = await accountBlock.autoSendByPoW(privateKey);
        console.log('[LOG] CreateContract', result, '\n');
    } else {
        await accountBlock.setPreviousAccountBlock(previousAccountBlock);
        result = await accountBlock.sendByPoW(privateKey);
        console.log('[LOG] CreateContract', result, '\n');
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

async function CheckTxList(pageSize) {
    const data = await viteProvider.getTransactionList({
        address,
        pageIndex: 0,
        pageSize
    });

    // console.log('[LOG] CheckMyTxList', data, '\n');

    data.forEach((ele, i) => {
        console.log(`[LOG] CheckTxList TxType ${ i }: ${ ele.transactionType } \n`);
        console.log(`[LOG] CheckTxList Contract ${ i }: ${ JSON.stringify(ele.contractParams) } \n`);
    });
    return data;
}

async function CheckTokenList(previousAccountBlock) {
    let tokens = await viteProvider.request('contract_getTokenInfoListByOwner', address);
    console.log('[LOG] contract_getTokenInfoListByOwner', tokens, '\n');

    if (!tokens || !tokens.length) {
        await sleep(2000);
        console.log('Step 13 IssueToken 1. \n');
        previousAccountBlock = await IssueToken(accountBlock);

        await sleep(2000);
        console.log('Step 13 IssueToken 2. \n');
        previousAccountBlock = await IssueToken(accountBlock);

        await sleep(2000);
        console.log('Step 13 IssueToken 3. \n');
        previousAccountBlock = await IssueToken(accountBlock);

        await sleep(2000);
        tokens = await viteProvider.request('contract_getTokenInfoListByOwner', address);
        console.log('[LOG] contract_getTokenInfoListByOwner Again', tokens, '\n');
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
        previousAccountBlock = await ReIssueToken(previousAccountBlock, reIssueOne);
    
        await sleep(2000);
        previousAccountBlock = await BurnToken(previousAccountBlock, reIssueOne);
    }

    if (disableToken) {
        await sleep(2000);
        previousAccountBlock = await DisableReIssueToken(previousAccountBlock, disableToken);
    }

    if (toChangeTransferShipOne) {
        await sleep(2000);
        previousAccountBlock = await TransferTokenOwnership(previousAccountBlock, toChangeTransferShipOne);
    }

    return previousAccountBlock;
}

async function IssueToken(previousAccountBlock) {
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
    console.log('[LOG] IssueToken', result, '\n');

    return result;
}

async function DisableReIssueToken(previousAccountBlock, token) {
    const accountBlock = tx.disableReIssueToken(token);

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] DisableReIssueToken', result, '\n');

    return result;
}

async function ReIssueToken(previousAccountBlock, token) {
    const accountBlock = tx.reIssueToken({
        tokenId: token.tokenId,
        amount: '100',
        receiveAddress: address
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] ReIssueToken', result, '\n');

    return result;
}

async function BurnToken(previousAccountBlock, token) {
    const accountBlock = tx.burnToken({
        tokenId: token.tokenId,
        amount: '100',
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] BurnToken', result, '\n');

    return result;
}

async function TransferTokenOwnership(previousAccountBlock, token) {
    const accountBlock = tx.transferTokenOwnership({
        tokenId: token.tokenId,
        newOwnerAddress: addr2.address
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] TransferTokenOwnership', result, '\n');

    return result;
}
