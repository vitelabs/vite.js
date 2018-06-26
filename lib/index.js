import Vite from './viteJS/vite.js';
import Jsonrpc from './tools/Jsonrpc.js';
import version from './config/version.json';

class ViteJS {
    constructor(provider) {
        this._currentProvider = provider;
        this.vite = new Vite(provider);
    }

    resetProvider(provider) {
        this._currentProvider = provider;
        this.vite.setProvider(provider);
    }
}

ViteJS.Jsonrpc = Jsonrpc;
ViteJS.version = version;

export default ViteJS;