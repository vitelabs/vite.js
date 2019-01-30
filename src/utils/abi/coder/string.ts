import { stringIllegal } from '../error';
import { hexToBytes } from 'utils/encoder';
import number from './int';

export default {
    encode(typeObj, params) {
        let result = '';
        params.forEach((str) => {
            if (typeof str !== 'string') {
                throw stringIllegal; 
            }

            let bytesStr;

            if (/^0x[0-9a-fA-F]+$/.test(str)) {
                if (str.length % 2 !== 0) {
                    throw stringIllegal;
                }
                bytesStr = hexToBytes(str.substring(2));
            } else {
                bytesStr = Buffer.from(str, 'utf8');
            }

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
        });
        return result;
    },
    decode() {
        
    }
};