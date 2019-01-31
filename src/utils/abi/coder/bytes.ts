import { hexToBytes } from 'utils/encoder';
import { bytesStrIllegal, lengthIllegal } from '../error';
import number from './int';

export default {
    encode(typeObj, params) {
        const BYTE_LEN = typeObj.byteLength;
        let result = '';        

        params.forEach((str) => {
            if ( typeof str !== 'string' || 
                 !/^0x[0-9a-fA-F]+$/.test(str) ||
                 str.length % 2 !== 0 ) {
                throw bytesStrIllegal; 
            }

            let _str = str.substring(2);
            let bytesStr = hexToBytes(_str);

            if (!BYTE_LEN) {
                const STR_LEN = bytesStr.length;
                let dataLength = 32 * Math.ceil(bytesStr.length / 32);
                
                let bytesLen = number.encode({ 
                    type: 'int', byteLength: 32, isArr: false
                }, [STR_LEN + '']);
                let bytesDataLen = number.encode({
                    type: 'int', byteLength: 32, isArr: false
                }, [dataLength + '']);

                let len = bytesDataLen.length/2 + bytesLen.length/2 + dataLength;
                let arr = new Uint8Array(len);

                arr.set(Buffer.from(bytesDataLen, 'hex'));
                arr.set(Buffer.from(bytesLen, 'hex'), bytesDataLen.length / 2);
                arr.set(bytesStr, bytesDataLen.length / 2 + bytesLen.length / 2);
                result += Buffer.from(arr).toString('hex');
                return;
            }

            if (typeObj.actualByteLen < bytesStr.length || 
                BYTE_LEN - bytesStr.length < 0) {
                throw lengthIllegal;
            }

            let _encodeResult = new Uint8Array(BYTE_LEN);
            _encodeResult.set(bytesStr);
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
