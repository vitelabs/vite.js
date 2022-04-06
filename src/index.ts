import * as _abi from './abi/index';
import * as _error from './error/index';
import * as _keystore from './keystore/index';
import * as _utils from './utils/index';
import * as _constant from './constant/index';
import * as _account from './accountBlock/account';
import * as _accountBlock from './accountBlock/index';
import _viteAPI from './viteAPI/index';
import _wallet from './wallet/index';


// Not Change
export const abi = _abi;
export const error = _error;
export const keystore = _keystore;

// Add functions
export const utils = _utils;
export const constant = _constant;

// Change a lot
export const accountBlock = _accountBlock;
export const account = _account;

// Add
export const ViteAPI = _viteAPI;
export const wallet = _wallet;
