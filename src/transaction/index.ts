import { isValidAddress, createAddressByPrivateKey } from '~@vite/vitejs-hdwallet/address';
import { checkParams, isNonNegativeInteger, isHexString, isArray, isObject } from '~@vite/vitejs-utils';
import { paramsMissing } from '~@vite/vitejs-error';

import AccountBlock from './accountBlock';
import { getCreateContractData } from './utils';
import { BlockType, Vite_TokenId } from './constant';

import { Hex, Address, TokenId, BigInt, AddrObj, Base64, Uint8 } from './type';

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
        params?: any;
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

    callContract() {

    }
}

export const transaction = TransactionClass;
export default TransactionClass;

