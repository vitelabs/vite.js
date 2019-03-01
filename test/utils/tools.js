const assert = require('assert');

import { getRawTokenid, validNodeName, validInteger, getTokenIdFromRaw, uriStringify }from '../../packages/utils/src/tools';

describe('utils/tools', function () {
    it('getRawTokenid', function () {
        assert.equal('5649544520544f4b454e', getRawTokenid('tti_5649544520544f4b454e6e40'));
    });
    it('uriStringify', function () {
        assert.equal('vite:vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad/echo?amount=1&data=MTIzYWJjZA', uriStringify({target_address:'vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad',params:{amount:1,data:'MTIzYWJjZA'},function_name:'echo'}));
        assert.equal('vite:vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad?tti=tti_5649544520544f4b454e6e40&amount=1&data=MTIzYWJjZA', uriStringify({target_address:'vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad',params:{tti:'tti_5649544520544f4b454e6e40',amount:1,data:'MTIzYWJjZA'}}));
    });
    it('getTokenIdFromRaw', function () {
        assert.equal('tti_5649544520544f4b454e6e40', getTokenIdFromRaw('5649544520544f4b454e'));
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
