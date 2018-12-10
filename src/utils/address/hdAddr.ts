const bip39 = require('bip39');
const hd = require('@sisi/ed25519-blake2b-hd-key');

import { AddrObj, Hex } from 'const/type';
import { paramsFormat } from 'const/error';
import { checkParams } from 'utils/tools';
import { bytesToHex, blake2b } from 'utils/encoder';
import { ROOT_PATH  } from './vars';
import { newHexAddr, isValidHexAddr as _isValidHexAddr, getAddrFromHexAddr as _getAddrFromHexAddr } from './privToAddr';


export function validateMnemonic(mnemonic) {
    return mnemonic && bip39.validateMnemonic(mnemonic);
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
    addr: AddrObj, entropy: string, mnemonic: string
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

export function getAddrFromMnemonic(mnemonic, index = 0): AddrObj {
    let err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: bip39.validateMnemonic
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    if (index < 0) {
        console.warn(`${paramsFormat.message} Index must greater than 0.`);
        index = 0;
    }

    let path = getPath(index);
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    return getAddrFromPath(path, seed);
}

export function getAddrsFromMnemonic(mnemonic, start = 0, num = 10): AddrObj[] {
    let err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: bip39.validateMnemonic
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    if (start < 0) {
        console.warn(`${paramsFormat.message} Start must greater than 0 or equal to 0.`);
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

export function getId(mnemonic: string): Hex {
    let err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: validateMnemonic
    }]);
    if (err) {
        console.error( new Error(err.message) );
        return null;
    }

    let addrObj = getAddrFromMnemonic(mnemonic, 0);
    let keyBuffer = Buffer.from(addrObj.hexAddr);
    let idByte = blake2b(keyBuffer, null, 32);
    return Buffer.from(idByte).toString('hex');
}

export const getAddrFromHexAddr = _getAddrFromHexAddr;

export const isValidHexAddr = _isValidHexAddr;



function getAddrFromPath(path: string, seed: string): AddrObj {
    let { key } = hd.derivePath(path, seed);
    let { privateKey } = hd.getPublicKey(key);
    let priv = bytesToHex(privateKey);
    return newHexAddr(priv);
}

function getPath(index: number): string {
    return `${ROOT_PATH}/${index}\'`;
}
