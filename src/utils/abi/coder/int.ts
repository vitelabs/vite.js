const BigNumber = require('bn.js');
import { lengthIllegal } from '../error';

export default {
    encode(typeObj, params) {
        const BYTE_LEN = typeObj.byteLength;
        let result = '';

        params.forEach((numStr) => {
            let bytesInt = new BigNumber(numStr).toArray();

            if (typeObj.actualByteLen < bytesInt.length) {
                throw lengthIllegal;
            }

            let offset = BYTE_LEN - bytesInt.length;
            if (offset < 0) {
                throw lengthIllegal;
            }
            
            let _encodeResult = new Uint8Array(BYTE_LEN);
            _encodeResult.set(bytesInt, offset);
            result += Buffer.from(_encodeResult).toString('hex');
        });

        return { 
            isDynamic: false,
            result
        };
    },
    decode() {
        
    }
};