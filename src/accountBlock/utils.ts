const BigNumber = require('bn.js');
const blake = require('blakejs/blake2b');

import { paramsMissing, paramsFormat } from '~@vite/vitejs-error';
import { Delegate_Gid, Contracts } from '~@vite/vitejs-constant';
import {
    getAbiByType,
    encodeParameters,
    encodeFunctionCall,
    encodeFunctionSignature,
    decodeLog,
    decodeFunctionCall,
    getAbiByName, JsonInterface
} from '~@vite/vitejs-abi';
import { isValidAddress, getAddressFromPublicKey, createAddressByPrivateKey, getOriginalAddressFromAddress, AddressType, getAddressFromOriginalAddress } from '~@vite/vitejs-wallet/address';
import { checkParams, isNonNegativeInteger, isHexString, isValidTokenId, getOriginalTokenIdFromTokenId, isObject, ed25519, isBase64String, isArray } from '~@vite/vitejs-utils';

import { BlockType, Address, Base64, Hex, TokenId, Uint64, BigInt, AccountBlockType, Uint8 } from './type';
import { EventFragment, Fragment, FunctionFragment } from '~@vite/vitejs-abi/fragments';

export const Default_Hash = '0000000000000000000000000000000000000000000000000000000000000000'; // A total of 64 0

export const Default_Contract_TransactionType: {readonly [key: string]: ContractInfo} = encodeContractList(Contracts);

export enum AccountBlockStatus {
    'Before_Hash' = 1,
    'Before_Signature',
    'Complete'
}

export interface ContractInfo {
    transactionType?: string,
    contractAddress: string,
    abi: JsonInterface | string
}

type TypeCheck<T> = { -readonly [K in keyof T]: T[K] };

// Check AccountBlock
/**
 * Check if an account block has all the necessary information according to AccountBlockStatus, if not, return an error message.
 * @param accountBlock
 * @param status AccountBlockStatus
 */
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
} {
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
        return null;
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
        return null;
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

    return null;
}

