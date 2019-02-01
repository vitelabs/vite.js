import { stringIllegal } from '../error';
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
                bytesStr = Buffer.from(str.substring(2), 'hex');
            } else {
                bytesStr = Buffer.from(str, 'utf8');
            }

            const STR_LEN = bytesStr.length;
            const dataLength = 32 * Math.ceil(STR_LEN / 32);

            let bytesLen = number.encode({ 
                type: 'int', byteLength: 32, isArr: false
            }, [STR_LEN + '']).result;

            let len = bytesLen.length/2 + dataLength;
            let arr = new Uint8Array(len);

            arr.set(Buffer.from(bytesLen, 'hex'));
            arr.set(bytesStr, bytesLen.length / 2);
            result += Buffer.from(arr).toString('hex');
            return;
        });

        return {
            isDynamic: true, 
            result
        };
    },
    decode() {
        
    }
};