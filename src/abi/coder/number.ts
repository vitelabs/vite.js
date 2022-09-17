import { Coder, Reader, Writer, BigNumber } from './index';

const MaxUint256 = new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'hex');

export class NumberCoder extends Coder {
    readonly size: number;
    readonly signed: boolean;

    constructor(size: number, signed: boolean, localName: string) {
        const name = ((signed ? 'int' : 'uint') + (size * 8));
        super(name, name, localName, false);

        this.size = size;
        this.signed = signed;
    }

    defaultValue(): number {
        return 0;
    }

    encode(writer: Writer, value: bigint | number | string | BigNumber): number {
        if (typeof (value) === 'bigint') {
            value = value.toString(16);
        }
        let v = new BigNumber(value);
        // Check bounds are safe for encoding
        const maxUintValue = MaxUint256.clone().imaskn(writer.wordSize * 8);
        if (this.signed) {
            const bounds = maxUintValue.imaskn(this.size * 8 - 1);
            if (v.gt(bounds) || v.lt(bounds.add(new BigNumber(1)).mul(new BigNumber(-1)))) {
                throw new Error(`value out-of-bounds: ${ value }`);
            }
        } else if (v.lt(new BigNumber(0)) || v.gt(maxUintValue.imaskn(this.size * 8))) {
            throw new Error(`value out-of-bounds: ${ value }`);
        }

        v = v.toTwos(this.size * 8).imaskn(this.size * 8);

        if (this.signed) {
            v = v.fromTwos(this.size * 8).toTwos(8 * writer.wordSize);
        }

        return writer.writeValue(v);
    }

    decode(reader: Reader): any {
        let value = reader.readValue().imaskn(this.size * 8);

        if (this.signed) {
            value = value.fromTwos(this.size * 8);
        }

        return reader.coerce(this, value);
    }
}

