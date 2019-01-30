const assert = require('assert');

import abi from 'utils/abi/index';

describe('utils/tools', function () {
    it('encode-token-id', function () {
        let result = abi.encodeParameter('tokenId', 'tti_5649544520544f4b454e6e40');
        assert.equal('000000000000000000000000000000000000000000005649544520544f4b454e', result);
    });
});
