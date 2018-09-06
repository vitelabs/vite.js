import Vite from './Vite/index.js';
import Wallet from './Wallet/index.js';
import HTTP_RPC from '../libs/HTTP/index.js';
import IPC_RPC from '../libs/IPC/index.js';
import BigNumber from 'bignumber.js';

import version from './version.json';

class ViteJS {
    constructor(provider) {
        this._currentProvider = provider;

        this.Vite = new Vite(provider);
        this.Wallet = new Wallet();

        this.version = version;
        this.ViteVersion = this.Vite.version;
    }

    resetProvider(provider, isAbort) {
        this._currentProvider.reset(isAbort);
        this._currentProvider = provider;
        this.Vite.setProvider(provider);
    }
}

ViteJS.HTTP_RPC = HTTP_RPC;
ViteJS.IPC_RPC = IPC_RPC;
ViteJS.BigNumber = BigNumber;

export default ViteJS;