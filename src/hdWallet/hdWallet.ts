const bip39 = require('bip39');
const blake = require('blakejs/blake2b');

import { checkParams } from '~@vite/vitejs-utils';

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
    readonly seedHex: Hex

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
        const { privateKey, publicKey } = hdKey.deriveKeyPairByPath(this.seedHex, path);
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

    deriveWalletList(startIndex: number, endIndex: number) {
        const err = checkParams({ startIndex, endIndex }, [ 'startIndex', 'endIndex' ]);
        if (err) {
            throw new Error(err.message);
        }

        if (startIndex >= endIndex) {
            throw new Error('Illegal index');
        }

        const walletList: Array<Wallet> = [];
        for (let i = startIndex; i <= endIndex; i++) {
            const wallet: Wallet = this.deriveWallet(i);
            walletList.push(wallet);
        }
        return walletList;
    }
}

export default HDWallet;
