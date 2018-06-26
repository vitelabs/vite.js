let Vite = require('./viteJS/vite.js');
let Jsonrpc = require('./tools/Jsonrpc.js');
let version = require('./config/version.json');

class ViteJS {
    constructor(provider) {
        this.vite = new Vite(provider);
    }
}

ViteJS.Jsonrpc = Jsonrpc;
ViteJS.version = version;

module.exports = ViteJS;