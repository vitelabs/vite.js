import { paramsMissing } from '~@vite/vitejs-error';
import { BlockType, Vite_TokenId } from '~@vite/vitejs-constant';
import { getCreateContractData, getCallContractData } from '~@vite/vitejs-accountblock';
import { isValidAddress, createAddressByPrivateKey, ADDR_TYPE } from '~@vite/vitejs-hdwallet/address';
import { checkParams, isNonNegativeInteger, isHexString, isArray, isObject } from '~@vite/vitejs-utils';

import AccountBlock from './accountBlock';

import { Hex, Address, TokenId, BigInt, Base64, Uint8 } from './type';


class TransactionClass {
    readonly address: Address

    constructor(address: Address) {
        const err = checkParams({ address }, ['address'], [{
            name: 'address',
            func: isValidAddress
        }]);
        if (err) {
            throw err;
        }

        this.address = address;
    }

    sendTransaction({ toAddress, tokenId = Vite_TokenId, amount = '0', message }: {
        toAddress: Address;
        tokenId: TokenId;
        amount: BigInt;
        message: string;
    }) {
        const err = checkParams({ toAddress }, ['toAddress']);
        if (err) {
            throw err;
        }

        const messageHex = Buffer.from(message).toString('hex');
        const data = Buffer.from(messageHex, 'hex').toString('base64');

        const accountBlock: AccountBlock = new AccountBlock({
            blockType: BlockType.TransferRequest,
            address: this.address,
            toAddress,
            tokenId,
            amount,
            data
        });

        return accountBlock;
    }

    receive({ sendBlockHash }: { sendBlockHash: Hex }) {
        const err = checkParams({ sendBlockHash }, ['sendBlockHash']);
        if (err) {
            throw err;
        }

        const accountBlock: AccountBlock = new AccountBlock({
            blockType: BlockType.Response,
            address: this.address,
            sendBlockHash
        });

        return accountBlock;
    }

    send({ toAddress, tokenId = Vite_TokenId, amount = '0', data }: {
        toAddress: Address;
        tokenId: TokenId;
        amount: BigInt;
        data: Base64;
    }) {
        const err = checkParams({ toAddress }, ['toAddress']);
        if (err) {
            throw err;
        }

        const accountBlock: AccountBlock = new AccountBlock({
            blockType: BlockType.TransferRequest,
            address: this.address,
            toAddress,
            tokenId,
            amount,
            data
        });

        return accountBlock;
    }

    createContract({ responseLatency = '0', quotaMultiplier = '10', randomDegree = '0', code, abi, params }: {
        code: Hex;
        responseLatency?: Uint8;
        quotaMultiplier?: Uint8;
        randomDegree?: Uint8;
        abi?: Object | Array<Object>;
        params?: string | Array<string | boolean>;
    }) {
        const err = checkParams({ code, abi, responseLatency, quotaMultiplier, randomDegree },
            [ 'code', 'fee', 'responseLatency', 'quotaMultiplier', 'randomDegree' ],
            [ {
                name: 'responseLatency',
                func: _c => Number(_c) >= 0 && Number(_c) <= 75
            }, {
                name: 'quotaMultiplier',
                func: _c => Number(_c) >= 10 && Number(_c) <= 100
            }, {
                name: 'randomDegree',
                func: _c => Number(_c) >= 0 && Number(_c) <= 75
            }, {
                name: 'abi',
                func: _a => isArray(_a) || isObject(_a)
            } ]);
        if (err) {
            throw err;
        }

        const data = getCreateContractData({
            abi,
            code,
            params,
            responseLatency,
            quotaMultiplier,
            randomDegree
        });
        return new AccountBlock({
            blockType: BlockType.CreateContractRequest,
            address: this.address,
            data,
            fee: '10000000000000000000'
        });
    }

    callContract({ toAddress, tokenId = Vite_TokenId, amount = '0', abi, methodName, params = [] }: {
        toAddress: Address;
        abi: Object | Array<Object>;
        methodName?: string;
        params?: string | Array<string | boolean>;
        tokenId?: TokenId;
        amount?: BigInt;
    }) {
        const err = checkParams({ toAddress, abi }, [ 'toAddress', 'abi' ], [{
            name: 'address',
            func: _a => isValidAddress(_a) === ADDR_TYPE.Contract
        }]);
        if (err) {
            throw err;
        }

        return new AccountBlock({
            blockType: BlockType.TransferRequest,
            address: this.address,
            toAddress,
            tokenId,
            amount,
            fee: '0',
            data: getCallContractData({ abi, params, methodName })
        });
    }
}

export const transaction = TransactionClass;
export default TransactionClass;

