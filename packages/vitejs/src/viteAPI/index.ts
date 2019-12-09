import { Contracts } from './../constant';
import { checkParams, isArray, blake2bHex } from './../utils';
import { isValidAddress, AddressType, getOriginalAddressFromAddress } from './../wallet/address';
import { decodeParameters, encodeFunctionCall, getAbiByType } from './../abi';
import { Default_Contract_TransactionType, encodeContractList, getTransactionType, decodeContractAccountBlock } from './../accountblock/utils';

import { Address, AccountBlockType, Transaction, Hex, Base64, BigInt } from './type';

import Provider from './provider';


class ViteAPIClass extends Provider {
    private customTransactionType: Object

    constructor(provider: any, onInitCallback: Function) {
        super(provider, onInitCallback);

        // { [funcSign + contractAddress]: { contractAddress, abi, transactionType } }
        this.customTransactionType = {};
    }

    get transactionType() {
        return Object.assign({}, this.customTransactionType, Default_Contract_TransactionType);
    }

    // contractList = { 'transactionTypeName': { contractAddress, abi } }
    addTransactionType(contractList: Object = {}) {
        for (const transactionType in contractList) {
            if (Contracts[transactionType]) {
                throw new Error(`Please rename it. Your transactionType ${ transactionType } conflicts with default transactionType.`);
            }
            if (this.customTransactionType && this.customTransactionType[transactionType]) {
                throw new Error(`Please rename it. Your transactionType ${ transactionType } conflicts with custom transactionType.`);
            }
        }

        const transactionTypeAfterEncode = encodeContractList(contractList);
        this.customTransactionType = Object.assign({}, this.customTransactionType, transactionTypeAfterEncode);
    }

    async getBalanceInfo(address: Address): Promise<{ balance: Object; unreceived: Object }> {
        const err = checkParams({ address }, ['address'], [{
            name: 'address',
            func: isValidAddress
        }]);
        if (err) {
            throw err;
        }

        const data = await this.batch([ {
            methodName: 'ledger_getAccountInfoByAddress',
            params: [address]
        }, {
            methodName: 'ledger_getUnreceivedTransactionSummaryByAddress',
            params: [address]
        } ]);

        if (!data || (data instanceof Array && data.length < 2)) {
            return {
                balance: null,
                unreceived: null
            };
        }

        if (data[0].error) {
            throw data[0].error;
        }
        if (data[1].error) {
            throw data[1].error;
        }

        return {
            balance: data[0].result,
            unreceived: data[1].result
        };
    }

    async getTransactionList({ address, pageIndex, pageSize = 50 }: {
        address: Address; pageIndex: number; pageSize?: number;
    }, decodeTxTypeList: 'all' | string[] = 'all'): Promise<Transaction[]> {
        const err = checkParams({ address, pageIndex, decodeTxTypeList }, [ 'address', 'pageIndex' ], [ {
            name: 'address',
            func: isValidAddress
        }, {
            name: 'decodeTxTypeList',
            func: function (_d) {
                return _d === 'all' || _d === 'none' || isArray(_d);
            },
            msg: '\'all\' || \'none\' || TransactionType[]'
        } ]);
        if (err) {
            throw err;
        }

        pageIndex = pageIndex >= 0 ? pageIndex : 0;
        const data = await this.request('ledger_getAccountBlocksByAddress', address, pageIndex, pageSize);
        const rawList = data || [];

        const list: Transaction[] = [];
        rawList.forEach((accountBlock: AccountBlockType) => {
            const transaction: Transaction = accountBlock;
            const { abi, transactionType, contractAddress } = getTransactionType(accountBlock, this.customTransactionType);

            transaction.transactionType = transactionType;

            const isDecodeTx = contractAddress
                && abi
                && (
                    decodeTxTypeList === 'all'
                    || (decodeTxTypeList.length && decodeTxTypeList.indexOf(transactionType) !== -1
                    )
                );

            if (isDecodeTx) {
                transaction.contractParams = contractAddress && abi
                    ? decodeContractAccountBlock({ accountBlock, contractAddress, abi })
                    : null;
            }

            list.push(transaction);
        });

        return list;
    }

    async callOffChainContract({ address, abi, code, params }) {
        const err = checkParams({ address, abi }, [ 'address', 'abi' ], [{
            name: 'address',
            func: _a => isValidAddress(_a) === AddressType.Contract
        }]);
        if (err) {
            throw err;
        }

        const offchainAbi = getAbiByType(abi, 'offchain');
        if (!offchainAbi) {
            throw new Error('Can\'t find abi that type is offchain');
        }

        const data = encodeFunctionCall(offchainAbi, params || []);
        const result = await this.request('contract_callOffChainMethod', {
            address,
            code,
            data: Buffer.from(data, 'hex').toString('base64')
        });

        if (!result) {
            return null;
        }

        const hexResult = Buffer.from(result, 'base64').toString('hex');
        return decodeParameters(offchainAbi.outputs, hexResult);
    }

    async getNonce({ difficulty, previousHash, address }: {
        difficulty: BigInt;
        previousHash: Hex;
        address: Address;
    }): Promise<Base64> {
        const err = checkParams({ difficulty, previousHash, address }, [ 'address', 'difficulty', 'previousHash' ]);
        if (err) {
            throw err;
        }

        const originalAddress = getOriginalAddressFromAddress(address);
        const getNonceHashBuffer = Buffer.from(originalAddress + previousHash, 'hex');
        const getNonceHash = blake2bHex(getNonceHashBuffer, null, 32);

        return this.request('util_getPoWNonce', difficulty, getNonceHash);
    }
}

export const ViteAPI = ViteAPIClass;
export default ViteAPI;
