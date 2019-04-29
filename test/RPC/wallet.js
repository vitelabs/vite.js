import HTTP_RPC from '../../src/HTTP';
import Client from '../../src/client/index';
import Account from '../../src/account/index';
import HdAccount from '../../src/hdAccount/index';
import { Vite_TokenId, BuiltinTxType } from '../../src/constant/index';
import config from '../config';

const provider = new Client(new HTTP_RPC(config.http));
const Default_Amount = '1000000000000000000000000'; // 1000000 VITE

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
    // await GetViteFromWorld('vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2');

    console.log('Step 0 CheckHeight. \n');
    await CheckHeight();

    console.log('Step 1 CheckMyBalance. \n');
    await CheckMyBalance();

    console.log('Step 2 SendTxToMyself. \n');
    await SendTxToMyself();

    console.log('Step 3 ReceiveTx. \n');
    await ReceiveTx();

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

    console.log('Step 9 getQuota. \n');
    await checkQuota();

    console.log('Step 10 withdrawalOfQuota. \n');
    await withdrawalOfQuota();

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
        abi: [{
            'inputs': [{ 'name': 'proposalNames', 'type': 'uint256[]' }],
            'payable': false,
            'stateMutability': 'nonpayable',
            'type': 'constructor'
        }],
        hexCode: '608060405234801561001057600080fd5b506101ca806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806380ae0ea114610046575b600080fd5b6100bd6004803603602081101561005c57600080fd5b810190808035906020019064010000000081111561007957600080fd5b82018360208201111561008b57600080fd5b803590602001918460208302840111640100000000831117156100ad57600080fd5b90919293919293905050506100bf565b005b60006002838390508115156100d057fe5b061415156100dd57600080fd5b600080905060008090505b8383905081101561018a576000848483818110151561010357fe5b9050602002013590506000858560018501818110151561011f57fe5b905060200201359050808401935080841015151561013c57600080fd5b600081111561017d578173ffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff168260405160405180820390838587f1505050505b50506002810190506100e8565b50348114151561019957600080fd5b50505056fea165627a7a723058203cef4a3f93b33e64e99e0f88f586121282084394f6d4b70f1030ca8c360b74620029',
        confirmTimes: 2,
        params: [[ '0x1111111111111111111111111111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222222222222222222222222222' ]]
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
        }]
        // beforeCheckPow: (accountBlock, next) => {
        //     console.log('[beforeCheckPow]', accountBlock);
        //     return next();
        // },
        // beforePow: (accountBlock, checkPowResult, next) => {
        //     console.log('[beforePow]', accountBlock, checkPowResult);
        //     return next(false);
        // },
        // beforeSendTx: (accountBlock, checkPowResult, next) => {
        //     console.log('[beforeSendTx]', accountBlock, checkPowResult);
        //     return next(false);
        // }
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
        pageCount: 1
    });

    // console.log('[LOG] CheckMyTxList', data, '\n');

    data.list.forEach((ele, i) => {
        console.log(`[LOG] CheckMyTxList builtinTxtype ${ i }: ${ BuiltinTxType[ele.txType] } \n`);
    });
    return data;
}

async function GetViteFromWorld(toAddress, amount = Default_Amount) {
    const worldHdAccount = new HdAccount({
        mnemonic: config.mnemonic,
        client: provider
    }, { addrStartInx: config.addrIndex });

    const worldSecondAccount = new Account({
        privateKey: worldHdAccount.addrList[0].privKey,
        client: provider
    });

    const data = await worldSecondAccount.sendTx({
        toAddress,
        amount,
        tokenId: Vite_TokenId
    });

    console.log('[LOG] getViteFromWorld', data, '\n');
    return data;
}
