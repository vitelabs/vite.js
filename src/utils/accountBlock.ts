const BigNumber = require('bn.js');

import { getPublicKey, sign } from 'utils/ed25519';
import { bytesToHex, blake2b } from 'utils/encoder';
import { checkParams, getRawTokenid } from "utils/tools";
import { getAddrFromHexAddr } from 'utils/address/privToAddr';
import { formatAccountBlock, validReqAccountBlock } from "utils/builtin";

import { Default_Hash } from 'const/contract';
import { paramsMissing, paramsFormat } from "const/error";
import { AccountBlock, BlockType, SignBlock, sendTxBlock, receiveTxBlock, formatBlock } from "const/type";


enum txType {
    'f29c6ce2_vite_0000000000000000000000000000000000000001c9e9f25417' = 'SBPreg',
    '3b7bdf74_vite_0000000000000000000000000000000000000001c9e9f25417' = 'UpdateReg',
    '60862fe2_vite_0000000000000000000000000000000000000001c9e9f25417' = 'RevokeReg',
    'ce1f27a7_vite_0000000000000000000000000000000000000001c9e9f25417' = 'RetrieveReward',
    'fdc17f25_vite_000000000000000000000000000000000000000270a48cc491' = 'Voting',
    'a629c531_vite_000000000000000000000000000000000000000270a48cc491' = 'RevokeVoting',
    '8de7dcfd_vite_000000000000000000000000000000000000000309508ba646' = 'GetQuota',
    '9ff9c7b6_vite_000000000000000000000000000000000000000309508ba646' = 'WithdrawalOfQuota',
    '46d0ce8b_vite_00000000000000000000000000000000000000056ad6d26692' = 'TokenIssuance',
    '9b9125f5_vite_00000000000000000000000000000000000000056ad6d26692' = 'WithdrawalOfToken'
};


export function getAccountBlock({
    blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, toAddress, tokenId, amount
}: formatBlock) {
    let reject = (error, errMsg = '') => {
        let message = `${error.msg} ${errMsg}`;
        console.error(new Error(message));
        return null;
    }

    let err = validReqAccountBlock({
        blockType, fromBlockHash, accountAddress, message, data, toAddress, amount
    });
    if (err) {
        return reject(err);
    }

    if (!snapshotHash) {
        return reject(paramsMissing, 'SnapshotHash.');
    }

    if (!height && prevHash) {
        return reject(paramsFormat, 'No height but prevHash.');
    }

    if (height && !prevHash) {
        return reject(paramsFormat, 'No prevHash but height.');
    }

    return formatAccountBlock({
        blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, toAddress, tokenId, amount
    });
}

export function getSendTxBlock({
    accountAddress, toAddress, tokenId, amount, message, height, prevHash, snapshotHash
}: sendTxBlock) {
    let err = checkParams({ toAddress, tokenId, amount }, ['toAddress', 'tokenId', 'amount']);
    if (err) {
        console.error(new Error(err.message))
        return null;
    }

    return getAccountBlock({
        blockType: 2,
        accountAddress, toAddress, tokenId, amount, message, height, prevHash, snapshotHash
    });
}

export function getReceiveTxBlock({
    accountAddress, fromBlockHash, height, prevHash, snapshotHash
}: receiveTxBlock) {
    let err = checkParams({ fromBlockHash }, ['fromBlockHash']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    return getAccountBlock({
        blockType: 4,
        fromBlockHash, accountAddress, height, prevHash, snapshotHash
    });
}

export function getBuiltinTxType(toAddress, data, blockType) {
    const defaultType = BlockType[blockType];

    if (blockType !== 2) {
        return defaultType;
    }

    let _data = Buffer.from(data || '', 'base64').toString('hex');
    const dataPrefix = _data.slice(0, 8);
    const key =`${dataPrefix}_${toAddress}`;
    const type = txType[key] ? defaultType : txType[key];
    return type;
}

// 1.sendBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + ToAddress + Amount + TokenId  + Fee + SnapshotHash + Data + Timestamp + LogHash + Nonce）
// 2.receiveBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + FromBlockHash + Fee + SnapshotHash + Data + Timestamp + LogHash + Nonce）

export function getBlockHash(accountBlock: SignBlock) {
    let source = '';

    let blockType = Buffer.from([accountBlock.blockType]).toString('hex');
    source += blockType;
    source += accountBlock.prevHash || Default_Hash;
    source += accountBlock.height ? bytesToHex(new BigNumber(accountBlock.height).toArray('big', 8)) : '';
    source += accountBlock.accountAddress ? getAddrFromHexAddr(accountBlock.accountAddress) : '';

    if (accountBlock.toAddress) {
        source += getAddrFromHexAddr(accountBlock.toAddress);
        let amount = new BigNumber(accountBlock.amount);
        source += accountBlock.amount && !amount.isZero() ? bytesToHex(amount.toArray('big')) : '';
        source += getRawTokenid(accountBlock.tokenId) || '';
    } else {
        source += accountBlock.fromBlockHash || Default_Hash;
    }

    let fee = new BigNumber(accountBlock.fee);
    source += accountBlock.fee && !fee.isZero() ? bytesToHex(fee.toArray('big')) : '';
    source += accountBlock.snapshotHash || '';

    if ( accountBlock.data ) {
        let hex = Buffer.from(accountBlock.data, 'base64').toString('hex');
        source += hex;
    }

    source += accountBlock.timestamp ? bytesToHex(new BigNumber(accountBlock.timestamp).toArray('big', 8)) : '';
    source += accountBlock.logHash || '';
    source += accountBlock.nonce ? Buffer.from(accountBlock.nonce, 'base64').toString('hex')  : '';

    let sourceHex = Buffer.from(source, 'hex');
    let hash = blake2b(sourceHex, null, 32);
    let hashHex = Buffer.from(hash).toString('hex');

    return hashHex;
}

export function signAccountBlock(accountBlock: SignBlock, privKey: string) {
    let hashHex = getBlockHash(accountBlock);

    let _privKey = Buffer.from(privKey, 'hex');
    let pubKey = getPublicKey(_privKey);
    let signature = sign(hashHex, _privKey);

    let _accountBlock: AccountBlock = Object.assign({
        hash: hashHex, 
        signature: Buffer.from(signature, 'hex').toString('base64'),
        publicKey: Buffer.from(pubKey).toString('base64')
    }, accountBlock);

    return _accountBlock;
}
