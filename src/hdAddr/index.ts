const bip39 = require('bip39');
const hd = require('@sisi/ed25519-blake2b-hd-key');
import { createAddressByPrivateKey, isAddress as _isAddress, getRealAddressFromAddress as _getRealAddressFromAddress } from '~@vite/vitejs-privtoaddr';
import { paramsFormat } from '~@vite/vitejs-error';
import { checkParams, bytesToHex, blake2b } from '~@vite/vitejs-utils';

import { AddrObj, Hex } from './type';

const ROOT_PATH = 'm/44\'/666666\'';

export function validateMnemonic(mnemonic: string, wordlist: Array<String>) {
    wordlist = wordlist || bip39.wordlists.EN;
    return mnemonic && bip39.validateMnemonic(mnemonic, wordlist);
}

export function getEntropyFromMnemonic(mnemonic: string, wordlist: Array<String>): string {
    wordlist = wordlist || bip39.wordlists.EN;
    const err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.mnemonicToEntropy(mnemonic, wordlist);
}

export function getMnemonicFromEntropy(entropy: string, wordlist: Array<String>): string {
    const err = checkParams({ entropy }, ['entropy']);
    if (err) {
        throw new Error(err.message);
    }

    wordlist = wordlist || bip39.wordlists.EN;
    return bip39.entropyToMnemonic(entropy, wordlist);
}

export function createAddress(bits: number = 256, wordlist: Array<String>, pwd: string = '', isContract?: boolean): {
    addr: AddrObj; entropy: string; mnemonic: string; id: Hex;
} {
    const err = checkParams({ bits }, ['bits']);
    if (err) {
        throw new Error(err.message);
    }

    wordlist = wordlist || bip39.wordlists.EN;
    const mnemonic = bip39.generateMnemonic(bits, null, wordlist);
    const entropy = bip39.mnemonicToEntropy(mnemonic, wordlist);
    const seed = bip39.mnemonicToSeedSync(mnemonic, pwd).toString('hex');
    const path = getPath(0);
    const addr = getAddrFromPath(path, seed, isContract);
    const id = getId(mnemonic, wordlist);

    return { addr, entropy, mnemonic, id };
}

export function getAddrFromMnemonic(mnemonic, index = 0, wordlist: Array<String>, pwd: string = '', isContract?: boolean): AddrObj {
    wordlist = wordlist || bip39.wordlists.EN;
    const err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    if (index < 0) {
        console.warn(`${ paramsFormat.message } Index must greater than 0.`);
        index = 0;
    }

    const path = getPath(index);
    const seed = bip39.mnemonicToSeedSync(mnemonic, pwd).toString('hex');
    return getAddrFromPath(path, seed, isContract);
}

export function getAddrsFromMnemonic(mnemonic, start = 0, num = 10, wordlist: Array<String>, pwd: string = '', isContract?: boolean): AddrObj[] {
    wordlist = wordlist || bip39.wordlists.EN;
    const err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    if (start < 0) {
        console.warn(`${ paramsFormat.message } Start must greater than 0 or equal to 0.`);
        start = 0;
    }

    if (num <= 0) {
        return [];
    }

    const addrs = [];
    const seed = bip39.mnemonicToSeedSync(mnemonic, pwd).toString('hex');

    for (let i = start; i < start + num; i++) {
        const currentPath = getPath(i);
        const addr = getAddrFromPath(currentPath, seed, isContract);
        addrs.push(addr);
    }

    return addrs;
}

export const getId = _getId;

export const getRealAddressFromAddress = _getRealAddressFromAddress;

export const isAddress = _isAddress;


function getAddrFromPath(path: string, seed: string, isContract?: boolean): AddrObj {
    const { key } = hd.derivePath(path, seed);
    const { privateKey } = hd.getPublicKey(key);
    const priv = bytesToHex(privateKey);
    return createAddressByPrivateKey(priv, isContract);
}

function getPath(index: number): string {
    return `${ ROOT_PATH }/${ index }\'`;
}

function _getId(mnemonic: string, wordlist: Array<String>, pwd: string = '', isContract?: boolean): Hex {
    wordlist = wordlist || bip39.wordlists.EN;
    const err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, wordlist)
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const addrObj = getAddrFromMnemonic(mnemonic, 0, wordlist, pwd, isContract);
    const keyBuffer = Buffer.from(addrObj.hexAddr);
    const idByte = blake2b(keyBuffer, null, 32);
    return Buffer.from(idByte).toString('hex');
}
