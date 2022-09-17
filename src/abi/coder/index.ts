import * as BigNumber from 'bn.js';
import { arrayify, hexlify } from '../utils';

export interface Result extends ReadonlyArray<any> {
    readonly [key: string]: any;
}

export { BigNumber };

export abstract class Coder {
    // The coder name:
    //   - address, uint256, tuple, array, etc.
    readonly name: string;

    // The fully expanded type, including composite types:
    //   - address, uint256, tuple(address,bytes), uint256[3][4][],  etc.
    readonly type: string;

    // The localName bound in the signature, in this example it is "baz":
    //   - tuple(address foo, uint bar) baz
    readonly localName: string;

    // Whether this type is dynamic:
    //  - Dynamic: bytes, string, address[], tuple(boolean[]), etc.
    //  - Static: address, uint256, boolean[3], tuple(address, uint8)
    readonly dynamic: boolean;

    protected constructor(name: string, type: string, localName: string, dynamic: boolean) {
        this.name = name;
        this.type = type;
        this.localName = localName;
        this.dynamic = dynamic;
    }

    pack(writer: Writer, coders: ReadonlyArray<Coder>, values: Array<any> | { [ name: string ]: any }): number {
        let arrayValues: Array<any> = null;

        if (Array.isArray(values)) {
            arrayValues = values;
        } else if (values && typeof (values) === 'object') {
            const unique: { [ name: string ]: boolean } = { };

            arrayValues = coders.map(coder => {
                const name = coder.localName;
                if (!name) {
                    throw new Error(`cannot encode object for signature with missing names: ${ coder.type }`);
                }

                if (unique[name]) {
                    throw new Error(`cannot encode object for signature with duplicate names: ${ name }`);
                }

                unique[name] = true;

                return values[name];
            });
        } else {
            throw new Error(`invalid tuple value: ${ values }`);
        }

        if (coders.length !== arrayValues.length) {
            throw new Error(`types/value length mismatch: ${ values }`);
        }

        const staticWriter = new Writer(writer.wordSize);
        const dynamicWriter = new Writer(writer.wordSize);

        const updateFuncs: Array<(baseOffset: number) => void> = [];
        coders.forEach((coder, index) => {
            const value = arrayValues[index];

            if (coder.dynamic) {
                // Get current dynamic offset (for the future pointer)
                const dynamicOffset = dynamicWriter.length;

                // Encode the dynamic value into the dynamicWriter, including subarray
                coder.encode(dynamicWriter, value);

                // Prepare to populate the correct offset once we are done
                const updateFunc = staticWriter.writeUpdatableValue();
                updateFuncs.push((baseOffset: number) => {
                    updateFunc(baseOffset + dynamicOffset);
                });
            } else {
                coder.encode(staticWriter, value);
            }
        });

        // Backfill all the dynamic offsets, now that we know the static length
        updateFuncs.forEach(func => {
            func(staticWriter.length);
        });

        let length = writer.appendWriter(staticWriter);
        length += writer.appendWriter(dynamicWriter);
        return length;
    }

    unpack(reader: Reader, coders: Array<Coder>): Result {
        let values: any = [];

        // A reader anchored to this base
        const baseReader = reader.subReader(0);

        coders.forEach(coder => {
            let value: any = null;

            if (coder.dynamic) {
                const offset = reader.readValue();
                const offsetReader = baseReader.subReader(offset.toNumber());
                value = coder.decode(offsetReader);
            } else {
                value = coder.decode(reader);
            }

            if (value !== undefined) {
                values.push(value);
            }
        });

        // We only output named properties for uniquely named coders
        const uniqueNames = coders.reduce((accum, coder) => {
            const name = coder.localName;
            if (name) {
                if (!accum[name]) {
                    accum[name] = 0;
                }
                accum[name]++;
            }
            return accum;
        }, { });

        // Add any named parameters (i.e. tuples)
        const tuple = { };
        coders.forEach((coder: Coder, index: number) => {
            let name = coder.localName;
            if (!name || uniqueNames[name] !== 1) {
                return;
            }

            if (name === 'length') {
                name = '_length';
            }

            if (values[name] != null) {
                return;
            }

            if (this.name === 'tuple' && this.localName !== '_') {
                tuple[name] = values[index];
            } else { // TODO: enable to add name index to decode result
                values[name] = values[index];
            }
        });
        if (this.name === 'tuple' && this.localName !== '_' && Object.keys(tuple).length === values.length) {
            values = tuple;
        }

        return Object.freeze(values);
    }

