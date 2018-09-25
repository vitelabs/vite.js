let nacl = require('../../libs/nacl_blake2b');
let blake = require('blakejs/blake2b');

import basicStruct from './basicStruct';
import libUtils from '../../libs/utils';
import address from '../address';

class Account extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    newHexAddr(privKey) {
        return address.newHexAddr(privKey);
    }

    signTX(accountBlock, privKey) {
        let sourceHex = getSource(accountBlock);
        let source = libUtils.hexToBytes(sourceHex);

        let addr = address.newHexAddr(privKey);
        let pubKey = addr.pubKey; // Hex string

        let hash = blake.blake2b(source, null, 32);
        let hashString = libUtils.bytesToHex(hash);

        let signature = nacl.sign.detached(hash, libUtils.hexToBytes(privKey), libUtils.hexToBytes(pubKey));
        let signatureHex = libUtils.bytesToHex(signature);

        return {
            pubKey,
            hash: hashString, 
            signature: signatureHex
        };
    }
}

export default Account;

function getSource(accountBlock) {
    let source = '';

    source += accountBlock.prevHash || '';
    source += (accountBlock.meta && accountBlock.meta.height) ? libUtils.strToHex(accountBlock.meta.height) : '';
    source += accountBlock.accountAddress ? address.getAddrFromHexAddr(accountBlock.accountAddress) : '';

    if (accountBlock.to) {
        source += address.getAddrFromHexAddr(accountBlock.to);
        source += getRawTokenid(accountBlock.tokenId) || '';
        source += libUtils.strToHex(accountBlock.amount) || '';
    } else {
        source += accountBlock.fromHash || '';
    }

    source += 'EFBFBD';
    source += accountBlock.data ? libUtils.strToHex(accountBlock.data) : '';
    source += accountBlock.snapshotTimestamp || '';
    source += accountBlock.nonce || '';
    source += accountBlock.difficulty || '';
    source += accountBlock.fAmount ? libUtils.strToHex(accountBlock.fAmount) : '';

    return source;
}

function getRawTokenid(tokenId) {
    if (tokenId.indexOf('tti_') !== 0) {
        return null;
    }
    return tokenId.slice(4, tokenId.length - 4);
}
