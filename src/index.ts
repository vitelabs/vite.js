import * as _abi from './abi/index';
import * as _error from './error/index';
import * as _keystore from './keystore/index';
import * as _utils from './utils/index';
import * as _constant from './constant/index';
import * as _account from './accountBlock/account';
import * as _accountBlock from './accountBlock/index';
import * as _communication from './communication/index';
import _viteAPI from './viteAPI/index';
import _wallet from './wallet/index';
import _httpRpc from './HTTP/index';
import _ipcRpc from './IPC/index';
import _wsRpc from './WS/index';

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
