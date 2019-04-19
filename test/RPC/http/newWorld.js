import HTTP_RPC from '../../../src/HTTP';
import Client from '../../../src/client/index';
import HdAccount from '../../../src/hdAccount/index';
import Account from '../../../src/account/index';
import { Vite_TokenId } from '../../../src/constant/index';

const rootAccM = 'alarm canal scheme actor left length bracket slush tuna garage prepare scout school pizza invest rose fork scorpion make enact false kidney mixed vast';

const provider = new Client(new HTTP_RPC('http://148.70.30.139:48132'));
const rootHdAccount = new HdAccount({
    mnemonic: rootAccM,
    client: provider
}, { addrStartInx: 1 });

console.log(rootHdAccount.addrList);

const rootSecondAccount = new Account({
    privateKey: rootHdAccount.addrList[0].privKey,
    client: provider
});

console.log(rootSecondAccount.address, Vite_TokenId);

rootSecondAccount.getBalance().then(data => {
    console.log('vite balance', data.balance.tokenBalanceInfoMap[Vite_TokenId]);
}).catch(err => {
    console.log('getBalance', err);
});

const myHdAccount = new HdAccount({
    mnemonic: 'spend daughter ridge dwarf blast park clinic enemy move gate copper total collect harvest school smoke web differ wild banana produce pudding view damage',
    client: provider
});
const myAccount = new Account({
    privateKey: myHdAccount.addrList[0].privKey,
    client: provider
});

rootSecondAccount.sendTx({
    toAddress: myAccount.address,
    amount: '100000000000000000000000',
    tokenId: Vite_TokenId
}).then(data => {
    console.log('sendTx root to me ok', data);
}).catch(err => {
    console.log('sendTx root to me fail', err);
});
