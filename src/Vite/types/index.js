import basicStruct from '../basicStruct.js';
import utils from '../../utils/index';
import libUtils from '../../../libs/utils/index';

class Types extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    isValidHexAddress(hexAddr) {
        return utils.isValidHexAddress(hexAddr);
    }

    isValidKeystore(keystore) {
        // keystore = JSON.stringify({'hexaddress':'vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689','id':'6eaca13f-c45a-4c46-b7f2-7e998d1c22a9','crypto':{'ciphername':'aes-256-gcm','ciphertext':'4860303324a7197d3a6b59e26c8cbaddb708518199a9fd02b41cfa2e07e4776468237d89f4f829bb7c8107b99743bf0b24c280f05cf2f153e14f6b617d3bfdcc7d2afd8a7755928320db73f3a5367d67','nonce':'120a16c31737f84e70ca8186','kdf':'scrypt','scryptparams':{'n':262144,'r':8,'p':1,'keylen':32,'salt':'51bea421f79b95150356f754b876adc654e579a22ab5a64d6dc504bc9febc1bb'}},'keystoreversion':1,'timestamp':1536037233}).toLocaleLowerCase();
        
        // Out keystore file size is about 500 so if a file is very large it must not be a keystore file
        if (libUtils.getStrBytesCount(keystore) > 2 * 1024) {
            return false;
        }
    
        let keyJson = {};
        try {
            keyJson = JSON.parse(keystore.toLowerCase());
        } catch(err) {
            console.log(err);
            return false;
        }

        console.log(utils.isValidHexAddress(keyJson.hexaddress));
        if (!keyJson.id || 
                !keyJson.hexaddress || 
                !keyJson.keystoreversion || 
                !utils.isValidHexAddress(keyJson.hexaddress)) {
            console.log('???');
            return false;
        }
    
        // let kId = uuid.Parse(keyJson.id);
        let kVersion = keyJson.keystoreversion;
        let hexAddr = keyJson.hexaddress;
    
        console.log(kVersion, hexAddr);

        return {
            hexAddr
        };
    }

    isValidTokenId(tokenId) {
        return this.provider.request('types.IsValidHexTokenTypeId', tokenId);
    }
}

export default Types;
