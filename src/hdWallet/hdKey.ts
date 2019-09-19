const bip39 = require('bip39');
const hd = require('@sisi/ed25519-blake2b-hd-key');

import { checkParams } from '~@vite/vitejs-utils';
import Wallet from './hdWallet';

export const ROOT_PATH = 'm/44\'/666666\'';


export function createMnemonic(bits: number = 256, wordlist: Array<String> = bip39.wordlists.EN) {
    const err = checkParams({ bits, wordlist }, [ 'bits', 'wordlist' ]);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.generateMnemonic(bits, null, wordlist);
}

export function validateMnemonic(mnemonic: String, wordlist: Array<String> = bip39.wordlists.EN) {
    return mnemonic && bip39.validateMnemonic(mnemonic, wordlist);
}

export function getEntropyFromMnemonic(mnemonic: String, wordlist: Array<String> = bip39.wordlists.EN): String {
    const err = checkParams({ mnemonic, wordlist }, [ 'mnemonic', 'wordlist' ], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.mnemonicToEntropy(mnemonic, wordlist);
}

export function getSeedFromMnemonic(mnemonic: String, wordlist: Array<String> = bip39.wordlists.EN, pwd: String = '') {
    const err = checkParams({ mnemonic, wordlist }, [ 'mnemonic', 'wordlist' ], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic, pwd).toString('hex');
    const seedHex = seed.toString('hex');
    return { seed, seedHex };
}

export function createSeed(bits: number = 256, wordlist: Array<String> = bip39.wordlists.EN, pwd: String = '') {
    const mnemonic = createMnemonic(bits, wordlist);
    const { seed, seedHex } = getSeedFromMnemonic(mnemonic, wordlist, pwd);
    return { mnemonic, seed, seedHex };
}

export function getMnemonicFromEntropy(entropy: String, wordlist: Array<String> = bip39.wordlists.EN): String {
    const err = checkParams({ entropy }, ['entropy']);
    if (err) {
        throw new Error(err.message);
    }
    return bip39.entropyToMnemonic(entropy, wordlist);
}

export function getPath(index: number): String {
    return `${ ROOT_PATH }/${ index }\'`;
}

export function deriveKeyPairByPath(seed, path): { privateKey: Buffer; publicKey: Buffer; } {
    const { key } = hd.derivePath(path, seed);
    return hd.getPublicKey(key);
}

export function deriveKeyPair(seed, index: number): { privateKey: Buffer; publicKey: Buffer; } {
    const path = getPath(index);
    return deriveKeyPairByPath(seed, path);
}

export function createWallet(bits: number = 256, wordlist: Array<String> = bip39.wordlists.EN, pwd: String = '') {
    const mnemonic = createMnemonic(bits, wordlist);
    return new Wallet(mnemonic, wordlist, pwd);
}

export function getWallet(mnemonic: String, wordlist: Array<String> = bip39.wordlists.EN, pwd: String = '') {
    const err = checkParams({ mnemonic, wordlist }, [ 'mnemonic', 'wordlist' ], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }
    return new Wallet(mnemonic, wordlist, pwd);
}
