const config = require('../rpcConfig');

import HTTP_RPC from '../../src/HTTP/index';
import ViteAPI from '../../src/viteAPI/index';
import walletUtils from '../../src/wallet/index';
import Account from '../../src/accountBlock/account';

export const viteProvider = new ViteAPI(new HTTP_RPC(config.http), () => {
    console.log('Connected');
});

export const myWallet = walletUtils.getWallet(config.myMnemonic);
const addr1  = myWallet.deriveAddress(0);

export const privateKey = addr1.privateKey;
export const address = addr1.address;
export const addr2  = myWallet.deriveAddress(1);
export const tx = new Account(address).setProvider(viteProvider).setPrivateKey(privateKey);
export const tx2 = new Account(addr2.address).setProvider(viteProvider).setPrivateKey(addr2.privateKey);

export function SendTXByPreviousAccountBlock(accountBlock, previousAccountBlock) {
    if (previousAccountBlock) {
        return accountBlock.setPreviousAccountBlock(previousAccountBlock).sendByPoW();
    }
    return accountBlock.autoSendByPoW(privateKey);
}

export function sleep(ms) {
    return new Promise((res, rej) => {
        setTimeout(res, ms);
    });
}

export function waitUntil(condition) {
    return new Promise((res) => {
        let interval = setInterval(() => {
            if (!condition()) {
                return;
            }

            clearInterval(interval);
            res();
        }, 1000);
    });
}
