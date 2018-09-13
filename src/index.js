import Vite from './Vite/index.js';
import Wallet from './Wallet/index.js';

import HTTP_RPC from '../libs/HTTP/index.js';
// import IPC_RPC from '../libs/IPC/index.js';
import WS_RPC from '../libs/WS/index.js';

import BigNumber from 'bignumber.js';

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
ViteJS.BigNumber = BigNumber;

export default ViteJS;