import { isHexString } from '~@vite/vitejs-utils';

const HexCharacters = '0123456789abcdef';

/**
 * Convert a given value into hex string
 * @param value
 */
export function hexlify(value: Buffer | Uint8Array | string | number | bigint): string {
    if (typeof (value) === 'number') {
        if (value < 0 || value >= 0x1fffffffffffff) {
            throw new Error(`invalid hexlify value ${ value }`);
        }
        let hex = '';
        while (value) {
            hex = HexCharacters[value & 0xf] + hex;
            value = Math.floor(value / 16);
        }
        if (hex.length) {
            if (hex.length % 2) {
                hex = `0${ hex }`;
            }
            return `${ hex }`;
        }
        return '00';
    }
    if (typeof (value) === 'bigint') {
        if (value < 0) {
            throw new Error(`invalid hexlify value ${ value }`);
        }
        value = value.toString(16);
        if (value.length % 2) {
            return (`0${ value }`);
        }
        return `${ value }`;
    }
    if (typeof (value) === 'string') {
        if (value.substring(0, 2) === '0x') {
            value = value.substring(2);
        }
        if (isHexString(value)) {
            if (value.length % 2) {
                throw new Error(`hex data is odd-length ${ value }`);
                // value = `0${ value }`;
            }
            return value;
        }
        throw new Error(`not hex string ${ value }`);
    }
    if (Buffer.isBuffer(value)) {
        return value.toString('hex');
    }
    if (value.constructor === Uint8Array) {
        return Buffer.from(value).toString('hex');
    }

    throw new Error(`invalid hexlify value ${ value }`);
}

/**
 * Convert a given value into byte array
 * @param value
 */
export function arrayify(value: Buffer | Uint8Array | string | number | bigint): Buffer {
    if (typeof (value) === 'number') {
        if (value < 0 || value >= 0x1fffffffffffff) {
            throw new Error(`invalid arrayify value ${ value }`);
        }
        const result = [];
        while (value) {
            result.unshift(value & 0xff);
            value = parseInt(String(value / 256));
        }
        if (result.length === 0) {
            result.push(0);
        }

        return Buffer.from(result);
    }
    if (typeof (value) === 'bigint') {
        if (value < 0) {
            throw new Error(`invalid arrayify value ${ value }`);
        }
        value = value.toString(16);
        if (value.length % 2) {
            value = `0${ value }`;
        }
        return Buffer.from(value.toString(), 'hex');
    }
    if (typeof (value) === 'string') {
        if (value.substring(0, 2) === '0x') {
            value = value.substring(2);
        }
        if (isHexString(value)) {
            if (value.length % 2) {
                value = `0${ value }`;
            }
            return Buffer.from(value.toString(), 'hex');
        }
        throw new Error(`not hex string ${ value }`);
    }

    if (Buffer.isBuffer(value) || (value as any).constructor === Uint8Array) {
        // return Buffer.alloc(value.length, value);
        return Buffer.from(value);
    }

    throw new Error(`invalid arrayify value ${ value }`);
}

/**
 * Pad a hex string with zeros on the left
 * @param value
 * @param length The length of the returned string in bytes
 */
export function leftPadZero(value: Buffer | string, length: number): string {
    if (typeof (value) !== 'string') {
        value = hexlify(value);
    } else if (!isHexString(value)) {
        throw new Error(`invalid hex string: ${ value }`);
    }

    if (value.length > 2 * length) {
        throw new Error(`value out of range: ${ value }, length: ${ length }`);
    }

    while (value.length < 2 * length) {
        value = `0${ value }`;
    }

    return value;
}

/**
 * Pad a hex string with zeros on the right
 * @param value
 * @param length The length of the returned string in bytes
 */
export function rightPadZero(value: Buffer | string, length: number): string {
    if (typeof (value) !== 'string') {
        value = hexlify(value);
    } else if (!isHexString(value)) {
        throw new Error(`invalid hex string: ${ value }`);
    }

    if (value.length > 2 * length) {
        throw new Error(`value out of range: ${ value }, length: ${ length }`);
    }

    while (value.length < 2 * length) {
        value = `${ value }0`;
    }

    return value;
}

/**
 * Parse a string into JSON object. When the input is not valid JSON string, this function returns null instead of throwing an error.
 * @param value
 */
export function safeParseJson(value: any) {
    if (typeof value !== 'string') return null;
    try {
        const result = JSON.parse(value);
        const type = Object.prototype.toString.call(result);
        return (type === '[object Object]' || type === '[object Array]') ? result : null;
    } catch (err) {
        return null;
    }
}

/**
 * Determine an array's maximum depth. Returns 0 if the input is not an array.
 * @param value
 */
export function getArrayDepth(value: any) {
    return Array.isArray(value) ? 1 + Math.max(0, ...value.map(getArrayDepth)) : 0;
}
