import { hexToBytes } from 'utils/encoder';
import { bytesStrIllegal, lengthIllegal } from '../error';
import { encode } from './common';

export default {
    encode(typeObj, params) {
        const BYTE_LEN = typeObj.byteLength;
        
        if ( typeof params !== 'string' || 
            !/^0x[0-9a-fA-F]+$/.test(params) ||
            params.length % 2 !== 0 ) {
            throw bytesStrIllegal; 
        }

        let _str = params.substring(2);
        let bytesStr = hexToBytes(_str);
        let isDynamic = !BYTE_LEN;

        if (isDynamic) {
            const STR_LEN = bytesStr.length;
            let dataLength = 32 * Math.ceil(bytesStr.length / 32);
            
            let bytesLen = encode({ 
                type: 'number', byteLength: 32, isArr: false
            }, [STR_LEN + '']).result;
            let bytesDataLen = encode({
                type: 'number', byteLength: 32, isArr: false
            }, [dataLength + '']).result;

            let len = bytesDataLen.length/2 + bytesLen.length/2 + dataLength;
            let arr = new Uint8Array(len);

            arr.set(Buffer.from(bytesDataLen, 'hex'));
            arr.set(Buffer.from(bytesLen, 'hex'), bytesDataLen.length / 2);
            arr.set(bytesStr, bytesDataLen.length / 2 + bytesLen.length / 2);
            return {
                result: Buffer.from(arr).toString('hex'),
                isDynamic,
                typeObj
            };
        }

        if (typeObj.actualByteLen < bytesStr.length || 
            BYTE_LEN - bytesStr.length < 0) {
            throw lengthIllegal;
        }

        let _encodeResult = new Uint8Array(BYTE_LEN);
        _encodeResult.set(bytesStr);

        return {
            result: Buffer.from(_encodeResult).toString('hex'),
            isDynamic,
            typeObj
        } 
    },
    decode() {
        
    }
};
