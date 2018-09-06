import bip39 from 'bip39';
import hd from '../../libs/hd';
import libUtils from '../../libs/utils';

const ADDR_NUM = 10;

class HD {
    constructor(Vite) {
        this.Vite = Vite;
    }

    getSeed(mnemonic) {
        mnemonic = mnemonic || bip39.generateMnemonic(256);
        let seed = bip39.mnemonicToSeedHex(mnemonic);
        return { mnemonic, seed };
    }

    getAddrsFromSeed(seed) {
        // [TODO]
        let path = 'm/44\'/999\'/';
        let addrs = [];

        for (let i=0; i<ADDR_NUM; i++) {
            let currentPath = `${path}${i}\'`;
            let addr = this.getAddrFromPath(currentPath, seed);
            addrs.push(addr);
        }

        return addrs;
    }

    getAddrFromPath(path, seed) {
        let { key } = hd.derivePath(path, seed);
        let { privateKey } = hd.getPublicKey(key);
        let priv = libUtils.bytesToHex(privateKey);
        return this.Vite.Account.newHexAddr(priv);
    }
}

export default HD;

