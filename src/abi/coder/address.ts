import { Coder, Reader, Writer } from './index';
import { getAddressFromOriginalAddress, getOriginalAddressFromAddress } from '~@vite/vitejs-wallet/address';
import { leftPadZero } from '../utils';

export class AddressCoder extends Coder {
    constructor(localName: string) {
        super('address', 'address', localName, false);
    }

    defaultValue(): string {
        return getAddressFromOriginalAddress('000000000000000000000000000000000000000000');
    }

    encode(writer: Writer, value: string): number {
        value = getOriginalAddressFromAddress(value);
        return writer.writeValue(value);
    }

    decode(reader: Reader): any {
        return getAddressFromOriginalAddress(leftPadZero(reader.readValue().toString(16), 21));
    }
}

