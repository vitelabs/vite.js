import * as _abi from '@vite/vitejs-abi';
import * as _error from '@vite/vitejs-error';
import * as _keystore from '@vite/vitejs-keystore';
import * as _utils from '@vite/vitejs-utils';
import * as _communication from '@vite/vitejs-communication';
import * as _constant from '@vite/vitejs-constant';
import * as _accountBlock from '@vite/vitejs-accountblock';
import WS_RPC from '@vite/vitejs-ws';
import IPC_RPC from '@vite/vitejs-ipc';
import HTTP_RPC from  '@vite/vitejs-http';
import ViteAPI from '@vite/vitejs-viteapi';
import _wallet from '@vite/vitejs-wallet';

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
export const account = _accountBlock.Account;

// Add
export { ViteAPI, WS_RPC, IPC_RPC, HTTP_RPC };
export const wallet = _wallet;

