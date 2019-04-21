import HTTP_RPC from '../../../src/HTTP';
import Client from '../../../src/client/index';
import HdAccount from '../../../src/hdAccount/index';
import Account from '../../../src/account/index';
import { Vite_TokenId, BuiltinTxType } from '../../../src/constant/index';
import config from '../config';

const provider = new Client(new HTTP_RPC(config.http));
const Default_Amount = '1000000000000000000000000'; // 1000000 VITE

const myHdAccount = new HdAccount({
    mnemonic: config.myMnemonic,
    client: provider
});
const myAccount = new Account({
    privateKey: myHdAccount.addrList[0].privKey,
    client: provider
}, {
    autoPow: true,
    usePledgeQuota: true
});
myHdAccount.addAddr();


// Start Test
TestFunc().then(() => {
    console.log('Test Finish');
}).catch(err => {
    console.log('Test Error', err);
});


async function TestFunc() {
    // await GetViteFromWorld(myAccount.address);

    // console.log('Step 0 CheckHeight. \n');
    // await CheckHeight();

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

    console.log('Step 7 revokeVoting. \n');
    await revokeVoting();

    console.log('Last One CheckMyTxList. \n');
    await CheckMyTxList();

    return null;
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
        pageCount: 1
    });

    if (!data || !data.length) {
        console.log('[LOG] ReceiveTx 1', null, '\n');
        return;
    }
    console.log(data[0]);
    const result = await myAccount.receiveTx(data[0].hash);

    console.log('[LOG] ReceiveTx 2', result, '\n');
    return result;
}

async function SendTxToMyself() {
    const result = await myAccount.sendTx({
        toAddress: myAccount.address,
        tokenId: Vite_TokenId,
        amount: '100'
    });

    console.log('[LOG] SendTxToMyself', result, '\n');
    return result;
}

async function CheckMyBalance() {
    const data = await myAccount.getBalance();
    console.log('[LOG] CheckMyBalance', data, '\n');

    if (!data.balance) {
        await GetViteFromWorld(myAccount.address);
    }

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
