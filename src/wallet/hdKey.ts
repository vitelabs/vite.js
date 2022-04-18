const bip39 = require('bip39');
const hd = require('@sisi/ed25519-blake2b-hd-key');

import { checkParams } from '~@vite/vitejs-utils';

import { Hex } from './type';

export const ROOT_PATH = 'm/44\'/666666\'';


export function createMnemonics(strength = 256, wordlist: Array<string> = bip39.wordlists.EN): string {
    const err = checkParams({ strength, wordlist }, [ 'strength', 'wordlist' ]);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.generateMnemonic(strength, null, wordlist);
}

export function validateMnemonics(mnemonic: string, wordlist: Array<string> = bip39.wordlists.EN): boolean {
    return mnemonic && bip39.validateMnemonic(mnemonic, wordlist);
}

export function getEntropyFromMnemonics(mnemonic: string, wordlist: Array<string> = bip39.wordlists.EN): Hex {
    const err = checkParams({ mnemonic, wordlist }, [ 'mnemonic', 'wordlist' ], [{
        name: 'mnemonic',
        func: _m => validateMnemonics(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.mnemonicToEntropy(mnemonic, wordlist);
}

export function getSeedFromMnemonics(mnemonic: string, passphrase = '', wordlist: Array<string> = bip39.wordlists.EN): {
    seed: Buffer;
    seedHex: Hex;
} {
    const err = checkParams({ mnemonic, wordlist }, [ 'mnemonic', 'wordlist' ], [{
        name: 'mnemonic',
        func: _m => validateMnemonics(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    const seed: Buffer = bip39.mnemonicToSeedSync(mnemonic, passphrase);
    const seedHex: Hex = seed.toString('hex');
    return { seed, seedHex };
}

export function createSeed(strength = 256, passphrase = '', wordlist: Array<string> = bip39.wordlists.EN): {
    mnemonic: string;
    seed: Buffer;
    seedHex: Hex;
} {
    const mnemonic = createMnemonics(strength, wordlist);
    const { seed, seedHex } = getSeedFromMnemonics(mnemonic, passphrase, wordlist);
    return { mnemonic, seed, seedHex };
}

export function getMnemonicsFromEntropy(entropy: Hex, wordlist: Array<string> = bip39.wordlists.EN): string {
    const err = checkParams({ entropy }, ['entropy']);
    if (err) {
        throw new Error(err.message);
    }
    return bip39.entropyToMnemonic(entropy, wordlist);
}

export function getPath(index: number): string {
    return `${ ROOT_PATH }/${ index }\'`;
}

export function deriveKeyPairByPath(seed: Hex, path: string): { privateKey: Hex; publicKey: Hex; } {
    const { key } = hd.derivePath(path, seed);
    const { privateKey, publicKey } = hd.getPublicKey(key);
    return {
        privateKey: Buffer.from(privateKey).toString('hex'),
        publicKey: Buffer.from(publicKey).toString('hex')
    };
}

export function deriveKeyPairByIndex(seed: Hex, index: number): { privateKey: Hex; publicKey: Hex; } {
    const path = getPath(index);
    return deriveKeyPairByPath(seed, path);
}
