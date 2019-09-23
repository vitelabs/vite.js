const assert = require('assert');

import * as type from '../../src/type';
import * as constant from '../../src/constant/index';

it('type.BlockType be equal to constant.BlockType', function () {
    assert.deepEqual(type.BlockType, constant.BlockType);
});

describe('TransactionType', function () {
    for (const contractTxType in constant.Contracts) {
        it(`contractTxType ${ contractTxType }`, function () {
            assert.equal(!!type.TransactionType[contractTxType], true);
        });
    }

    for (const blockT in constant.BlockType) {
        it(`blockType ${ blockT }`, function () {
            assert.equal(!!type.TransactionType[blockT], true);
        });
    }
});
