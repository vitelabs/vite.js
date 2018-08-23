import Vite from './Vite/index.js';
import HTTP_RPC from '../lib/HTTP/index.js';
import IPC_RPC from '../lib/IPC/index.js';
import version from './version.json';

class ViteJS {
    constructor(provider) {
        this._currentProvider = provider;
        this.Vite = new Vite(provider);
        // [TODO] GoVite version should be confirmed by provider
        this.version = version;
    }

    resetProvider(provider) {
        this._currentProvider = provider;
        this.Vite.setProvider(provider);
    }
}

ViteJS.HTTP_RPC = HTTP_RPC;
ViteJS.IPC_RPC = IPC_RPC;

export default ViteJS;