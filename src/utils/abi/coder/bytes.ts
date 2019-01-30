import { hexToBytes } from 'utils/encoder';
import { bytesStrIllegal, lengthIllegal } from '../error';
import number from './int';

export default {
    encode(typeObj, params) {
        let result = '';
        params.forEach((str) => {
            const BYTE_LEN = typeObj.byteLength;

            if ( typeof str !== 'string' || 
                 !/^0x[0-9a-fA-F]+$/.test(str) ||
                 str.length % 2 !== 0 ) {
                throw bytesStrIllegal; 
            }

            let _str = str.substring(2);
            let bytesStr = hexToBytes(_str);

            if (!BYTE_LEN) {
                const STR_LEN = bytesStr.length;
                let bytesLen = number.encode({ 
                    type: 'int', byteLength: 32, isArr: false
                }, STR_LEN + '');

                var dataLength = 32 * Math.ceil(bytesStr.length / 32);
                var padding = new Uint8Array(dataLength - bytesStr.length);

                let len = STR_LEN + dataLength;
                let arr = new Uint8Array(len);
                arr.set(Buffer.from(bytesLen, 'hex'));
                arr.set(bytesStr, bytesLen.length);
                arr.set(padding, bytesLen.length + bytesStr.length);
                return Buffer.from(arr).toString('hex');
            }

            let _encodeResult = new Uint8Array(BYTE_LEN);
            let offset = BYTE_LEN - bytesStr.length;
            if (offset < 0) {
                throw lengthIllegal;
            }

            _encodeResult.set(bytesStr, offset);
            result += Buffer.from(_encodeResult).toString('hex');
        });
        return result;
    },
    decode() {
        
    }
};


function addSlice(array: Uint8Array): Uint8Array {
    if (array.slice) { return array; }

    array.slice = function() {
        var args = Array.prototype.slice.call(arguments);
        return new Uint8Array(Array.prototype.slice.apply(array, args));
    }

    return array;
}
