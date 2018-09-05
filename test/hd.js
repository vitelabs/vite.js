const assert = require('assert');
const bip39 = require('bip39');

import hd from '../libs/hd';
import utils from '../src/utils';
import libUtils from '../libs/utils';

const path = 'm/44\'/999\'/';

describe('mnemonic 12', function() {
    let mnemonic = 'horn equal mystery success pride regret renew great witness hire man moon';

    let entropy = bip39.mnemonicToEntropy(mnemonic);
    it('entropy', function () {
        assert.equal(entropy, '6d898249ec2aa9696d8b31fcad821b47');
    });

    let seedHex = bip39.mnemonicToSeedHex(mnemonic);
    it('seed_hex', function () {
        assert.equal(seedHex, '899b4ee8ce42e2c090f28d3523279e2bdfe6b868b5742f2398db9af26e854d4457f61410ad0dd292e6db75e65efcb2d341ad5e330abb683c60bf7d1c793c463f');
    });

    let master = hd.getMasterKeyFromSeed(seedHex);
    it('primary_key_hex', function () {
        assert.equal(master.key.toString('hex'), 'f84cdd034c4de6ed4eac92baf99b4d44abb1d55d1e0056ff3a534612069b1a13');
    });

    let Accounts = [
        {
            key: '4495f8ac7466a4bad825d3c1741e514baa41ce7c413bedcdd24c138e104b6934',
            hexAddr: 'vite_4475f6dd2fa87d372dbad4f708e5c389a6856b53c183cf5bb6'
        },{
            key: '66655a25a6713e39be5224dd7903649c4a7ca328b3e563d44875bd138ce612c9',
            hexAddr: 'vite_6e149f83f468b51c56b50078dec1898bfaa33b10f06c3a6309'
        },{
            key: 'eef125116fc40628d67f5b89a7ce96a34554432f7ff697f2beb92025a1c6522e',
            hexAddr: 'vite_0a1a68984db218ff672ce359c6ab9c4dbbd3e0c363ec234cc7'
        },{
            key: '1abe5c297e1b32b3521538e61108602c75a50887da39720feaf8949fb953e213',
            hexAddr: 'vite_07848cf142eb84d0ac6ba547773cfbcde3fe904b59b09542d5'
        },{
            key: 'da66f0f3a2ecf51ee0983e99d73fce990b5526135149c4436f4c3d2d7f7a99c7',
            hexAddr: 'vite_91a8a48bf824209ee38e90f0154014083bb2e85f17a9c88184'
        },{
            key: '3eaa5490e0d5980511219067a63d5572e27e671a9d33d63efc540b2c2485d057',
            hexAddr: 'vite_21b29b8321953949a54daa747f705944888e98e3460a6f875a'
        },{
            key: 'c245393ead655eda745515ab9c52e81a739d2373b89a1b1fda41b3d43675868a',
            hexAddr: 'vite_946b161b8c6dca7883ce8e9f5a36b8c3091014a08fe7b988ac'
        },{
            key: '6f96308b64e03858b8f0a2b00e5d83b91f38418b7c4cc31bfcf1dcf7e4498f32',
            hexAddr: 'vite_b300b5f2511a4261314a0a5f5bca8bab3a211234f846ed3361'
        },{
            key: '9af654ce607d6b89c89b4d1128b421fbbb320a1e4c58299917645359b3e0e265',
            hexAddr: 'vite_49a8f97fabc63604ef7c9d5d03eddb11cc45e1a3888c914373'
        },{
            key: '1463cbb2f8aa501f6948bee523df0f3309305fc0a92e9f730fe02be38cff78bb',
            hexAddr: 'vite_b0a24240859b78896bd3ff7618d6c1a829b4b673e996ee6f67'
        }
    ];

    verification(Accounts, seedHex);
});

