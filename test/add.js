/**
 * 测试用例
 */

var assert = require('assert');
var viteJS = require('../index.js');

describe('tools/add', function () {
    it('1 + 1 = 2', function () {
        assert.equal(viteJS.add(1, 1), 2);
    });
});