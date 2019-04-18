const { client } = require('../../packages/vitejs');
const { WS_RPC } = require('../../packages/WS');
const { HTTP_RPC } = require('../../packages/HTTP');
const { IPC_RPC } = require('../../packages/IPC');

// console.log(vitejs);
console.log(WS_RPC);
console.log(HTTP_RPC);
console.log(IPC_RPC);

const Client = client;

const provider = new WS_RPC('wss://testnet.vitewallet.com/test/ws');
const myClient = new Client(provider);

myClient.ledger.getSnapshotChainHeight().then(result => {
    console.log(result);
}).catch(err => {
    console.warn(err);
});
