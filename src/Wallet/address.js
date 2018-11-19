const hd = require('@sisi/ed25519-blake2b-hd-key');

import bip39 from 'bip39';
import libUtils from '../../libs/utils';
import address from '../address';

const rootPath = 'm/44\'/666666\'';

class Address {
    getAddrFromHexAddr(hexAddr) {
        return address.getAddrFromHexAddr(hexAddr);
    }

    getEntropyFromMnemonic(mnemonic) {
        let valid = bip39.validateMnemonic(mnemonic);
        if (!valid) {
            return false;
        }    
        return bip39.mnemonicToEntropy(mnemonic);
    }

    getMnemonicFromEntropy(entropy) {
        return bip39.entropyToMnemonic(entropy);
    }

    newAddr(bits = 256) {
        let mnemonic = bip39.generateMnemonic(bits);
        let entropy = bip39.mnemonicToEntropy(mnemonic);
        let seed = bip39.mnemonicToSeedHex(mnemonic);
        let path = `${rootPath}/0\'`;
        let addr = getAddrFromPath.call(this, path, seed);
        return { addr, entropy };
    }

    newAddrFromMnemonic(mnemonic, index) {
        if (!mnemonic) {
            return false;
        }

        let valid = bip39.validateMnemonic(mnemonic);
        if (!valid) {
            return false;
        }

        let path = `${rootPath}/${index}\'`;
        let seed = bip39.mnemonicToSeedHex(mnemonic);
        return getAddrFromPath.call(this, path, seed);
    }

    getAddrsFromMnemonic(mnemonic, num = 10, path) {
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

        for (let i=0; i<num; i++) {
            let currentPath = `${path}/${i}\'`;
            let addr = getAddrFromPath.call(this, currentPath, seed);
            addrs.push(addr);
        }

        return addrs;
    }
}

export default Address;

function getAddrFromPath(path, seed) {
    let { key } = hd.derivePath(path, seed);
    let { privateKey } = hd.getPublicKey(key);
    let priv = libUtils.bytesToHex(privateKey);
    return address.newHexAddr(priv);
}
