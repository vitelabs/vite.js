import { getAddrFromHexAddr } from 'utils/address/privToAddr';
import { hexToBytes } from 'utils/encoder';
import { addressIllegal } from '../error';

export default {
    encode(typeObj, params) {
        let result = '';
        params.forEach((address) => {
            let addr = getAddrFromHexAddr(address);
            if (!addr) {
                throw addressIllegal;
            }

            const BYTE_LEN = typeObj.byteLength;
            
            let _encodeResult = new Uint8Array(BYTE_LEN);
            let bytesAddr = hexToBytes(addr);
            let offset = BYTE_LEN - bytesAddr.length;
            
            _encodeResult.set(bytesAddr, offset);
            result += Buffer.from(_encodeResult).toString('hex');
        });
        return result;
    },
    decode(typeObj, params) {
        const BYTE_LEN = typeObj.byteLength;
        // let _encodeResult = new Uint8Array(SIZE);
        

    }
};


// export function arrayify(value: Arrayish | Hexable): Uint8Array {
//     if (value == null) {
//         errors.throwError('cannot convert null value to array', errors.INVALID_ARGUMENT, { arg: 'value', value: value });
//     }

//     if (isHexable(value)) {
//         value = value.toHexString();
//     }

//     if (typeof(value) === 'string') {
//         let match = value.match(/^(0x)?[0-9a-fA-F]*$/);

//         if (!match) {
//             errors.throwError('invalid hexidecimal string', errors.INVALID_ARGUMENT, { arg: 'value', value: value });
//         }

//         if (match[1] !== '0x') {
//              errors.throwError('hex string must have 0x prefix', errors.INVALID_ARGUMENT, { arg: 'value', value: value });
//         }

//         value = value.substring(2);
//         if (value.length % 2) { value = '0' + value; }

//         var result = [];
//         for (var i = 0; i < value.length; i += 2) {
//             result.push(parseInt(value.substr(i, 2), 16));
//         }

//         return addSlice(new Uint8Array(result));
//     }

//     if (isArrayish(value)) {
//         return addSlice(new Uint8Array(value));
//     }

//     errors.throwError('invalid arrayify value', null, { arg: 'value', value: value, type: typeof(value) });
//     return null;
// }