describe('mnemonic 12 password', function() {
    let mnemonic = 'banner bar shiver budget window cart snake control venue lonely marine print';

    let entropy = bip39.mnemonicToEntropy(mnemonic);
    it('entropy', function () {
        assert.equal(entropy, '12424f188ecfb64633497bf270762055');
    });

    let passphrase = '123456';
    let seedHex = bip39.mnemonicToSeedHex(mnemonic, passphrase);
    it('seed_hex', function () {
        assert.equal(seedHex, '21a107743295dfec434254374fdbb43ee4701fa699acce6d1810ddae7d356aeeb10bedc09358e5cf8860fc16d225c422f0a44a708267bf0d2bbbbcd3bd299a49');
    });

    let master = hd.getMasterKeyFromSeed(seedHex);
    it('primary_key_hex', function () {
        assert.equal(master.key.toString('hex'), '12e93115ee269dd47396451d19352a89c839147fa5a1c917f960507a3e216cae');
    });

    let Accounts = [
        {
            key: '75fc5363932536e25bd739909b8a70f7e84b3ff7932770ff73f8c787610f2c70',
            hexAddr: 'vite_0967a69748656ef06b8a8399fff3adc29afb5a6c4a78ccd6d0'
        },{
            key: '5653d2ffe2e35e38594dab93f73ded8eca6e29ee504c6b80bb0889abdbcf18ee',
            hexAddr: 'vite_e1ab2bb3ef0d8de1fec7f75529a92ef2b1a5d35be3a10f8500'
        },{
            key: 'a30e506f4d1a1870cae817b8bf4d2596a4d9dc041f8951ed011a2e3498a09eb4',
            hexAddr: 'vite_68482757b2a41b6e9a8cc5bdaca30c45fa36347f8be18331d5'
        },{
            key: '916cbc771c9d298434100fac6041e197c0204ef808939c27a0050853d0a96aeb',
            hexAddr: 'vite_c72e70709d1075df7b05874fe462046e09794fc3905e8412d4'
        },{
            key: '8d36da4ecb473b0405c53e243e78815eb9d82e0683de77d7ff5bba62c9ccfe13',
            hexAddr: 'vite_266c5eaf34abfbbe13bbde510985adc5920b12cb92545120e2'
        },{
            key: 'c71cc9d1f88617b134ff6d5cfe461712bf16a4e17beceb9153cd7cd5d36176fe',
            hexAddr: 'vite_34fbeb6a677a36cb2864ff532b17f106e223c895bee8c47644'
        },{
            key: '1efb9f7a8720b39d9c25cf626ef84265d64ed219038c1927d910d61690830ea8',
            hexAddr: 'vite_05d6274dc9a2b8e0e79ee79661ceac31e8d347d128d1a4f17c'
        },{
            key: '3f547c29642273566102a68446eaea321f1d72de817385ae57853f65e29c012f',
            hexAddr: 'vite_7a0ce43e2bdaed6b068c8390bcd114e925de115e1c6574621b'
        },{
            key: '5e0257538730ab10d28acbaddf4cc3a30f3f7393c71b1bb9eefdf4ef2de330c3',
            hexAddr: 'vite_89ba31e441b96e8f6b69c51c81c2d9311d76d674138ee594ae'
        },{
            key: 'ab71e9fdb86492ab881db56229a1bdaa4faf39780e86b240bc8d18bf6867d339',
            hexAddr: 'vite_fc77af995dccd5837b5c0f77e05c4f3123b6a5c3e7071feafa'
        }
    ];

    verification(Accounts, seedHex);
});

describe('mnemonic 24', function() {
    let mnemonic = 'truck female picnic cactus mountain around keen letter brass assume night air shallow predict gap scheme again moon drive slender tone coin stairs seven';

    let entropy = bip39.mnemonicToEntropy(mnemonic);
    it('entropy', function () {
        assert.equal(entropy, 'e92a9e90900908185e6c041b21be5602bc515357d60504b1f10d65ae445af516');
    });

    let seedHex = bip39.mnemonicToSeedHex(mnemonic);
    it('seed_hex', function () {
        assert.equal(seedHex, 'f3ceb491b91476cc604e7fe57fd30483aa4611c705d7ef0591bd3a1ff23071c2ce3d88f8959cbafb9fd99d079b91ea863704c9d5447a83ad09661f3c1db33d60');
    });

    let master = hd.getMasterKeyFromSeed(seedHex);
    it('primary_key_hex', function () {
        assert.equal(master.key.toString('hex'), '442bdb351f58561071e8f65d2df1b4da996ee4e88fff65f39818beec5ff9d09b');
    });

    let Accounts = [
        {
            key: '0b5e0cf03a21855fa19be2c410b8acaedb73780bb60b84eee81a6ff1ca540036',
            hexAddr: 'vite_07bd5cef6a26faf677f77ccc17a79b0d4ecbdc68953b3cf34d'
        },{
            key: '5bf13f53a87503b42040c5d6b764fb63e6ececf5d60c7947304b842b611ca753',
            hexAddr: 'vite_b09b8401eec626ea6ff2b95493833b910ccf7ea9216f6cca67'
        },{
            key: '3b72bbedf5d804fa3b03ddb6c8f53bd425932d581ebcd95d3b62cccd259d7cea',
            hexAddr: 'vite_d05aa780b45f93d3959b0ad552921e5da8a08ffb44002e12f7'
        },{
            key: 'db82111b2790570f20d396637e15076f893d4dda301f50acf7748fcfd3adf37b',
            hexAddr: 'vite_9e465ef2e49b9d227cf7ef9f7b56a0c24f37cf6245357388d2'
        },{
            key: '840c36dba9a3b336a3de726ff99b71735ccea65ec55c970cdfb451b391728477',
            hexAddr: 'vite_004c3c0a712775cb513b0d4b4dfe2b742ea49ce8796c0eae80'
        },{
            key: '0c3db6d8820a9bd82b1ebf7c068fc92e19c3e23f9553e09ee68b58016359f520',
            hexAddr: 'vite_af6fdd10ed33d0317b21cf11f3df0bf9f79948790d36b9e2e8'
        },{
            key: '32adde9f1337580d79ff7ff4e6a857d579d2c8f77bf697776c484abbe0abf9e4',
            hexAddr: 'vite_8fdb9d9af5251f73b0a82d18c48f185a3cf8bfde70e9c3f851'
        },{
            key: '630a022b4e0ee5582a25310ce5d1fc42a2051e4a318d619da2ffc3fa7ea4698d',
            hexAddr: 'vite_bfca4d59638b8da52b7d74700d59bb666495f6baaf230b8b15'
        },{
            key: '3fce9df84a7434a1ca03d3cceb6fcc26e0cb1d4599e705617b25f2c3971ebf27',
            hexAddr: 'vite_74630139fa3d47e65e63efba781b56d5a2bea820597bc73a75'
        },{
            key: '3ecd53c610e92bbfbf6c2ef591d05307104d756bddd93c15131fbb1e4a6e96c3',
            hexAddr: 'vite_4d49f23a4a2cbf6866788f84328181a7ee02c9fd9842e8f60c'
        }
    ];

    verification(Accounts, seedHex);
});

