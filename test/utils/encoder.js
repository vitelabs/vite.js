const assert = require('assert');

import { hexToBytes, utf8ToBytes, bytesToHex, getBytesSize } from '../../src/utils';

describe('strToUtf8', function () {
    it('test1', function () {
        const utf8Bytes = utf8ToBytes('为');
        const hex = bytesToHex(utf8Bytes);

        assert.equal('e4b8ba', hex);
        assert.deepEqual(utf8Bytes, hexToBytes(hex));
    });
    it('test2', function () {
        const utf8Bytes = utf8ToBytes('sdsdsds。；。、lp.;,p[oo阿京东方]');
        const hex = bytesToHex(utf8Bytes);

        assert.equal('73647364736473e38082efbc9be38082e380816c702e3b2c705b6f6fe998bfe4baace4b89ce696b95d', hex);
        assert.deepEqual(utf8Bytes, hexToBytes(hex));
    });
    it('test3', function () {
        const utf8Bytes = utf8ToBytes('[坏笑]😊🙂🙂😆😅😅');
        const hex = bytesToHex(utf8Bytes);

        assert.equal('5be59d8fe7ac915d', hex);
        assert.deepEqual(utf8Bytes, hexToBytes(hex));
    });
});

describe('getBytesSize', function () {
    it('test1', function () {
        assert.equal(40, getBytesSize('是打发发发 水电费是否爽肤水'));
    });
    it('test2', function () {
        assert.equal(30, getBytesSize('sdjafofaodsfjwo8eifhsnodslkfjs'));
    });
    it('test3', function () {
        assert.equal(56, getBytesSize('[坏笑]😊🙂🙂😆😅😅'));
    });
    it('test4', function () {
        assert.equal(32, getBytesSize('[坏笑]😊🙂🙂😆😅😅', 'utf16'));
    });
});
