import basicStruct from '../basicStruct.js';
import utils from '../../utils/index';
// import libUtils from '../../../libs/utils/index';

class Types extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    isValidHexAddress(hexAddr) {
        return utils.isValidHexAddress(hexAddr);
    }

    isValidTokenId(tokenId) {
        return this.provider.request('types.IsValidHexTokenTypeId', tokenId);
    }
}

export default Types;
