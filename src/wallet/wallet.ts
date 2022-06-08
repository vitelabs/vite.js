import * as bip39 from 'bip39';
import * as blake from 'blakejs';

import { checkParams, isNonNegativeInteger } from '@vite/vitejs-utils';

import * as hdKey from './hdKey';
import * as addressLib from './address';
import { Hex, Address } from './type';

interface AddressObj {
    publicKey: Hex;
    privateKey: Hex;
    originalAddress: Hex;
    address: Address;
    path: string;
}

class Wallet {
    readonly rootPath: string;
    readonly mnemonics: string;
    readonly entropy: Hex;
    readonly wordlist: Array<string>;
    readonly passphrase: string;
    readonly seed: Buffer;
    readonly seedHex: Hex;

    private addressList: Object;

    constructor(mnemonics: string, wordlist: Array<string> = bip39.wordlists.EN, passphrase = '') {
        if (!hdKey.validateMnemonics(mnemonics, wordlist)) {
            throw new Error('Illegal mnemonic');
        }

        this.rootPath = hdKey.ROOT_PATH;
        this.mnemonics = mnemonics;
        this.wordlist = wordlist;
        this.passphrase = passphrase;
        this.entropy = hdKey.getEntropyFromMnemonics(mnemonics, wordlist);

        const { seed, seedHex } = hdKey.getSeedFromMnemonics(mnemonics, passphrase, wordlist);
        this.seed = seed;
        this.seedHex = seedHex;
        this.addressList = {};
    }

    get id(): Hex {
        let address = '';
        if (this.addressList[0]) {
            address = this.addressList[0].address;
        } else {
            const account = this.deriveAddress(0);
            address = account.address;
        }

        const addressBuffer = Buffer.from(address);
        const idBuffer = blake.blake2b(addressBuffer, undefined, 32);
        return Buffer.from(idBuffer).toString('hex');
    }

    getAddressList() {
        return this.addressList;
    }

    deriveAddress(index: number): AddressObj {
        const err = checkParams({ index }, ['index'], [{
            name: 'index',
            func: isNonNegativeInteger
        }]);
        if (err) {
            throw new Error(err.message);
        }

        if (this.addressList[index]) {
            return this.addressList[index];
        }

        const path = hdKey.getPath(index);
        const { privateKey, publicKey } = hdKey.deriveKeyPairByPath(this.seedHex, path);
        const address = addressLib.getAddressFromPublicKey(publicKey);
        const originalAddress = addressLib.getOriginalAddressFromAddress(address);

        const account: AddressObj = {
            privateKey,
            publicKey,
            address,
            originalAddress,
            path
        };

        this.addressList[index] = account;
        return account;
    }

    deriveAddressList(startIndex: number, endIndex: number): Array<AddressObj> {
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

        if (startIndex > endIndex) {
            throw new Error('Illegal index');
        }

        const addressList: Array<AddressObj> = [];
        for (let i = startIndex; i <= endIndex; i++) {
            const account: AddressObj = this.deriveAddress(i);
            addressList.push(account);
        }
        return addressList;
    }
}

export default Wallet;
