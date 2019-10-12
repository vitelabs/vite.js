import { Contracts } from '~@vite/vitejs-constant';
import { checkParams, isArray } from '~@vite/vitejs-utils';
import { isValidAddress, ADDR_TYPE } from '~@vite/vitejs-hdwallet/address';
import { decodeParameters, encodeFunctionCall, getAbiByType } from '~@vite/vitejs-abi';
import { Default_Contract_TransactionType, encodeContractList, getTransactionType, decodeAccountBlockByContract } from '~@vite/vitejs-accountblock';

import { Address, AccountBlockType, Transaction } from './type';

import Client from './client';


class ViteAPIClass extends Client {
    private customTransactionType: Object

    constructor(provider: any, firstConnect: Function) {
        super(provider, firstConnect);

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
            // ledger.getAccountByAccAddr
            methodName: 'ledger_getAccountByAccAddr',
            params: [address]
        }, {
            // onroad.getOnroadInfoByAddress
            methodName: 'ledger_getUnreceivedBlocksByAddress',
            params: [address]
        } ]);

        if (!data || (data instanceof Array && data.length < 2)) {
            return null;
        }

        return {
            balance: data[0].result,
            unreceived: data[1].result
        };
    }

    async getTransactionList({ address, pageIndex, pageCount = 50 }: {
        address: Address; pageIndex: number; pageCount?: number;
    }, decodeTxTypeList: 'all' | String[] = 'all'): Promise<Transaction[]> {
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
        const data = await this.request('ledger_getBlocksByAccAddr', address, pageIndex, pageCount);
        const rawList = data || [];

        const list: Transaction[] = [];
        rawList.forEach((accountBlock: AccountBlockType) => {
            const transaction: Transaction = accountBlock;
            const { abi, transactionType, contractAddress } = getTransactionType(accountBlock, this.customTransactionType);

            transaction.transationType = transactionType;

            const isDecodeTx = contractAddress
                && abi
                && (
                    decodeTxTypeList === 'all'
                    || (decodeTxTypeList.length && decodeTxTypeList.indexOf(transactionType) !== -1
                    )
                );

            if (isDecodeTx) {
                transaction.contractResult = contractAddress && abi
                    ? decodeAccountBlockByContract({ accountBlock, contractAddress, abi })
                    : null;
            }

            list.push(transaction);
        });

        return list;
    }

    async callOffChainContract({ address, abi, code, params }) {
        const err = checkParams({ address, abi }, [ 'address', 'abi' ], [{
            name: 'address',
            func: _a => isValidAddress(_a) === ADDR_TYPE.Contract
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
}

export const ViteAPI = ViteAPIClass;
export default ViteAPI;
