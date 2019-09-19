const bip39 = require('bip39');
const assert = require('assert');

import { createAddress, getId, getEntropyFromMnemonic, getMnemonicFromEntropy, getAddrsFromMnemonic, getAddrFromMnemonic } from '../../src/hdAddr/index.ts';

describe('language test', function () {
    const entropy = 'e27b674dd7cc3b4ce67ad38d18bae592871dc7e4a7384cdcc07e1a3f9d3dcfca';

    describe('english', function () {
        const mnemonic = bip39.entropyToMnemonic(entropy);
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        it('mnemonic', function () {
            const m = 'tiny swamp square question senior please okay foil minimum shift ride celery impact token myth train error toward buzz crucial what page dish empower';
            assert.equal(mnemonic, m);
        });

        it('seed', function () {
            const hex = 'df950b950344e2341c4d76da9c87cefc0605b624fc1a93bc6548aad075b3c1c93d6df27aa7177f9d1ff64b55f2ed15f70b600298e3e88721d2246553634e98f3';
            assert.equal(seed.toString('hex'), hex);
        });
    });

    describe('japanese', function () {
        const mnemonic = getMnemonicFromEntropy(entropy, bip39.wordlists.JA);
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        it('mnemonic', function () {
            const m = 'まわす　ほあん　ふさい　にあう　はっきり　とおる　つつじ　さくひん　だむる　はめつ　ねまき　おばさん　ずほう　みかん　ちいき　むいか　こうつう　みほん　おうふく　きどう　りりく　でこぼこ　くれる　けんすう';
            assert.equal(mnemonic, m);
        });

        it('seed', function () {
            const hex = '105f8de5c554d67f38f305ec5d7e65ab54c34de406b4ba35312b1e1c11764e75474eec92a95a802c1d189789923937cf56fa8753bdf892210f30ae65bb790316';
            assert.equal(seed.toString('hex'), hex);
        });
    });

    describe('korean', function () {
        const mnemonic = getMnemonicFromEntropy(entropy, bip39.wordlists.korean);
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        it('mnemonic', function () {
            const m = '토마토 취향 천천히 자동 종업원 이발소 왜냐하면 비둘기 여든 주장 전문 날짜 수박 통화 영양 팩스 백성 판결 기능 독일 홍차 원숭이 몸속 발생';
            assert.equal(mnemonic, m);
        });

        it('seed', function () {
            const hex = '5cc3a8623456ad338e703b9fa8fd348af720e6e1f8ab78b8d83a1384c4a484c2524160355d8efa3c1ad24de029acb1afabb753d3498c48075912c3fb9e3fb640';
            assert.equal(seed.toString('hex'), hex);
        });
    });

    describe('italian', function () {
        const mnemonic = getMnemonicFromEntropy(entropy, bip39.wordlists.italian);
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        it('mnemonic', function () {
            const m = 'tara stacco sobbalzo rastrello scala possesso parola gallina oblio scivolo risvolto cane levigato tecnico organico tiro evoluto tettoia bozzolo crisi vigilia petalo dogma esanime';
            assert.equal(mnemonic, m);
        });

        it('seed', function () {
            const hex = '46faa580cdf17fdfd29c5694b34d1e92095a9479e37a68180469d063944772c70154ca5ee7cf1412af15a221733461391243a78fc40a4587f10bfeed29c42a1e';
            assert.equal(seed.toString('hex'), hex);
        });
    });

    describe('chinese_simplified', function () {
        const mnemonic = getMnemonicFromEntropy(entropy, bip39.wordlists.chinese_simplified);
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        it('mnemonic', function () {
            const m = '症 佛 眉 伍 砖 徒 恢 频 尚 详 兼 认 亮 杰 谷 焰 够 冶 先 般 戈 坡 失 充';
            assert.equal(mnemonic, m);
        });

        it('seed', function () {
            const hex = 'f4e2995616d286faa45d2d171525d2c24ef37799b83844dbdf25eb70f98eb3192edb958ac340e99909f55f5f54e345e047316802a28aad46f6fe6753a57028ec';
            assert.equal(seed.toString('hex'), hex);
        });
    });

    describe('chinese_traditional', function () {
        const mnemonic = getMnemonicFromEntropy(entropy, bip39.wordlists.chinese_traditional);
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        it('mnemonic', function () {
            const m = '症 佛 眉 伍 磚 徒 恢 頻 尚 詳 兼 認 亮 傑 谷 焰 夠 冶 先 般 戈 坡 失 充';
            assert.equal(mnemonic, m);
        });

        it('seed', function () {
            const hex = '3d580509ec61af79e970af889840c6dd937937af8904a7b2cf8fb6b068312895eb0807674de0dc708fc075ed0838a7c3e959f1671aed9df81f5c13af528a0b67';
            assert.equal(seed.toString('hex'), hex);
        });
    });

    describe('spanish', function () {
        const mnemonic = getMnemonicFromEntropy(entropy, bip39.wordlists.spanish);
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        it('mnemonic', function () {
            const m = 'tatuaje sopa satán pena recreo oruga neutro finito mercado reja poste burro imperio teléfono monja tierra enero testigo bocina cocción vida obtener dardo edad';
            assert.equal(mnemonic, m);
        });

        it('seed', function () {
            const hex = '26e1d7631f436403047a0d35c5d560e64b6224f5db741b9b54c4ddea1569f7283837fb9bd483957db7eb5a4d2b9e4d9dadcbd1744f17474f853adc50d4ebe6c0';
            assert.equal(seed.toString('hex'), hex);
        });
    });
});

