import HTTP_RPC from '../../src/HTTP';
import Client from '../../src/client/index';
import HdAccount from '../../src/hdAccount/index';
import { Vite_TokenId } from '../../src/constant/index';
import config from '../config';

const Default_Amount = '1000000000000000000000000'; // 1000000 VITE

async function GetViteFromWorld(toAddress, amount = Default_Amount) {
    const provider = new Client(new HTTP_RPC(config.http));
    const worldHdAccount = new HdAccount({
        mnemonic: config.mnemonic,
        client: provider
    }, { addrStartInx: config.addrIndex });

    const worldSecondAccount = worldHdAccount.getAccount();

    const data = await worldSecondAccount.sendTx({
        toAddress,
        amount,
        tokenId: Vite_TokenId
    });

    console.log('[LOG] getViteFromWorld', data, '\n');
    return data;
}

// GetViteFromWorld('vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2');

export default GetViteFromWorld;
