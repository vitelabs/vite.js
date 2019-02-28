const BigNumber = require('bn.js');

import { SignBlock, formatBlock } from 'const/type';
import { Vite_TokenId, Default_Hash, Delegate_Gid } from 'const/contract';
import { paramsMissing, paramsConflict } from "const/error";
import { isValidHexAddr } from 'utils/address/privToAddr';
import { checkParams, validInteger } from "utils/tools";
import { encodeParameters } from "utils/abi";
import { isArray } from 'utils/encoder';

export function formatAccountBlock({
    blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, tokenId = Vite_TokenId, fee, toAddress, amount, nonce
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

export function getCreateContractData({
    abi, hexCode, params
}) {
    let jsonInterface = getConstructor(abi);
    let data = Delegate_Gid + '01' + hexCode;
    if (jsonInterface) {
        data += encodeParameters(jsonInterface, params);
    }
    return Buffer.from(data, 'hex').toString('base64');
}




function getConstructor(jsonInterfaces) {
    if ( !isArray(jsonInterfaces) ) {
        if (jsonInterfaces.type === 'constructor') {
            return jsonInterfaces;
        }
    }

    for (let i=0; i<jsonInterfaces.length; i++) {
        if (jsonInterfaces[i].type === 'constructor') {
            return jsonInterfaces[i];
        }
    }
}
