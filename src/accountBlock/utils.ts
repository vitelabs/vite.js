import * as BigNumber from 'bn.js';
import * as blake from 'blakejs';

import { paramsMissing, paramsFormat } from '@vite/vitejs-error';
import { Delegate_Gid, Contracts } from '@vite/vitejs-constant';
import { getAbiByType, encodeParameters, encodeFunctionCall, encodeFunctionSignature, decodeLog } from '@vite/vitejs-abi';
import addressUtils from '@vite/vitejs-wallet';
import { checkParams, isNonNegativeInteger, isHexString, isValidTokenId, getOriginalTokenIdFromTokenId, isObject, ed25519, isBase64String } from '@vite/vitejs-utils';

import { BlockType, Address, Base64, Hex, TokenId, Uint64, BigInt, AccountBlockType, Uint8 } from './type';


const isValidAddress = addressUtils.isValidAddress;
const getAddressFromPublicKey = addressUtils.getAddressFromPublicKey;
const createAddressByPrivateKey = addressUtils.createAddressByPrivateKey;
const getOriginalAddressFromAddress = addressUtils.getOriginalAddressFromAddress;
const AddressType = addressUtils.AddressType;
const getAddressFromOriginalAddress = addressUtils.getAddressFromOriginalAddress;

export const Default_Hash = '0000000000000000000000000000000000000000000000000000000000000000'; // A total of 64 0

export const Default_Contract_TransactionType = encodeContractList(Contracts);

export enum AccountBlockStatus {
    'Before_Hash' = 1,
    'Before_Signature',
    'Complete'
}

