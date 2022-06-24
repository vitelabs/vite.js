import * as bip39 from 'bip39';

import { checkParams } from '@vite/vitejs-utils';

import Wallet from './wallet';
import * as hdKey from './hdKey';
import * as addressLib from './address';
import { AddressObj } from './type';


export default {
    ...addressLib,
    ...hdKey,
    deriveAddress,
    deriveAddressList: function ({ mnemonics, startIndex, endIndex, wordlist = bip39.wordlists.EN, passphrase = '' }: {
        mnemonics: string;
        startIndex: number;
        endIndex: number;
        wordlist?: Array<string>;
        passphrase?: string;
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
            const addr: AddressObj = deriveAddress({ mnemonics, index: i, wordlist, passphrase });
            addressList.push(addr);
        }
        return addressList;
    },
    createWallet: function (strength = 256, wordlist: Array<string> = bip39.wordlists.EN, passphrase = '') {
        const mnemonic = hdKey.createMnemonics(strength, wordlist);
        return new Wallet(mnemonic, wordlist, passphrase);
    },
    getWallet: function (mnemonics: string, wordlist: Array<string> = bip39.wordlists.EN, passphrase = '') {
        const err = checkParams({ mnemonics, wordlist }, [ 'mnemonics', 'wordlist' ], [{
            name: 'mnemonics',
            func: _m => hdKey.validateMnemonics(_m, wordlist)
        }]);
        if (err) {
            throw new Error(err.message);
        }
        return new Wallet(mnemonics, wordlist, passphrase);
    }
};


function deriveAddress({ mnemonics, index = 0, wordlist = bip39.wordlists.EN, passphrase = '' }: {
    mnemonics: string;
    index: number;
    wordlist?: Array<string>;
    passphrase?: string;
}): AddressObj {
    const { seedHex } = hdKey.getSeedFromMnemonics(mnemonics, passphrase, wordlist);
    const { privateKey } = hdKey.deriveKeyPairByIndex(seedHex, index);
    return addressLib.createAddressByPrivateKey(privateKey);
}
