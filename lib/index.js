import Vite from './viteJS/vite.js';
import Jsonrpc from './tools/Jsonrpc.js';
import version from './config/version.json';

class ViteJS {
    constructor(provider) {
        this.vite = new Vite(provider);
    }
}

ViteJS.Jsonrpc = Jsonrpc;
ViteJS.version = version;

export default ViteJS;