describe('password test', function () {
    describe('mnemonic 12 password', function () {
        const mnemonic = 'banner bar shiver budget window cart snake control venue lonely marine print';
        const entropy = getEntropyFromMnemonic(mnemonic);

        it('entropy', function () {
            assert.equal(entropy, '12424f188ecfb64633497bf270762055');
        });

        const passphrase = '123456';
        const seedHex = bip39.mnemonicToSeedSync(mnemonic, passphrase).toString('hex');
        it('seed_hex', function () {
            assert.equal(seedHex, '21a107743295dfec434254374fdbb43ee4701fa699acce6d1810ddae7d356aeeb10bedc09358e5cf8860fc16d225c422f0a44a708267bf0d2bbbbcd3bd299a49');
        });
    });
    describe('mnemonic 24 password', function () {
        const mnemonic = 'hazard kind issue draw bottom foot net join train elbow census present blind assume suit vague vital crack slab material pill census actress panda';
        const entropy = getEntropyFromMnemonic(mnemonic);

        it('entropy', function () {
            assert.equal(entropy, '69ef51daa131a4b5e52bc1e708e49555017c1bf64785f5063b2bc47a4c4a80b4');
        });

        const passphrase = '123456';
        const seedHex = bip39.mnemonicToSeedSync(mnemonic, passphrase).toString('hex');
        it('seed_hex', function () {
            assert.equal(seedHex, '4e0f10e63407ba168ce6c504631b1d405b121406746b50c7d4831b150985641b867a6edccefaf77554221c44f89bbc0e47038114f50de9f1ffaefbd50c3d6b29');
        });
    });
});

describe('function', function () {
    it('getAddrsFromMnemonic', function () {
        const as = getAddrsFromMnemonic('horn equal mystery success pride regret renew great witness hire man moon');
        const arr = [];
        as.forEach(item => {
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

    const addrObj = createAddress();

    it('createAddress test mnemonic', () => {
        assert(addrObj.mnemonic.split(' ').length, 24);
    });

    it('createAddress test entropy', () => {
        assert(addrObj.entropy.length, 512);
    });

    it('createAddress test addr 0', () => {
        const addr0 = getAddrFromMnemonic(addrObj.mnemonic);
        assert(addrObj.addr, addr0);
    });

    it('createAddress getId', () => {
        assert(getId(addrObj.mnemonic), addrObj.id);
    });
});

