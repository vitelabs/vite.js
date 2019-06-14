const BigNumber = require('bn.js');
import { paramsMissing, paramsConflict } from '~@vite/vitejs-error';
import { Vite_TokenId, Default_Hash, Delegate_Gid, BlockType } from '~@vite/vitejs-constant';
import { isValidHexAddr } from '~@vite/vitejs-privtoaddr';
import { checkParams, validInteger, isArray, isObject } from '~@vite/vitejs-utils';
import { encodeParameters, encodeFunctionSignature } from '~@vite/vitejs-abi';

import { SignBlock, formatBlock } from './type';


export function formatAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, height, prevHash, tokenId = Vite_TokenId, fee, toAddress, amount, nonce }: formatBlock) {
    const _height = height ? new BigNumber(height).add(new BigNumber(1)).toString() : '1';
    const _prevHash = prevHash || Default_Hash;

    const _accountBlock: SignBlock = {
        accountAddress,
        blockType,
        prevHash: _prevHash,
        height: _height
    };

    if (message) {
        const msgHex = `0002${ Buffer.from(message).toString('hex') }`;
        const msgBase64 = Buffer.from(msgHex, 'hex').toString('base64');
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

export function isAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, toAddress, amount }: formatBlock) {
    const err = checkParams({ blockType, accountAddress, toAddress, amount }, [ 'accountAddress', 'blockType' ], [ {
        name: 'accountAddress',
        func: isValidHexAddr
    }, {
        name: 'toAddress',
        func: isValidHexAddr
    }, {
        name: 'blockType',
        func: _b => BlockType[_b],
        msg: `Don\'t have blockType ${ blockType }`
    }, {
        name: 'amount',
        func: validInteger,
        msg: 'Amount must be an integer string.'
    } ]);

    if (err) {
        return err;
    }

    if (Number(blockType) === 4 && !fromBlockHash) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } ReceiveBlock must have fromBlockHash.`
        };
    }

    if (message && data) {
        return {
            code: paramsConflict.code,
            message: `${ paramsConflict.message } Message and data are only allowed to exist one.`
        };
    }

    return null;
}

export function getCreateContractData({ abi, hexCode, params, confirmTimes = 0, times = 10 }) {
    const jsonInterface = getAbi(abi);
    const _confirmTimes = new BigNumber(confirmTimes).toArray();
    const _times = new BigNumber(times).toArray();
    let data = `${ Delegate_Gid }01${ Buffer.from(_confirmTimes).toString('hex') }${ Buffer.from(_times).toString('hex') }${ hexCode }`;

    if (jsonInterface) {
        data += encodeParameters(jsonInterface, params);
    }
    return Buffer.from(data, 'hex').toString('base64');
}

export function getAbi(jsonInterfaces, type = 'constructor') {
    if (!isArray(jsonInterfaces) && isObject(jsonInterfaces)) {
        if (jsonInterfaces.type === type) {
            return jsonInterfaces;
        }
    }

    if (!isArray(jsonInterfaces)) {
        return null;
    }

    for (let i = 0; i < jsonInterfaces.length; i++) {
        if (jsonInterfaces[i].type === type) {
            return jsonInterfaces[i];
        }
    }

    return null;
}

export function getContractTxType(_contracts: Object) {
    const err = checkParams({ _contracts }, ['_contracts'], [{
        name: '_contracts',
        func: isObject
    }]);
    if (err) {
        throw err;
    }

    const txType = {};

    for (const type in _contracts) {
        const _c = _contracts[type];

        const err = checkParams(_c, [ 'contractAddr', 'abi' ], [{
            name: 'contractAddr',
            func: isValidHexAddr
        }]);
        if (err) {
            throw err;
        }

        const funcSign = encodeFunctionSignature(_c.abi);
        txType[`${ funcSign }_${ _c.contractAddr }`] = {
            txType: type,
            ..._c
        };
    }

    return txType;
}
