import HTTP_RPC from '../../../src/HTTP';
import Client from '../../../src/client/index';
import HdAccount from '../../../src/hdAccount/index';
import Account from '../../../src/account/index';
import { bytesToHex, blake2b, hexToBytes } from '../../../src/utils/index';

const myHTTPClient = new Client(new HTTP_RPC('http://148.70.30.139:48132'));
const myHdAccount = new HdAccount({
    mnemonic: 'spend daughter ridge dwarf blast park clinic enemy move gate copper total collect harvest school smoke web differ wild banana produce pudding view damage',
    client: myHTTPClient
});

const address = myHdAccount.addrList[0].hexAddr;
const realAddr = myHdAccount.addrList[0].addr;
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

    if (!data || !data.length) {
        return;
    }

    const block = data[0];

    myHTTPClient.buildinTxBlock.asyncReceiveTx({
        accountAddress: address,
        fromBlockHash: block.hash
    }).then(accBlock => {
        // const prevHash = Number(accBlock.prevHash) === 0 ? '0' : accBlock.prevHash;
        myHTTPClient.tx.calcPoWDifficulty({
            selfAddr: address,
            prevHash: accBlock.prevHash,
            blockType: accBlock.blockType,
            toAddr: accBlock.toAddress,
            data: accBlock.data,
            usePledgeQuota: true
        }).then(data => {
            const hash = bytesToHex(blake2b(hexToBytes(realAddr + accBlock.prevHash), null, 32));

            if (data.difficulty) {
                myHTTPClient.request('pow_getPowNonce', data.difficulty, hash).then(nonce => {
                    accBlock.nonce = nonce;
                    accBlock.difficulty = data.difficulty;
                    myAccount.sendRawTx(accBlock).then(data => {
                        console.log(data);
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
}).catch(err => {
    console.log('getOnroadBlocksByAddress', err);
});


myHTTPClient.getBalance(address).then(data => {
    console.log('getBalance', data);
}).catch(err => {
    console.log('getBalance', err);
});

myHTTPClient.getTxList({
    addr: address,
    index: 0,
    pageCount: 10
}).then(data => {
    console.log('getTxList', data);
}).catch(err => {
    console.log('getTxList', err);
});

