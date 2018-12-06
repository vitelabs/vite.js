const BigNumber = require('bn.js');

import { SignBlock, formatBlock } from 'const/type';
import { Default_Hash } from 'const/contract';
import { paramsMissing, paramsConflict } from "const/error";
import { isValidHexAddr } from 'utils/address/privToAddr';
import { checkParams, validInteger } from "utils/tools";

export function formatAccountBlock({
    blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, tokenId, toAddress, amount
}: formatBlock) {
    let _height = height ? new BigNumber(height).add(new BigNumber(1)).toString() : '1';
    let _prevHash = prevHash || Default_Hash;
    let timestamp = new BigNumber(new Date().getTime()).div(new BigNumber(1000)).toNumber();

    let _accountBlock: SignBlock = {
        timestamp,
        accountAddress,
        snapshotHash,
        blockType,
        prevHash: _prevHash,
        height: _height,
        fee: '0'
    };

    if (message) {
        let msgBuffer = Buffer.from(message).toString('base64');
        // let base64Str = Buffer.from(utf8bytes).toString('base64');
        _accountBlock.data = msgBuffer;
    } else {
        data && (_accountBlock.data = data);
    }

    if (blockType === 2) {
        _accountBlock.tokenId = tokenId;
        _accountBlock.toAddress = toAddress;
        _accountBlock.amount = amount;
    }

    if (blockType === 4) {
        _accountBlock.fromBlockHash = fromBlockHash || '';
    }

    return _accountBlock;
}

export function validReqAccountBlock({
    blockType, fromBlockHash, accountAddress, message, data, toAddress, amount
}: formatBlock) {
    let err = checkParams({
        blockType, fromBlockHash, accountAddress, message, data, toAddress, amount
    }, ['accountAddress', 'blockType', ], [{
        name: 'accountAddress',
        func: isValidHexAddr
    }, {
        name: 'blockType',
        func: (_b) => {
            return +_b > 0 && +_b < 5
        },
        msg: 'BlockType should be greater than 0 and less than 6.'
    }, {
        name: 'amount',
        func: validInteger,
        msg: 'Amount must be an integer string.'
    }])
    
    if (err) {
        return err;
    }

    if (+blockType === 4 && !fromBlockHash) {
        return {
            code: paramsMissing.code,
            msg: `${paramsMissing.msg} ReceiveBlock must have fromBlockHash.`
        };
    }

    if (message && data) {
        return {
            code: paramsConflict.code,
            msg: `${paramsConflict.msg} Message and data are only allowed to exist one.`
        };
    }

    return null;
}
