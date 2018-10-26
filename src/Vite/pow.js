let blake = require('blakejs/blake2b');

import BigNumber from 'bn.js';
import basicStruct from './basicStruct.js';
import address from '../address';
import libUtils from '../../libs/utils';

const defaultHash = libUtils.bytesToHex(new BigNumber(0).toArray('big', 32));

class Pow extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    getNonce(addr, prevHash, difficulty) {
        // if (!prevHash) {
        //     this.provider.request('ledger_getLatestBlock', [ addr ]).
        // }
        let prev = prevHash || defaultHash;
        let realAddr = address.getAddrFromHexAddr(addr);
        let hash = libUtils.bytesToHex(blake.blake2b(realAddr + prev, null, 32));
        return this.provider.request('pow_getPowNonce', [difficulty, hash]);
    }
}

export default Pow;
