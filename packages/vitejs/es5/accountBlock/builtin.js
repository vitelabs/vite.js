"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BigNumber = require('bn.js');
var error_1 = require("error");
var constant_1 = require("constant");
var privToAddr_1 = require("privToAddr");
var utils_1 = require("utils");
var abi_1 = require("abi");
var checkParams = utils_1.tools.checkParams, validInteger = utils_1.tools.validInteger;
var isArray = utils_1.encoder.isArray;
function formatAccountBlock(_a) {
    var blockType = _a.blockType, fromBlockHash = _a.fromBlockHash, accountAddress = _a.accountAddress, message = _a.message, data = _a.data, height = _a.height, prevHash = _a.prevHash, snapshotHash = _a.snapshotHash, _c = _a.tokenId, tokenId = _c === void 0 ? constant_1.Vite_TokenId : _c, fee = _a.fee, toAddress = _a.toAddress, amount = _a.amount, nonce = _a.nonce;
    var _height = height ? new BigNumber(height).add(new BigNumber(1)).toString() : '1';
    var _prevHash = prevHash || constant_1.Default_Hash;
    var timestamp = new BigNumber(new Date().getTime()).div(new BigNumber(1000)).toNumber();
    var _accountBlock = {
        timestamp: timestamp,
        accountAddress: accountAddress,
        snapshotHash: snapshotHash,
        blockType: blockType,
        prevHash: _prevHash,
        height: _height
    };
    if (message) {
        var msgBase64 = Buffer.from(message).toString('base64');
        _accountBlock.data = msgBase64;
    }
    else {
        data && (_accountBlock.data = data);
    }
    if (blockType === 2 || blockType === 1) {
        tokenId && (_accountBlock.tokenId = tokenId);
        toAddress && (_accountBlock.toAddress = toAddress);
        amount && (_accountBlock.amount = amount);
    }
    if (blockType === 4) {
        _accountBlock.fromBlockHash = fromBlockHash || '';
    }
    nonce && (_accountBlock.nonce = nonce);
    fee && (_accountBlock.fee = fee);
    return _accountBlock;
}
exports.formatAccountBlock = formatAccountBlock;
function validReqAccountBlock(_a) {
    var blockType = _a.blockType, fromBlockHash = _a.fromBlockHash, accountAddress = _a.accountAddress, message = _a.message, data = _a.data, toAddress = _a.toAddress, amount = _a.amount;
    var err = checkParams({ blockType: blockType, accountAddress: accountAddress, toAddress: toAddress, amount: amount }, ['accountAddress', 'blockType'], [{
            name: 'accountAddress',
            func: privToAddr_1.isValidHexAddr
        }, {
            name: 'toAddress',
            func: privToAddr_1.isValidHexAddr
        }, {
            name: 'blockType',
            func: function (_b) { return Number(_b) > 0 && Number(_b) < 5; },
            msg: 'BlockType should be greater than 0 and less than 6.'
        }, {
            name: 'amount',
            func: validInteger,
            msg: 'Amount must be an integer string.'
        }]);
    if (err) {
        return err;
    }
    if (Number(blockType) === 4 && !fromBlockHash) {
        return {
            code: error_1.paramsMissing.code,
            msg: error_1.paramsMissing.message + " ReceiveBlock must have fromBlockHash."
        };
    }
    if (message && data) {
        return {
            code: error_1.paramsConflict.code,
            msg: error_1.paramsConflict.message + " Message and data are only allowed to exist one."
        };
    }
    return null;
}
exports.validReqAccountBlock = validReqAccountBlock;
function getCreateContractData(_a) {
    var abi = _a.abi, hexCode = _a.hexCode, params = _a.params;
    var jsonInterface = getConstructor(abi);
    var data = constant_1.Delegate_Gid + "01" + hexCode;
    if (jsonInterface) {
        data += abi_1.encodeParameters(jsonInterface, params);
    }
    return Buffer.from(data, 'hex').toString('base64');
}
exports.getCreateContractData = getCreateContractData;
function getConstructor(jsonInterfaces) {
    if (!isArray(jsonInterfaces)) {
        if (jsonInterfaces.type === 'constructor') {
            return jsonInterfaces;
        }
    }
    for (var i = 0; i < jsonInterfaces.length; i++) {
        if (jsonInterfaces[i].type === 'constructor') {
            return jsonInterfaces[i];
        }
    }
}
