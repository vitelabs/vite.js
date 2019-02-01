import { hexToBytes } from 'utils/encoder';
import { gidIllegal } from '../error';

export default {
    encode(typeObj, params) {
        const BYTE_LEN = typeObj.byteLength;
        let result = '';      

        params.forEach((gid) => {
            if (!gid || !/^[0-9a-fA-F]+$/.test(gid) || gid.length !== 20 ) {
                throw gidIllegal;
            }

            let _encodeResult = new Uint8Array(BYTE_LEN);
            let bytesGid = hexToBytes(gid);
            let offset = BYTE_LEN - bytesGid.length;
            
            _encodeResult.set(bytesGid, offset);
            result += Buffer.from(_encodeResult).toString('hex');
        });
        
        return { 
            isDynamic: false,
            result
        };;
    },
    decode() {
        
    }
};