let nacl = require('../../libs/nacl_blake2b');
let blake = require('blakejs/blake2b');

import BigNumber from 'bn.js';
import basicStruct from './basicStruct';
import libUtils from '../../libs/utils';
import address from '../address';

const defaultHash = libUtils.bytesToHex(new BigNumber(0).toArray('big', 32));

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

    signTX(accountBlock, privKey, type = 'byte') {
        let sourceHex = getSource(accountBlock);
        let source = libUtils.hexToBytes(sourceHex);

        let addr = address.newHexAddr(privKey);
        let pubKey = addr.pubKey; // Hex string

        let hash = blake.blake2b(source, null, 32);
        let hashString = libUtils.bytesToHex(hash);

        let signature = nacl.sign.detached(hash, libUtils.hexToBytes(privKey), libUtils.hexToBytes(pubKey));
        let signatureHex = libUtils.bytesToHex(signature);

        return {
            hash: hashString,
            pubKey: type === 'byte' ? libUtils.hexToBytes(pubKey) : pubKey,
            signature: type === 'byte' ? signature : signatureHex
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

    let blockType = Buffer.from(''+accountBlock.blockType).toString();
    source += blockType ? libUtils.bytesToHex(blockType) : '';
    source += accountBlock.prevHash || defaultHash;
    source += accountBlock.height ? libUtils.bytesToHex(new BigNumber(accountBlock.height).toArray('big', 8)) : '';
    source += accountBlock.accountAddress ? address.getAddrFromHexAddr(accountBlock.accountAddress) : '';

    if (accountBlock.toAddress) {
        source += address.getAddrFromHexAddr(accountBlock.toAddress);
        let amount = new BigNumber(accountBlock.amount);
        source += accountBlock.amount && !amount.isZero() ? libUtils.bytesToHex(amount.toArray('big')) : '';
        source += getRawTokenid(accountBlock.tokenId) || '';
    } else {
        source += accountBlock.fromBlockHash || defaultHash;
    }

    let fee = new BigNumber(accountBlock.fee);
    source += accountBlock.fee && !fee.isZero() ? libUtils.bytesToHex(fee.toArray('big')) : '';
    source += accountBlock.snapshotHash || '';

    if ( accountBlock.data ) {
        let hex = Buffer.from(accountBlock.data, 'base64').toString('hex');
        source += hex;
    }

    source += accountBlock.timestamp ? libUtils.bytesToHex(new BigNumber(accountBlock.timestamp).toArray('big', 8)) : '';
    source += accountBlock.logHash || '';
    source += accountBlock.nonce ? Buffer.from(accountBlock.nonce, 'base64').toString('hex')  : '';

    return source;
}

function getRawTokenid(tokenId) {
    if (tokenId.indexOf('tti_') !== 0) {
        return null;
    }
    return tokenId.slice(4, tokenId.length - 4);
}
