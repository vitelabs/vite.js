import ViteJS from './src/index.ts';

if (typeof window !== 'undefined' && typeof window.ViteJS === 'undefined') {
    window.ViteJS = ViteJS;
}

module.exports = ViteJS;
