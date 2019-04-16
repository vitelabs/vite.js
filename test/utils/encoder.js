const assert = require('assert');

import {
    hexToBytes, utf8ToBytes, bytesToHex, getBytesSize,
    getRawTokenId, validNodeName, validInteger, getTokenIdFromRaw, uriStringify
} from '../../src/utils';

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

describe('tools', function () {
    it('getRawTokenId', function () {
        assert.equal('5649544520544f4b454e', getRawTokenId('tti_5649544520544f4b454e6e40'));
    });
    it('uriStringify', function () {
        assert.equal('vite:vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad/echo?amount=1&data=MTIzYWJjZA', uriStringify({ target_address: 'vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad', params: { amount: 1, data: 'MTIzYWJjZA' }, function_name: 'echo' }));
        assert.equal('vite:vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad?tti=tti_5649544520544f4b454e6e40&amount=1&data=MTIzYWJjZA', uriStringify({ target_address: 'vite_fa1d81d93bcc36f234f7bccf1403924a0834609f4b2e9856ad', params: { tti: 'tti_5649544520544f4b454e6e40', amount: 1, data: 'MTIzYWJjZA' }}));
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
