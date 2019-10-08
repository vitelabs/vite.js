const BigNumber = require('bn.js');

import { paramsFormat, paramsMissing } from '~@vite/vitejs-error';
import { Default_Hash, Contracts } from '~@vite/vitejs-constant';
import { encodeFunctionSignature, decodeLog } from '~@vite/vitejs-abi';
import { getOriginalAddressFromAddress, isValidAddress } from '~@vite/vitejs-hdwallet/address';
import { ed25519, bytesToHex, blake2b, blake2bHex, checkParams, getRawTokenId } from '~@vite/vitejs-utils';

import { formatAccountBlock, getTransactionTypeByContractList, checkBlock } from './builtin';
import { AccountBlockType, Address, BlockType, SignBlock, sendTxBlock, receiveTxBlock, syncFormatBlock, Base64 } from './type';

const { getPublicKey, sign } = ed25519;

export const DefaultContractTxType = getTransactionTypeByContractList(Contracts);

export function getAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, height, prevHash, toAddress, tokenId, amount, nonce, fee }: syncFormatBlock) {
    const reject = (error, errMsg = '') => {
        const message = `${ error.message || '' } ${ errMsg }`;
        throw new Error(message);
    };

    if (!height && prevHash) {
        return reject(paramsFormat, 'No height but prevHash.');
    }

    if (height && !prevHash) {
        return reject(paramsFormat, 'No prevHash but height.');
    }

    return formatAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, height, prevHash, toAddress, tokenId, amount, nonce, fee });
}

export function getSendTxBlock({ accountAddress, toAddress, tokenId, amount, message, data, height, prevHash }: sendTxBlock) {
    const err = checkParams({ toAddress, tokenId, amount }, [ 'toAddress', 'tokenId', 'amount' ]);
    if (err) {
        throw new Error(err.message);
    }

    return getAccountBlock({
        blockType: 2,
        accountAddress,
        toAddress,
        tokenId,
        amount,
        message,
        data,
        height,
        prevHash
    });
}

export function getReceiveTxBlock({ accountAddress, fromBlockHash, height, prevHash }: receiveTxBlock) {
    const err = checkParams({ fromBlockHash }, ['fromBlockHash']);
    if (err) {
        throw new Error(err.message);
    }

    return getAccountBlock({
        blockType: 4,
        fromBlockHash,
        accountAddress,
        height,
        prevHash
    });
}

export function getTransactionType({ toAddress, data, blockType }: {
    toAddress?: Address;
    data?: Base64;
    blockType: BlockType;
}, contractTxType?): {
    transactionType: string;
    contractAddress?: Address;
    abi?: Object;
} {
    const err = checkParams({ blockType, toAddress }, ['blockType'], [ {
        name: 'toAddress',
        func: isValidAddress
    }, {
        name: 'blockType',
        func: _b => BlockType[_b],
        msg: `Don\'t have blockType ${ blockType }`
    } ]);

    if (err) {
        throw err;
    }

    blockType = Number(blockType);
    const defaultType = { transactionType: BlockType[blockType] };

    if (blockType !== BlockType.TransferRequest) {
        return defaultType;
    }

    if (!toAddress) {
        throw new Error(`${ paramsMissing.message } ToAddress`);
    }

    const allContractTxType = Object.assign({}, contractTxType || {}, DefaultContractTxType);

    const _data = Buffer.from(data || '', 'base64').toString('hex');
    const dataPrefix = _data.slice(0, 8);
    const key = `${ dataPrefix }_${ toAddress }`;

    return allContractTxType[key] || defaultType;
}

// 1.sendBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + ToAddress + Amount + TokenId + Data + Fee + LogHash + Nonce + sendBlock + hashList）

// 2.receiveBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + FromBlockHash + Data + Fee + LogHash + Nonce + sendBlock + hashList）

export function getBlockHash(accountBlock: SignBlock) {
    checkBlock(accountBlock);

    let source = '';

    const blockType = Buffer.from([accountBlock.blockType]).toString('hex');
    source += blockType;
    source += accountBlock.prevHash || Default_Hash;
    source += accountBlock.height ? bytesToHex(new BigNumber(accountBlock.height).toArray('big', 8)) : '';
    source += accountBlock.accountAddress ? getOriginalAddressFromAddress(accountBlock.accountAddress) : '';

    if (accountBlock.toAddress) {
        source += getOriginalAddressFromAddress(accountBlock.toAddress);
        source += getNumberHex(accountBlock.amount);
        source += accountBlock.tokenId ? getRawTokenId(accountBlock.tokenId) || '' : '';
    } else {
        // sendBlockHash
        source += accountBlock.fromBlockHash || Default_Hash;
    }

    if (accountBlock.data) {
        const hex = blake2bHex(Buffer.from(accountBlock.data, 'base64'), null, 32);
        source += hex;
    }

    source += getNumberHex(accountBlock.fee);
    // source += accountBlock.logHash || '';
    source += getNonceHex(accountBlock.nonce);

    // const sendBlockList = accountBlock.sendBlockList || [];
    // sendBlockList.forEach(block => {
    //     source += block.hash;
    // });

    const sourceHex = Buffer.from(source, 'hex');
    const hash = blake2b(sourceHex, null, 32);
    const hashHex = Buffer.from(hash).toString('hex');

    return hashHex;
}

export function signAccountBlock(accountBlock: SignBlock, privKey: Buffer) {
    checkBlock(accountBlock);

    const hashHex = getBlockHash(accountBlock);
    const pubKey = getPublicKey(privKey);
    const signature = sign(hashHex, privKey);

    const _accountBlock = Object.assign({}, accountBlock, {
        hash: hashHex,
        signature: Buffer.from(signature, 'hex').toString('base64'),
        publicKey: Buffer.from(pubKey).toString('base64')
    });

    return _accountBlock;
}

export function decodeBlockByContract({ accountBlock, contractAddress, abi, topics = [], mehtodName }: {
    accountBlock: AccountBlockType;
    contractAddress: Address;
    abi: any;
    topics?: any;
    mehtodName?: string;
}) {
    const err = checkParams({ accountBlock, contractAddress, abi }, [ 'accountBlock', 'contractAddress', 'abi' ], [{
        name: 'contractAddress',
        func: isValidAddress
    }]);
    if (err) {
        throw err;
    }

    checkBlock(accountBlock);

    if (accountBlock.blockType !== BlockType.TransferRequest) {
        throw new Error(`AccountBlock's blockType isn't ${ BlockType.TransferRequest }`);
    }

    if (accountBlock.toAddress !== contractAddress || !accountBlock.data) {
        return null;
    }

    const hexData = Buffer.from(accountBlock.data, 'base64').toString('hex');

    const encodeFuncSign = encodeFunctionSignature(abi, mehtodName);
    if (encodeFuncSign !== hexData.substring(0, 8)) {
        return null;
    }

    return decodeLog(abi, hexData.substring(8), topics, mehtodName);
}



function leftPadBytes(bytesData, len) {
    if (bytesData && len - bytesData.length < 0) {
        return bytesData.toString('hex');
    }

    const result = new Uint8Array(len);
    if (bytesData) {
        result.set(bytesData, len - bytesData.length);
    }
    return Buffer.from(result).toString('hex');
}

function getNumberHex(amount) {
    const bigAmount = new BigNumber(amount);
    const amountBytes = amount && !bigAmount.isZero() ? bigAmount.toArray('big') : '';
    return leftPadBytes(amountBytes, 32);
}

function getNonceHex(nonce) {
    const nonceBytes = nonce ? Buffer.from(nonce, 'base64') : '';
    return leftPadBytes(nonceBytes, 8);
}
