const BigNumber = require('bn.js');
import { paramsMissing, paramsConflict } from '@vite/vitejs-error';
import { Default_Hash } from '@vite/vitejs-constant';
import { isValidHexAddr } from '@vite/vitejs-privtoaddr';
import { tools } from '@vite/vitejs-utils';

import { SignBlock, formatBlock } from './type';

const { checkParams, validInteger } = tools;


export function formatAccountBlock({
    blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, tokenId, fee, toAddress, amount, nonce
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
        height: _height
    };

    if (message) {
        let msgBase64 = Buffer.from(message).toString('base64');
        _accountBlock.data = msgBase64;
    } else {
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

export function validReqAccountBlock({
    blockType, fromBlockHash, accountAddress, message, data, toAddress, amount
}: formatBlock) {
    let err = checkParams({
        blockType, accountAddress, toAddress, amount
    }, ['accountAddress', 'blockType'], [{
        name: 'accountAddress',
        func: isValidHexAddr
    }, {
        name: 'toAddress',
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
            msg: `${paramsMissing.message} ReceiveBlock must have fromBlockHash.`
        };
    }

    if (message && data) {
        return {
            code: paramsConflict.code,
            msg: `${paramsConflict.message} Message and data are only allowed to exist one.`
        };
    }

    return null;
}
