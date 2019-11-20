// import './getViteFromWorld';

import walletTest from './wallet';
import dexTest from './dex';

async function TestFunc() {
    await walletTest();
    await dexTest();
}

TestFunc().then(() => {
    console.log("Wallet Happy Ending, yes!");
}).catch(err => {
    console.log("Oooooh, Got Error!", err);
});
