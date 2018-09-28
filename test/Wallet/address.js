const assert = require('assert');
import vitejs from '../../index.js';

const HTTP_RPC = new vitejs.HTTP_RPC({});
const ViteJS = new vitejs(HTTP_RPC);
const WalletHD = ViteJS.Wallet.Address;

describe('Wallet_Address', function () {
    let mnemonic = 'truck female picnic cactus mountain around keen letter brass assume night air shallow predict gap scheme again moon drive slender tone coin stairs seven';

    it('test_getAddrsFromMnemonic', function () {
        let as = WalletHD.getAddrsFromMnemonic(mnemonic, 10, 'm/44\'/999\'');
        let arr = [];
        as.forEach((item)=>{
            arr.push(item.hexAddr);
        });

        assert.deepEqual(arr, [
            'vite_07bd5cef6a26faf677f77ccc17a79b0d4ecbdc68953b3cf34d',
            'vite_b09b8401eec626ea6ff2b95493833b910ccf7ea9216f6cca67',
            'vite_d05aa780b45f93d3959b0ad552921e5da8a08ffb44002e12f7',
            'vite_9e465ef2e49b9d227cf7ef9f7b56a0c24f37cf6245357388d2',
            'vite_004c3c0a712775cb513b0d4b4dfe2b742ea49ce8796c0eae80',
            'vite_af6fdd10ed33d0317b21cf11f3df0bf9f79948790d36b9e2e8',
            'vite_8fdb9d9af5251f73b0a82d18c48f185a3cf8bfde70e9c3f851',
            'vite_bfca4d59638b8da52b7d74700d59bb666495f6baaf230b8b15',
            'vite_74630139fa3d47e65e63efba781b56d5a2bea820597bc73a75',
            'vite_4d49f23a4a2cbf6866788f84328181a7ee02c9fd9842e8f60c'
        ]);
    });

    it('test_getAddrsFromSeed', function () {
        let as = WalletHD.getAddrsFromMnemonic('horn equal mystery success pride regret renew great witness hire man moon', 10, 'm/44\'/666666\'');
        let arr = [];
        as.forEach((item)=>{
            arr.push(item.hexAddr);
        });

        assert.deepEqual(arr, [
            'vite_0c27e431629b49fad8fcc87d33123dd70d6a73657c60cd8cb4',
            'vite_9e406fd75463a232f00f5c3bf51d0c49561d6c2ec119ce3f3c',
            'vite_bf56e382349867441f1f52ab55661c0ff0786204444fa10ee2',
            'vite_fb61bb0a65ac4141aeddfa247c808ded1ab4ea53ef10eef644',
            'vite_8cf0c68cea2988d14e30d133baa2b279ccc4b4011263d74bd0',
            'vite_25b07769690f8e897e0289907a7117d063614c7fe698648e21',
            'vite_aec7c83a130617fef863723cf731aed0426d45a2227268b1e0',
            'vite_00b2aed4102dfc97b6a322c73ae1158d024fe5444213ac1a10',
            'vite_889ba379a0390843fd18f8f89ed8ae268bd2bfdbb48f96c57a',
            'vite_97692d152d969bddaedaddcd58baa996fe913d912b2875c35c'
        ]);
    });
});
