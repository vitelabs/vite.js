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


export const constant = _constant;
export const error = _error;
export const utils = _utils;
export const accountBlock = _accountBlock;
export const keystore = _keystore;
export const hdWallet = _hdWallet;
export const viteAPI = _viteapi;
export const abi = _abi;
