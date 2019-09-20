import '@babel/polyfill';
require('es6-promise').polyfill();

import * as _constant from '~@vite/vitejs-constant';
import * as _error from '~@vite/vitejs-error';
import * as _utils from '~@vite/vitejs-utils';
import * as _accountBlock from '~@vite/vitejs-accountblock';
import * as _abi from '~@vite/vitejs-abi';
import * as _keystore from '~@vite/vitejs-keystore';
import * as _hdWallet from '~@vite/vitejs-hdwallet';
import _viteapi from '~@vite/vitejs-viteapi';
import _client from '~@vite/vitejs-client';
import _addrAccount from '~@vite/vitejs-addraccount';
import _account from '~@vite/vitejs-account';
// import _hdAccount from '~@vite/vitejs-hdaccount';


export const constant = _constant;
export const error = _error;
export const utils = _utils;
export const accountBlock = _accountBlock;
export const keystore = _keystore;
export const hdWallet = _hdWallet;
export const viteAPI = _viteapi;
export const client = _client;
export const addrAccount = _addrAccount;
export const account = _account;
// export const hdAccount = _hdAccount;
export const abi = _abi;
