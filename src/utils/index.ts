const bn = require('bn.js');
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
    schema: string; prefix: string; target_address: string; chain_id: number; function_name: string; params: Object;
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
    const _params = params ? `?${ toQueryString(params) }` : '';
    const str = `${ _schema }${ _prefix }${ _target_address }${ _chain_id }${ _function_name }${ _params }`;
    return str;
}

export function checkParams(params: Object, requiredP: Array<string> = [], validFunc: Array<{ name: string; func: Function; msg?: string }> = []): {
    code: string;
    message: string;
} {
    if (!params) {
        return null;
    }

    const isHave = name => Object.prototype.hasOwnProperty.call(params, name)
            && typeof params[name] !== 'undefined'
            && params[name] !== null;

    for (const name of requiredP) {
        if (!isHave(name)) {
            return {
                code: paramsMissing.code,
                message: `${ paramsMissing.message } ${ name }.`
            };
        }
    }

    for (const { name, func, msg } of validFunc) {
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

export function isValidTokenId(tokenId: string): boolean {
    if (tokenId.indexOf('tti_') !== 0 || tokenId.length !== 28) {
        return false;
    }

    const originalTokenId = tokenId.slice(4, tokenId.length - 4);
    const checkSum = getTokenIdCheckSum(originalTokenId);

    return tokenId.slice(tokenId.length - 4) === checkSum;
}

export function getOriginalTokenIdFromTokenId(tokenId: string): Hex {
    const err = checkParams({ tokenId }, ['tokenId'], [{
        name: 'tokenId',
        func: _t => _t.indexOf('tti_') === 0 && _t.length === 28
    }]);

    if (err) {
        throw new Error(err.message);
    }

    return tokenId.slice(4, tokenId.length - 4);
}

export function getTokenIdFromOriginalTokenId(originalTokenId: string): TokenId {
    const err = checkParams({ originalTokenId }, ['originalTokenId'], [{
        name: 'originalTokenId',
        func: _t => /^[0-9a-fA-F]+$/.test(_t) && _t.length === 20
    }]);
    if (err) {
        throw new Error(err.message);
    }

    return `tti_${ originalTokenId }${ getTokenIdCheckSum(originalTokenId) }`;
}

export function isValidSBPName(sbpName: string): boolean {
    return /^[a-zA-Z0-9_\.]+(\s{1}[a-zA-Z0-9_\.]+)*$/g.test(sbpName) && sbpName.length <= 40;
}

export function isNonNegativeInteger(num: string): boolean {
    num = `${ num }`;
    return num && (/(^[1-9]\d*$)/g.test(num) || num === '0');
}

export function isInteger(num: string): boolean {
    num = `${ num }`;
    return num && (/^[\-]{0,1}[1-9]\d*$/g.test(num) || num === '0');
}

export const isArray = Array.isArray || function (obj): boolean {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

export function isObject(obj): boolean {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

export function getBytesSize(str: string, charset: Charset = Charset.utf8): number {
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

export function isHexString(str: string): boolean {
    return /^[0-9a-fA-F]+$/.test(str);
}

export function isBase64String(str): boolean {
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

function getTokenIdCheckSum(originalTokenId: Hex): Hex {
    return blake.blake2bHex(Buffer.from(originalTokenId, 'hex'), null, 2);
}

// https://howchoo.com/javascript/how-to-turn-an-object-into-query-string-parameters-in-javascript
function toQueryString(params: object) {
    return Object.keys(params).map(key => `${ key }=${ params[key] }`).join('&');
}
