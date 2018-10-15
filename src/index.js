import Vite from './Vite/index.js';
import Wallet from './Wallet/index.js';

import HTTP_RPC from '../libs/HTTP.js';
// import IPC_RPC from '../libs/IPC.js';
import WS_RPC from '../libs/WS.js';

import utils from '../libs/utils.js';

class ViteJS {
    constructor(provider) {
        this._currentProvider = provider;

        this.Vite = new Vite(provider);
        this.Wallet = new Wallet(this.Vite);

        this.version = '~ViteJS.version';
        this.walletVersion = this.Wallet.version;
        this.viteVersion = this.Vite.version;
    }

    resetProvider(provider, isAbort) {
        this._currentProvider.reset(isAbort);
        this._currentProvider = provider;
        this.Vite.setProvider(provider);
    }
}

ViteJS.HTTP_RPC = HTTP_RPC;
// ViteJS.IPC_RPC = IPC_RPC;
ViteJS.WS_RPC = WS_RPC;
// Libs
ViteJS.utils = utils;

export default ViteJS;