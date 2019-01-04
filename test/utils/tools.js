const assert = require('assert');

import { getRawTokenid, validNodeName, validInteger }from '../../packages/utils/src/tools';

describe('utils/tools', function () {
    it('getRawTokenid', function () {
        assert.equal('5649544520544f4b454e', getRawTokenid('tti_5649544520544f4b454e6e40'));
    });
    it('validNodeName', function () {
        assert.equal(true, validNodeName('2323_sdsd'));
        assert.equal(true, validNodeName('2323_sd sd'));
        assert.equal(false, validNodeName(' 2323_sdsd '));
        assert.equal(false, validNodeName('2323_sd  sd'));
        assert.equal(false, validNodeName('232涉及到法律是否啊3_sd  sd'));
    });
    it('validInteger', function () {
        assert.equal(false, validInteger('232   2323'));
        assert.equal(true, validInteger('2323'));
        assert.equal(false, validInteger('0000'));
        assert.equal(true, validInteger('0'));
        assert.equal(false, validInteger('0.23829'));
    });
});
