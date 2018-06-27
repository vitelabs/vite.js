import ViteJS from '../index.js';

const Jsonrpc = new ViteJS.Jsonrpc();
const viteJSInstance = new ViteJS(Jsonrpc);

describe('tools/add', function () {
    it('1 + 1 = 2', function () {
        // assert.equal(viteJS.add(1, 1), 2);
    });
});