const nacl = require('@sisi/tweetnacl-blake2b');
const blake = require('blakejs/blake2b');
const BigNumber = require('bn.js');

import {bytesToHex,hexToBytes} from './encoder';
import {getAddrFromHexAddr,newHexAddr} from './address';
import { defaultHash } from '../const/address';
import { blockType } from "../const/type";

export declare type accountBlock = {
    accountAddress: string,
    prevHash: string,
    height: number,
    timestamp: number,
    snapshotHash: string,
    blockType: blockType,
    fee: string,
    data?: string,
    tokenId?: string,
    toAddress?: string,
    amount?: string,
    fromBlockHash?: string,
    logHash?: string,
    nonce?: string
}


export  function signTX(accountBlock: accountBlock, privKey: string, type = 'byte') {
    let sourceHex = getSource(accountBlock);
    let source = hexToBytes(sourceHex);

    let addr = newHexAddr(privKey);
    let pubKey = addr.pubKey; // Hex string

    let hash = blake.blake2b(source, null, 32);
    let hashString = bytesToHex(hash);

    let signature = nacl.sign.detached(hash, hexToBytes(privKey), hexToBytes(pubKey));
    let signatureHex = bytesToHex(signature);

    return {
        hash: hashString,
        pubKey: type === 'byte' ? hexToBytes(pubKey) : pubKey,
        signature: type === 'byte' ? signature : signatureHex
    };
}

// 1.sendBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + ToAddress + Amount + TokenId  + Fee + SnapshotHash + Data + Timestamp + LogHash + Nonce）
// 2.receiveBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + FromBlockHash + Fee + SnapshotHash + Data + Timestamp + LogHash + Nonce）

function getSource(accountBlock: accountBlock) {
    let source = '';
    const blockType = Buffer.from([accountBlock.blockType]).toString('hex');
    source += blockType;
    source += accountBlock.prevHash || defaultHash;
    source += accountBlock.height ? bytesToHex(new BigNumber(accountBlock.height).toArray('big', 8)) : '';
    source += accountBlock.accountAddress ? getAddrFromHexAddr(accountBlock.accountAddress) : '';

    if (accountBlock.toAddress) {
        source += getAddrFromHexAddr(accountBlock.toAddress);
        let amount = new BigNumber(accountBlock.amount);
        source += accountBlock.amount && !amount.isZero() ? bytesToHex(amount.toArray('big')) : '';
        source += getRawTokenid(accountBlock.tokenId) || '';
    } else {
        source += accountBlock.fromBlockHash || defaultHash;
    }

    let fee = new BigNumber(accountBlock.fee);
    source += accountBlock.fee && !fee.isZero() ? bytesToHex(fee.toArray('big')) : '';
    source += accountBlock.snapshotHash || '';

    if (accountBlock.data) {
        let hex = Buffer.from(accountBlock.data, 'base64').toString('hex');
        source += hex;
    }

    source += accountBlock.timestamp ? bytesToHex(new BigNumber(accountBlock.timestamp).toArray('big', 8)) : '';
    source += accountBlock.logHash || '';
    source += accountBlock.nonce ? Buffer.from(accountBlock.nonce, 'base64').toString('hex') : '';

    return source;
}

function getRawTokenid(tokenId: string) {
    if (!tokenId || tokenId.indexOf('tti_') !== 0) {
        return null;
    }
    return tokenId.slice(4, tokenId.length - 4);
}
