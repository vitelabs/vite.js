const hd = require('@sisi/ed25519-blake2b-hd-key');
const bip39 = require('bip39');

import { bytesToHex } from '../encoder';
import { newHexAddr } from './privToAddr';
import { ROOT_PATH  } from './vars';

declare type addrObj = {
    addr: string, 
    pubKey: string, 
    privKey: string, 
    hexAddr: string
}

export function getEntropyFromMnemonic(mnemonic: string): string {
    let valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
        return '';
    }
    return bip39.mnemonicToEntropy(mnemonic);
}

export function getMnemonicFromEntropy(entropy: string): string {
    return bip39.entropyToMnemonic(entropy);
}

export function newAddr(bits: number = 256): {
    addr: addrObj, entropy: string, mnemonic: string
} {
    let mnemonic = bip39.generateMnemonic(bits);
    let entropy = bip39.mnemonicToEntropy(mnemonic);
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    let path = getPath(0);
    let addr = getAddrFromPath(path, seed);
    return { addr, entropy, mnemonic };
}

export function getAddrFromMnemonic(mnemonic, index = 0): addrObj | boolean {
    if (!mnemonic) {
        return false;
    }

    let valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
        return false;
    }

    let path = getPath(index);
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    return getAddrFromPath(path, seed);
}

export function getAddrsFromMnemonic(mnemonic, start = 0, num = 10): Array<string> | boolean {
    if (!mnemonic || num > 10 || num < 0) {
        return false;
    }

    start = start > 0 ? start : 0;
    let valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
        return false;
    }

    let addrs = [];
    let seed = bip39.mnemonicToSeedHex(mnemonic);

    for (let i = start; i < num; i++) {
        let currentPath = getPath(i);
        let addr = getAddrFromPath(currentPath, seed);
        addrs.push(addr);
    }

    return addrs;
}



function getAddrFromPath(path: string, seed: string): addrObj {
    let { key } = hd.derivePath(path, seed);
    let { privateKey } = hd.getPublicKey(key);
    let priv = bytesToHex(privateKey);
    return newHexAddr(priv);
}

function getPath(index: number): string {
    return `${ROOT_PATH}/${index}\'`;
}