export function isValidAccountBlockWithoutHash(accountBlock: {
    blockType: BlockType;
    address: Address;
    height: Uint64;
    previousHash: Hex;
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

/**
 * Check if an account block is complete and ready to send
 * @param accountBlock
 */
export function isValidAccountBlock(accountBlock) {
    const err = checkAccountBlock(accountBlock, AccountBlockStatus.Complete);
    return !err;
}

/**
 * Check if an account block is request block
 * @param blockType
 */
export function isRequestBlock(blockType: BlockType): boolean {
    return blockType === BlockType.CreateContractRequest
        || blockType === BlockType.TransferRequest
        || blockType === BlockType.RefundByContractRequest
        || blockType === BlockType.ReIssueRequest;
}

/**
 * Check if an account block is response block
 * @param blockType
 */
export function isResponseBlock(blockType: BlockType): boolean {
    return blockType === BlockType.Response
        || blockType === BlockType.ResponseFail
        || blockType === BlockType.GenesisResponse;
}

/**
 * Generate a new contract address according to account address, height and previous hash
 * @param address
 * @param height
 * @param previousHash
 */
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
    const _originContractAddress = blake.blake2b(_o, null, 20);

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
/**
 * Calculate hash for the given account block
 * @param accountBlock
 */
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
    return height ? Buffer.from(new BigNumber(height).toArray('big', 8)).toString('hex') : '';
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
    return tokenId ? getOriginalTokenIdFromTokenId(tokenId) || '' : '';
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
/**
 * Generate account block data for smart contract deployment
 * @param abi
 * @param code Binary code in hex format
 * @param params Constructor parameters
 * @param responseLatency
 * @param quotaMultiplier
 * @param randomDegree
 */
export function getCreateContractData({ abi, code, params = [], responseLatency = '0', quotaMultiplier = '10', randomDegree = '0' }: {
    responseLatency?: Uint8;
    quotaMultiplier?: Uint8;
    randomDegree?: Uint8;
    code?: Hex;
    abi?: JsonInterface | string;
    params?: any;
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
        data += encodeParameters(jsonInterface, Array.isArray(params) ? params : [params]);
    }
    return Buffer.from(data, 'hex').toString('base64');
}

/**
 * Encode a function call into base64 string
 * @param abi
 * @param params
 * @param methodName
 */
export function getCallContractData({ abi, params, methodName }: {
    abi: JsonInterface | string;
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

    const signature: Hex = ed25519.sign(accountBlock.hash, privateKey);
    return {
        signature: Buffer.from(signature, 'hex').toString('base64'),
        publicKey: Buffer.from(publicKey, 'hex').toString('base64')
    };
}

// About Transaction and Contracts
/**
 * Decode a function call or event logs with the given account block
 * @param accountBlock Account block that includes a function call or event logs
 * @param contractAddress
 * @param abi
 * @param topics Topics, for event log decode only
 * @param methodName Function or event name
 */
export function decodeContractAccountBlock({ accountBlock, contractAddress, abi, topics = [], methodName }: {
    accountBlock: AccountBlockType;
    contractAddress: Address;
    abi: JsonInterface | string;
    topics?: Array<string>;
    methodName?: string;
}) {
    const err = checkParams({ accountBlock, contractAddress, abi }, [ 'accountBlock', 'contractAddress', 'abi' ], [{
        name: 'contractAddress',
        func: _a => isValidAddress(_a) === AddressType.Contract
    }]);
    if (err) {
        throw err;
    }

    if (accountBlock.blockType !== BlockType.TransferRequest && accountBlock.blockType !== BlockType.Response) {
        throw new Error(`wrong block type: ${ accountBlock.blockType }`);
    }
    if (accountBlock.toAddress !== contractAddress) {
        throw new Error(`contract address mismatch, expected: ${ contractAddress }, actual: ${ accountBlock.toAddress }`);
    }

    return decodeAccountBlockDataByContract({
        data: accountBlock.data,
        abi,
        topics,
        methodName
    });
}

/**
 * Decode a function call or event logs according to ABI
 * @param data Base64 data string
 * @param abi
 * @param topics Topics, for event log decode only
 * @param methodName Function or event name
 */
export function decodeAccountBlockDataByContract({ data, abi, topics = [], methodName }: {
    data: Base64;
    abi: JsonInterface | string;
    topics?: Array<string>;
    methodName?: string;
}) {
    const err = checkParams({ data, abi }, [ 'data', 'abi' ], [{
        name: 'data',
        func: isBase64String
    }]);
    if (err) {
        throw err;
    }

    if (typeof abi === 'string') {
        abi = JSON.parse(abi);
    }
    if (Array.isArray(abi)) {
        if (!methodName) {
            throw new Error('method name must be present when abi is an array');
        }
        abi = getAbiByName(abi, methodName);
    }

    const hexData = Buffer.from(data, 'base64').toString('hex');

    const _abi = Fragment.from(abi);
    if (FunctionFragment.isFunctionFragment(_abi)) {
        return decodeFunctionCall(_abi, hexData, methodName);
    } else if (EventFragment.isEventFragment(_abi)) {
        return decodeLog(_abi, hexData, topics, methodName);
    }
    throw new Error(`unsupported abi type ${ _abi.type }`);
}

/**
 * Transform a contract list into new list with 'sighash_address' as the key
 * @param contractList { 'transactionType': { contractAddress, abi } }
 * @return contractList { 'sighash_address': { transactionType, contractAddress, abi } }
 */
export function encodeContractList(contractList: { [name: string]: ContractInfo }): { [key: string]: ContractInfo } {
    const txType = { };

    for (const transactionType in contractList) {
        const { contractAddress, abi }: TypeCheck<{
            contractAddress: string,
            abi: JsonInterface | string
        }> = contractList[transactionType];

        const err = checkParams({ contractAddress, abi }, [ 'contractAddress', 'abi' ], [{
            name: 'contractAddress',
            func: _a => isValidAddress(_a) === AddressType.Contract
        }]);
        if (err) {
            throw err;
        }

        const funcSign = encodeFunctionSignature(abi);
        txType[`${ funcSign }_${ contractAddress }`] = {
            transactionType,
            contractAddress,
            abi
        };
    }

    return txType;
}

// contractTransactionType = { [funcSign + contractAddress]: { contractAddress, abi, transactionType } }
/**
 * Find transaction type in default contract list according to toAddress, data and blockType.
 * Return BlockType if no transaction type is found.
 * @param toAddress
 * @param data
 * @param blockType
 * @param contractTransactionType Additional list to look into
 * @return ContractInfo with transaction type
 */
export function getTransactionType({ toAddress, data, blockType }: {
    toAddress?: Address;
    data?: Base64;
    blockType: BlockType;
}, contractTransactionType?): ContractInfo {
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
    const defaultType = { contractAddress: undefined, abi: undefined, transactionType: BlockType[blockType] };

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

    const result: TypeCheck<{
        transactionType: string;
        contractAddress: Address;
        abi: JsonInterface | string;
    }> = allContractTransactionType[key] || defaultType;

    return result;
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
