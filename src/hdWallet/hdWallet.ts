const bip39 = require('bip39');
const blake = require('blakejs/blake2b');

import * as hdKey from './hdKey';
import * as addressLib from './address';
import { Hex, Address } from './type';

interface Wallet {
    publicKey: Buffer;
    privateKey: Buffer;
    realAddress: Hex;
    address: Address;
    path: String;
}

class HDWallet {
    readonly rootPath: String
    readonly mnemonic: String
    readonly wordlist: Array<String>
    readonly pwd: String
    readonly seed: Buffer
    readonly seedHex: String

    private walletList: Object

    constructor(mnemonic: String, wordlist: Array<String> = bip39.wordlists.EN, pwd: String = '') {
        if (!hdKey.validateMnemonic(mnemonic, wordlist)) {
            throw new Error('Illegal mnemonic');
        }

        this.rootPath = hdKey.ROOT_PATH;
        this.mnemonic = mnemonic;
        this.wordlist = wordlist;
        this.pwd = pwd;

        const { seed, seedHex } = hdKey.getSeedFromMnemonic(mnemonic, wordlist, pwd);
        this.seed = seed;
        this.seedHex = seedHex;
    }

    get id() {
        let address = '';
        if (this.walletList[0]) {
            address = this.walletList[0].address;
        } else {
            const wallet = this.deriveWallet(0);
            address = wallet.address;
        }

        const addressBuffer = Buffer.from(address);
        const idBuffer = blake.blake2b(addressBuffer, null, 32);
        return Buffer.from(idBuffer).toString('hex');
    }

    getWalletList() {
        return this.walletList;
    }

    deriveWallet(index: number) {
        const path = hdKey.getPath(index);
        const { privateKey, publicKey } = hdKey.deriveKeyPairByPath(this.seed, path);
        const address = addressLib.getAddressFromPublicKey(publicKey);
        const realAddress = addressLib.getRealAddressFromAddress(address);

        const wallet: Wallet = {
            privateKey,
            publicKey,
            address,
            realAddress,
            path
        };

        this.walletList[index] = wallet;
        return wallet;
    }
}

export default HDWallet;
