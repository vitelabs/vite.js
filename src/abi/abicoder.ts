import { Coder, Reader, Result, Writer } from './coder';
import { AddressCoder } from './coder/address';
import { ArrayCoder } from './coder/array';
import { BooleanCoder } from './coder/boolean';
import { BytesCoder, FixedBytesCoder } from './coder/bytes';
import { NullCoder } from './coder/null';
import { NumberCoder } from './coder/number';
import { StringCoder } from './coder/string';
import { TupleCoder } from './coder/tuple';
import { TokenIdCoder } from './coder/tokenId';
import { GidCoder } from './coder/gid';

import { ParamType } from './fragments';
import { arrayify } from './utils';

const paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);

export class AbiCoder {
    _getCoder(param: ParamType): Coder {
        switch (param.baseType) {
        case 'address':
            return new AddressCoder(param.name);
        case 'tokenId':
            return new TokenIdCoder(param.name);
        case 'gid':
            return new GidCoder(param.name);
        case 'bool':
            return new BooleanCoder(param.name);
        case 'string':
            return new StringCoder(param.name);
        case 'bytes':
            return new BytesCoder(param.name);
        case 'array':
            return new ArrayCoder(this._getCoder(param.arrayChildren), param.arrayLength, param.name);
        case 'tuple':
            return new TupleCoder((param.components || []).map(component => this._getCoder(component)), param.name);
        case '':
            return new NullCoder(param.name);
        }

        // u?int[0-9]*
        let match = param.type.match(paramTypeNumber);
        if (match) {
            const size = parseInt(match[2] || '256');
            if (size === 0 || size > 256 || (size % 8) !== 0) {
                throw new Error(`invalid ${ match[1] } bit length, ${ param }`);
            }
            return new NumberCoder(size / 8, (match[1] === 'int'), param.name);
        }

        // bytes[0-9]+
        match = param.type.match(paramTypeBytes);
        if (match) {
            const size = parseInt(match[1]);
            if (size === 0 || size > 32) {
                throw new Error(`invalid bytes length, ${ param }`);
            }
            return new FixedBytesCoder(size, param.name);
        }

        throw new Error(`invalid type,  ${ param.type }`);
    }

    _getWordSize(): number {
        return 32;
    }

    _getReader(data: Buffer, allowLoose?: boolean): Reader {
        return new Reader(data, this._getWordSize(), allowLoose);
    }

    _getWriter(): Writer {
        return new Writer(this._getWordSize());
    }

    getDefaultValue(types: ReadonlyArray<string | ParamType>): Result {
        const coders: Array<Coder> = types.map(type => this._getCoder(ParamType.from(type)));
        const coder = new TupleCoder(coders, '_');
        return coder.defaultValue();
    }

    encode(types: ReadonlyArray<string | ParamType>, values: ReadonlyArray<any>): string {
        if (typeof (values) === 'string') {
            values = JSON.parse(values);
        }
        if (types.length !== values.length) {
            throw new Error(`types/values length mismatch, types: ${ types.length }, values: ${ values.length }`);
        }

        const coders = types.map(type => this._getCoder(ParamType.from(type)));
        const coder = new TupleCoder(coders, '_');

        const writer = this._getWriter();
        coder.encode(writer, values);
        return writer.data;
    }

    decode(types: ReadonlyArray<string | ParamType>, data: Buffer | string, loose?: boolean): Result {
        const coders: Array<Coder> = types.map(type => this._getCoder(ParamType.from(type)));
        const coder = new TupleCoder(coders, '_');
        return coder.decode(this._getReader(arrayify(data), loose));
    }
}

export const defaultAbiCoder: AbiCoder = new AbiCoder();