describe('mnemonic 24 password', function() {
    let mnemonic = 'hazard kind issue draw bottom foot net join train elbow census present blind assume suit vague vital crack slab material pill census actress panda';

    let entropy = bip39.mnemonicToEntropy(mnemonic);
    it('entropy', function () {
        assert.equal(entropy, '69ef51daa131a4b5e52bc1e708e49555017c1bf64785f5063b2bc47a4c4a80b4');
    });

    let passphrase = '123456';
    let seedHex = bip39.mnemonicToSeedHex(mnemonic, passphrase);
    it('seed_hex', function () {
        assert.equal(seedHex, '4e0f10e63407ba168ce6c504631b1d405b121406746b50c7d4831b150985641b867a6edccefaf77554221c44f89bbc0e47038114f50de9f1ffaefbd50c3d6b29');
    });

    let master = hd.getMasterKeyFromSeed(seedHex);
    it('primary_key_hex', function () {
        assert.equal(master.key.toString('hex'), '9b9d93c311ecb9740dff642f50875bd1c7eda4b2098c3e602f0802a3d2268173');
    });

    let Accounts = [
        {
            key: 'f609508a5088cb3c2ab0941350a598ec85b210fa950f7bc491aa7f1d142f1254',
            hexAddr: 'vite_d5823dbcfb2475c7284bcd3cb3e8c96e3f9125cb61bffc77bb'
        },{
            key: '2a3273f821d17b7d6780401ed97ef91636535914f3462449f3ca29cf93b47b9f',
            hexAddr: 'vite_cca9e13e87a2c99279cbe0ddbc16ac64e497639a56dfe543dd'
        },{
            key: '79fa6d3f9c1e668578b4be7306b115ece57d1705adcd5cea5511e393e7593d1e',
            hexAddr: 'vite_55e2ebe38ec92e5f992767b76e64613ebce15218134315982d'
        },{
            key: '58950726a07dad7df5d91636177e96227b3a7c8bc9d1416ae997bb7ac2ff99a4',
            hexAddr: 'vite_de672bf8cc345a6a8528208cd9a8c0e8a0b91866e2202ec0ed'
        },{
            key: '98ff3e5dfdcd1cb50bcffa402d0fb476e150d68072941994f31106a4f9854dea',
            hexAddr: 'vite_41d28a425019a6b41064aae3e2360f175f2acece8338765b6d'
        },{
            key: '054c492809b8592d64e672c185a1db14689e57e5bc8aa93db21dbad2602ce3a9',
            hexAddr: 'vite_e6bb986e377de0b4e32ba4cd958552d4328a54b2555d1880ba'
        },{
            key: '710cf134bf5a721ccf02991f719b22116f63daa26f8e8e6c2438fc75193c0eef',
            hexAddr: 'vite_a32863466f768ededdc926ca950bb92baeef756013be2649d5'
        },{
            key: 'd0e514866880455af169a6758863dbc0a0072b9ec4276ab7e40ea1a2d5eba025',
            hexAddr: 'vite_742d2268878d6477cb7483c614f543970515cc7ce78e811926'
        },{
            key: '4ef6382d87824591cd1154885d5a9b772703236af52f4061751274f5d8540876',
            hexAddr: 'vite_88e6fabb9127a74e6bd9b9d26a6e7a5df93152bb236b32ca77'
        },{
            key: '7a77514a13be9984047b26fa29a4150b619f6c9d936507ed67a398ad12004678',
            hexAddr: 'vite_6d2172f40360a50585acdf68cfed38f52f4612814be0383e13'
        }
    ];

    verification(Accounts, seedHex);
});

function verification(Accounts, seedHex) {
    for (let i=0; i<10; i++) {
        let currentPath = `${path}${i}\'`;
        let { key } = hd.derivePath(currentPath, seedHex);
        
        let { privateKey } = hd.getPublicKey(key);
        let hexAddr = utils.newHexAddr( libUtils.bytesToHex(privateKey) ).hexAddr;

        describe(currentPath, function() {
            it('key', function () {
                assert.equal(key.toString('hex'), Accounts[i].key);
            });
            it('addr', function () {
                assert.equal(hexAddr, Accounts[i].hexAddr);
            });
        });
    }
}
