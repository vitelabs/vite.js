import { checkParams, isNonNegativeInteger, isHexString, isTokenId } from '~@vite/vitejs-utils';
import { paramsMissing } from '~@vite/vitejs-error';
import { isAddress, getAddressFromPublicKey } from '~@vite/vitejs-hdwallet/address';

import { BlockType, Address, Base64, Hex, TokenId, Uint64, BigInt } from './type';

export const Default_Hash = '0000000000000000000000000000000000000000000000000000000000000000'; // A total of 64 0

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
    signature?: Base64;
    publicKey?: Base64;
}): {
    code: string;
    message: string;
} {
    const err = checkParams(accountBlock, [ 'blockType', 'address' ], [ {
        name: 'blockType',
        func: _b => BlockType[_b],
        msg: `Don\'t have blockType ${ accountBlock.blockType }`
    }, {
        name: 'address',
        func: isAddress
    }, {
        name: 'sendBlockHash',
        func: isHexString
    }, {
        name: 'toAddress',
        func: isAddress
    }, {
        name: 'amount',
        func: isNonNegativeInteger,
        msg: 'Amount must be an non-negative integer string.'
    }, {
        name: 'tokenId',
        func: isTokenId
    }, {
        name: 'height',
        func: isNonNegativeInteger
    }, {
        name: 'previousHash',
        func: isHexString
    }, {
        name: 'hash',
        func: isHexString
    } ]);

    if (err) {
        return err;
    }

    if (Number(accountBlock.blockType) !== BlockType.Response && !accountBlock.sendBlockHash) {
        return {
            code: paramsMissing.code,
            message: `${ paramsMissing.message } SendBlockHash.`
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

    if (accountBlock.publicKey) {
        const address = getAddressFromPublicKey(Buffer.from(accountBlock.publicKey, 'base64'));
        if (accountBlock.address !== address) {
            return {
                code: paramsMissing.code,
                message: 'PublicKey is wrong.'
            };
        }
    }

    return null;
}

export function isRequestBlock(blockType: BlockType): Boolean {
    return blockType === BlockType.CreateContractRequest
        || blockType === BlockType.TransferRequest
        || blockType === BlockType.RefundByContractRequest
        || blockType === BlockType.ClaimSBPRewardsRequest;
}

export function isResponseBlock(blockType: BlockType): Boolean {
    return blockType === BlockType.Response
        || blockType === BlockType.ResponseFail
        || blockType === BlockType.GenesisResponse;
}
