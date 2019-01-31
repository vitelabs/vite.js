import { getRawTokenid } from 'utils/tools';
import { hexToBytes } from 'utils/encoder';
import { tokenIdIllegal } from '../error';

export default {
    encode(typeObj, params) {
        let result = '';      

        params.forEach((tokenId) => {
            let rawTokenId = getRawTokenid(tokenId);
            if (!rawTokenId) {
                throw tokenIdIllegal;
            }

            let bytesToken = hexToBytes(rawTokenId);

            const BYTE_LEN = typeObj.byteLength;
            let _encodeResult = new Uint8Array(BYTE_LEN);
            let offset = BYTE_LEN - bytesToken.length;
            _encodeResult.set(bytesToken, offset);
            result += Buffer.from(_encodeResult).toString('hex');
        });
        
        return result;
    },
    decode() {
        
    }
};