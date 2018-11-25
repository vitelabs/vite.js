import '@babel/polyfill';
require('es6-promise').polyfill();

import Vite from './Vite/index.js';
import Wallet from './Wallet/index.js';

import HTTP_RPC from 'provider/HTTP.js';
// import IPC_RPC from '../libs/IPC.js';
import WS_RPC from 'provider/WS.js';

import encoder from 'utils/encoder';

