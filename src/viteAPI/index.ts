import { checkParams, isArray } from '~@vite/vitejs-utils';
import { isValidAddress } from '~@vite/vitejs-hdwallet/address';
import { Contracts } from '~@vite/vitejs-constant';
import { getTransactionTypeByContractList } from '~@vite/vitejs-accountblock/builtin';
import { getTransactionType, decodeBlockByContract } from '~@vite/vitejs-accountblock';

import { Address, AccountBlockType, Transaction } from './type';

import Client from './client';


class ViteAPIClass extends Client {
    private customTransactionType: Object

    constructor(provider: any, firstConnect: Function) {
        super(provider, firstConnect);

        // { [funcSign + contractAddress]: { contractAddress, abi, transactionType } }
        this.customTransactionType = null;
    }

    // { [txType]String: { contractAddress:Address, abi:String } }
    addTransactionType(contractList: Object = {}) {
        for (const transactionType in contractList) {
            if (Contracts[transactionType]) {
                throw new Error(`Please rename it. Your transactionType ${ transactionType } conflicts with default transactionType.`);
            }
            if (this.customTransactionType && this.customTransactionType[transactionType]) {
                throw new Error(`Please rename it. Your transactionType ${ transactionType } conflicts with custom transactionType.`);
            }
        }

        const contract = getTransactionTypeByContractList(contractList);
        this.customTransactionType = Object.assign({}, this.customTransactionType, contract);
    }

    async getBalanceInfo(address: Address) {
        const err = checkParams({ address }, ['address'], [{
            name: 'address',
            func: isValidAddress
        }]);
        if (err) {
            return Promise.reject(err);
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
    }, decodeTxTypeList: 'all' | String[] = 'all') {
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
                    ? decodeBlockByContract({ accountBlock, contractAddress, abi })
                    : null;
            }

            list.push(transaction);
        });

        return list;
    }
}

export const ViteAPI = ViteAPIClass;
export default ViteAPI;
