const bip39 = require('bip39');
const hd = require('@sisi/ed25519-blake2b-hd-key');

import { checkParams } from 'utils/tools';
import { paramsFormat } from 'const/error';
import { ROOT_PATH  } from './vars';
import { bytesToHex } from '../encoder';
import { newHexAddr, isValidHexAddr as _isValidHexAddr, getAddrFromHexAddr as _getAddrFromHexAddr } from './privToAddr';

declare type addrObj = {
    addr: string, 
    pubKey: string, 
    privKey: string, 
    hexAddr: string
}

export function getEntropyFromMnemonic(mnemonic: string): string {
    let err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: bip39.validateMnemonic
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    return bip39.mnemonicToEntropy(mnemonic);
}

export function getMnemonicFromEntropy(entropy: string): string {
    let err = checkParams({ entropy }, ['entropy']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    return bip39.entropyToMnemonic(entropy);
}

export function newAddr(bits: number = 256): {
    addr: addrObj, entropy: string, mnemonic: string
} {
    let err = checkParams({ bits }, ['bits']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    let mnemonic = bip39.generateMnemonic(bits);
    let entropy = bip39.mnemonicToEntropy(mnemonic);
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    let path = getPath(0);
    let addr = getAddrFromPath(path, seed);
    return { addr, entropy, mnemonic };
}

export function getAddrFromMnemonic(mnemonic, index = 0): addrObj | boolean {
    let err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: bip39.validateMnemonic
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    if (index < 0) {
        console.warn(`${paramsFormat.msg} Index must greater than 0.`);
        index = 0;
    }

    let path = getPath(index);
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    return getAddrFromPath(path, seed);
}

export function getAddrsFromMnemonic(mnemonic, start = 0, num = 10): Array<string> | boolean {
    let err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: bip39.validateMnemonic
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    if (start < 0) {
        console.warn(`${paramsFormat.msg} Start must greater than 0 or equal to 0.`);
        start = 0;
    }

    if (num <= 0) {
        return [];
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

export const getAddrFromHexAddr = _getAddrFromHexAddr;

export const isValidHexAddr = _isValidHexAddr;



function getAddrFromPath(path: string, seed: string): addrObj {
    let { key } = hd.derivePath(path, seed);
    let { privateKey } = hd.getPublicKey(key);
    let priv = bytesToHex(privateKey);
    return newHexAddr(priv);
}

function getPath(index: number): string {
    return `${ROOT_PATH}/${index}\'`;
}
