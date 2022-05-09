import 'core-js/stable';
require('es6-promise').polyfill();

import * as _abi from '~@vite/vitejs-abi';
import * as _error from '~@vite/vitejs-error';
import * as _keystore from '~@vite/vitejs-keystore';
import * as _utils from '~@vite/vitejs-utils';
import * as _constant from '~@vite/vitejs-constant';
import * as _account from '~@vite/vitejs-accountblock/account';
import * as _accountBlock from '~@vite/vitejs-accountblock';
import * as _communication from '~@vite/vitejs-communication';
import _viteAPI from '~@vite/vitejs-viteapi';
import _wallet from '~@vite/vitejs-wallet';
import _httpRpc from '~@vite/vitejs-http';
import _ipcRpc from '~@vite/vitejs-ipc';
import _wsRpc from '~@vite/vitejs-ws';

// Not Change
export const abi = _abi;
export const error = _error;
export const keystore = _keystore;

// Add functions
export const utils = _utils;
export const constant = _constant;
export const communication = _communication;

// Change a lot
export const accountBlock = _accountBlock;
export const account = _account;

// Add
export const ViteAPI = _viteAPI;
export const wallet = _wallet;
export const HTTP_RPC = _httpRpc;
export const IPC_RPC = _ipcRpc;
export const WS_RPC = _wsRpc;

