const bip39 = require('bip39');

import { checkParams } from '~@vite/vitejs-utils';

import Wallet from './hdWallet';
import * as hdKey from './hdKey';
import * as addressLib from './address';
import { AddrObj } from './type';


export default {
    ...addressLib,
    ...hdKey,
    deriveAddress,
    deriveAddressList: function ({ mnemonic, startIndex, endIndex, wordlist, pwd = '', isContract }: {
        mnemonic: String;
        startIndex: number;
        endIndex: number;
        wordlist: Array<String>;
        pwd: String;
        isContract?: boolean;
    }): Array<AddrObj> {
        const err = checkParams({ startIndex, endIndex }, [ 'startIndex', 'endIndex' ]);
        if (err) {
            throw new Error(err.message);
        }

        if (startIndex >= endIndex) {
            throw new Error('Illegal index');
        }

        const addressList: Array<AddrObj> = [];
        for (let i = startIndex; i <= endIndex; i++) {
            const addr: AddrObj = deriveAddress({ mnemonic, index: i, wordlist, pwd, isContract });
            addressList.push(addr);
        }
        return addressList;
    },
    createHDWallet: function (bits: number = 256, wordlist: Array<String> = bip39.wordlists.EN, pwd: string = '') {
        const mnemonic = hdKey.createMnemonic(bits, wordlist);
        return new Wallet(mnemonic, wordlist, pwd);
    },
    getHDWallet: function (mnemonic: string, wordlist: Array<String> = bip39.wordlists.EN, pwd: string = '') {
        const err = checkParams({ mnemonic, wordlist }, [ 'mnemonic', 'wordlist' ], [{
            name: 'mnemonic',
            func: _m => hdKey.validateMnemonic(_m, wordlist)
        }]);
        if (err) {
            throw new Error(err.message);
        }
        return new Wallet(mnemonic, wordlist, pwd);
    }
};


function deriveAddress({ mnemonic, index = 0, wordlist, pwd = '', isContract }: {
    mnemonic: String;
    index: number;
    wordlist: Array<String>;
    pwd: String;
    isContract?: boolean;
}): AddrObj {
    const { seedHex } = hdKey.getSeedFromMnemonic(mnemonic, wordlist, pwd);
    const { privateKey } = hdKey.deriveKeyPair(seedHex, index);
    return addressLib.createAddressByPrivateKey(privateKey, isContract);
}
