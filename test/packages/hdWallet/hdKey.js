const bip39 = require('bip39');
const assert = require('assert');

import {
    createMnemonics, validateMnemonics,
    getMnemonicsFromEntropy, getEntropyFromMnemonics,
    getSeedFromMnemonics, createSeed,
    ROOT_PATH, getPath,
    deriveKeyPairByPath, deriveKeyPair
} from '../../../src/hdWallet/hdKey.ts';

describe('language test', function () {
    const entropy = 'e27b674dd7cc3b4ce67ad38d18bae592871dc7e4a7384cdcc07e1a3f9d3dcfca';

    const langList = [ {
        lang: 'english',
        m: 'tiny swamp square question senior please okay foil minimum shift ride celery impact token myth train error toward buzz crucial what page dish empower',
        seedHex: 'df950b950344e2341c4d76da9c87cefc0605b624fc1a93bc6548aad075b3c1c93d6df27aa7177f9d1ff64b55f2ed15f70b600298e3e88721d2246553634e98f3'
    }, {
        lang: 'japanese',
        m: 'まわす　ほあん　ふさい　にあう　はっきり　とおる　つつじ　さくひん　だむる　はめつ　ねまき　おばさん　ずほう　みかん　ちいき　むいか　こうつう　みほん　おうふく　きどう　りりく　でこぼこ　くれる　けんすう',
        seedHex: '105f8de5c554d67f38f305ec5d7e65ab54c34de406b4ba35312b1e1c11764e75474eec92a95a802c1d189789923937cf56fa8753bdf892210f30ae65bb790316'
    }, {
        lang: 'korean',
        m: '토마토 취향 천천히 자동 종업원 이발소 왜냐하면 비둘기 여든 주장 전문 날짜 수박 통화 영양 팩스 백성 판결 기능 독일 홍차 원숭이 몸속 발생',
        seedHex: '5cc3a8623456ad338e703b9fa8fd348af720e6e1f8ab78b8d83a1384c4a484c2524160355d8efa3c1ad24de029acb1afabb753d3498c48075912c3fb9e3fb640'
    }, {
        lang: 'italian',
        m: 'tara stacco sobbalzo rastrello scala possesso parola gallina oblio scivolo risvolto cane levigato tecnico organico tiro evoluto tettoia bozzolo crisi vigilia petalo dogma esanime',
        seedHex: '46faa580cdf17fdfd29c5694b34d1e92095a9479e37a68180469d063944772c70154ca5ee7cf1412af15a221733461391243a78fc40a4587f10bfeed29c42a1e'
    }, {
        lang: 'chinese_simplified',
        m: '症 佛 眉 伍 砖 徒 恢 频 尚 详 兼 认 亮 杰 谷 焰 够 冶 先 般 戈 坡 失 充',
        seedHex: 'f4e2995616d286faa45d2d171525d2c24ef37799b83844dbdf25eb70f98eb3192edb958ac340e99909f55f5f54e345e047316802a28aad46f6fe6753a57028ec'
    }, {
        lang: 'chinese_traditional',
        m: '症 佛 眉 伍 磚 徒 恢 頻 尚 詳 兼 認 亮 傑 谷 焰 夠 冶 先 般 戈 坡 失 充',
        seedHex: '3d580509ec61af79e970af889840c6dd937937af8904a7b2cf8fb6b068312895eb0807674de0dc708fc075ed0838a7c3e959f1671aed9df81f5c13af528a0b67'
    }, {
        lang: 'spanish',
        m: 'tatuaje sopa satán pena recreo oruga neutro finito mercado reja poste burro imperio teléfono monja tierra enero testigo bocina cocción vida obtener dardo edad',
        seedHex: '26e1d7631f436403047a0d35c5d560e64b6224f5db741b9b54c4ddea1569f7283837fb9bd483957db7eb5a4d2b9e4d9dadcbd1744f17474f853adc50d4ebe6c0'
    } ];

    langList.forEach(({ lang, m, seedHex }) => {
        describe(lang, function () {
            const wordlist = bip39.wordlists[lang];
            const mnemonic = bip39.entropyToMnemonic(entropy, wordlist);
            const seed = bip39.mnemonicToSeedSync(mnemonic);

            const myMnemonic = getMnemonicsFromEntropy(entropy, wordlist);
            const myEntropy = getEntropyFromMnemonics(mnemonic, wordlist);
            const mySeed = getSeedFromMnemonics(mnemonic, '', wordlist);
            const myValidateRes = validateMnemonics(myMnemonic, wordlist);

            it('createMnemonics', function () {
                const tmpM = createMnemonics(256, wordlist);
                assert.equal(true, bip39.validateMnemonic(tmpM, wordlist));
            });
            it('createSeed', function () {
                const tmp = createSeed(256, '', wordlist);
                assert.equal(true, bip39.validateMnemonic(tmp.mnemonic, wordlist));

                const tmpS = bip39.mnemonicToSeedSync(tmp.mnemonic);
                assert.deepEqual(tmpS, tmp.seed);
                assert.deepEqual(tmpS.toString('hex'), tmp.seedHex);
            });
            it('mnemonic real', function () {
                assert.equal(mnemonic, m);
            });
            it('getMnemonicsFromEntropy', function () {
                assert.equal(mnemonic, myMnemonic);
            });
            it('validateMnemonics', function () {
                assert.equal(myValidateRes, true);
            });
            it('getEntropyFromMnemonics', function () {
                assert.equal(entropy, myEntropy);
            });
            it('getSeedFromMnemonics seed', function () {
                assert.deepEqual(seed, mySeed.seed);
            });
            it('getSeedFromMnemonics seedHex', function () {
                assert.equal(seed.toString('hex'), mySeed.seedHex);
            });
            it('seedHex real', function () {
                assert.deepEqual(seedHex, mySeed.seedHex);
            });
        });
    });
});

