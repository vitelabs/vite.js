const config = require('../../rpcConfig.js');

import HTTP_RPC from '../../src/HTTP';
import ViteAPI from '../../src/viteAPI/index';
import Transaction from '../../src/transaction/index';
import hdWallet from '../../src/hdWallet/index';
import { Vite_TokenId } from '../../src/constant/index';

const Default_Amount = '1000000000000000000000000'; // 1000000 VITE

async function GetViteFromWorld(toAddress, amount = Default_Amount) {
    const provider = new ViteAPI(new HTTP_RPC(config.http));
    const worldHDWallet = hdWallet.getHDWallet(config.mnemonic);
    const worldWallet  = worldHDWallet.deriveWallet(config.addrIndex);

    const balanceInfo = await provider.getBalanceInfo(worldWallet.address);
    console.log('[LOG] getViteFromWorld BalanceInfo',worldWallet.address, balanceInfo, '\n');

    const tx = new Transaction(worldWallet.address, provider);
    const data = await tx.sendTransaction({
        toAddress, 
        tokenId: Vite_TokenId,
        amount
    }).autoSend(worldWallet.privateKey);

    console.log('[LOG] getViteFromWorld', data, '\n');
    return data;
}

// GetViteFromWorld('vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2');

export default GetViteFromWorld;
