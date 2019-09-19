const bip39 = require('bip39');

import { checkParams } from '~@vite/vitejs-utils';

import Wallet from './hdWallet';
import * as hdKey from './hdKey';
import * as address from './address';


export default {
    ...address,
    ...hdKey,
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
