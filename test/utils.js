const assert = require('assert');
import utils from '../libs/utils.js';

describe('strToUtf8', function () {
    it('test1', function () {
        let utf8Bytes = utils.strToUtf8Bytes('为', true);
        assert.equal('e4b8ba', utils.bytesToHex(utf8Bytes));
    });
    // it('test2', function () {
    //     let utf8Bytes = utils.strToUtf8Bytes('sdsdsds。；。、lp.;,p[oo阿京东方]', true);
    //     console.log(utils.bytesToHex(utf8Bytes));
    // });
    // it('test3', function () {
    //     let utf8Bytes = utils.strToUtf8Bytes('[坏笑]😊🙂🙂😆😅😅', true);
    //     console.log(utils.bytesToHex(utf8Bytes));
    // });
});
