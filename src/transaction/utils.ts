const BigNumber = require('bn.js');
const blake = require('blakejs/blake2b');

import { paramsMissing } from '~@vite/vitejs-error';
import { encodeParameters, encodeFunctionCall, encodeFunctionSignature } from '~@vite/vitejs-abi';
import { isValidAddress, getAddressFromPublicKey, getOriginalAddressFromAddress } from '~@vite/vitejs-hdwallet/address';
import { checkParams, isNonNegativeInteger, isHexString, isTokenId, bytesToHex, getRawTokenId, isArray, isObject } from '~@vite/vitejs-utils';

import { Delegate_Gid } from './constant';

import { BlockType, Address, Base64, Hex, TokenId, Uint64, BigInt, AccountBlockType, Uint8 } from './type';

export const Default_Hash = '0000000000000000000000000000000000000000000000000000000000000000'; // A total of 64 0

export function checkAccountBlock(accountBlock: {
    blockType: BlockType;
    address: Address;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    height?: Uint64;
    previousHash?: Hex;
    difficulty?: BigInt;
    nonce?: Base64;
    signature?: Base64;
    publicKey?: Base64;
}): {
    code: string;
    message: string;
} {
    const err = checkParams(accountBlock, [ 'blockType', 'address' ], [ {
        name: 'blockType',
        func: _b => BlockType[_b],
        msg: `Don\'t have blockType ${ accountBlock.blockType }`
    }, {
        name: 'address',
        func: isValidAddress
    }, {
        name: 'sendBlockHash',
        func: isHexString
    }, {
        name: 'toAddress',
        func: isValidAddress
    }, {
        name: 'amount',
        func: isNonNegativeInteger,
        msg: 'Amount must be an non-negative integer string.'
    }, {
        name: 'tokenId',
        func: isTokenId
    }, {
        name: 'height',
        func: isNonNegativeInteger
    }, {
        name: 'previousHash',
        func: isHexString
    }, {
        name: 'hash',
        func: isHexString
    } ]);

    if (err) {
        return err;
    }

    if (Number(accountBlock.blockType) !== BlockType.Response && !accountBlock.sendBlockHash) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } SendBlockHash.`
        };
    }

    if (Number(accountBlock.amount) && !accountBlock.tokenId) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } TokenId.`
        };
    }

    if ((accountBlock.difficulty && !accountBlock.nonce) || (!accountBlock.difficulty && accountBlock.nonce)) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } Difficulty and nonce is required at the same time.`
        };
    }

    if (accountBlock.publicKey) {
        const address = getAddressFromPublicKey(Buffer.from(accountBlock.publicKey, 'base64'));
        if (accountBlock.address !== address) {
            return {
                code: paramsMissing.code,
                message: 'PublicKey is wrong.'
            };
        }
    }

    return null;
}

export function isRequestBlock(blockType: BlockType): Boolean {
    return blockType === BlockType.CreateContractRequest
        || blockType === BlockType.TransferRequest
        || blockType === BlockType.RefundByContractRequest
        || blockType === BlockType.ReIssueRequest;
}

export function isResponseBlock(blockType: BlockType): Boolean {
    return blockType === BlockType.Response
        || blockType === BlockType.ResponseFail
        || blockType === BlockType.GenesisResponse;
}


// 1.sendBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + ToAddress + Amount + TokenId + Data + Fee + LogHash + Nonce + sendBlock + hashList）

// 2.receiveBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + FromBlockHash + Data + Fee + LogHash + Nonce + sendBlock + hashList）

export function getAccountBlockHash(accountBlock: {
    blockType: BlockType;
    address: Address;
    height?: Uint64;
    previousHash?: Hex;
    fromAddress?: Address;
    toAddress?: Address;
    sendBlockHash?: Hex;
    tokenId?: TokenId;
    amount?: BigInt;
    fee?: BigInt;
    data?: Base64;
    difficulty?: BigInt;
    nonce?: Base64;
    vmlogHash?: Hex;
    triggeredSendBlockList?: AccountBlockType[];
}): Hex {
    checkAccountBlock(accountBlock);

    let source = '';

    source += getBlockTypeHex(accountBlock.blockType);
    source += getPreviousHashHex(accountBlock.previousHash);
    source += getHeightHex(accountBlock.height);
    source += getAddressHex(accountBlock.address);

    if (accountBlock.toAddress) {
        source += getAddressHex(accountBlock.toAddress);
        source += getAmountHex(accountBlock.amount);
        source += getTokenIdHex(accountBlock.tokenId);
    } else {
        source += getSendBlockHashHex(accountBlock.sendBlockHash);
    }

    source += getDataHex(accountBlock.data);
    source += getFeeHex(accountBlock.fee);
    source += accountBlock.vmlogHash || '';
    source += getNonceHex(accountBlock.nonce);
    source += getTriggeredSendBlockListHex(accountBlock.triggeredSendBlockList);

    const sourceHex = Buffer.from(source, 'hex');
    const hashBuffer = blake.blake2b(sourceHex, null, 32);
    return Buffer.from(hashBuffer).toString('hex');
}

export function getBlockTypeHex(blockType: BlockType): Hex {
    return Buffer.from([blockType]).toString('hex');
}

export function getPreviousHashHex(previousHash: Hex): Hex {
    return previousHash || Default_Hash;
}

export function getHeightHex(height: Uint64): Hex {
    return Number(height) ? bytesToHex(new BigNumber(height).toArray('big', 8)) : '';
}

export function getAddressHex(address: Address): Hex {
    return address ? getOriginalAddressFromAddress(address) : '';
}

export function getToAddressHex(toAddress: Address): Hex {
    return toAddress ? getOriginalAddressFromAddress(toAddress) : '';
}

export function getAmountHex(amount): Hex {
    return getNumberHex(amount);
}

export function getTokenIdHex(tokenId: TokenId): Hex {
    return tokenId ? getRawTokenId(tokenId) || '' : '';
}

export function getSendBlockHashHex(sendBlockHash: Hex): Hex {
    return sendBlockHash || Default_Hash;
}

export function getDataHex(data: Base64): Hex {
    return data ? blake.blake2bHex(Buffer.from(data, 'base64'), null, 32) : '';
}

export function getFeeHex(fee: BigInt): Hex {
    return getNumberHex(fee);
}

export function getNonceHex(nonce: Base64) {
    const nonceBytes = nonce ? Buffer.from(nonce, 'base64') : '';
    return leftPadBytes(nonceBytes, 8);
}

export function getTriggeredSendBlockListHex(triggeredSendBlockList: AccountBlockType[] = []) {
    let source = '';
    triggeredSendBlockList.forEach(block => {
        source += block.hash;
    });
    return source;
}

export function getCreateContractData({ abi, code, params, responseLatency = '0', quotaMultiplier = '10', randomDegree = '0' }: {
    responseLatency?: Uint8;
    quotaMultiplier?: Uint8;
    randomDegree?: Uint8;
    code?: Hex;
    abi?: Object | Array<Object>;
    params?: string | Array<string | boolean>;
}): Base64 {
    const err = checkParams({ responseLatency, quotaMultiplier, randomDegree, code }, [ 'responseLatency', 'quotaMultiplier', 'randomDegree' ], [ {
        name: 'responseLatency',
        func: _c => Number(_c) >= 0 && Number(_c) <= 75
    }, {
        name: 'quotaMultiplier',
        func: _c => Number(_c) >= 10 && Number(_c) <= 100
    }, {
        name: 'randomDegree',
        func: _c => Number(_c) >= 0 && Number(_c) <= 75
    }, {
        name: 'code',
        func: isHexString
    } ]);
    if (err) {
        throw err;
    }

    // gid + contractType + responseLatency + randomDegree + quotaMultiplier + bytecode
    const jsonInterface = getAbi(abi, 'constructor');
    const _responseLatency = new BigNumber(responseLatency).toArray();
    const _randomDegree = new BigNumber(randomDegree).toArray();
    const _quotaMultiplier = new BigNumber(quotaMultiplier).toArray();
    let data = `${ Delegate_Gid }01${ Buffer.from(_responseLatency).toString('hex') }${ Buffer.from(_randomDegree).toString('hex') }${ Buffer.from(_quotaMultiplier).toString('hex') }${ code }`;

    if (jsonInterface) {
        data += encodeParameters(jsonInterface, params);
    }
    return Buffer.from(data, 'hex').toString('base64');
}

export function getCallContractData({ abi, params, methodName }: {
    abi: Object | Array<Object>;
    params?: string | Array<string | boolean>;
    methodName?: string;
}): Base64 {
    const data = encodeFunctionCall(abi, params, methodName);
    return Buffer.from(data, 'hex').toString('base64');
}

export function getAbi(jsonInterfaces, type) {
    const err = checkParams({ jsonInterfaces, type }, [ 'jsonInterfaces', 'type' ], [{
        name: 'jsonInterfaces',
        func: {
            name: 'jsonInterfaces',
            func: _a => isArray(_a) || isObject(_a)
        }
    }]);
    if (err) {
        throw err;
    }

    // jsonInterfaces is an object
    if (!isArray(jsonInterfaces) && isObject(jsonInterfaces)) {
        if (jsonInterfaces.type === type) {
            return jsonInterfaces;
        }
    }

    // jsonInterfaces is an array
    for (let i = 0; i < jsonInterfaces.length; i++) {
        if (jsonInterfaces[i].type === type) {
            return jsonInterfaces[i];
        }
    }

    return null;
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
