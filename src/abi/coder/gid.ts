import { Coder, Reader, Writer } from './index';
import { leftPadZero } from '../utils';

export class GidCoder extends Coder {
    constructor(localName: string) {
        super('gid', 'gid', localName, false);
    }

    defaultValue(): string {
        return '00000000000000000001';
    }

    encode(writer: Writer, value: string): number {
        if (!value || !/^[0-9a-fA-F]+$/.test(value) || value.length !== 20) {
            throw new Error(`[Error] Illegal gid. ${ value }`);
        }
        return writer.writeValue(value);
    }

    decode(reader: Reader): any {
        return leftPadZero(reader.readValue().toString(16), 10);
    }
}

