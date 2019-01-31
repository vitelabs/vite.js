const BigNumber = require('bn.js');

export default {
    encode(typeObj, params) {
        let result = '';        

        params.forEach((_params) => {
            const BYTE_LEN = typeObj.byteLength;

            _params = !!_params;
            let bytesBool = _params ? new BigNumber('1').toArray() : new BigNumber('0').toArray();
            let _encodeResult = new Uint8Array(BYTE_LEN);
            let offset = BYTE_LEN - bytesBool.length;

            _encodeResult.set(bytesBool, offset);
            result += Buffer.from(_encodeResult).toString('hex');
        });

        return result;
    },
    decode() {
        
    }
};