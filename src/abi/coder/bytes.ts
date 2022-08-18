import { Coder, Reader, Writer } from './index';
import { arrayify, hexlify } from '../utils';

export class DynamicBytesCoder extends Coder {
    constructor(type: string, localName: string) {
        super(type, type, localName, true);
    }

    defaultValue(): string {
        return '';
    }

    encode(writer: Writer, value: any): number {
        value = arrayify(value);
        let length = writer.writeValue(value.length);
        length += writer.writeBytes(value);
        return length;
    }

    decode(reader: Reader): any {
        return reader.readBytes(reader.readValue().toNumber(), true);
    }
}

export class BytesCoder extends DynamicBytesCoder {
    constructor(localName: string) {
        super('bytes', localName);
    }

    decode(reader: Reader): any {
        return reader.coerce(this, hexlify(super.decode(reader)));
    }
}

export class FixedBytesCoder extends Coder {
    readonly size: number;

    constructor(size: number, localName: string) {
        const name = `bytes${ String(size) }`;
        super(name, name, localName, false);
        this.size = size;
    }

    defaultValue(): string {
        return ('0000000000000000000000000000000000000000000000000000000000000000').substring(0, this.size * 2);
    }

    encode(writer: Writer, value: Buffer | string): number {
        const data = arrayify(value);
        if (data.length !== this.size) {
            throw new Error(`incorrect data length: ${ value }`);
        }
        return writer.writeBytes(data);
    }

    decode(reader: Reader): any {
        return reader.coerce(this, hexlify(reader.readBytes(this.size)));
    }
}


