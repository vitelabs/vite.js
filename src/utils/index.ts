const bn = require('bn.js');
import { stringify } from 'qs';
const blake = require('blakejs/blake2b');

import { paramsMissing, paramsFormat } from '~@vite/vitejs-error';

import * as _e from './ed25519';
import { Hex, TokenId } from './type';

declare const enum Charset {
    'utf16' = 'utf16',
    'utf8' = 'utf8'
}

export const ed25519 = _e;

export function uriStringify(o: {
    schema: String; prefix: String; target_address: String; chain_id: Number; function_name: String; params: Object;
}) {
    const { schema, prefix, target_address, chain_id, function_name, params } = o;
    const _schema = schema ? `${ schema }:` : 'vite:';
    const _prefix = typeof prefix === 'undefined' ? '' : `${ prefix }-`;
    const _target_address = target_address || '';
    const _chain_id = chain_id ? `@${ chain_id }` : '';
    const _function_name = function_name ? `/${ function_name }` : '';
    if (params && (params as any).data) {
        (params as any).data = (params as any).data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');// base64 urlsafe
    }
    const _params = params ? `?${ stringify(params, { encode: false }) }` : '';
    const str = `${ _schema }${ _prefix }${ _target_address }${ _chain_id }${ _function_name }${ _params }`;
    return str;
}

export function checkParams(params: Object, requiredP: Array<string> = [], validFunc: Array<{ name; func; msg? }> = []): {
    code: string;
    message: string;
} {
    if (!params) {
        return null;
    }

    const isHave = name => params.hasOwnProperty(name)
            && typeof params[name] !== 'undefined'
            && params[name] !== null;

    for (let i = 0; i < requiredP.length; i++) {
        const name = requiredP[i];
        if (!isHave(name)) {
            return {
                code: paramsMissing.code,
                message: `${ paramsMissing.message } ${ name }.`
            };
        }
    }

    for (let i = 0; i < validFunc.length; i++) {
        const { name, func, msg } = validFunc[i];
        if (!name || !func || !isHave(name)) {
            continue;
        }

        if (!func(params[name])) {
            return {
                code: paramsFormat.code,
                message: `${ paramsFormat.message } Illegal ${ name }. ${ msg || '' }`
            };
        }
    }

    return null;
}

export function isValidTokenId(tokenId: string): Boolean {
    if (tokenId.indexOf('tti_') !== 0 || tokenId.length !== 28) {
        return false;
    }

    const originalTokenId = tokenId.slice(4, tokenId.length - 4);
    const checkSum = getTokenIdCheckSum(originalTokenId);

    return tokenId.slice(tokenId.length - 4) === checkSum;
}

export function getOriginalTokenId(tokenId: string): Hex {
    const err = checkParams({ tokenId }, ['tokenId'], [{
        name: 'tokenId',
        func: _t => _t.indexOf('tti_') === 0 && _t.length === 28
    }]);

    if (err) {
        throw new Error(err.message);
    }

    return tokenId.slice(4, tokenId.length - 4);
}

export function getTokenIdFromRaw(originalTokenId: string): TokenId {
    const err = checkParams({ originalTokenId }, ['originalTokenId'], [{
        name: 'originalTokenId',
        func: _t => /^[0-9a-fA-F]+$/.test(_t) && _t.length === 20
    }]);
    if (err) {
        throw new Error(err.message);
    }

    return `tti_${ originalTokenId }${ getTokenIdCheckSum(originalTokenId) }`;
}

function getTokenIdCheckSum(originalTokenId: Hex): Hex {
    return blake.blake2bHex(Buffer.from(originalTokenId, 'hex'), null, 2);
}

export function isValidSBPName(sbpName: string): Boolean {
    return /^[a-zA-Z0-9_\.]+(\s{1}[a-zA-Z0-9_\.]+)*$/g.test(sbpName) && sbpName.length <= 40;
}

export function isNonNegativeInteger(num: string): Boolean {
    num = `${ num }`;
    return num && (/(^[1-9]\d*$)/g.test(num) || num === '0');
}

export function isInteger(num: string): Boolean {
    num = `${ num }`;
    return num && (/^[\-]{0,1}[1-9]\d*$/g.test(num) || num === '0');
}

export const isArray = Array.isArray || function (obj): Boolean {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

export function isObject(obj): Boolean {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

export function bytesToHex(arr: Buffer = Buffer.from([])): Hex {
    const err = checkParams({ arr }, ['arr']);
    if (err) {
        throw new Error(err.message);
    }

    const hexArr = Array.prototype.map.call(arr, function (bit: Number) {
        return (`00${ bit.toString(16) }`).slice(-2);
    });
    return hexArr.join('');
}

export function hexToBytes(hex: Hex) {
    const err = checkParams({ hex }, ['hex']);
    if (err) {
        throw new Error(err.message);
    }

    const typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16);
    }));
    return typedArray;
}

export function getBytesSize(str: String, charset: Charset = Charset.utf8): number {
    const err = checkParams({ str }, ['str']);
    if (err) {
        throw new Error(err.message);
    }

    let total = 0;
    let code;
    let i;
    let len;

    if (charset === Charset.utf16) {
        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            total += code <= 0xffff ? 2 : 4;
        }
        return total;
    }

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            total += 1;
        } else if (0x80 <= code && code <= 0x7ff) {
            total += 2;
        } else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {
            total += 3;
        } else {
            total += 4;
        }
    }
    return total;
}

export function utf8ToBytes(str = ''): Uint8Array {
    const err = checkParams({ str }, ['str']);
    if (err) {
        throw new Error(err.message);
    }

    const back = [];
    let i;
    for (i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)));
        } else if ((0x800 <= code && code <= 0xd7ff)
            || (0xe000 <= code && code <= 0xffff)) {
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)));
        }
    }

    for (i = 0; i < back.length; i++) {
        back[i] &= 0xff;
    }

    return new Uint8Array(back);
}

export function isSafeInteger(num): -1 | 0 | 1 {
    if (typeof num === 'string') {
        return isInteger(num) ? 1 : -1;
    }
    if (typeof num !== 'number') {
        return -1;
    }
    if (!Number.isSafeInteger(num)) {
        return 0;
    }
    return 1;
}

export function isHexString(str: string): Boolean {
    return /^[0-9a-fA-F]+$/.test(str);
}

export function isBase64String(str): Boolean {
    if (str === '') {
        return true;
    }
    const base64Pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    return base64Pattern.test(str);
}

export const blake2b = blake.blake2b;

export const blake2bHex = blake.blake2bHex;

export const _Buffer = Buffer;

export const _bn = bn;
