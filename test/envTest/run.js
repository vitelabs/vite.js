const config = require('../rpcConfig');
const { WS_RPC } = require('../../src/WS');
const { ViteAPI } = require('../../src/viteAPI');

const provider = new WS_RPC(config.ws);

const myClient = new ViteAPI(provider, _myClient => {
    console.log('Connected');
});

myClient.request('ledger_getSnapshotChainHeight').then(result => {
    console.log(result);
}).catch(err => {
    console.warn(err);
});