// Check AccountBlock
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
    hash?: Hex;
    signature?: Base64;
    publicKey?: Base64;
}, status: AccountBlockStatus = AccountBlockStatus.Before_Hash): {
    code: string;
    message: string;
} | undefined {
    const err = checkParams(accountBlock,
        [ 'blockType', 'address', 'height', 'previousHash' ],
        [ {
            name: 'blockType',
            func: _b => BlockType[_b],
            msg: `Don\'t have blockType ${ accountBlock.blockType }`
        }, {
            name: 'address',
            func: isValidAddress
        }, {
            name: 'height',
            func: isNonNegativeInteger
        }, {
            name: 'previousHash',
            func: isHexString
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
            name: 'fee',
            func: isNonNegativeInteger,
            msg: 'Fee must be an non-negative integer string.'
        }, {
            name: 'tokenId',
            func: isValidTokenId
        }, {
            name: 'data',
            func: isBase64String
        }, {
            name: 'hash',
            func: isHexString
        }, {
            name: 'signature',
            func: isBase64String
        }, {
            name: 'publicKey',
            func: isBase64String
        } ]);

    if (err) {
        return err;
    }

    if (Number(accountBlock.blockType) === BlockType.Response && !accountBlock.sendBlockHash) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } SendBlockHash.`
        };
    }

    if (isRequestBlock(accountBlock.blockType) && !accountBlock.toAddress) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } ToAddress.`
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

    if (status === AccountBlockStatus.Before_Hash) {
        return undefined;
    }

    if (!accountBlock.hash) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } Hash.`
        };
    }

    const hash = getAccountBlockHash(accountBlock);
    if (accountBlock.hash !== hash) {
        return {
            code: paramsFormat.code,
            message: `${ paramsFormat.message } Hash is wrong.`
        };
    }

    if (status === AccountBlockStatus.Before_Signature) {
        return undefined;
    }

    if (!accountBlock.publicKey) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } PublicKey.`
        };
    }

    const address = getAddressFromPublicKey(Buffer.from(accountBlock.publicKey, 'base64').toString('hex'));
    if (accountBlock.address !== address) {
        return {
            code: paramsFormat.code,
            message: 'PublicKey is wrong.'
        };
    }

    if (!accountBlock.signature) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } Signature.`
        };
    }

    const publicKey = Buffer.from(accountBlock.publicKey, 'base64').toString('hex');
    const signature = Buffer.from(accountBlock.signature, 'base64').toString('hex');
    const result = ed25519.verify(hash, signature, publicKey);
    if (!result) {
        return {
            code: paramsFormat.code,
            message: 'Signature is wrong.'
        };
    }

    return undefined;
}

export function isValidAccountBlockWithoutHash(accountBlock: {
    blockType: BlockType;
    address: Address;
    height?: Uint64;
    previousHash?: Hex;
    fee?: BigInt;
    amount?: BigInt;
    toAddress?: Address;
    tokenId?: TokenId;
    data?: Base64;
    sendBlockHash?: Hex;
    difficulty?: BigInt;
    nonce?: Base64;
}) {
    const err = checkAccountBlock(accountBlock, AccountBlockStatus.Before_Hash);
    return !err;
}

export function isValidAccountBlockWithoutSignature(accountBlock: {
    blockType: BlockType;
    address: Address;
    height: Uint64;
    previousHash: Hex;
    hash: Hex;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    difficulty?: BigInt;
    nonce?: Base64;
}) {
    const err = checkAccountBlock(accountBlock, AccountBlockStatus.Before_Signature);
    return !err;
}

export function isValidAccountBlock(accountBlock) {
    const err = checkAccountBlock(accountBlock, AccountBlockStatus.Complete);
    return !err;
}

export function isRequestBlock(blockType: BlockType): boolean {
    return blockType === BlockType.CreateContractRequest
        || blockType === BlockType.TransferRequest
        || blockType === BlockType.RefundByContractRequest
        || blockType === BlockType.ReIssueRequest;
}

export function isResponseBlock(blockType: BlockType): boolean {
    return blockType === BlockType.Response
        || blockType === BlockType.ResponseFail
        || blockType === BlockType.GenesisResponse;
}

export function createContractAddress({ address, height, previousHash }: {
    address: Address;
    height: Uint64;
    previousHash: Hex;
}): Address {
    const err = checkParams({ address, height, previousHash },
        [ 'address', 'height', 'previousHash' ],
        [ {
            name: 'address',
            func: isValidAddress
        }, {
            name: 'height',
            func: isNonNegativeInteger
        }, {
            name: 'previousHash',
            func: isHexString
        } ]);
    if (err) {
        throw err;
    }

    const originAddressBuffer: Buffer = Buffer.from(getOriginalAddressFromAddress(address), 'hex');
    const heightBuffer: Buffer = Buffer.from(new BigNumber(height).toArray('big', 8));
    const previousHashBuffer: Buffer = Buffer.from(previousHash, 'hex');

    const totalLength = originAddressBuffer.length + heightBuffer.length + previousHashBuffer.length;
    const _o: Buffer = Buffer.concat([ originAddressBuffer, heightBuffer, previousHashBuffer ], totalLength);
    const _originContractAddress = blake.blake2b(_o, undefined, 20);

    const originContractAddress = new Uint8Array(21);
    originContractAddress.set(_originContractAddress);
    originContractAddress.set([1], 20);

    return getAddressFromOriginalAddress(Buffer.from(originContractAddress).toString('hex'));
}

// Get AccountBlock.hash

// 1.sendBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + ToAddress + Amount + TokenId + Data + Fee + LogHash + Nonce + sendBlock + hashList）

// 2.receiveBlock
// hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + FromBlockHash + Data + Fee + LogHash + Nonce + sendBlock + hashList）

export function getAccountBlockHash(accountBlock: {
    blockType: BlockType;
    address: Address;
    hash?: Hex;
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
    let source = '';

    source += getBlockTypeHex(accountBlock.blockType);
    source += getPreviousHashHex(accountBlock.previousHash);
    source += getHeightHex(accountBlock.height);
    source += getAddressHex(accountBlock.address);

    if (isRequestBlock(accountBlock.blockType)) {
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
    const hashBuffer = blake.blake2b(sourceHex, undefined, 32);
    return Buffer.from(hashBuffer).toString('hex');
}

export function getBlockTypeHex(blockType: BlockType): Hex {
    return Buffer.from([blockType]).toString('hex');
}

export function getPreviousHashHex(previousHash: Hex | undefined): Hex {
    return previousHash || Default_Hash;
}

export function getHeightHex(height: Uint64 | undefined): Hex {
    return height ? Buffer.from(new BigNumber(height).toArray('big', 8)).toString('hex') : '';
}

export function getAddressHex(address: Address | undefined): Hex {
    return address ? getOriginalAddressFromAddress(address) : '';
}

export function getToAddressHex(toAddress: Address | undefined): Hex {
    return toAddress ? getOriginalAddressFromAddress(toAddress) : '';
}

export function getAmountHex(amount): Hex {
    return getNumberHex(amount);
}

export function getTokenIdHex(tokenId: TokenId | undefined): Hex {
    return tokenId ? getOriginalTokenIdFromTokenId(tokenId) || '' : '';
}

export function getSendBlockHashHex(sendBlockHash: Hex | undefined): Hex {
    return sendBlockHash || Default_Hash;
}

export function getDataHex(data: Base64 | undefined): Hex {
    return data ? blake.blake2bHex(Buffer.from(data, 'base64'), undefined, 32) : '';
}

export function getFeeHex(fee: BigInt | undefined): Hex {
    return getNumberHex(fee);
}

export function getNonceHex(nonce: Base64 | undefined) {
    const nonceBytes = nonce ? Buffer.from(nonce, 'base64') : '';
    return leftPadBytes(nonceBytes, 8);
}

export function getTriggeredSendBlockListHex(triggeredSendBlockList: AccountBlockType[] = []) {
    if (!triggeredSendBlockList) {
        return '';
    }
    let source = '';
    triggeredSendBlockList.forEach(block => {
        source += block.hash;
    });
    return source;
}


// Get AccountBlock.data
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
    const jsonInterface = getAbiByType(abi, 'constructor');
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
    params?: any;
    methodName?: string;
}): Base64 {
    const data = encodeFunctionCall(abi, params, methodName);
    return Buffer.from(data, 'hex').toString('base64');
}

export function messageToData(message: string) {
    if (!message) {
        return '';
    }
    const messageHex = Buffer.from(message).toString('hex');
    return Buffer.from(messageHex, 'hex').toString('base64');
}

// Sign
export function signAccountBlock(accountBlock: {
    blockType: BlockType;
    address: Address;
    hash?: Hex;
    height?: Uint64;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    previousHash?: Hex;
    difficulty?: BigInt;
    nonce?: Base64;
}, privateKey: Hex): {
    signature: Base64; publicKey: Base64;
} {
    const err = checkParams({ privateKey, accountBlock }, [ 'privateKey', 'accountBlock' ], [{
        name: 'privateKey',
        func: isHexString,
        msg: 'PrivateKey is Hex-string'
    }]);
    if (err) {
        throw err;
    }

    const checkError = checkAccountBlock(accountBlock, AccountBlockStatus.Before_Signature);
    if (checkError) {
        throw checkError;
    }

    const {
        address,
        publicKey
    } = createAddressByPrivateKey(privateKey);
    if (accountBlock.address !== address) {
        throw new Error('PrivateKey is wrong.');
    }

    if(!accountBlock.hash){
        throw {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } ${ "hash" }.`
        }
    }
    const signature: Hex = ed25519.sign(accountBlock.hash, privateKey);
    return {
        signature: Buffer.from(signature, 'hex').toString('base64'),
        publicKey: Buffer.from(publicKey, 'hex').toString('base64')
    };
}


