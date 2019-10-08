import { checkParams, isNonNegativeInteger, isHexString, isTokenId } from '~@vite/vitejs-utils';
import { paramsMissing } from '~@vite/vitejs-error';
import { isValidAddress } from '~@vite/vitejs-hdwallet/address';

import { BlockType, requiredAccountBlock } from './blockTypes';

export function checkAccountBlockKeywords(accountBlock: requiredAccountBlock): {
    code: string;
    message: string;
} {
    const err = checkParams(accountBlock, ['blockType'], [ {
        name: 'blockType',
        func: _b => BlockType[_b],
        msg: `Don\'t have blockType ${ accountBlock.blockType }`
    }, {
        name: 'height',
        func: isNonNegativeInteger
    }, {
        name: 'hash',
        func: isHexString
    }, {
        name: 'previousHash',
        func: isHexString
    }, {
        name: 'address',
        func: isValidAddress
    }, {
        name: 'toAddress',
        func: isValidAddress
    }, {
        name: 'sendBlockHash',
        func: isHexString
    }, {
        name: 'amount',
        func: isNonNegativeInteger,
        msg: 'Amount must be an non-negative integer string.'
    }, {
        name: 'tokenId',
        func: isTokenId
    } ]);

    if (err) {
        return err;
    }

    if (accountBlock.sendBlockHash && Number(accountBlock.blockType) !== 4) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } ReceiveBlock must have fromBlockHash.`
        };
    }

    if (accountBlock.amount && !accountBlock.tokenId) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } TokenId.`
        };
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
