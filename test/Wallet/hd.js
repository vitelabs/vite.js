const bip39 = require('bip39');
import hd from '../../src/Wallet/hdKey';
import utils from '../../src/utils/index';
import libUtils from '../../libs/utils/index';

const assert = require('assert');

describe('Wallet_HD', function () {
    let mnemonic = 'horn equal mystery success pride regret renew great witness hire man moon';

    describe('api', function() {
        let entropy = bip39.mnemonicToEntropy(mnemonic);
        let seedHex = bip39.mnemonicToSeedHex(mnemonic);
        let master = hd.getMasterKeyFromSeed(seedHex);

        // let { key, chainCode} = hd.derivePath('m/44\'/999\'', seedHex);
        // console.log(key.toString('hex'));
        // console.log(chainCode.toString('hex'));

        let { key, chainCode} = hd.derivePath('m/44\'/999\'/0\'', seedHex);
        console.log(key.toString('hex'));
        console.log(chainCode.toString('hex'));

        let {
            publicKey, privateKey
        } = hd.getPublicKey(key);
        console.log(libUtils.bytesToHex(publicKey));
        console.log(libUtils.bytesToHex(privateKey));

        console.log( utils.newHexAddr(libUtils.bytesToHex(privateKey)) );

        it('entropy', function () {
            assert.equal(entropy, '6d898249ec2aa9696d8b31fcad821b47');
        });
    
        it('seed_hex', function () {
            assert.equal(seedHex, '899b4ee8ce42e2c090f28d3523279e2bdfe6b868b5742f2398db9af26e854d4457f61410ad0dd292e6db75e65efcb2d341ad5e330abb683c60bf7d1c793c463f');
        });

        it('primary_key_hex', function () {
            assert.equal(master.key.toString('hex'), 'f84cdd034c4de6ed4eac92baf99b4d44abb1d55d1e0056ff3a534612069b1a13');
        });
    });
});
