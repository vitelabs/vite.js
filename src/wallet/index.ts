const bip39 = require('bip39');

import { checkParams } from '~@vite/vitejs-utils';

import Wallet from './wallet';
import * as hdKey from './hdKey';
import * as addressLib from './address';
import { AddressObj } from './type';


export default {
    ...addressLib,
    ...hdKey,
    deriveAddress,
    deriveAddressList: function ({ mnemonics, startIndex, endIndex, wordlist, password = '', isContract }: {
        mnemonics: String;
        startIndex: number;
        endIndex: number;
        wordlist: Array<String>;
        password: String;
        isContract?: boolean;
    }): Array<AddressObj> {
        const err = checkParams({ startIndex, endIndex }, [ 'startIndex', 'endIndex' ]);
        if (err) {
            throw new Error(err.message);
        }

        if (startIndex >= endIndex) {
            throw new Error('Illegal index');
        }

        const addressList: Array<AddressObj> = [];
        for (let i = startIndex; i <= endIndex; i++) {
            const addr: AddressObj = deriveAddress({ mnemonics, index: i, wordlist, password, isContract });
            addressList.push(addr);
        }
        return addressList;
    },
    createWallet: function (strength: number = 256, wordlist: Array<String> = bip39.wordlists.EN, password: string = '') {
        const mnemonic = hdKey.createMnemonics(strength, wordlist);
        return new Wallet(mnemonic, wordlist, password);
    },
    getWallet: function (mnemonics: string, wordlist: Array<String> = bip39.wordlists.EN, password: string = '') {
        const err = checkParams({ mnemonics, wordlist }, [ 'mnemonics', 'wordlist' ], [{
            name: 'mnemonics',
            func: _m => hdKey.validateMnemonics(_m, wordlist)
        }]);
        if (err) {
            throw new Error(err.message);
        }
        return new Wallet(mnemonics, wordlist, password);
    }
};


function deriveAddress({ mnemonics, index = 0, wordlist, password = '', isContract }: {
    mnemonics: String;
    index: number;
    wordlist: Array<String>;
    password: String;
    isContract?: boolean;
}): AddressObj {
    const { seedHex } = hdKey.getSeedFromMnemonics(mnemonics, password, wordlist);
    const { privateKey } = hdKey.deriveKeyPairByIndex(seedHex, index);
    return addressLib.createAddressByPrivateKey(privateKey, isContract);
}
