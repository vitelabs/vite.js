const assert = require('assert');

import walletTest from './wallet';
import dexTest from './dex';
import receiveAccountBlock from './receiveAccountBlock';

describe('RPC Test', function () {
    it('wallet test', async () => {
        await walletTest();
        assert.ok(true);
    }).timeout(600000);

    it('dex test', async () => {
        await dexTest();
        assert.ok(true);
    }).timeout(600000);

    it('receive txs', async () => {
        await receiveAccountBlock();
        assert.ok(true);
    }).timeout(600000);
});

// async function TestFunc() {
//     await walletTest();
//     await dexTest();
//     await receiveAccountBlock();
// }

// TestFunc().then(() => {
//     console.log("Wallet Happy Ending, yes!");
// }).catch(err => {
//     console.log("Oooooh, Got Error!", err);
// });
