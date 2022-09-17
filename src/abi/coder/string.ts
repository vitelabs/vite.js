import { Reader, Writer } from './index';
import { DynamicBytesCoder } from './bytes';

export class StringCoder extends DynamicBytesCoder {
    constructor(localName: string) {
        super('string', localName);
    }

    defaultValue(): string {
        return '';
    }

    encode(writer: Writer, value: any): number {
        return super.encode(writer, Buffer.from(value, 'utf8'));
    }

    decode(reader: Reader): any {
        return Buffer.from(super.decode(reader)).toString('utf8');
    }
}
