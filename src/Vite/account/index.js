import basicStruct from '../basicStruct';
import utils from '../../utils/index';

class Account extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    newHexAddress(privKey) {
        return utils.newHexAddr(privKey);
    }

    status() {

    }

    unLock() {

    }

    lock() {

    }


    // signTX() {

    // }
}

export default Account;
