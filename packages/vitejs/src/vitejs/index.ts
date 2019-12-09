import '@babel/polyfill';
require('es6-promise').polyfill();

import * as _abi from './../abi';
import * as _error from './../error';
import * as _keystore from './../keystore';
import * as _utils from './../utils';
import * as _constant from './../constant';
import * as _accountBlock from './../accountblock';
import _viteapi from './../viteapi';
import _wallet from './../wallet';


// Not Change
export const abi = _abi;
export const error = _error;
export const keystore = _keystore;

// Add functions
export const utils = _utils;
export const constant = _constant;

// Change a lot
export const accountBlock = _accountBlock;

// Add
export const ViteAPI = _viteapi;
export const wallet = _wallet;
