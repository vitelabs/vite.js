/**
 * 测试用例
 */

import ViteJS from '../index.js';
console.log(ViteJS);

let Jsonrpc = new ViteJS.Jsonrpc();
console.log(Jsonrpc);

let viteJSInstance = new ViteJS(Jsonrpc);
console.log(viteJSInstance);

describe('tools/add', function () {
    it('1 + 1 = 2', function () {
        // assert.equal(viteJS.add(1, 1), 2);
    });
});