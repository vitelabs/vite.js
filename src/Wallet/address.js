const hd = require('@sisi/ed25519-blake2b-hd-key');

import bip39 from 'bip39';
import encoder from 'utils/encoder';
import address from 'utils/address';

const rootPath = 'm/44\'/666666\'';


export function getAddrFromHexAddr(hexAddr) {
    return address.getAddrFromHexAddr(hexAddr);
}

export function getEntropyFromMnemonic(mnemonic) {
    let valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
        return false;
    }
    return bip39.mnemonicToEntropy(mnemonic);
}

export function getMnemonicFromEntropy(entropy) {
    return bip39.entropyToMnemonic(entropy);
}

export function newAddr() {
    let mnemonic = bip39.generateMnemonic(256);
    let entropy = bip39.mnemonicToEntropy(mnemonic);
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    let addr = getAddrFromPath(rootPath, seed);
    return { addr, entropy };
}

export function newAddrFromMnemonic(mnemonic, index) {
    if (!mnemonic) {
        return false;
    }

    let valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
        return false;
    }

    let path = `${rootPath}/${index}\'`;
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    return getAddrFromPath( path, seed);
}

export function getAddrsFromMnemonic(mnemonic, num = 10, path) {
    path = path || rootPath;
    if (!mnemonic || num > 10 || num < 0) {
        return false;
    }

    let valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
        return false;
    }

    let addrs = [];
    let seed = bip39.mnemonicToSeedHex(mnemonic);

    for (let i = 0; i < num; i++) {
        let currentPath = `${path}/${i}\'`;
        let addr = getAddrFromPath(currentPath, seed);
        addrs.push(addr);
    }

    return addrs;
}


function getAddrFromPath(path, seed) {
    let { key } = hd.derivePath(path, seed);
    let { privateKey } = hd.getPublicKey(key);
    let priv = encoder.bytesToHex(privateKey);
    return address.newHexAddr(priv);
}
