import { Coder, Reader, Writer } from './index';

export class ArrayCoder extends Coder {
    readonly coder: Coder;
    readonly length: number;

    constructor(coder: Coder, length: number, localName: string) {
        const type = (`${ coder.type }[${ length >= 0 ? length : '' }]`);
        const dynamic = (length === -1 || coder.dynamic);
        super('array', type, localName, dynamic);

        this.coder = coder;
        this.length = length;
    }

    defaultValue(): Array<any> {
        // Verifies the child coder is valid (even if the array is dynamic or 0-length)
        const defaultChild = this.coder.defaultValue();

        const result: Array<any> = [];
        for (let i = 0; i < this.length; i++) {
            result.push(defaultChild);
        }
        return result;
    }

    encode(writer: Writer, value: Array<any>): number {
        if (typeof (value) === 'string') {
            value = JSON.parse(value);
        }
        if (!Array.isArray(value)) {
            throw new Error(`expected array value: ${ value }`);
        }

        let count = this.length;

        if (count === -1) { // encode dynamic array length
            count = value.length;
            writer.writeValue(value.length);
        }

        if (value.length !== count) {
            throw new Error(`array value and size mismatch: ${ value }, size: ${ count }`);
        }

        const coders = [];
        for (let i = 0; i < value.length; i++) {
            coders.push(this.coder);
        }

        return this.pack(writer, coders, value);
    }

    decode(reader: Reader): any {
        let count = this.length;
        if (count === -1) {
            count = reader.readValue().toNumber();

            // Check that there is *roughly* enough data to ensure
            // stray random data is not being read as a length. Each
            // slot requires at least 32 bytes for their value (or 32
            // bytes as a link to the data). This could use a much
            // tighter bound, but we are erroring on the side of safety.
            if (count * 32 > reader._data.length) {
                throw new Error(`insufficient data length: ${ reader._data.length }, count: ${ count }`);
            }
        }
        const coders = [];
        for (let i = 0; i < count; i++) {
            coders.push(this.coder);
        }

        return reader.coerce(this, this.unpack(reader, coders));
    }
}

