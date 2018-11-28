const assert = require('assert');
import {getAddrsFromMnemonic} from '../../src/Wallet/address';

describe('Wallet_Address', function () {
    it('test_getAddrsFromMnemonic_1', function () {
        let mnemonic = 'truck female picnic cactus mountain around keen letter brass assume night air shallow predict gap scheme again moon drive slender tone coin stairs seven';

        let as = getAddrsFromMnemonic(mnemonic, 10, 'm/44\'/999\'');
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

    let mnemonic = 'horn equal mystery success pride regret renew great witness hire man moon';

    it('test_getAddrsFromMnemonic_2', function () {
        let as = getAddrsFromMnemonic(mnemonic, 10, 'm/44\'/999\'');
        let arr = [];
        as.forEach((item)=>{
            arr.push(item.hexAddr);
        });

        assert.deepEqual(arr, [
            'vite_4475f6dd2fa87d372dbad4f708e5c389a6856b53c183cf5bb6',
            'vite_6e149f83f468b51c56b50078dec1898bfaa33b10f06c3a6309',
            'vite_0a1a68984db218ff672ce359c6ab9c4dbbd3e0c363ec234cc7',
            'vite_07848cf142eb84d0ac6ba547773cfbcde3fe904b59b09542d5',
            'vite_91a8a48bf824209ee38e90f0154014083bb2e85f17a9c88184',
            'vite_21b29b8321953949a54daa747f705944888e98e3460a6f875a',
            'vite_946b161b8c6dca7883ce8e9f5a36b8c3091014a08fe7b988ac',
            'vite_b300b5f2511a4261314a0a5f5bca8bab3a211234f846ed3361',
            'vite_49a8f97fabc63604ef7c9d5d03eddb11cc45e1a3888c914373',
            'vite_b0a24240859b78896bd3ff7618d6c1a829b4b673e996ee6f67'
        ]);
    });

    it('test_getAddrsFromSeed', function () {
        let as = getAddrsFromMnemonic(mnemonic, 10, 'm/44\'/666666\'');
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
