import { Coder, Reader, Writer } from './index';

export class NullCoder extends Coder {
    constructor(localName: string) {
        super('null', '', localName, false);
    }

    defaultValue(): null {
        return null;
    }

    encode(writer: Writer, value: any): number {
        if (value != null) {
            throw new Error(`value not null: ${ value }`);
        }
        return writer.writeBytes(Buffer.from([ ]));
    }

    decode(reader: Reader): any {
        reader.readBytes(0);
        return reader.coerce(this, null);
    }
}
