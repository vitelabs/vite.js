import bip39 from 'bip39';
import hd from '../../libs/hd';
import libUtils from '../../libs/utils';

class Address {
    constructor(Vite) {
        this.Vite = Vite;
    }

    getMnemonicFromEntropy(mnemonic) {        
        let valid = bip39.validateMnemonic(mnemonic);
        if (!valid) {
            return false;
        }
        return bip39.mnemonicToEntropy(mnemonic);
    }

    getEntropyFromMnemonic(entropy) {
        return bip39.entropyToMnemonic(entropy);
    }

    newAddr(rootPath) {
        let mnemonic = bip39.generateMnemonic(256);
        let entropy = bip39.mnemonicToEntropy(mnemonic);
        let seed = bip39.mnemonicToSeedHex(mnemonic);
        let addr = getAddrFromPath.call(this, `${rootPath}/0\'`, seed);
        return { addr, entropy };
    }

    getAddrsFromMnemonic(mnemonic, rootPath, num = 10) {
        if (!mnemonic || !rootPath) {
            return false;
        }

        let valid = bip39.validateMnemonic(mnemonic);
        if (!valid) {
            return false;
        }
        
        let addrs = [];
        let seed = bip39.mnemonicToSeedHex(mnemonic);

        for (let i=0; i<num; i++) {
            let currentPath = `${rootPath}/${i}\'`;
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
    return this.Vite.Account.newHexAddr(priv);
}
