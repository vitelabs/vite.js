
import { Vite_TokenId, VX_TokenId } from '../../src/constant/index';
import { sleep, SendTXByPreviousAccountBlock, viteProvider, privateKey, address, addr2, tx, tx2 } from './utils';

export default async function TestFunc() {
    console.log('Step 0 DEX Test Start. \n');

    let previousAccountBlock = null;

    // 1. Deposit-Withdraw

    console.log('Step 1 Deposit. \n');
    previousAccountBlock = await Deposit();

    await sleep(2000);

    console.log('Step 2 Get balance. \n');
    await GetBalance();

    await sleep(2000);

    console.log('Step 3 Withdraw. \n');
    previousAccountBlock = await Withdraw(previousAccountBlock);

    // 2. Stake For Mining

    await sleep(2000);

    console.log('Step 4 StakeForMining. \n');
    previousAccountBlock = await StakeForMining(previousAccountBlock);

    await sleep(2000);

    console.log('Step 5 CancelStakeMining. \n');
    previousAccountBlock = await CancelStakeMining(previousAccountBlock);

    // 3. Stake About VIP

    await sleep(2000);

    console.log('Step 6 StakeForVIP. \n');
    previousAccountBlock = await StakeForVIP(previousAccountBlock);

    await sleep(2000);

    console.log('Step 7 StakeForSuperVIP. \n');
    previousAccountBlock = await StakeForSuperVIP(previousAccountBlock);

    await sleep(2000);

    console.log('Step 8 StakeForPrincipalSVIP. \n');
    previousAccountBlock = await StakeForPrincipalSVIP(previousAccountBlock);

    await sleep(1000);

    console.log('Step 9 GetVIPList. \n');
    await GetVIPList();

    // 4. Abount inviter

    await sleep(1000);

    console.log('Step 10 CreateNewInviter. \n');
    previousAccountBlock = await CreateNewInviter(previousAccountBlock);

    await sleep(2000);

    console.log('Step 11 BindInviteCode. \n');
    previousAccountBlock = await BindInviteCode(previousAccountBlock);

    // 5. Lock For VX

    await sleep(2000);

    console.log('Step 12 LockVxForDividend. \n');
    previousAccountBlock = await LockVxForDividend(previousAccountBlock);

    await sleep(2000);

    console.log('Step 13 UnLockVxForDividend. \n');
    previousAccountBlock = await UnLockVxForDividend(previousAccountBlock);

    await sleep(2000);

    console.log('Step 14 SwitchConfigOpen. \n');
    previousAccountBlock = await SwitchConfigOpen(previousAccountBlock);

    await sleep(2000);

    console.log('Step 15 SwitchConfigClose. \n');
    previousAccountBlock = await SwitchConfigClose(previousAccountBlock);

    // 6. TX Pair And Order
    // dexCancelOrder

    await sleep(2000);

    console.log('Step 16 OpenNewMarket. \n');
    previousAccountBlock = await OpenNewMarket(previousAccountBlock);

    // 7. Internal Transfer, Agent Deposit And Assigned Withdraw

    await sleep(2000);

    console.log('Step 17 Dex Transfer. \n');
    previousAccountBlock = await InternalTransfer();

    await sleep(2000);

    console.log('Step 18 Agent Deposit. \n');
    previousAccountBlock = await AgentDeposit(previousAccountBlock);

    await sleep(2000);

    console.log('Step 19 Assigned Withdraw. \n');
    previousAccountBlock = await AssignedWithdraw(previousAccountBlock);

    await sleep(2000);

    console.log('Step 20 Assigned Withdraw with Label. \n');
    previousAccountBlock = await AssignedWithdrawWithLabel(previousAccountBlock);

    return null;
}

async function GetBalance() {
    const data = await viteProvider.request('dex_getAccountBalanceInfo', address);
    console.log('[LOG] GetBalance VITE', data[Vite_TokenId], '\n');
    console.log('[LOG] GetBalance VX', data[VX_TokenId], '\n');
    return null;
}

