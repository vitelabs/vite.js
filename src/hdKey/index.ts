const bip39 = require('bip39');
const hd = require('@sisi/ed25519-blake2b-hd-key');

import { checkParams } from '~@vite/vitejs-utils';

const ROOT_PATH = 'm/44\'/666666\'';


export function createMnemonic(bits: number = 256, wordlist: Array<String> = bip39.wordlists.EN) {
    const err = checkParams({ bits, wordlist }, [ 'bits', 'wordlist' ]);
    if (err) {
        throw new Error(err.message);
    }

    const mnemonic = bip39.generateMnemonic(bits, null, wordlist);
    const entropy = bip39.mnemonicToEntropy(mnemonic, wordlist);

    return { mnemonic, entropy };
}

export function validateMnemonic(mnemonic: string, wordlist: Array<String> = bip39.wordlists.EN) {
    return mnemonic && bip39.validateMnemonic(mnemonic, wordlist);
}

export function getEntropyFromMnemonic(mnemonic: string, wordlist: Array<String> = bip39.wordlists.EN): string {
    const err = checkParams({ mnemonic, wordlist }, [ 'mnemonic', 'wordlist' ], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.mnemonicToEntropy(mnemonic, wordlist);
}

export function getSeedFromMnemonic(mnemonic: string, wordlist: Array<String> = bip39.wordlists.EN, pwd: string = '') {
    const entropy = getEntropyFromMnemonic(mnemonic, wordlist);
    const seed = bip39.mnemonicToSeedSync(mnemonic, pwd).toString('hex');
    const seedHex = seed.toString('hex');
    return { entropy, seed, seedHex };
}

export function createSeed(bits: number = 256, wordlist: Array<String> = bip39.wordlists.EN, pwd: string = '') {
    const { mnemonic } = createMnemonic(bits, wordlist);
    const { entropy, seed, seedHex } = getSeedFromMnemonic(mnemonic, wordlist, pwd);
    return { mnemonic, entropy, seed, seedHex };
}

export function getMnemonicFromEntropy(entropy: string, wordlist: Array<String> = bip39.wordlists.EN): string {
    const err = checkParams({ entropy }, ['entropy']);
    if (err) {
        throw new Error(err.message);
    }
    return bip39.entropyToMnemonic(entropy, wordlist);
}

export function getRootPath() {
    return ROOT_PATH;
}

export function getPath(index: number): string {
    return `${ ROOT_PATH }/${ index }\'`;
}

export function deriveKeyPairByPath(seed, path): { privateKey; publicKey } {
    const { key } = hd.derivePath(path, seed);
    return hd.getPublicKey(key);
}

export function deriveKeyPair(seed, index: number): { privateKey; publicKey } {
    const path = getPath(index);
    return deriveKeyPairByPath(seed, path);
}
