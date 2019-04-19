const bip39 = require('bip39');
const hd = require('@sisi/ed25519-blake2b-hd-key');
import { newHexAddr, isValidHexAddr as _isValidHexAddr, getAddrFromHexAddr as _getAddrFromHexAddr } from '~@vite/vitejs-privtoaddr';
import { paramsFormat } from '~@vite/vitejs-error';
import { checkParams, bytesToHex, blake2b } from '~@vite/vitejs-utils';

import { AddrObj, Hex, LangList } from '../type';

const ROOT_PATH = 'm/44\'/666666\'';

export function validateMnemonic(mnemonic: string, lang: LangList = LangList.english) {
    return mnemonic && bip39.validateMnemonic(mnemonic, getWordList(lang));
}

export function getEntropyFromMnemonic(mnemonic: string, lang: LangList = LangList.english): string {
    const err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, lang)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.mnemonicToEntropy(mnemonic, getWordList(lang));
}

export function getMnemonicFromEntropy(entropy: string, lang: LangList = LangList.english): string {
    const err = checkParams({ entropy }, ['entropy']);
    if (err) {
        throw new Error(err.message);
    }

    return bip39.entropyToMnemonic(entropy, getWordList(lang));
}

export function newAddr(bits: number = 256, lang: LangList = LangList.english, pwd: string = ''): {
    addr: AddrObj; entropy: string; mnemonic: string; id: Hex;
} {
    const err = checkParams({ bits }, ['bits']);
    if (err) {
        throw new Error(err.message);
    }

    const wordList = getWordList(lang);
    const mnemonic = bip39.generateMnemonic(bits, null, wordList);
    const entropy = bip39.mnemonicToEntropy(mnemonic, wordList);
    const seed = bip39.mnemonicToSeedHex(mnemonic, pwd);
    const path = getPath(0);
    const addr = getAddrFromPath(path, seed);
    const id = getId(mnemonic, lang);

    return { addr, entropy, mnemonic, id };
}

export function getAddrFromMnemonic(mnemonic, index = 0, lang: LangList = LangList.english, pwd: string = ''): AddrObj {
    const err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, lang)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    if (index < 0) {
        console.warn(`${ paramsFormat.message } Index must greater than 0.`);
        index = 0;
    }

    const path = getPath(index);
    const seed = bip39.mnemonicToSeedHex(mnemonic, pwd);
    return getAddrFromPath(path, seed);
}

export function getAddrsFromMnemonic(mnemonic, start = 0, num = 10, lang: LangList = LangList.english, pwd: string = ''): AddrObj[] {
    const err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, lang)
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
    const seed = bip39.mnemonicToSeedHex(mnemonic, pwd);

    for (let i = start; i < start + num; i++) {
        const currentPath = getPath(i);
        const addr = getAddrFromPath(currentPath, seed);
        addrs.push(addr);
    }

    return addrs;
}

export const getId = _getId;

export const getAddrFromHexAddr = _getAddrFromHexAddr;

export const isValidHexAddr = _isValidHexAddr;


function getAddrFromPath(path: string, seed: string): AddrObj {
    const { key } = hd.derivePath(path, seed);
    const { privateKey } = hd.getPublicKey(key);
    const priv = bytesToHex(privateKey);
    return newHexAddr(priv);
}

function getPath(index: number): string {
    return `${ ROOT_PATH }/${ index }\'`;
}

function getWordList(lang: LangList = LangList.english) {
    lang = lang && bip39.wordlists[lang] ? lang : LangList.english;
    return bip39.wordlists[lang];
}

function _getId(mnemonic: string, lang: LangList = LangList.english): Hex {
    const err = checkParams({ mnemonic }, ['mnemonic'], [{
        name: 'mnemonic',
        func: _m => validateMnemonic(_m, lang)
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const addrObj = getAddrFromMnemonic(mnemonic, 0);
    const keyBuffer = Buffer.from(addrObj.hexAddr);
    const idByte = blake2b(keyBuffer, null, 32);
    return Buffer.from(idByte).toString('hex');
}
