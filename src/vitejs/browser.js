import * as ViteJS from './index';

if (typeof window !== 'undefined' && typeof window.ViteJS === 'undefined') {
    window.ViteJS = ViteJS;
}

module.exports = ViteJS;
