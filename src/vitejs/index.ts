import * as _abi from '@vite/vitejs-abi';
import * as _error from '@vite/vitejs-error';
import * as _keystore from '@vite/vitejs-keystore';
import * as _utils from '@vite/vitejs-utils';
import * as _constant from '@vite/vitejs-constant';
import * as _accountBlock from '@vite/vitejs-accountblock';
import * as  _viteAPI from '@vite/vitejs-viteapi';
import _wallet from '@vite/vitejs-wallet';


// Not Change
export const abi = _abi;
export const error = _error;
export const keystore = _keystore;

// Add functions
export const utils = _utils;
export const constant = _constant;

// Change a lot
export const accountBlock = _accountBlock;
export const account = _accountBlock.Account;

// Add
export const ViteAPI = _viteAPI;
export const wallet = _wallet;
