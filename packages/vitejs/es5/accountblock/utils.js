"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BigNumber = require('bn.js');
var blake = require('blakejs/blake2b');
var vitejs_error_1 = require("./../error");
var vitejs_constant_1 = require("./../constant");
var vitejs_abi_1 = require("./../abi");
var address_1 = require("./../wallet/address");
var vitejs_utils_1 = require("./../utils");
var type_1 = require("./type");
exports.Default_Hash = '0000000000000000000000000000000000000000000000000000000000000000';
exports.Default_Contract_TransactionType = encodeContractList(vitejs_constant_1.Contracts);
var AccountBlockStatus;
(function (AccountBlockStatus) {
    AccountBlockStatus[AccountBlockStatus["Before_Hash"] = 1] = "Before_Hash";
    AccountBlockStatus[AccountBlockStatus["Before_Signature"] = 2] = "Before_Signature";
    AccountBlockStatus[AccountBlockStatus["Complete"] = 3] = "Complete";
})(AccountBlockStatus = exports.AccountBlockStatus || (exports.AccountBlockStatus = {}));
function checkAccountBlock(accountBlock, status) {
    if (status === void 0) { status = AccountBlockStatus.Before_Hash; }
    var err = vitejs_utils_1.checkParams(accountBlock, ['blockType', 'address', 'height', 'previousHash'], [{
            name: 'blockType',
            func: function (_b) { return type_1.BlockType[_b]; },
            msg: "Don't have blockType " + accountBlock.blockType
        }, {
            name: 'address',
            func: address_1.isValidAddress
        }, {
            name: 'height',
            func: vitejs_utils_1.isNonNegativeInteger
        }, {
            name: 'previousHash',
            func: vitejs_utils_1.isHexString
        }, {
            name: 'sendBlockHash',
            func: vitejs_utils_1.isHexString
        }, {
            name: 'toAddress',
            func: address_1.isValidAddress
        }, {
            name: 'amount',
            func: vitejs_utils_1.isNonNegativeInteger,
            msg: 'Amount must be an non-negative integer string.'
        }, {
            name: 'fee',
            func: vitejs_utils_1.isNonNegativeInteger,
            msg: 'Fee must be an non-negative integer string.'
        }, {
            name: 'tokenId',
            func: vitejs_utils_1.isValidTokenId
        }, {
            name: 'data',
            func: vitejs_utils_1.isBase64String
        }, {
            name: 'hash',
            func: vitejs_utils_1.isHexString
        }, {
            name: 'signature',
            func: vitejs_utils_1.isBase64String
        }, {
            name: 'publicKey',
            func: vitejs_utils_1.isBase64String
        }]);
    if (err) {
        return err;
    }
    if (Number(accountBlock.blockType) === type_1.BlockType.Response && !accountBlock.sendBlockHash) {
        return {
            code: vitejs_error_1.paramsMissing.code,
            message: vitejs_error_1.paramsMissing.message + " SendBlockHash."
        };
    }
    if (isRequestBlock(accountBlock.blockType) && !accountBlock.toAddress) {
        return {
            code: vitejs_error_1.paramsMissing.code,
            message: vitejs_error_1.paramsMissing.message + " ToAddress."
        };
    }
    if (Number(accountBlock.amount) && !accountBlock.tokenId) {
        return {
            code: vitejs_error_1.paramsMissing.code,
            message: vitejs_error_1.paramsMissing.message + " TokenId."
        };
    }
    if ((accountBlock.difficulty && !accountBlock.nonce) || (!accountBlock.difficulty && accountBlock.nonce)) {
        return {
            code: vitejs_error_1.paramsMissing.code,
            message: vitejs_error_1.paramsMissing.message + " Difficulty and nonce is required at the same time."
        };
    }
    if (status === AccountBlockStatus.Before_Hash) {
        return null;
    }
    if (!accountBlock.hash) {
        return {
            code: vitejs_error_1.paramsMissing.code,
            message: vitejs_error_1.paramsMissing.message + " Hash."
        };
    }
    var hash = getAccountBlockHash(accountBlock);
    if (accountBlock.hash !== hash) {
        return {
            code: vitejs_error_1.paramsFormat.code,
            message: vitejs_error_1.paramsFormat.message + " Hash is wrong."
        };
    }
    if (status === AccountBlockStatus.Before_Signature) {
        return null;
    }
    if (!accountBlock.publicKey) {
        return {
            code: vitejs_error_1.paramsMissing.code,
            message: vitejs_error_1.paramsMissing.message + " PublicKey."
        };
    }
    var address = address_1.getAddressFromPublicKey(Buffer.from(accountBlock.publicKey, 'base64').toString('hex'));
    if (accountBlock.address !== address) {
        return {
            code: vitejs_error_1.paramsFormat.code,
            message: 'PublicKey is wrong.'
        };
    }
    if (!accountBlock.signature) {
        return {
            code: vitejs_error_1.paramsMissing.code,
            message: vitejs_error_1.paramsMissing.message + " Signature."
        };
    }
    var publicKey = Buffer.from(accountBlock.publicKey, 'base64').toString('hex');
    var signature = Buffer.from(accountBlock.signature, 'base64').toString('hex');
    var result = vitejs_utils_1.ed25519.verify(hash, signature, publicKey);
    if (!result) {
        return {
            code: vitejs_error_1.paramsFormat.code,
            message: 'Signature is wrong.'
        };
    }
    return null;
}
exports.checkAccountBlock = checkAccountBlock;
function isValidAccountBlockWithoutHash(accountBlock) {
    var err = checkAccountBlock(accountBlock, AccountBlockStatus.Before_Hash);
    return !err;
}
exports.isValidAccountBlockWithoutHash = isValidAccountBlockWithoutHash;
function isValidAccountBlockWithoutSignature(accountBlock) {
    var err = checkAccountBlock(accountBlock, AccountBlockStatus.Before_Signature);
    return !err;
}
exports.isValidAccountBlockWithoutSignature = isValidAccountBlockWithoutSignature;
function isValidAccountBlock(accountBlock) {
    var err = checkAccountBlock(accountBlock, AccountBlockStatus.Complete);
    return !err;
}
exports.isValidAccountBlock = isValidAccountBlock;
function isRequestBlock(blockType) {
    return blockType === type_1.BlockType.CreateContractRequest
        || blockType === type_1.BlockType.TransferRequest
        || blockType === type_1.BlockType.RefundByContractRequest
        || blockType === type_1.BlockType.ReIssueRequest;
}
exports.isRequestBlock = isRequestBlock;
function isResponseBlock(blockType) {
    return blockType === type_1.BlockType.Response
        || blockType === type_1.BlockType.ResponseFail
        || blockType === type_1.BlockType.GenesisResponse;
}
exports.isResponseBlock = isResponseBlock;
function createContractAddress(_d) {
    var address = _d.address, height = _d.height, previousHash = _d.previousHash;
    var err = vitejs_utils_1.checkParams({ address: address, height: height, previousHash: previousHash }, ['address', 'height', 'previousHash'], [{
            name: 'address',
            func: address_1.isValidAddress
        }, {
            name: 'height',
            func: vitejs_utils_1.isNonNegativeInteger
        }, {
            name: 'previousHash',
            func: vitejs_utils_1.isHexString
        }]);
    if (err) {
        throw err;
    }
    var originAddressBuffer = Buffer.from(address_1.getOriginalAddressFromAddress(address), 'hex');
    var heightBuffer = Buffer.from(new BigNumber(height).toArray('big', 8));
    var previousHashBuffer = Buffer.from(previousHash, 'hex');
    var totalLength = originAddressBuffer.length + heightBuffer.length + previousHashBuffer.length;
    var _o = Buffer.concat([originAddressBuffer, heightBuffer, previousHashBuffer], totalLength);
    var _originContractAddress = blake.blake2b(_o, null, 20);
    var originContractAddress = new Uint8Array(21);
    originContractAddress.set(_originContractAddress);
    originContractAddress.set([1], 20);
    return address_1.getAddressFromOriginalAddress(Buffer.from(originContractAddress).toString('hex'));
}
exports.createContractAddress = createContractAddress;
function getAccountBlockHash(accountBlock) {
    var source = '';
    source += getBlockTypeHex(accountBlock.blockType);
    source += getPreviousHashHex(accountBlock.previousHash);
    source += getHeightHex(accountBlock.height);
    source += getAddressHex(accountBlock.address);
    if (isRequestBlock(accountBlock.blockType)) {
        source += getAddressHex(accountBlock.toAddress);
        source += getAmountHex(accountBlock.amount);
        source += getTokenIdHex(accountBlock.tokenId);
    }
    else {
        source += getSendBlockHashHex(accountBlock.sendBlockHash);
    }
    source += getDataHex(accountBlock.data);
    source += getFeeHex(accountBlock.fee);
    source += accountBlock.vmlogHash || '';
    source += getNonceHex(accountBlock.nonce);
    source += getTriggeredSendBlockListHex(accountBlock.triggeredSendBlockList);
    var sourceHex = Buffer.from(source, 'hex');
    var hashBuffer = blake.blake2b(sourceHex, null, 32);
    return Buffer.from(hashBuffer).toString('hex');
}
exports.getAccountBlockHash = getAccountBlockHash;
function getBlockTypeHex(blockType) {
    return Buffer.from([blockType]).toString('hex');
}
exports.getBlockTypeHex = getBlockTypeHex;
function getPreviousHashHex(previousHash) {
    return previousHash || exports.Default_Hash;
}
exports.getPreviousHashHex = getPreviousHashHex;
function getHeightHex(height) {
    return height ? Buffer.from(new BigNumber(height).toArray('big', 8)).toString('hex') : '';
}
exports.getHeightHex = getHeightHex;
function getAddressHex(address) {
    return address ? address_1.getOriginalAddressFromAddress(address) : '';
}
exports.getAddressHex = getAddressHex;
function getToAddressHex(toAddress) {
    return toAddress ? address_1.getOriginalAddressFromAddress(toAddress) : '';
}
exports.getToAddressHex = getToAddressHex;
function getAmountHex(amount) {
    return getNumberHex(amount);
}
exports.getAmountHex = getAmountHex;
function getTokenIdHex(tokenId) {
    return tokenId ? vitejs_utils_1.getOriginalTokenIdFromTokenId(tokenId) || '' : '';
}
exports.getTokenIdHex = getTokenIdHex;
function getSendBlockHashHex(sendBlockHash) {
    return sendBlockHash || exports.Default_Hash;
}
exports.getSendBlockHashHex = getSendBlockHashHex;
function getDataHex(data) {
    return data ? blake.blake2bHex(Buffer.from(data, 'base64'), null, 32) : '';
}
exports.getDataHex = getDataHex;
function getFeeHex(fee) {
    return getNumberHex(fee);
}
exports.getFeeHex = getFeeHex;
function getNonceHex(nonce) {
    var nonceBytes = nonce ? Buffer.from(nonce, 'base64') : '';
    return leftPadBytes(nonceBytes, 8);
}
exports.getNonceHex = getNonceHex;
function getTriggeredSendBlockListHex(triggeredSendBlockList) {
    if (triggeredSendBlockList === void 0) { triggeredSendBlockList = []; }
    if (!triggeredSendBlockList) {
        return '';
    }
    var source = '';
    triggeredSendBlockList.forEach(function (block) {
        source += block.hash;
    });
    return source;
}
exports.getTriggeredSendBlockListHex = getTriggeredSendBlockListHex;
function getCreateContractData(_d) {
    var abi = _d.abi, code = _d.code, params = _d.params, _e = _d.responseLatency, responseLatency = _e === void 0 ? '0' : _e, _f = _d.quotaMultiplier, quotaMultiplier = _f === void 0 ? '10' : _f, _g = _d.randomDegree, randomDegree = _g === void 0 ? '0' : _g;
    var err = vitejs_utils_1.checkParams({ responseLatency: responseLatency, quotaMultiplier: quotaMultiplier, randomDegree: randomDegree, code: code }, ['responseLatency', 'quotaMultiplier', 'randomDegree'], [{
            name: 'responseLatency',
            func: function (_c) { return Number(_c) >= 0 && Number(_c) <= 75; }
        }, {
            name: 'quotaMultiplier',
            func: function (_c) { return Number(_c) >= 10 && Number(_c) <= 100; }
        }, {
            name: 'randomDegree',
            func: function (_c) { return Number(_c) >= 0 && Number(_c) <= 75; }
        }, {
            name: 'code',
            func: vitejs_utils_1.isHexString
        }]);
    if (err) {
        throw err;
    }
    var jsonInterface = vitejs_abi_1.getAbiByType(abi, 'constructor');
    var _responseLatency = new BigNumber(responseLatency).toArray();
    var _randomDegree = new BigNumber(randomDegree).toArray();
    var _quotaMultiplier = new BigNumber(quotaMultiplier).toArray();
    var data = vitejs_constant_1.Delegate_Gid + "01" + Buffer.from(_responseLatency).toString('hex') + Buffer.from(_randomDegree).toString('hex') + Buffer.from(_quotaMultiplier).toString('hex') + code;
    if (jsonInterface) {
        data += vitejs_abi_1.encodeParameters(jsonInterface, params);
    }
    return Buffer.from(data, 'hex').toString('base64');
}
exports.getCreateContractData = getCreateContractData;
function getCallContractData(_d) {
    var abi = _d.abi, params = _d.params, methodName = _d.methodName;
    var data = vitejs_abi_1.encodeFunctionCall(abi, params, methodName);
    return Buffer.from(data, 'hex').toString('base64');
}
exports.getCallContractData = getCallContractData;
function messageToData(message) {
    if (!message) {
        return '';
    }
    var messageHex = Buffer.from(message).toString('hex');
    return Buffer.from(messageHex, 'hex').toString('base64');
}
exports.messageToData = messageToData;
function signAccountBlock(accountBlock, privateKey) {
    var err = vitejs_utils_1.checkParams({ privateKey: privateKey, accountBlock: accountBlock }, ['privateKey', 'accountBlock'], [{
            name: 'privateKey',
            func: vitejs_utils_1.isHexString,
            msg: 'PrivateKey is Hex-string'
        }]);
    if (err) {
        throw err;
    }
    var checkError = checkAccountBlock(accountBlock, AccountBlockStatus.Before_Signature);
    if (checkError) {
        throw checkError;
    }
    var _d = address_1.createAddressByPrivateKey(privateKey), address = _d.address, publicKey = _d.publicKey;
    if (accountBlock.address !== address) {
        throw new Error('PrivateKey is wrong.');
    }
    var signature = vitejs_utils_1.ed25519.sign(accountBlock.hash, privateKey);
    return {
        signature: Buffer.from(signature, 'hex').toString('base64'),
        publicKey: Buffer.from(publicKey, 'hex').toString('base64')
    };
}
exports.signAccountBlock = signAccountBlock;
function decodeContractAccountBlock(_d) {
    var accountBlock = _d.accountBlock, contractAddress = _d.contractAddress, abi = _d.abi, _e = _d.topics, topics = _e === void 0 ? [] : _e, methodName = _d.methodName;
    var err = vitejs_utils_1.checkParams({ accountBlock: accountBlock, contractAddress: contractAddress, abi: abi }, ['accountBlock', 'contractAddress', 'abi'], [{
            name: 'contractAddress',
            func: function (_a) { return address_1.isValidAddress(_a) === address_1.AddressType.Contract; }
        }]);
    if (err) {
        throw err;
    }
    if (accountBlock.blockType !== type_1.BlockType.TransferRequest
        || accountBlock.toAddress !== contractAddress) {
        return null;
    }
    return decodeAccountBlockDataByContract({
        data: accountBlock.data,
        abi: abi,
        topics: topics,
        methodName: methodName
    });
}
exports.decodeContractAccountBlock = decodeContractAccountBlock;
function decodeAccountBlockDataByContract(_d) {
    var data = _d.data, abi = _d.abi, _e = _d.topics, topics = _e === void 0 ? [] : _e, methodName = _d.methodName;
    var err = vitejs_utils_1.checkParams({ data: data, abi: abi }, ['data', 'abi'], [{
            name: 'data',
            func: vitejs_utils_1.isBase64String
        }]);
    if (err) {
        throw err;
    }
    var hexData = Buffer.from(data, 'base64').toString('hex');
    var encodeFuncSign = vitejs_abi_1.encodeFunctionSignature(abi, methodName);
    if (encodeFuncSign !== hexData.substring(0, 8)) {
        return null;
    }
    return vitejs_abi_1.decodeLog(abi, hexData.substring(8), topics, methodName);
}
exports.decodeAccountBlockDataByContract = decodeAccountBlockDataByContract;
function encodeContractList(contractList) {
    var err = vitejs_utils_1.checkParams({ contractList: contractList }, ['contractList'], [{
            name: 'contractList',
            func: vitejs_utils_1.isObject
        }]);
    if (err) {
        throw err;
    }
    var txType = {};
    for (var transactionType in contractList) {
        var _d = contractList[transactionType], contractAddress = _d.contractAddress, abi = _d.abi;
        var err_1 = vitejs_utils_1.checkParams({ contractAddress: contractAddress, abi: abi }, ['contractAddress', 'abi'], [{
                name: 'contractAddress',
                func: function (_a) { return address_1.isValidAddress(_a) === address_1.AddressType.Contract; }
            }]);
        if (err_1) {
            throw err_1;
        }
        var funcSign = vitejs_abi_1.encodeFunctionSignature(abi);
        var _contract = {
            transactionType: transactionType,
            contractAddress: contractAddress,
            abi: abi
        };
        txType[funcSign + "_" + contractAddress] = _contract;
    }
    return txType;
}
exports.encodeContractList = encodeContractList;
function getTransactionType(_d, contractTransactionType) {
    var toAddress = _d.toAddress, data = _d.data, blockType = _d.blockType;
    var err = vitejs_utils_1.checkParams({ blockType: blockType, toAddress: toAddress }, ['blockType'], [{
            name: 'toAddress',
            func: address_1.isValidAddress
        }, {
            name: 'blockType',
            func: function (_b) { return type_1.BlockType[_b]; },
            msg: "Don't have blockType " + blockType
        }]);
    if (err) {
        throw err;
    }
    blockType = Number(blockType);
    var defaultType = { transactionType: type_1.BlockType[blockType] };
    if (blockType !== type_1.BlockType.TransferRequest) {
        return defaultType;
    }
    if (!toAddress) {
        throw new Error(vitejs_error_1.paramsMissing.message + " ToAddress");
    }
    var allContractTransactionType = Object.assign({}, contractTransactionType || {}, exports.Default_Contract_TransactionType);
    var _data = Buffer.from(data || '', 'base64').toString('hex');
    var dataPrefix = _data.slice(0, 8);
    var key = dataPrefix + "_" + toAddress;
    return allContractTransactionType[key] || defaultType;
}
exports.getTransactionType = getTransactionType;
function leftPadBytes(bytesData, len) {
    if (bytesData && len - bytesData.length < 0) {
        return bytesData.toString('hex');
    }
    var result = new Uint8Array(len);
    if (bytesData) {
        result.set(bytesData, len - bytesData.length);
    }
    return Buffer.from(result).toString('hex');
}
function getNumberHex(amount) {
    var bigAmount = new BigNumber(amount);
    var amountBytes = amount && !bigAmount.isZero() ? bigAmount.toArray('big') : '';
    return leftPadBytes(amountBytes, 32);
}
