const { WS_RPC } = require('@vite/vitejs-ws');
const { client } = require('@vite/vitejs');

const provider = new WS_RPC('ws://148.70.30.139:41423');
const Client = client;

const myClient = new Client(provider, _myClient => {
    console.log('Connected');
});

myClient.ledger.getSnapshotChainHeight().then(result => {
    console.log(result);
}).catch(err => {
    console.warn(err);
});
