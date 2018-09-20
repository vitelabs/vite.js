import basicStruct from './basicStruct.js';
import address from '../address';

class Types extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    isValidHexAddr(hexAddr) {
        return address.isValidHexAddr(hexAddr);
    }

    isValidTokenId(tokenId) {
        return this.provider.request('types.IsValidHexTokenTypeId', tokenId);
    }
}

export default Types;
