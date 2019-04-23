"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BigNumber = require('bn.js');
var vitejs_error_1 = require("./../error");
var vitejs_constant_1 = require("./../constant");
var vitejs_privtoaddr_1 = require("./../privtoaddr");
var vitejs_utils_1 = require("./../utils");
var vitejs_abi_1 = require("./../abi");
function formatAccountBlock(_a) {
    var blockType = _a.blockType, fromBlockHash = _a.fromBlockHash, accountAddress = _a.accountAddress, message = _a.message, data = _a.data, height = _a.height, prevHash = _a.prevHash, _c = _a.tokenId, tokenId = _c === void 0 ? vitejs_constant_1.Vite_TokenId : _c, fee = _a.fee, toAddress = _a.toAddress, amount = _a.amount, nonce = _a.nonce;
    var _height = height ? new BigNumber(height).add(new BigNumber(1)).toString() : '1';
    var _prevHash = prevHash || vitejs_constant_1.Default_Hash;
    var _accountBlock = {
        accountAddress: accountAddress,
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
    var err = vitejs_utils_1.checkParams({ blockType: blockType, accountAddress: accountAddress, toAddress: toAddress, amount: amount }, ['accountAddress', 'blockType'], [{
            name: 'accountAddress',
            func: vitejs_privtoaddr_1.isValidHexAddr
        }, {
            name: 'toAddress',
            func: vitejs_privtoaddr_1.isValidHexAddr
        }, {
            name: 'blockType',
            func: function (_b) { return vitejs_constant_1.BlockType[_b]; },
            msg: "Don't have blockType " + blockType
        }, {
            name: 'amount',
            func: vitejs_utils_1.validInteger,
            msg: 'Amount must be an integer string.'
        }]);
    if (err) {
        return err;
    }
    if (Number(blockType) === 4 && !fromBlockHash) {
        return {
            code: vitejs_error_1.paramsMissing.code,
            msg: vitejs_error_1.paramsMissing.message + " ReceiveBlock must have fromBlockHash."
        };
    }
    if (message && data) {
        return {
            code: vitejs_error_1.paramsConflict.code,
            msg: vitejs_error_1.paramsConflict.message + " Message and data are only allowed to exist one."
        };
    }
    return null;
}
exports.validReqAccountBlock = validReqAccountBlock;
function getCreateContractData(_a) {
    var abi = _a.abi, hexCode = _a.hexCode, params = _a.params, _c = _a.confirmTimes, confirmTimes = _c === void 0 ? 0 : _c;
    var jsonInterface = getAbi(abi);
    var _confirmTimes = new BigNumber(confirmTimes).toArray();
    var data = vitejs_constant_1.Delegate_Gid + "01" + Buffer.from(_confirmTimes).toString('hex') + hexCode;
    if (jsonInterface) {
        data += vitejs_abi_1.encodeParameters(jsonInterface, params);
    }
    return Buffer.from(data, 'hex').toString('base64');
}
exports.getCreateContractData = getCreateContractData;
function getAbi(jsonInterfaces, type) {
    if (type === void 0) { type = 'constructor'; }
    if (!vitejs_utils_1.isArray(jsonInterfaces) && vitejs_utils_1.isObject(jsonInterfaces)) {
        if (jsonInterfaces.type === type) {
            return jsonInterfaces;
        }
    }
    if (!vitejs_utils_1.isArray(jsonInterfaces)) {
        return null;
    }
    for (var i = 0; i < jsonInterfaces.length; i++) {
        if (jsonInterfaces[i].type === type) {
            return jsonInterfaces[i];
        }
    }
    return null;
}
exports.getAbi = getAbi;
