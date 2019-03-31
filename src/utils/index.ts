const blake = require('blakejs/blake2b');
import { stringify } from 'qs';

import { paramsMissing, paramsFormat } from '~@vite/vitejs-error';
import * as _e from './ed25519';
import { Hex } from '../type';

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
    const _params = params ? `?${ stringify(params, { encode: false }) }` : '';
    const str = `${ _schema }${ _prefix }${ _target_address }${ _chain_id }${ _function_name }${ _params }`;
    return str;
}

export function checkParams(params, requiredP: Array<string> = [], validFunc: Array<{ name; func; msg? }> = []) {
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

export function getRawTokenId(tokenId: string) {
    const err = checkParams({ tokenId }, ['tokenId'], [{
        name: 'tokenId',
        func: _t => _t.indexOf('tti_') === 0 && _t.length === 28
    }]);

    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    return tokenId.slice(4, tokenId.length - 4);
}

export function getTokenIdFromRaw(rawTokenId: string) {
    const err = checkParams({ rawTokenId }, ['rawTokenId'], [{
        name: 'rawTokenId',
        func: _t => /^[0-9a-fA-F]+$/.test(_t) && _t.length === 20
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const checkSum = blake.blake2bHex(Buffer.from(rawTokenId, 'hex'), null, 2);
    return `tti_${ rawTokenId }${ checkSum }`;
}

export function validNodeName(nodeName) {
    return /^[a-zA-Z0-9_\.]+(\s{1}[a-zA-Z0-9_\.]+)*$/g.test(nodeName) && nodeName.length <= 40;
}

export function validInteger(num) {
    return num && (/(^[1-9]\d*$)/g.test(num) || num === '0');
}

export const isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

export function isObject(obj) {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

export function bytesToHex(arr: Buffer = Buffer.from([])): Hex {
    const err = checkParams({ arr }, ['arr']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const hexArr = Array.prototype.map.call(arr, function (bit: Number) {
        return (`00${ bit.toString(16) }`).slice(-2);
    });
    return hexArr.join('');
}

export function hexToBytes(hex: Hex) {
    const err = checkParams({ hex }, ['hex']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16);
    }));
    return typedArray;
}

export function getBytesSize(str: String, charset: Charset = Charset.utf8) {
    const err = checkParams({ str }, ['str']);
    if (err) {
        console.error(new Error(err.message));
        return null;
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

export function utf8ToBytes(str = '') {
    const err = checkParams({ str }, ['str']);
    if (err) {
        console.error(new Error(err.message));
        return null;
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

export const _Buffer = Buffer;

export const blake2b = blake.blake2b;

export const blake2bHex = blake.blake2bHex;