describe('password test', function () {
    describe('mnemonic 12 password', function () {
        const mnemonic = 'banner bar shiver budget window cart snake control venue lonely marine print';
        const passphrase = '123456';

        const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
        const seedHex = seed.toString('hex');
        const myS = getSeedFromMnemonics(mnemonic, passphrase);
        it('seed real', function () {
            assert.equal(seedHex, '21a107743295dfec434254374fdbb43ee4701fa699acce6d1810ddae7d356aeeb10bedc09358e5cf8860fc16d225c422f0a44a708267bf0d2bbbbcd3bd299a49');
        });
        it('seed', function () {
            assert.deepEqual(seed, myS.seed);
        });
        it('seed_hex', function () {
            assert.equal(seedHex, myS.seedHex);
        });
    });
    describe('mnemonic 24 password', function () {
        const mnemonic = 'hazard kind issue draw bottom foot net join train elbow census present blind assume suit vague vital crack slab material pill census actress panda';
        const passphrase = '123456';

        const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
        const seedHex = seed.toString('hex');
        const myS = getSeedFromMnemonics(mnemonic, passphrase);
        it('seed real', function () {
            assert.equal(seedHex, '4e0f10e63407ba168ce6c504631b1d405b121406746b50c7d4831b150985641b867a6edccefaf77554221c44f89bbc0e47038114f50de9f1ffaefbd50c3d6b29');
        });
        it('seed', function () {
            assert.deepEqual(seed, myS.seed);
        });
        it('seed_hex', function () {
            assert.equal(seedHex, myS.seedHex);
        });
    });
});

describe('path', function () {
    it('getPath', function () {
        assert.equal(`${ ROOT_PATH }/0'`, getPath('0'));
    });
});

describe('deriveKeyPair', function () {
    it('keypair = keyPairPath', function () {
        const seed = '21a107743295dfec434254374fdbb43ee4701fa699acce6d1810ddae7d356aeeb10bedc09358e5cf8860fc16d225c422f0a44a708267bf0d2bbbbcd3bd299a49';
        const index = 1;
        const path = getPath(index);

        const keyPair = deriveKeyPair(seed, index);
        const keyPairPath = deriveKeyPairByPath(seed, path);
        assert.deepEqual(keyPair, keyPairPath);
    });
});
