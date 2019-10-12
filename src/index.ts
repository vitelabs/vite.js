import * as _abi from './abi/index';
import * as _error from './error/index';
import * as _keystore from './keystore/index';
import * as _utils from './utils/index';
import * as _constant from './constant/index';
import * as _accountBlock from './accountblock/index';
import _viteAPI from './viteAPI/index';
import _hdWallet from './hdWallet/index';

// Not Change
export const abi = _abi;
export const error = _error;
export const keystore = _keystore;

// Add functions
export const utils = _utils;
export const constant = _constant;

// Change
export const accountBlock = _accountBlock;

// Add
export const viteAPI = _viteAPI;
export const hdWallet = _hdWallet;
