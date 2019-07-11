const assert = require('assert');

import * as abi from '../../src/abi/index';

describe('encodeParameter', function () {
    it('uint256', function () {
        const _r = abi.encodeParameter('uint256', '2345675643');
        assert.equal('000000000000000000000000000000000000000000000000000000008bd02b7b', _r);
    });
    it('uint', function () {
        const _r1 = abi.encodeParameter('uint', '2345675643');
        assert.equal('000000000000000000000000000000000000000000000000000000008bd02b7b', _r1);
    });
    it('tokenId', function () {
        const result = abi.encodeParameter('tokenId', 'tti_5649544520544f4b454e6e40');
        assert.equal('000000000000000000000000000000000000000000005649544520544f4b454e', result);
    });
    it('uint8', function () {
        const encodeParameterResult1 = abi.encodeParameter('uint8', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult1);
    });
    it('int 2', function () {
        const encodeParameterResult1111 = abi.encodeParameter('int', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult1111);
    });
    it('int -2', function () {
        const encodeParameterResult1111 = abi.encodeParameter('int', '-2');
        assert.equal('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe', encodeParameterResult1111);
    });
    it('int -19999999999999999999999999999999999999999999999999999999999999', function () {
        const encodeParameterResult1111 = abi.encodeParameter('int', '-19999999999999999999999999999999999999999999999999999999999999');
        assert.equal('fffffffffffff38dd0f10627f5529bdb2c52d4846810af0ac000000000000001', encodeParameterResult1111);
    });
    it('bytes', function () {
        const _xxx = abi.encodeParameter('bytes', '0xdf3234');
        assert.equal('00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000', _xxx);
    });
    it('uint16', function () {
        const encodeParameterResult3 = abi.encodeParameter('uint16', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult3);
    });
    it('uint16[]', function () {
        const encodeParameterResult4 = abi.encodeParameter('uint16[]', [ 1, 2 ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult4);
    });
    it('uint8[]', function () {
        const encodeParameterResult2 = abi.encodeParameter('uint8[]', [ '1', '2' ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult2);
    });
    it('uint32', function () {
        const encodeParameterResult5 = abi.encodeParameter('uint32', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult5);
    });
    it('uint32[]', function () {
        const encodeParameterResult6 = abi.encodeParameter('uint32[]', [ 1, 2 ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult6);
    });
    it('uint64', function () {
        const encodeParameterResult7 = abi.encodeParameter('uint64', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult7);
    });
    it('uint64[]', function () {
        const encodeParameterResult8 = abi.encodeParameter('uint64[]', [ 1, 2 ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult8);
    });
    it('uint256', function () {
        const encodeParameterResult9 = abi.encodeParameter('uint256', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult9);
    });
    it('uint256[]', function () {
        const encodeParameterResult10 = abi.encodeParameter('uint256[]', [ 1, 2 ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult10);
    });
    it('int8', function () {
        const encodeParameterResult11 = abi.encodeParameter('int8', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult11);
    });
    it('int8 -2', function () {
        const encodeParameterResult1111 = abi.encodeParameter('int8', '-2');
        assert.equal('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe', encodeParameterResult1111);
    });
    it('int8[]', function () {
        const encodeParameterResult12 = abi.encodeParameter('int8[]', [ 1, 2 ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult12);
    });
    it('int8[] -', function () {
        const encodeParameterResult14 = abi.encodeParameter('int8[]', [ -2, -99 ]);
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9d', encodeParameterResult14);
    });
    it('int16', function () {
        const encodeParameterResult13 = abi.encodeParameter('int16', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult13);
    });
    it('int16 -2', function () {
        const encodeParameterResult1111 = abi.encodeParameter('int16', '-2');
        assert.equal('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe', encodeParameterResult1111);
    });
    it('int16[]', function () {
        const encodeParameterResult14 = abi.encodeParameter('int16[]', [ 1, 2 ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult14);
    });
    it('int16[] -', function () {
        const encodeParameterResult14 = abi.encodeParameter('int16[]', [ -2, -99 ]);
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9d', encodeParameterResult14);
    });

    it('int32', function () {
        const encodeParameterResult15 = abi.encodeParameter('int32', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult15);
    });
    it('int32 -2', function () {
        const encodeParameterResult1111 = abi.encodeParameter('int32', '-2');
        assert.equal('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe', encodeParameterResult1111);
    });
    it('int32[]', function () {
        const encodeParameterResult16 = abi.encodeParameter('int32[]', [ 1, 2 ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult16);
    });
    it('int32[] -', function () {
        const encodeParameterResult14 = abi.encodeParameter('int16[]', [ -2, -99 ]);
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9d', encodeParameterResult14);
    });
    it('int64', function () {
        const encodeParameterResult17 = abi.encodeParameter('int64', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult17);
    });
    it('int64 -2', function () {
        const encodeParameterResult1111 = abi.encodeParameter('int64', '-2');
        assert.equal('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe', encodeParameterResult1111);
    });
    it('int64[]', function () {
        const encodeParameterResult18 = abi.encodeParameter('int64[]', [ 1, 2 ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult18);
    });

    it('int256', function () {
        const encodeParameterResult19 = abi.encodeParameter('int256', '2');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult19);
    });
    it('int256 -2', function () {
        const encodeParameterResult1111 = abi.encodeParameter('int256', '-2');
        assert.equal('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe', encodeParameterResult1111);
    });

    it('int256[]', function () {
        const encodeParameterResult20 = abi.encodeParameter('int256[]', [ 1, 2 ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult20);
    });
    it('bytes1', function () {
        const encodeParameterResult21 = abi.encodeParameter('bytes1', '0x01');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult21);
    });
    it('bytes2', function () {
        const encodeParameterResult22 = abi.encodeParameter('bytes2', '0x0100');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult22);
    });
    it('bytes3', function () {
        const encodeParameterResult23 = abi.encodeParameter('bytes3', '0x010000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult23);
    });
    it('bytes4', function () {
        const encodeParameterResult24 = abi.encodeParameter('bytes4', '0x01000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult24);
    });
    it('bytes5', function () {
        const encodeParameterResult25 = abi.encodeParameter('bytes5', '0x0100000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult25);
    });
    it('bytes6', function () {
        const encodeParameterResult26 = abi.encodeParameter('bytes6', '0x010000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult26);
    });
    it('bytes7', function () {
        const encodeParameterResult27 = abi.encodeParameter('bytes7', '0x01000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult27);
    });
    it('bytes8', function () {
        const encodeParameterResult28 = abi.encodeParameter('bytes8', '0x0100000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult28);
    });
    it('bytes9', function () {
        const encodeParameterResult29 = abi.encodeParameter('bytes9', '0x010000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult29);
    });
    it('bytes10', function () {
        const encodeParameterResult30 = abi.encodeParameter('bytes10', '0x01000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult30);
    });
    it('bytes11', function () {
        const encodeParameterResult31 = abi.encodeParameter('bytes11', '0x0100000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult31);
    });
    it('bytes12', function () {
        const encodeParameterResult32 = abi.encodeParameter('bytes12', '0x010000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult32);
    });
    it('bytes13', function () {
        const encodeParameterResult33 = abi.encodeParameter('bytes13', '0x01000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult33);
    });
    it('bytes14', function () {
        const encodeParameterResult34 = abi.encodeParameter('bytes14', '0x0100000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult34);
    });
    it('bytes15', function () {
        const encodeParameterResult35 = abi.encodeParameter('bytes15', '0x010000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult35);
    });
    it('bytes16', function () {
        const encodeParameterResult36 = abi.encodeParameter('bytes16', '0x01000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult36);
    });
    it('bytes17', function () {
        const encodeParameterResult37 = abi.encodeParameter('bytes17', '0x0100000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult37);
    });
    it('bytes18', function () {
        const encodeParameterResult38 = abi.encodeParameter('bytes18', '0x010000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult38);
    });
    it('bytes19', function () {
        const encodeParameterResult39 = abi.encodeParameter('bytes19', '0x01000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult39);
    });
    it('bytes20', function () {
        const encodeParameterResult40 = abi.encodeParameter('bytes20', '0x0100000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult40);
    });
    it('bytes21', function () {
        const encodeParameterResult41 = abi.encodeParameter('bytes21', '0x010000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult41);
    });
    it('bytes22', function () {
        const encodeParameterResult42 = abi.encodeParameter('bytes22', '0x01000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult42);
    });
    it('bytes23', function () {
        const encodeParameterResult43 = abi.encodeParameter('bytes23', '0x0100000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult43);
    });
    it('bytes24', function () {
        const encodeParameterResult44 = abi.encodeParameter('bytes24', '0x010000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult44);
    });
    it('bytes25', function () {
        const encodeParameterResult46 = abi.encodeParameter('bytes25', '0x01000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult46);
    });
    it('bytes26', function () {
        const encodeParameterResult47 = abi.encodeParameter('bytes26', '0x0100000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult47);
    });
    it('bytes27', function () {
        const encodeParameterResult48 = abi.encodeParameter('bytes27', '0x010000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult48);
    });
    it('bytes28', function () {
        const encodeParameterResult49 = abi.encodeParameter('bytes28', '0x01000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult49);
    });
    it('bytes29', function () {
        const encodeParameterResult50 = abi.encodeParameter('bytes29', '0x0100000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult50);
    });
    it('bytes30', function () {
        const encodeParameterResult51 = abi.encodeParameter('bytes30', '0x010000000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult51);
    });
    it('bytes31', function () {
        const encodeParameterResult52 = abi.encodeParameter('bytes31', '0x01000000000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult52);
    });
    it('bytes32', function () {
        const encodeParameterResult53 = abi.encodeParameter('bytes32', '0x0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000000000000000000000000000000000', encodeParameterResult53);
    });
    it('address[]', function () {
        const encodeParameterResult55 = abi.encodeParameter('address[]', [ 'vite_010000000000000000000000000000000000000063bef3da00', 'vite_0200000000000000000000000000000000000000e4194eedc2' ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000', encodeParameterResult55);
    });
    it('address', function () {
        const encodeParameterResult5555 = abi.encodeParameter('address', 'vite_010000000000000000000000000000000000000063bef3da00');
        assert.equal('0000000000000000000000010000000000000000000000000000000000000000', encodeParameterResult5555);
    });
    it('tokenId[]', function () {
        const encodeParameterResult57 = abi.encodeParameter('tokenId[]', [ 'tti_01000000000000000000fb5e', 'tti_02000000000000000000199f' ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000', encodeParameterResult57);
    });
    it('gid[]', function () {
        const encodeParameterResult56 = abi.encodeParameter('gid[]', [ '01000000000000000000', '02000000000000000000' ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000', encodeParameterResult56);
    });
    it('gid', function () {
        const encodeParameterResult5666 = abi.encodeParameter('gid', '01000000000000000000');
        assert.equal('0000000000000000000000000000000000000000000001000000000000000000', encodeParameterResult5666);
    });
    it('bool', function () {
        const encodeParameterResult5667 = abi.encodeParameter('bool', true);
        assert.equal('0000000000000000000000000000000000000000000000000000000000000001', encodeParameterResult5667);
    });
    it('bytes32[]', function () {
        const encodeParameterResult58 = abi.encodeParameter('bytes32[]', [ '0x0100000000000000000000000000000000000000000000000000000000000000', '0x0200000000000000000000000000000000000000000000000000000000000000' ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000201000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000', encodeParameterResult58);
    });
    it('bytes 0X', function () {
        const encodeParameterResult5889 = abi.encodeParameter('bytes', '0xdf3234');
        assert.equal('00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000', encodeParameterResult5889);
    });
    it('bytes', function () {
        const encodeParameterResult5899 = abi.encodeParameter('bytes', 'df3234');
        assert.equal('00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000', encodeParameterResult5899);
    });
    it('string foobar', function () {
        const encodeParameterResult60 = abi.encodeParameter('string', 'foobar');
        assert.equal('0000000000000000000000000000000000000000000000000000000000000006666f6f6261720000000000000000000000000000000000000000000000000000', encodeParameterResult60);
    });
    it('string 0x02', function () {
        const encodeParameterResult60 = abi.encodeParameter('string', '0x02');
        assert.equal('00000000000000000000000000000000000000000000000000000000000000043078303200000000000000000000000000000000000000000000000000000000', encodeParameterResult60);
    });
    it('string 02ab', function () {
        const encodeParameterResult60 = abi.encodeParameter('string', '02ab');
        assert.equal('00000000000000000000000000000000000000000000000000000000000000043032616200000000000000000000000000000000000000000000000000000000', encodeParameterResult60);
    });
    it('uint8[2]', function () {
        const encodeParameterResult6000 = abi.encodeParameter('uint8[2]', [ '1', '2' ]);
        assert.equal('00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParameterResult6000);
    });
    it('uint32[2][3][4]', function () {
        // Not support
        const encodeParameterResult54 = abi.encodeParameter('uint32[2][3][4]', [[[ 1, 2 ], [ 3, 4 ], [ 5, 6 ]], [[ 7, 8 ], [ 9, 10 ], [ 11, 12 ]], [[ 13, 14 ], [ 15, 16 ], [ 17, 18 ]], [[ 19, 20 ], [ 21, 22 ], [ 23, 24 ]]]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000110000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001300000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000015000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000018', encodeParameterResult54);
    });
    // it('bytes[][][]',function() {
    //     let encodeParameterResult65 = abi.encodeParameter('bytes[][][]', [[['0x0100000000000000000000000000000000000000000000000000000000000000'],['0x0100000000000000000000000000000000000000000000000000000000000000','0x0100000000000000000000000000000000000000000000000000000000000000'],['0x0100000000000000000000000000000000000000000000000000000000000000']]]);
    //     assert.equal('', encodeParameterResult65);
    // })
});

describe('decodeParameter', function () {
    it('tokenId', function () {
        const result = abi.decodeParameter('tokenId', '000000000000000000000000000000000000000000005649544520544f4b454e');
        assert.equal('tti_5649544520544f4b454e6e40', result);
    });
    it('uint8', function () {
        const encodeParameterResult1 = abi.decodeParameter('uint8', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult1);
    });
    it('uint16', function () {
        const encodeParameterResult3 = abi.decodeParameter('uint16', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult3);
    });
    it('uint32', function () {
        const encodeParameterResult5 = abi.decodeParameter('uint32', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult5);
    });
    it('uint64', function () {
        const encodeParameterResult7 = abi.decodeParameter('uint64', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult7);
    });
    it('uint256', function () {
        const encodeParameterResult9 = abi.decodeParameter('uint256', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult9);
    });
    it('int8', function () {
        const encodeParameterResult11 = abi.decodeParameter('int8', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult11);
    });
    it('int8 -2', function () {
        const encodeParameterResult1111 = abi.decodeParameter('int8', 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe');
        assert.equal('-2', encodeParameterResult1111);
    });
    it('int8[] -', function () {
        const encodeParameterResult14 = abi.decodeParameter('int8[]', '0000000000000000000000000000000000000000000000000000000000000002fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9d');
        assert.deepEqual([ -2, -99 ], encodeParameterResult14);
    });
    it('int16', function () {
        const encodeParameterResult13 = abi.decodeParameter('int16', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult13);
    });
    it('int16 -2', function () {
        const encodeParameterResult1111 = abi.decodeParameter('int16', 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe');
        assert.equal('-2', encodeParameterResult1111);
    });
    it('int16[] -', function () {
        const encodeParameterResult14 = abi.decodeParameter('int16[]', '0000000000000000000000000000000000000000000000000000000000000002fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9d');
        assert.deepEqual([ -2, -99 ], encodeParameterResult14);
    });
    it('int32', function () {
        const encodeParameterResult15 = abi.decodeParameter('int32', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult15);
    });
    it('int32 -2', function () {
        const encodeParameterResult1111 = abi.decodeParameter('int32', 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe');
        assert.equal('-2', encodeParameterResult1111);
    });
    it('int32[] -', function () {
        const encodeParameterResult14 = abi.decodeParameter('int16[]', '0000000000000000000000000000000000000000000000000000000000000002fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9d');
        assert.deepEqual([ -2, -99 ], encodeParameterResult14);
    });
    it('int64', function () {
        const encodeParameterResult17 = abi.decodeParameter('int64', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult17);
    });
    it('int64 -2', function () {
        const encodeParameterResult1111 = abi.decodeParameter('int64', 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe');
        assert.equal(-2, encodeParameterResult1111);
    });
    it('int256', function () {
        const encodeParameterResult19 = abi.decodeParameter('int256', '0000000000000000000000000000000000000000000000000000000000000002');
        assert.equal('2', encodeParameterResult19);
    });
    it('int256 -2', function () {
        const encodeParameterResult1111 = abi.decodeParameter('int256', 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe');
        assert.equal(-2, encodeParameterResult1111);
    });
    it('uint16[]', function () {
        const encodeParameterResult4 = abi.decodeParameter('uint16[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ '1', '2' ], encodeParameterResult4);
    });
    it('bytes', function () {
        const _xxx = abi.decodeParameter('bytes', '00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000');
        assert.equal('df3234', _xxx);
    });
    it('uint8[]', function () {
        const encodeParameterResult2 = abi.decodeParameter('uint8[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ '1', '2' ], encodeParameterResult2);
    });
    it('uint32[]', function () {
        const encodeParameterResult6 = abi.decodeParameter('uint32[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ '1', '2' ], encodeParameterResult6);
    });
    it('uint64[]', function () {
        const encodeParameterResult8 = abi.decodeParameter('uint64[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ '1', '2' ], encodeParameterResult8);
    });
    it('uint256[]', function () {
        const encodeParameterResult10 = abi.decodeParameter('uint256[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ '1', '2' ], encodeParameterResult10);
    });
    it('int8[]', function () {
        const encodeParameterResult12 = abi.decodeParameter('int8[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ '1', '2' ], encodeParameterResult12);
    });
    it('int16[]', function () {
        const encodeParameterResult14 = abi.decodeParameter('int16[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ '1', '2' ], encodeParameterResult14);
    });
    it('int32[]', function () {
        const encodeParameterResult16 = abi.decodeParameter('int32[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ 1, 2 ], encodeParameterResult16);
    });
    it('int64[]', function () {
        const encodeParameterResult18 = abi.decodeParameter('int64[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ 1, 2 ], encodeParameterResult18);
    });
    it('int256[]', function () {
        const encodeParameterResult20 = abi.decodeParameter('int256[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ 1, 2 ], encodeParameterResult20);
    });
    it('bytes1', function () {
        const encodeParameterResult21 = abi.decodeParameter('bytes1', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('01', encodeParameterResult21);
    });
    it('bytes2', function () {
        const encodeParameterResult22 = abi.decodeParameter('bytes2', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('0100', encodeParameterResult22);
    });
    it('bytes3', function () {
        const encodeParameterResult23 = abi.decodeParameter('bytes3', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('010000', encodeParameterResult23);
    });
    it('bytes4', function () {
        const encodeParameterResult24 = abi.decodeParameter('bytes4', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('01000000', encodeParameterResult24);
    });
    it('bytes5', function () {
        const encodeParameterResult25 = abi.decodeParameter('bytes5', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000', encodeParameterResult25);
    });
    it('bytes6', function () {
        const encodeParameterResult26 = abi.decodeParameter('bytes6', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('010000000000', encodeParameterResult26);
    });
    it('bytes7', function () {
        const encodeParameterResult27 = abi.decodeParameter('bytes7', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('01000000000000', encodeParameterResult27);
    });
    it('bytes8', function () {
        const encodeParameterResult28 = abi.decodeParameter('bytes8', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000', encodeParameterResult28);
    });
    it('bytes9', function () {
        const encodeParameterResult29 = abi.decodeParameter('bytes9', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('010000000000000000', encodeParameterResult29);
    });
    it('bytes10', function () {
        const encodeParameterResult30 = abi.decodeParameter('bytes10', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('01000000000000000000', encodeParameterResult30);
    });
    it('bytes11', function () {
        const encodeParameterResult31 = abi.decodeParameter('bytes11', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000', encodeParameterResult31);
    });
    it('bytes12', function () {
        const encodeParameterResult32 = abi.decodeParameter('bytes12', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('010000000000000000000000', encodeParameterResult32);
    });
    it('bytes13', function () {
        const encodeParameterResult33 = abi.decodeParameter('bytes13', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('01000000000000000000000000', encodeParameterResult33);
    });
    it('bytes14', function () {
        const encodeParameterResult34 = abi.decodeParameter('bytes14', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000', encodeParameterResult34);
    });
    it('bytes15', function () {
        const encodeParameterResult35 = abi.decodeParameter('bytes15', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('010000000000000000000000000000', encodeParameterResult35);
    });
    it('bytes16', function () {
        const encodeParameterResult36 = abi.decodeParameter('bytes16', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('01000000000000000000000000000000', encodeParameterResult36);
    });
    it('bytes17', function () {
        const encodeParameterResult37 = abi.decodeParameter('bytes17', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('0100000000000000000000000000000000', encodeParameterResult37);
    });
    it('bytes18', function () {
        const encodeParameterResult38 = abi.decodeParameter('bytes18', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('010000000000000000000000000000000000', encodeParameterResult38);
    });
    it('bytes19', function () {
        const encodeParameterResult39 = abi.decodeParameter('bytes19', '0100000000000000000000000000000000000000000000000000000000000000');
        assert.equal('01000000000000000000000000000000000000', encodeParameterResult39);
    });
    it('address[]', function () {
        const encodeParameterResult55 = abi.decodeParameter('address[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000');
        assert.deepEqual([ 'vite_00010000000000000000000000000000000000005cce05dbde', 'vite_0002000000000000000000000000000000000000fe64322db1' ], encodeParameterResult55);
    });
    it('tokenId[]', function () {
        const encodeParameterResult57 = abi.decodeParameter('tokenId[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000');
        assert.deepEqual([ 'tti_01000000000000000000fb5e', 'tti_02000000000000000000199f' ], encodeParameterResult57);
    });
    it('gid[]', function () {
        const encodeParameterResult56 = abi.decodeParameter('gid[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000');
        assert.deepEqual([ '01000000000000000000', '02000000000000000000' ], encodeParameterResult56);
    });
    it('bytes32[]', function () {
        const encodeParameterResult58 = abi.decodeParameter('bytes32[]', '000000000000000000000000000000000000000000000000000000000000000201000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000');
        assert.deepEqual([ '0100000000000000000000000000000000000000000000000000000000000000', '0200000000000000000000000000000000000000000000000000000000000000' ], encodeParameterResult58);
    });
    it('string', function () {
        const encodeParameterResult60 = abi.decodeParameter('string', '0000000000000000000000000000000000000000000000000000000000000006666f6f6261720000000000000000000000000000000000000000000000000000');
        assert.equal('foobar', encodeParameterResult60);
    });
    it('string 0x02', function () {
        const encodeParameterResult60 = abi.decodeParameter('string', '00000000000000000000000000000000000000000000000000000000000000043078303200000000000000000000000000000000000000000000000000000000');
        assert.equal('0x02', encodeParameterResult60);
    });
    it('string 02ab', function () {
        const encodeParameterResult60 = abi.decodeParameter('string', '00000000000000000000000000000000000000000000000000000000000000043032616200000000000000000000000000000000000000000000000000000000');
        assert.equal('02ab', encodeParameterResult60);
    });
    // Not support
    it('uint32[2][3][4]', function () {
        const encodeParameterResult54 = abi.decodeParameter('uint32[2][3][4]', '000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000110000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001300000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000015000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000018');
        assert.deepEqual([[[ 1, 2 ], [ 3, 4 ], [ 5, 6 ]], [[ 7, 8 ], [ 9, 10 ], [ 11, 12 ]], [[ 13, 14 ], [ 15, 16 ], [ 17, 18 ]], [[ 19, 20 ], [ 21, 22 ], [ 23, 24 ]]], encodeParameterResult54);
    });
});

describe('encodeParameters', function () {
    it('0 abi constructor array', function () {
        const encodeParametersResult1 = abi.encodeParameters([
            { 'type': 'uint8[]' }, { 'type': 'bytes' }
        ], [[ '34', '43' ], '324567ff' ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002b0000000000000000000000000000000000000000000000000000000000000004324567ff00000000000000000000000000000000000000000000000000000000', encodeParametersResult1);
    });
    it('1 abi constructor array', function () {
        const encodeParametersResult1 = abi.encodeParameters({
            'type': 'constructor',
            'inputs': [
                { 'type': 'uint8[]' }, { 'type': 'bytes' }
            ]
        }, [[ '34', '43' ], '324567ff' ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002b0000000000000000000000000000000000000000000000000000000000000004324567ff00000000000000000000000000000000000000000000000000000000', encodeParametersResult1);
    });
    it('1 abi constructor string', function () {
        const encodeParametersResult1 = abi.encodeParameters({
            'type': 'constructor',
            'inputs': [
                { 'type': 'uint8[]' }, { 'type': 'bytes' }
            ]
        }, JSON.stringify([[ '34', '43' ], '324567ff' ]));
        assert.equal('000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002b0000000000000000000000000000000000000000000000000000000000000004324567ff00000000000000000000000000000000000000000000000000000000', encodeParametersResult1);
    });
    it('no inputs', function () {
        const encodeParametersResult1 = abi.encodeParameters({ 'type': 'constructor' });
        assert.equal('', encodeParametersResult1);
    });
    it('inputs []', function () {
        const encodeParametersResult1 = abi.encodeParameters({ 'type': 'constructor', inputs: [] });
        assert.equal('', encodeParametersResult1);
    });
    it('multi abi constructor', function () {
        const encodeParametersResult12 = abi.encodeParameters([
            { 'type': 'constructor', 'name': 'myMethods', 'inputs': [ { 'type': 'uint8[]' }, { 'type': 'bytes' } ] },
            { 'type': 'constructor', 'name': 'myMetod', 'inputs': [{ 'type': 'bytes' }] },
            { 'type': 'constructor', 'name': 'myMethowed', 'inputs': [ { 'type': 'uint8[]' }, { 'type': 'bytes' } ] },
            { 'type': 'constructor', 'name': 'myMethossssd', 'inputs': [{ 'type': 'bytes' }] }
        ], [[ '34', '43' ], '324567ff' ], 'myMethowed');
        assert.equal('000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002b0000000000000000000000000000000000000000000000000000000000000004324567ff00000000000000000000000000000000000000000000000000000000', encodeParametersResult12);
    });
    it('[ address, uint8[] ]', function () {
        const encodeParametersResult2 = abi.encodeParameters([ 'address', 'uint8[]' ], [ 'vite_010000000000000000000000000000000000000063bef3da00', [ 1, 2 ]]);
        assert.equal('00000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParametersResult2);
    });
    it('[ uint8[], address ]', function () {
        const encodeParametersResult3 = abi.encodeParameters([ 'uint8[]', 'address' ], [[ 1, 2 ], 'vite_010000000000000000000000000000000000000063bef3da00' ]);
        assert.equal('00000000000000000000000000000000000000000000000000000000000000400000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', encodeParametersResult3);
    });
    it('[ tokenId, address ]', function () {
        const encodeParametersResult4 = abi.encodeParameters([ 'tokenId', 'address' ], [ 'tti_01000000000000000000fb5e', 'vite_010000000000000000000000000000000000000063bef3da00' ]);
        assert.equal('00000000000000000000000000000000000000000000010000000000000000000000000000000000000000010000000000000000000000000000000000000000', encodeParametersResult4);
    });
    it('[ string, tokenId, address ]', function () {
        const encodeParametersResult5 = abi.encodeParameters([ 'string', 'tokenId', 'address' ], [ '4829482nsdkjskd', 'tti_01000000000000000000fb5e', 'vite_010000000000000000000000000000000000000063bef3da00' ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000010000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f343832393438326e73646b6a736b640000000000000000000000000000000000', encodeParametersResult5);
    });
    it('[ string, bytes32[], address ]', function () {
        const encodeParametersResult6 = abi.encodeParameters([ 'string', 'bytes32[]', 'address' ], [ '4829482nsdkjskd', [ '0x0100000000000000000000000000000000000000000000000000000000000000', '0x0200000000000000000000000000000000000000000000000000000000000000' ], 'vite_010000000000000000000000000000000000000063bef3da00' ]);
        assert.equal('000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f343832393438326e73646b6a736b640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000201000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000', encodeParametersResult6);
    });
    it('[ int64, int32[], int8 ]', function () {
        const encodeParametersResult6 = abi.encodeParameters([ 'int64', 'int32[]', 'int8' ], [ -1, [ -99, -5 ], -9 ]);
        assert.equal('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000060fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff70000000000000000000000000000000000000000000000000000000000000002ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb', encodeParametersResult6);
    });
});

describe('decodeParameters', function () {
    it('case 0', function () {
        const result = abi.decodeParameters([
            { 'type': 'uint8[]' }, { 'type': 'bytes' }
        ], '000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002b0000000000000000000000000000000000000000000000000000000000000004324567ff00000000000000000000000000000000000000000000000000000000');
        assert.deepEqual([[ '34', '43' ], '324567ff' ], result);
    });
    it('case 1', function () {
        const encodeParametersResult1 = abi.decodeParameters({
            'type': 'constructor',
            'inputs': [
                { 'type': 'uint8[]' }, { 'type': 'bytes' }
            ]
        }, '000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002b0000000000000000000000000000000000000000000000000000000000000004324567ff00000000000000000000000000000000000000000000000000000000');
        assert.deepEqual([[ '34', '43' ], '324567ff' ], encodeParametersResult1);
    });
    it('case 2', function () {
        const encodeParametersResult22 = abi.decodeParameters([
            { 'type': 'function', 'name': 'singl', 'inputs': [{ 'name': 'param1', 'type': 'address' }] },
            {
                'type': 'function',
                'name': 'singleParam',
                'inputs': [
                    { 'name': 'param1', 'type': 'address' },
                    { 'name': 'param1', 'type': 'uint8[]' }
                ]
            }
        ], '00000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', 'singleParam');
        assert.deepEqual([ 'vite_00010000000000000000000000000000000000005cce05dbde', [ 1, 2 ]], encodeParametersResult22);
    });
    it('case 3', function () {
        const encodeParametersResult2 = abi.decodeParameters([ 'address', 'uint8[]' ], '00000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([ 'vite_00010000000000000000000000000000000000005cce05dbde', [ 1, 2 ]], encodeParametersResult2);
    });
    it('case 4', function () {
        const encodeParametersResult3 = abi.decodeParameters([ 'uint8[]', 'address' ], '00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
        assert.deepEqual([[ 1, 2 ], 'vite_00010000000000000000000000000000000000005cce05dbde' ], encodeParametersResult3);
    });
    it('case 5', function () {
        const encodeParametersResult4 = abi.decodeParameters([ 'tokenId', 'address' ], '00000000000000000000000000000000000000000000010000000000000000000000000000000000000000000100000000000000000000000000000000000000');
        assert.deepEqual([ 'tti_01000000000000000000fb5e', 'vite_00010000000000000000000000000000000000005cce05dbde' ], encodeParametersResult4);
    });
    it('case 6', function () {
        const encodeParametersResult5 = abi.decodeParameters([ 'string', 'tokenId', 'address' ], '000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f343832393438326e73646b6a736b640000000000000000000000000000000000');
        assert.deepEqual([ '4829482nsdkjskd', 'tti_01000000000000000000fb5e', 'vite_00010000000000000000000000000000000000005cce05dbde' ], encodeParametersResult5);
    });
    it('case 7', function () {
        const encodeParametersResult6 = abi.decodeParameters([ 'string', 'bytes32[]', 'address' ], '000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f343832393438326e73646b6a736b640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000201000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000');
        assert.deepEqual([ '4829482nsdkjskd', [ '0100000000000000000000000000000000000000000000000000000000000000', '0200000000000000000000000000000000000000000000000000000000000000' ], 'vite_00010000000000000000000000000000000000005cce05dbde' ], encodeParametersResult6);
    });
    it('case 8', function () {
        const encodeParametersResult6 = abi.decodeParameters([ 'int64', 'int32[]', 'int8' ], 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000060fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff70000000000000000000000000000000000000000000000000000000000000002ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb');
        assert.deepEqual([ -1, [ -99, -5 ], -9 ], encodeParametersResult6);
    });
});

describe('encodeFunctionSignature', function () {
    it('case 1', function () {
        const encodeMethodResult1 = abi.encodeFunctionSignature({ 'type': 'function', 'name': 'singleParam', 'inputs': [{ 'name': 'param1', 'type': 'address' }] });
        assert.equal('053f71a4', encodeMethodResult1);
    });
    it('case 2', function () {
        const encodeMethodResult2 = abi.encodeFunctionSignature({ 'type': 'function', 'name': 'twoParams', 'inputs': [ { 'name': 'param1', 'type': 'tokenId' }, { 'name': 'param2', 'type': 'uint256[2]' } ] });
        assert.equal('41bdf4f6', encodeMethodResult2);
    });
    it('case 3', function () {
        const encodeMethodResult3 = abi.encodeFunctionSignature([{ 'type': 'function', 'name': 'singleParam', 'inputs': [{ 'name': 'param1', 'type': 'address' }] }]);
        assert.equal('053f71a4', encodeMethodResult3);
    });
    it('case 4', function () {
        const encodeMethodResult4 = abi.encodeFunctionSignature([
            { 'type': 'function', 'name': 'singleParam', 'inputs': [{ 'name': 'param1', 'type': 'address' }] },
            { 'type': 'function', 'name': 'singl', 'inputs': [{ 'name': 'param1', 'type': 'address' }] }
        ], 'singleParam');
        assert.equal('053f71a4', encodeMethodResult4);
    });
    it('case 5', function () {
        const encodeMethodResult5 = abi.encodeFunctionSignature('singleParam(address)');
        assert.equal('053f71a4', encodeMethodResult5);
    });
    it('case 6', function () {
        const encodeMethodResult1 = abi.encodeFunctionSignature({ 'type': 'function', 'name': 'noParam' });
        assert.equal('e3cb7377', encodeMethodResult1);
    });
});

describe('encodeLogSignature', function () {
    it('case 1', function () {
        const encodeLogSignatureResult1 = abi.encodeLogSignature({
            'type': 'event',
            'name': 'balance',
            'inputs': [{ 'name': 'in', 'type': 'uint256' }]
        });
        assert.equal('8a3390b86e28f274e3a88354b3b83cf0f8780a1f0975f629966bd2a2d38eb188', encodeLogSignatureResult1);
    });
    it('case 2', function () {
        const encodeLogSignatureResult2 = abi.encodeLogSignature({ 'type': 'event', 'name': 'check', 'inputs': [ { 'name': 't', 'type': 'address' }, { 'name': 'b', 'type': 'uint256' } ] });
        assert.equal('17c53855485cba60b5dea781a996394bb9d3b44bc8932b3adf79ac70e908b220', encodeLogSignatureResult2);
    });
    it('case 3', function () {
        const encodeLogSignatureResult22 = abi.encodeLogSignature([
            { 'type': 'event', 'name': 'heck', 'inputs': [{ 'name': 't', 'type': 'address' }] },
            { 'type': 'event', 'name': 'check', 'inputs': [ { 'name': 't', 'type': 'address' }, { 'name': 'b', 'type': 'uint256' } ] },
            { 'type': 'event', 'name': 'eck', 'inputs': [] }
        ], 'check');
        assert.equal('17c53855485cba60b5dea781a996394bb9d3b44bc8932b3adf79ac70e908b220', encodeLogSignatureResult22);
    });
});

describe('decodeLog', function () {
    it('case 1', function () {
        const decodeResult1 = abi.decodeLog({
            'type': 'constructor',
            'inputs': [
                { type: 'string', name: 'myString' },
                { type: 'uint256', name: 'myNumber', indexed: true },
                { type: 'uint8', name: 'mySmallNumber', indexed: true }
            ]
        },
        '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
        [ '000000000000000000000000000000000000000000000000000000000000f310', '0000000000000000000000000000000000000000000000000000000000000010' ]);
        assert.deepEqual({
            '0': 'Hello%!',
            '1': '62224',
            '2': '16',
            myString: 'Hello%!',
            myNumber: '62224',
            mySmallNumber: '16'
        }, decodeResult1);
    });
    it('case 2', function () {
        const decodeResult222 = abi.decodeLog([
            {
                'type': 'constructor',
                'name': '89xxx',
                'inputs': [{ type: 'string', name: 'myString' }]
            },
            { 'name': '232', 'inputs': [] },
            {
                'type': 'constructor',
                'name': 'xxxxx',
                'inputs': [
                    { type: 'string', name: 'myString' },
                    { type: 'uint256', name: 'myNumber', indexed: true },
                    { type: 'uint8', name: 'mySmallNumber', indexed: true }
                ]
            }
        ],
        '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
        [ '000000000000000000000000000000000000000000000000000000000000f310', '0000000000000000000000000000000000000000000000000000000000000010' ], 'xxxxx');
        assert.deepEqual({
            '0': 'Hello%!',
            '1': '62224',
            '2': '16',
            myString: 'Hello%!',
            myNumber: '62224',
            mySmallNumber: '16'
        }, decodeResult222);
    });
    it('case 3', function () {
        const decodeResult2 = abi.decodeLog([ { 'indexed': true, 'name': 'from', 'type': 'address' }, { 'indexed': true, 'name': 'to', 'type': 'address' }, { 'indexed': false, 'name': 'value', 'type': 'uint256' } ],
            '00000000000000000000000000000000000000000000000000000000000f4240',
            [ '0000000000000000000000000100000000000000000000000000000000000000', '0000000000000000000000000200000000000000000000000000000000000000' ]);
        assert.deepEqual({
            '0': 'vite_00010000000000000000000000000000000000005cce05dbde',
            '1': 'vite_0002000000000000000000000000000000000000fe64322db1',
            '2': '1000000',
            from: 'vite_00010000000000000000000000000000000000005cce05dbde',
            to: 'vite_0002000000000000000000000000000000000000fe64322db1',
            value: '1000000'
        }, decodeResult2);
    });
    it('case 4', function () {
        const decodeResult3 = abi.decodeLog([
            { 'indexed': false, 'name': 'who', 'type': 'address' },
            { 'indexed': false, 'name': 'wad', 'type': 'uint128' },
            { 'indexed': false, 'name': 'currency', 'type': 'bytes3' } ],
        '00000000000000000000000000ce0d46d924cc8437c806721496599fc3ffa2680000000000000000000000000000000000000000000000000000020489e800007573640000000000000000000000000000000000000000000000000000000000',
        []);
        assert.deepEqual({
            '0': 'vite_0000ce0d46d924cc8437c806721496599fc3ffa288d2bea2cf',
            '1': '2218516807680',
            '2': '757364',
            who: 'vite_0000ce0d46d924cc8437c806721496599fc3ffa288d2bea2cf',
            wad: '2218516807680',
            currency: '757364'
        }, decodeResult3);
    });
});

describe('encodeFunctionCall', function () {
    it('case 1', function () {
        const result = abi.encodeFunctionCall({
            name: 'myMethod',
            type: 'function',
            inputs: [ {
                type: 'uint256',
                name: 'myNumber'
            }, {
                type: 'string',
                name: 'myString'
            } ]
        }, [ '2345675643', 'Hello!%' ]);
        assert.equal('96173f6c000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000', result);
    });
    it('case 2', function () {
        const result1 = abi.encodeFunctionCall([ {
            name: 'myMethod',
            type: 'function',
            inputs: [ {
                type: 'uint256',
                name: 'myNumber'
            }, {
                type: 'string',
                name: 'myString'
            } ]
        }, {
            name: 'myethod',
            type: 'function',
            inputs: [ {
                type: 'uint256',
                name: 'myNumber'
            }, {
                type: 'string',
                name: 'myString'
            } ]
        } ], [ '2345675643', 'Hello!%' ], 'myMethod');
        assert.equal('96173f6c000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000', result1);
    });
    it('case 3 int16[]', function () {
        const encodeParameterResult14 = abi.encodeFunctionCall({ 'constant': false, 'inputs': [{ 'name': 'proposal', 'type': 'int16[]' }], 'name': 'vote', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, [[ -2, -2 ]]);
        assert.equal('aa941d3300000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe', encodeParameterResult14);
    });
    it('case 4 int16[]', function () {
        const encodeParameterResult14 = abi.encodeFunctionCall({ 'constant': false, 'inputs': [{ 'name': 'proposal', 'type': 'int16[]' }], 'name': 'vote', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, [[ -2, -9999 ]]);
        assert.equal('aa941d3300000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd8f1', encodeParameterResult14);
    });
});

describe('encode2decode', function () {
    it('case 1', function () {
        const result = abi.encodeParameter('string', '15');
        assert.equal('15', abi.decodeParameter('string', result));
    });
    it('case 2', function () {
        const result = abi.encodeParameter('string', '0x15');
        assert.equal('0x15', abi.decodeParameter('string', result));
    });
    it('case 3', function () {
        const result = abi.encodeParameter('string', '我也圣诞节');
        assert.equal('我也圣诞节', abi.decodeParameter('string', result));
    });
    it('case 4', function () {
        const result = abi.encodeParameter('int8', -1);
        assert.equal(-1, abi.decodeParameter('int8', result));
    });
    it('case 5', function () {
        const result = abi.encodeParameter('int', '-199999999999999999');
        assert.equal(-199999999999999999, abi.decodeParameter('int', result));
    });
});

// describe('en', function () {
//     it('uint', function () {
//         const _r1 = abi.encodeParameter('uint', '-2');
//         assert.equal('000000000000000000000000000000000000000000000000000000008bd02b7b', _r1);
//     });
//     it('int', function () {
//         const _r1 = abi.encodeParameter('int8', '-9999');
//         assert.equal('000000000000000000000000000000000000000000000000000000008bd02b7b', _r1);
//     });
//     it('int', function () {
//         const _r1 = abi.encodeParameter('int8', '9999');
//         assert.equal('000000000000000000000000000000000000000000000000000000008bd02b7b', _r1);
//     });
//     it('int -19999999999999999999999999999999999999999999999999999999999999', function () {
//         const encodeParameterResult1111 = abi.decodeParameter('int8', 'fffffffffffff38dd0f10627f5529bdb2c52d4846810af0ac000000000000001');
//         assert.equal('-99', encodeParameterResult1111);
//     });
// });

