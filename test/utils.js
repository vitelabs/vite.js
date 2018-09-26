const assert = require('assert');
import utils from '../libs/utils.js';

describe('strToUtf8', function () {
    it('test1', function () {
        let utf8Bytes = utils.strToUtf8('为', true);
        let bytes = new Uint8Array(utf8Bytes);
        assert.equal('e4b8ba', utils.bytesToHex(bytes));
    });
    it('test2', function () {
        let utf8Bytes = utils.strToUtf8('sdsdsds。；。、lp.;,p[oo阿京东方]', true);
        let bytes = new Uint8Array(utf8Bytes);
        console.log(utils.bytesToHex(bytes));
    });
    it('test3', function () {
        let utf8Bytes = utils.strToUtf8('[坏笑]😊🙂🙂😆😅😅', true);
        let bytes = new Uint8Array(utf8Bytes);
        console.log(utils.bytesToHex(bytes));
    });
});
