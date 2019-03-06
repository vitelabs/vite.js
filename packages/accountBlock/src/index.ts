const BigNumber = require('bn.js');

import { ed25519, encoder, tools } from '@vite/vitejs-utils';
import { getAddrFromHexAddr } from '@vite/vitejs-privtoaddr';
import { paramsMissing, paramsFormat } from '@vite/vitejs-error';
import { Default_Hash, contractAddrs, abiFuncSignature } from '@vite/vitejs-constant';

import { formatAccountBlock as _formatAccountBlock, validReqAccountBlock as _validReqAccountBlock, getCreateContractData as _getCreateContractData } from "./builtin";
import { AccountBlock, BlockType, SignBlock, sendTxBlock, receiveTxBlock, syncFormatBlock } from "./type";

const { getPublicKey, sign } = ed25519;
const { bytesToHex, blake2b } = encoder;
const { checkParams, getRawTokenid } = tools;

const txType = enumTxType();

export function getAccountBlock({
    blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, toAddress, tokenId, amount, nonce
}: syncFormatBlock) {
    let reject = (error, errMsg = '') => {
        let message = `${error.message || ''} ${errMsg}`;
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
        blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, toAddress, tokenId, amount, nonce
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
    const key = `${dataPrefix}_${toAddress}`;

    const type = txType[key] || defaultType;
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
        source += accountBlock.tokenId ? getRawTokenid(accountBlock.tokenId) || '' : '';
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

    let _accountBlock: AccountBlock = Object.assign({}, accountBlock, {
        hash: hashHex, 
        signature: Buffer.from(signature, 'hex').toString('base64'),
        publicKey: Buffer.from(pubKey).toString('base64')
    });

    return _accountBlock;
}

export const formatAccountBlock = _formatAccountBlock;

export const validReqAccountBlock = _validReqAccountBlock;

export const getCreateContractData = _getCreateContractData;



function enumTxType () {
    let txType = {};

    // Register
    txType[`${abiFuncSignature.Register}_${contractAddrs.Register}`] = 'SBPreg';
    txType[`${abiFuncSignature.UpdateRegistration}_${contractAddrs.Register}`] = 'UpdateReg';
    txType[`${abiFuncSignature.CancelRegister}_${contractAddrs.Register}`] = 'RevokeReg';
    txType[`${abiFuncSignature.Reward}_${contractAddrs.Register}`] = 'RetrieveReward';

    // Vote
    txType[`${abiFuncSignature.Vote}_${contractAddrs.Vote}`] = 'Voting';
    txType[`${abiFuncSignature.CancelVote}_${contractAddrs.Vote}`] = 'RevokeVoting';

    // Quota
    txType[`${abiFuncSignature.Pledge}_${contractAddrs.Quota}`] = 'GetQuota';
    txType[`${abiFuncSignature.CancelPledge}_${contractAddrs.Quota}`] = 'WithdrawalOfQuota';
    
    // Mintage
    txType[`${abiFuncSignature.Mint}_${contractAddrs.Mintage}`] = 'Mintage';
    txType[`${abiFuncSignature.Issue}_${contractAddrs.Mintage}`] = 'MintageIssue';
    txType[`${abiFuncSignature.Burn}_${contractAddrs.Mintage}`] = 'MintageBurn';
    txType[`${abiFuncSignature.TransferOwner}_${contractAddrs.Mintage}`] = 'MintageTransferOwner';
    txType[`${abiFuncSignature.ChangeTokenType}_${contractAddrs.Mintage}`] = 'MintageChangeTokenType';
    txType[`${abiFuncSignature.Mint_CancelPledge}_${contractAddrs.Mintage}`] = 'MintageCancelPledge';
    
    // Dex
    txType[`${abiFuncSignature.DexFundUserDeposit}_${contractAddrs.DexFund}`] = 'DexFundUserDeposit';
    txType[`${abiFuncSignature.DexFundUserWithdraw}_${contractAddrs.DexFund}`] = 'DexFundUserWithdraw';
    txType[`${abiFuncSignature.DexFundNewOrder}_${contractAddrs.DexFund}`] = 'DexFundNewOrder';
    txType[`${abiFuncSignature.DexTradeCancelOrder}_${contractAddrs.DexTrade}`] = 'DexTradeCancelOrder';

    return txType;
}