async function Deposit() {
    const accountBlock = await tx.dexDeposit({
        toAddress: address,
        tokenId: Vite_TokenId,
        amount: '300000000000000000000000'
    });

    const data = await accountBlock.autoSendByPoW();
    console.log('[LOG] Deposit', data, '\n');
    return data;
}

async function Withdraw(previousAccountBlock) {
    const accountBlock = await tx.dexWithdraw({
        toAddress: address,
        tokenId: Vite_TokenId,
        amount: '1000000000000000000'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] Withdraw', result, '\n');
    return result;
}

async function StakeForMining(previousAccountBlock) {
    const accountBlock = await tx.dexStakeForMining({
        actionType: 1,
        amount: '134000000000000000000'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] StakeForMining', result, '\n');
    return result;
}

async function CancelStakeMining(previousAccountBlock) {
    const data = await viteProvider.request('dex_getMiningStakeInfoList', address, 0, 10);
    console.log('[LOG] dex_getMiningStakeInfoList', data, '\n');

    if (!data || !data.stakeList || !data.stakeList.length) {
        return;
    }

    const accountBlock = tx.dexCancelStakeById({
        id: data.stakeList[0].id
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] CancelStakeMining', result, '\n');
    return result;
}

async function StakeForVIP(previousAccountBlock) {
    const accountBlock = tx.dexStakeForVIP({
        actionType: 1
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] StakeForVIP', result, '\n');
    return result;
}

async function StakeForSuperVIP(previousAccountBlock) {
    const accountBlock = tx.dexStakeForSuperVIP({
        actionType: 1
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] StakeForSuperVIP', result, '\n');
    return result;
}

async function StakeForPrincipalSVIP(previousAccountBlock) {
    const accountBlock = tx.dexStakeForPrincipalSVIP({
        principal: addr2.address
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] StakeForPrincipalSVIP', result, '\n');
    return result;
}

async function GetVIPList() {
    const data = await viteProvider.request('dex_getVIPStakeInfoList', address, 0, 10);
    console.log('[LOG] dex_getVIPStakeInfoList', data, '\n');
    return null;
}

async function CreateNewInviter(previousAccountBlock) {
    const accountBlock = tx.dexCreateNewInviter();

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] CreateNewInviter', result, '\n');
    return result;
}

async function BindInviteCode(previousAccountBlock) {
    const code = await viteProvider.request('dex_getInviteCode', address);
    console.log('[LOG] dex_getInviteCode', code, '\n');

    // 1. Stake Quota For addr2
    let accountBlock = tx.stakeForQuota({
        beneficiaryAddress: addr2.address,
        amount: '1340000000000000000000'
    });

    previousAccountBlock = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] StakeForQuota to Addr2', previousAccountBlock, '\n');

    // 2. Send Tx To addr2

    await sleep(2000);

    accountBlock = tx.send({
        toAddress: addr2.address,
        tokenId: Vite_TokenId,
        amount: '10000000000000000000'
    });

    previousAccountBlock = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] Send TX to Addr2', previousAccountBlock, '\n');

    // 3. Addr2 Receive TX

    await sleep(2000);

    const txList = await viteProvider.request('ledger_getUnreceivedBlocksByAddress', addr2.address, 0, 10);
    if (!txList || !txList.length) {
        console.log('[LOG] Addr2 No Unreceived Blocks', null, '\n');
        return previousAccountBlock;
    }

    let accountBlock2 = tx2.receive({
        sendBlockHash: txList[0].hash,
    });

    await sleep(2000);

    const data1 = await accountBlock2.autoSendByPoW();
    console.log('[LOG] Addr2 Receive TX', data1, '\n');

    // 4. Addr2 Bind Code

    await sleep(2000);

    accountBlock2 = tx2.dexBindInviteCode({ code });
    const data = await SendTXByPreviousAccountBlock(accountBlock2, data1);

    console.log('[LOG] Addr2 BindInviteCode', data, '\n');

    return previousAccountBlock;
}

async function LockVxForDividend(previousAccountBlock) {
    const accountBlock = tx.dexLockVxForDividend({
        actionType: 1,
        amount: '10000000000000000000'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] LockVxForDividend', result, '\n');
    return result;
}

async function UnLockVxForDividend(previousAccountBlock) {
    const accountBlock = tx.dexLockVxForDividend({
        actionType: 2,
        amount: '10000000000000000000'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] LockVxForDividend', result, '\n');
    return result;
}

async function SwitchConfigOpen(previousAccountBlock) {
    const accountBlock = tx.dexSwitchConfig({
        switchType: 1,
        enable: true
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] SwitchConfigOpen', result, '\n');
    return result;
}

async function SwitchConfigClose(previousAccountBlock) {
    const accountBlock = tx.dexSwitchConfig({
        switchType: 1,
        enable: false
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] SwitchConfigClose', result, '\n');
    return result;
}

async function OpenNewMarket(previousAccountBlock) {
    let tokens = await viteProvider.request('contract_getTokenInfoListByOwner', address);
    console.log('[LOG] contract_getTokenInfoListByOwner', tokens, '\n');

    if (!tokens || !tokens.length) {
        return;
    }

    // 1. Open Market
    let accountBlock = tx.dexOpenNewMarket({
        tradeToken: tokens[0].tokenId,
        quoteToken: Vite_TokenId
    });

    previousAccountBlock = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] OpenNewMarket', previousAccountBlock, '\n');

    // 2. Config Market

    await sleep(2000);

    accountBlock = tx.dexMarketAdminConfig({
        tradeToken: tokens[0].tokenId,
        quoteToken: Vite_TokenId,
        operationCode: 6,
        makerFeeRate: 200000,
        takerFeeRate: 100000,
        marketOwner: address,
        stopMarket: false
    });

    previousAccountBlock = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] MarketAdminConfig', previousAccountBlock, '\n');

    // 3. Change Token Owner

    await sleep(2000);

    accountBlock = tx.dexTransferTokenOwnership({
        tokenId: tokens[0].tokenId,
        newOwner: addr2.address
    });

    previousAccountBlock = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] TransferTokenOwnership', previousAccountBlock, '\n');

    // 4. Config Agent

    await sleep(2000);

    accountBlock = tx.dexConfigMarketAgents({
        actionType: 1,
        agent: addr2.address,
        tradeTokens: [tokens[0].tokenId],
        quoteTokens: [Vite_TokenId]
    });

    previousAccountBlock = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] ConfigMarketAgents', previousAccountBlock, '\n');

    // 5. Place Order

    await sleep(2000);

    accountBlock = tx.dexPlaceOrder({
        tradeToken: tokens[0].tokenId,
        quoteToken: Vite_TokenId,
        side: 1,
        price: '1',
        quantity: '10'
    });

    previousAccountBlock = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] PlaceOrder', previousAccountBlock, '\n');

    return previousAccountBlock;
}

async function InternalTransfer(previousAccountBlock) {
    const accountBlock = await tx.dexTransfer({
        destination: addr2.address,
        tokenId: Vite_TokenId,
        amount: '100000000000000000000'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] Dex Transfer', result, '\n');
    return result;
}

async function AgentDeposit(previousAccountBlock) {
    const accountBlock = await tx.dexAgentDeposit({
        beneficiary: addr2.address,
        tokenId: Vite_TokenId,
        amount: '300000000000000000000'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] Agent Deposit', result, '\n');
    return result;
}

async function AssignedWithdraw(previousAccountBlock) {
    const accountBlock = await tx.dexAssignedWithdraw({
        destination: addr2.address,
        tokenId: Vite_TokenId,
        amount: '1000000000000000000'
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] Withdraw', result, '\n');
    return result;
}

async function AssignedWithdrawWithLabel(previousAccountBlock) {
    const label = Buffer.concat([
        Buffer.from('0bc3', 'hex'),
        Buffer.from([0]),
        Buffer.from('0x0000000000000000000000000000000000000001')
    ]).toString("hex");
    const accountBlock = await tx.dexAssignedWithdraw({
        destination: addr2.address,
        tokenId: Vite_TokenId,
        amount: '1000000000000000000',
        label
    });

    const result = await SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock);
    console.log('[LOG] Assigned Withdraw', result, '\n');
    return result;
}
