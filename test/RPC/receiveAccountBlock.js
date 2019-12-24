import { Vite_TokenId } from '../../src/constant/index';
import { ReceiveAccountBlockTask } from '../../src/accountBlock/receiveAccountBlock';

import { sleep, viteProvider, privateKey, address, tx } from './utils';

const ReceiveTask = new ReceiveAccountBlockTask({
    address,
    privateKey,
    provider: viteProvider,
});

export default async function start() {
    await SendTxToMyself();
    await sleep(2000);
    await SendTxToMyself();
    await sleep(2000);
    await SendTxToMyself();
    await sleep(2000);
    await SendTxToMyself();
    await sleep(2000);
    await SendTxToMyself();
    await sleep(2000);
    await SendTxToMyself();
    await sleep(2000);
    await SendTxToMyself();
    await sleep(2000);

    ReceiveTask.onSuccess((result) => {
        console.log('success', result);
        ReceiveTask.stop();
    });
    ReceiveTask.onError((error) => {
        console.log('error', error);
    });
    ReceiveTask.start({
        checkTime: 3000,
        receivedNumberATime: 10
    });
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
