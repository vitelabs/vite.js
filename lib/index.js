let Vite = require('./viteJS/vite.js');
let HttpProvider = require('./tools/HttpProvider.js');
let version = require('./config/version.json');

class ViteJS {
    constructor(provider) {
        this.version = version;
        this.vite = new Vite(provider);
        this.HttpProvider = HttpProvider;
    }
}

module.exports = ViteJS;