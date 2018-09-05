import basicStruct from '../basicStruct.js';
import utils from '../../utils/index';

class Types extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    isValidHexAddr(hexAddr) {
        return utils.isValidHexAddr(hexAddr);
    }

    isValidTokenId(tokenId) {
        return this.provider.request('types.IsValidHexTokenTypeId', tokenId);
    }
}

export default Types;
