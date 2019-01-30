const BigNumber = require('bn.js');
import { numberIllegal, lengthIllegal } from '../error';

export default {
    encode(typeObj, params) {
        let result = '';
        params.forEach((numStr) => {
            const BYTE_LEN = typeObj.byteLength;

            if ( typeof numStr !== 'string' || 
                 !/^[0-9]+$/.test(numStr)) {
                throw numberIllegal; 
            }

            let _encodeResult = new Uint8Array(BYTE_LEN);
            let bytesInt = new BigNumber(numStr).toArray();
            let offset = BYTE_LEN - bytesInt.length;
            if (offset < 0) {
                throw lengthIllegal;
            }

            _encodeResult.set(bytesInt, offset);
            result += Buffer.from(_encodeResult).toString('hex');
        });
        return result;
    },
    decode() {
        
    }
};