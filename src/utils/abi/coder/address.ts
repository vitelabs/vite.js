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

        return {
            isDynamic: false,
            result
        }
    },
    decode(typeObj, params) {
        const BYTE_LEN = typeObj.byteLength;
        // let _encodeResult = new Uint8Array(SIZE);
        

    }
};
