import HTTP_RPC from '../../../src/HTTP';
import Client from '../../../src/client/index';
import HdAccount from '../../../src/hdAccount/index';
import Account from '../../../src/account/index';

const myHTTPClient = new Client(new HTTP_RPC('http://148.70.30.139:48132'));
const myHdAccount = new HdAccount({
    mnemonic: 'spend daughter ridge dwarf blast park clinic enemy move gate copper total collect harvest school smoke web differ wild banana produce pudding view damage',
    client: myHTTPClient
});

// console.log(myHTTPClient);
// console.log(myHdAccount);

// console.log(myHTTPClient.request);

const address = myHdAccount.addrList[0].hexAddr;
const privateKey = myHdAccount.addrList[0].privKey;

// const activeAccount = myHdAccount.activateAccount({}, {
//     receiveFailAction: err => {
//         console.log(err);
//     }
// });

const myAccount = new Account({
    privateKey,
    client: myHTTPClient
});

myHTTPClient.onroad.getOnroadBlocksByAddress(address, 0, 10).then(data => {
    console.log('getOnroadBlocksByAddress', data);

    const block = data[0];

    // myHTTPClient.tx.calcPoWDifficulty()


    myAccount.receiveTx(block.hash).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}).catch(err => {
    console.log('getOnroadBlocksByAddress', err);
});


// myHTTPClient.getBalance(address).then(data => {
//     console.log('getBalance', data);
// }).catch(err => {
//     console.log('getBalance', err);
// });

// myHTTPClient.getTxList({
//     addr: address,
//     index: 0,
//     pageCount: 10
// }).then(data => {
//     console.log('getTxList', data);
// }).catch(err => {
//     console.log('getTxList', err);
// });

