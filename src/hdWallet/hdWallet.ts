const bip39 = require('bip39');
const blake = require('blakejs/blake2b');

import { checkParams, isNonNegativeInteger } from '~@vite/vitejs-utils';

import * as hdKey from './hdKey';
import * as addressLib from './address';
import { Hex, Address } from './type';

interface Wallet {
    publicKey: Hex;
    privateKey: Hex;
    originalAddress: Hex;
    address: Address;
    path: String;
}

class HDWallet {
    readonly rootPath: String
    readonly mnemonics: String
    readonly entropy: String
    readonly wordlist: Array<String>
    readonly password: String
    readonly seed: Buffer
    readonly seedHex: Hex

    private walletList: Object

    constructor(mnemonics: String, wordlist: Array<String> = bip39.wordlists.EN, password: String = '') {
        if (!hdKey.validateMnemonics(mnemonics, wordlist)) {
            throw new Error('Illegal mnemonic');
        }

        this.rootPath = hdKey.ROOT_PATH;
        this.mnemonics = mnemonics;
        this.wordlist = wordlist;
        this.password = password;
        this.entropy = hdKey.getEntropyFromMnemonics(mnemonics, wordlist);

        const { seed, seedHex } = hdKey.getSeedFromMnemonics(mnemonics, password, wordlist);
        this.seed = seed;
        this.seedHex = seedHex;
        this.walletList = {};
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
        const err = checkParams({ index }, ['index'], [{
            name: 'index',
            func: isNonNegativeInteger
        }]);
        if (err) {
            throw new Error(err.message);
        }

        if (this.walletList[index]) {
            return this.walletList[index];
        }

        const path = hdKey.getPath(index);
        const { privateKey, publicKey } = hdKey.deriveKeyPairByPath(this.seedHex, path);
        const address = addressLib.getAddressFromPublicKey(publicKey);
        const originalAddress = addressLib.getOriginalAddressFromAddress(address);

        const wallet: Wallet = {
            privateKey,
            publicKey,
            address,
            originalAddress,
            path
        };

        this.walletList[index] = wallet;
        return wallet;
    }

    deriveWalletList(startIndex: number, endIndex: number) {
        const err = checkParams({ startIndex, endIndex }, [ 'startIndex', 'endIndex' ], [ {
            name: 'startIndex',
            func: isNonNegativeInteger
        }, {
            name: 'endIndex',
            func: isNonNegativeInteger
        } ]);
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
