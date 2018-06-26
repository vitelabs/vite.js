import viteJS from './lib/index.js';

if (typeof window !== 'undefined' && typeof window.viteJS === 'undefined') {
    window.viteJS = viteJS;
}

export default viteJS;
