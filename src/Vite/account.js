let nacl = require('../../libs/nacl_blake2b');
let blake = require('blakejs/blake2b');

import basicStruct from './basicStruct';
import libUtils from '../../libs/utils';
import address from '../address';

class Account extends basicStruct {
    constructor(provider) {
        super(provider);
    }
    
    isValidHexAddr(hexAddr) {
        return address.isValidHexAddr(hexAddr);
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

// 1.sendBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + ToAddress + Amount + TokenId  + Fee + SnapshotHash + Data + Timestamp + LogHash + Nonce）
// 2.receiveBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + FromBlockHash + Fee + SnapshotHash + Data + Timestamp + LogHash + Nonce）

function getSource(accountBlock) {
    let source = '';

    source += accountBlock.blockType ? libUtils.strToHex(''+accountBlock.blockType) : '';
    source += accountBlock.prevHash || '';
    source += (accountBlock.meta && accountBlock.meta.height) ? libUtils.strToHex(accountBlock.meta.height) : '';
    source += accountBlock.accountAddress ? address.getAddrFromHexAddr(accountBlock.accountAddress) : '';

    if (accountBlock.toAddress) {
        source += address.getAddrFromHexAddr(accountBlock.toAddress);
        source += libUtils.strToHex(accountBlock.amount) || '';
        source += getRawTokenid(accountBlock.tokenId) || '';
    } else {
        source += accountBlock.fromBlockHash || '';
    }

    source += accountBlock.fee ? libUtils.strToHex(accountBlock.fee) : '';
    source += accountBlock.snapshotHash || '';

    if ( accountBlock.data ) {
        let byte = libUtils.strToUtf8Bytes(accountBlock.data);
        let hex = libUtils.bytesToHex(byte);
        source += hex;
    }

    source += accountBlock.timestamp ? libUtils.strToHex(''+accountBlock.timestamp) : '';
    // source += accountBlock.logHash || '';
    source += accountBlock.nonce || '';

    return source;
}

function getRawTokenid(tokenId) {
    if (tokenId.indexOf('tti_') !== 0) {
        return null;
    }
    return tokenId.slice(4, tokenId.length - 4);
}
