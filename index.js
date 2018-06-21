var viteJS = require('./lib/index.js');

if (typeof window !== 'undefined' && typeof window.viteJS === 'undefined') {
    window.viteJS = viteJS;
}

module.exports = viteJS;