// About Transaction and Contracts

export function decodeContractAccountBlock({ accountBlock, contractAddress, abi, topics = [], methodName }: {
    accountBlock: AccountBlockType;
    contractAddress: Address;
    abi: any;
    topics?: any;
    methodName?: string;
}) {
    if (!accountBlock.data) {
        throw {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } ${ "block.data"}`
        }
    }
    const err = checkParams({ accountBlock, contractAddress, abi }, [ 'accountBlock', 'contractAddress', 'abi' ], [{
        name: 'contractAddress',
        func: _a => isValidAddress(_a) === AddressType.Contract
    }]);
    if (err) {
        throw err;
    }

    if (accountBlock.blockType !== BlockType.TransferRequest
        || accountBlock.toAddress !== contractAddress) {
        return undefined;
    }

    return decodeAccountBlockDataByContract({
        data: accountBlock.data,
        abi,
        topics,
        methodName
    });
}

export function decodeAccountBlockDataByContract({ data, abi, topics = [], methodName }: {
    data: Base64;
    abi: any;
    topics?: any;
    methodName?: string;
}) {
    const err = checkParams({ data, abi }, [ 'data', 'abi' ], [{
        name: 'data',
        func: isBase64String
    }]);
    if (err) {
        throw err;
    }

    const hexData = Buffer.from(data, 'base64').toString('hex');

    const encodeFuncSign = encodeFunctionSignature(abi, methodName);
    if (encodeFuncSign !== hexData.substring(0, 8)) {
        return undefined;
    }

    return decodeLog(abi, hexData.substring(8), topics, methodName);
}

// contractList = { 'transactionTypeName': { contractAddress, abi } }
export function encodeContractList(contractList: Object): Object {
    const err = checkParams({ contractList }, ['contractList'], [{
        name: 'contractList',
        func: isObject
    }]);
    if (err) {
        throw err;
    }

    const txType = {};

    for (const transactionType in contractList) {
        const { contractAddress, abi } = contractList[transactionType];

        const err = checkParams({ contractAddress, abi }, [ 'contractAddress', 'abi' ], [{
            name: 'contractAddress',
            func: _a => isValidAddress(_a) === AddressType.Contract
        }]);
        if (err) {
            throw err;
        }

        const funcSign = encodeFunctionSignature(abi);
        const _contract: {
            transactionType: string;
            contractAddress: Address;
            abi: Object;
        } = {
            transactionType,
            contractAddress,
            abi
        };
        txType[`${ funcSign }_${ contractAddress }`] = _contract;
    }

    return txType;
}

// contractTransactionType = { [funcSign + contractAddress]: { contractAddress, abi, transactionType } }
export function getTransactionType({ toAddress, data, blockType }: {
    toAddress?: Address;
    data?: Base64;
    blockType: BlockType;
}, contractTransactionType?): {
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

    const allContractTransactionType = Object.assign({}, contractTransactionType || {}, Default_Contract_TransactionType);

    const _data = Buffer.from(data || '', 'base64').toString('hex');
    const dataPrefix = _data.slice(0, 8);
    const key = `${ dataPrefix }_${ toAddress }`;

    return allContractTransactionType[key] || defaultType;
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
