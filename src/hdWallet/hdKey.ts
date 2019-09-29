const bip39 = require('bip39');
const hd = require('@sisi/ed25519-blake2b-hd-key');

import { checkParams } from '~@vite/vitejs-utils';

import { Hex } from './type';

export const ROOT_PATH = 'm/44\'/666666\'';


export function createMnemonic(bits: number = 256, wordlist: Array<String> = bip39.wordlists.EN): String {
    const err = checkParams({ bits, wordlist }, [ 'bits', 'wordlist' ]);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.generateMnemonic(bits, null, wordlist);
}

export function validateMnemonic(mnemonic: String, wordlist: Array<String> = bip39.wordlists.EN): Boolean {
    return mnemonic && bip39.validateMnemonic(mnemonic, wordlist);
}

export function getEntropyFromMnemonic(mnemonic: String, wordlist: Array<String> = bip39.wordlists.EN): Hex {
    const err = checkParams({ mnemonic, wordlist }, [ 'mnemonic', 'wordlist' ], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.mnemonicToEntropy(mnemonic, wordlist);
}

export function getSeedFromMnemonic(mnemonic: String, pwd: String = '', wordlist: Array<String> = bip39.wordlists.EN): {
    seed: Buffer;
    seedHex: Hex;
} {
    const err = checkParams({ mnemonic, wordlist }, [ 'mnemonic', 'wordlist' ], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    const seed: Buffer = bip39.mnemonicToSeedSync(mnemonic, pwd);
    const seedHex: Hex = seed.toString('hex');
    return { seed, seedHex };
}

export function createSeed(bits: number = 256, pwd: String = '', wordlist: Array<String> = bip39.wordlists.EN): {
    mnemonic: String;
    seed: Buffer;
    seedHex: Hex;
} {
    const mnemonic = createMnemonic(bits, wordlist);
    const { seed, seedHex } = getSeedFromMnemonic(mnemonic, pwd, wordlist);
    return { mnemonic, seed, seedHex };
}

export function getMnemonicFromEntropy(entropy: Hex, wordlist: Array<String> = bip39.wordlists.EN): String {
    const err = checkParams({ entropy }, ['entropy']);
    if (err) {
        throw new Error(err.message);
    }
    return bip39.entropyToMnemonic(entropy, wordlist);
}

export function getPath(index: number): String {
    return `${ ROOT_PATH }/${ index }\'`;
}

export function deriveKeyPairByPath(seed: Hex, path: String): { privateKey: Buffer; publicKey: Buffer; } {
    const { key } = hd.derivePath(path, seed);
    return hd.getPublicKey(key);
}

export function deriveKeyPair(seed: Hex, index: number): { privateKey: Buffer; publicKey: Buffer; } {
    const path = getPath(index);
    return deriveKeyPairByPath(seed, path);
}
