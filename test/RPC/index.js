// import './getViteFromWorld';

import walletTest from './wallet';
import dexTest from './dex';
import receiveAccountBlock from './receiveAccountBlock';

async function TestFunc() {
    await walletTest();
    await dexTest();
    await receiveAccountBlock();
}

TestFunc().then(() => {
    console.log("Wallet Happy Ending, yes!");
}).catch(err => {
    console.log("Oooooh, Got Error!", err);
});