    abstract encode(writer: Writer, value: any): number;
    abstract decode(reader: Reader): any;

    abstract defaultValue(): any;
}

export class Writer {
    readonly wordSize: number;

    _data: Buffer[];
    _dataLength: number;
    _padding: Buffer;

    constructor(wordSize?: number) {
        this.wordSize = wordSize || 32;
        this._data = [ ];
        this._dataLength = 0;
        this._padding = Buffer.alloc(this.wordSize);
    }

    get data(): string {
        let result = '';
        this._data.forEach(item => {
            result += hexlify(item);
        });
        return result;
    }

    get length(): number {
        return this._dataLength;
    }

    _writeData(data: Buffer): number {
        this._data.push(data);
        this._dataLength += data.length;
        return data.length;
    }

    appendWriter(writer: Writer): number {
        // let result = '';
        // this._data.forEach(item => {
        //     result += Buffer.concat(item);
        // });
        return this._writeData(Buffer.concat(writer._data));
    }

    // Arrayish items; padded on the right to wordSize
    writeBytes(value: Buffer | string): number {
        if (typeof (value) === 'string') {
            value = Buffer.from(value, 'utf8');
        }
        let bytes = arrayify(value);
        const paddingOffset = bytes.length % this.wordSize;
        if (paddingOffset) {
            bytes = Buffer.concat([ bytes, this._padding.slice(paddingOffset) ]);
        }
        return this._writeData(bytes);
    }

    _getValue(value: number | bigint | string | BigNumber): Buffer {
        if (value instanceof BigNumber) {
            value = value.toString(16);
        }
        let bytes = arrayify(value);
        if (bytes.length > this.wordSize) {
            throw new Error(`value out-of-bounds ${ this.wordSize } ${ bytes.length }`);
        }
        if (bytes.length % this.wordSize) {
            bytes = Buffer.concat([ this._padding.slice(bytes.length % this.wordSize), bytes ]);
        }
        return bytes;
    }

    writeValue(value: number | bigint | string | BigNumber): number {
        return this._writeData(this._getValue(value));
    }

    writeUpdatableValue(): (value: number | bigint | string) => void {
        const offset = this._data.length;
        this._data.push(this._padding);
        this._dataLength += this.wordSize;
        return (value: number | bigint | string) => {
            this._data[offset] = this._getValue(value);
        };
    }
}

export class Reader {
    readonly wordSize: number;
    readonly allowLoose: boolean;
    readonly _data: Buffer;

    _offset: number;

    constructor(data: Buffer | string, wordSize?: number, allowLoose?: boolean) {
        this._data = arrayify(data);
        this.wordSize = wordSize || 32;
        this.allowLoose = allowLoose;
        this._offset = 0;
    }

    get data(): string {
        return hexlify(this._data);
    }

    get consumed(): number {
        return this._offset;
    }

    coerce(coder: Coder, value: any): any {
        if (coder.name.match('^u?int([0-9]+)$')) {
            // TODO: enable to return numeric types for numbers
            // if (parseInt(match[1]) <= 48 || value.lt(new BigNumber(Number.MAX_SAFE_INTEGER))) {
            //     value = value.toNumber();
            // } else {
            //     value = value.toString();
            // }
            value = value.toString();
        }
        return value;
    }

    _peekBytes(offset: number, length: number, loose?: boolean): Buffer {
        let alignedLength = Math.ceil(length / this.wordSize) * this.wordSize;
        if (this._offset + alignedLength > this._data.length) {
            if (this.allowLoose && loose && this._offset + length <= this._data.length) {
                alignedLength = length;
            } else {
                throw new Error(`data out-of-bounds: ${ this._offset + alignedLength }, actual: ${ this._data.length }`);
            }
        }
        return this._data.slice(this._offset, this._offset + alignedLength);
    }

    subReader(offset: number): Reader {
        return new Reader(this._data.slice(this._offset + offset), this.wordSize, this.allowLoose);
    }

    readBytes(length: number, loose?: boolean): Buffer {
        const bytes = this._peekBytes(0, length, !!loose);
        this._offset += bytes.length;
        return bytes.slice(0, length);
    }

    readValue(): BigNumber {
        return new BigNumber(this.readBytes(this.wordSize));
    }
}
