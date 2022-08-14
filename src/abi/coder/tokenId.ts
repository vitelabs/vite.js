import { Coder, Reader, Writer } from './index';
import { getOriginalTokenIdFromTokenId, getTokenIdFromOriginalTokenId} from '~@vite/vitejs-utils';
import { leftPadZero } from '../utils';

export class TokenIdCoder extends Coder {
    constructor(localName: string) {
        super('tokenId', 'tokenId', localName, false);
    }

    defaultValue(): string {
        return getTokenIdFromOriginalTokenId('00000000000000000000');
    }

    encode(writer: Writer, value: string): number {
        value = getOriginalTokenIdFromTokenId(value);
        return writer.writeValue(value);
    }

    decode(reader: Reader): any {
        return getTokenIdFromOriginalTokenId(leftPadZero(reader.readValue().toString(16), 10));
    }
}

