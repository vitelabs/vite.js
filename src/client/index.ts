import { Contracts } from '~@vite/vitejs-constant';
import ViteAPI from '~@vite/vitejs-viteapi';

// import { checkParams } from '~@vite/vitejs-utils';
// import { isValidAddress } from '~@vite/vitejs-hdwallet/address';
// import { getTransactionType, signAccountBlock, decodeBlockByContract } from '~@vite/vitejs-accountblock';
// import { isAccountBlock, getAbi, getTransactionTypeByContractList } from '~@vite/vitejs-accountblock/builtin';
import { getTransactionTypeByContractList } from '~@vite/vitejs-accountblock/builtin';
// import { encodeFunctionCall, decodeParameters } from '~@vite/vitejs-abi';

import TxBlock from './txBlock';
// import { Address, RPCrequest } from './type';


class ClientClass extends ViteAPI {
    builtinTxBlock: TxBlock
    customTxType: Object
    isDecodeTx: boolean
    decodeTxTypeList: Array<string>

    constructor(provider: any, firstConnect: Function, config: {
        isDecodeTx?: boolean;
        decodeTxTypeList?: Array<string>;
    } = { isDecodeTx: false }) {
        super(provider, firstConnect);

        this.builtinTxBlock = new TxBlock(this);
        this.isDecodeTx = !!config.isDecodeTx;
        this.decodeTxTypeList = config.decodeTxTypeList;
        this.customTxType = null;       // { [funcSign + contractAddress]: {contractAddress, abi, txType} }
    }

    // { [txType]: { contractAddress, abi } }
    addTxType(contractList: Object = {}) {
        for (const txType in contractList) {
            if (Contracts[txType]) {
                throw new Error(`Please rename it. Your txType ${ txType } conflicts with default txType.`);
            }
            if (this.customTxType && this.customTxType[txType]) {
                throw new Error(`Please rename it. Your txType ${ txType } conflicts with this.customTxType.`);
            }
        }

        const customTxType = getTransactionTypeByContractList(contractList);
        this.customTxType = Object.assign({}, this.customTxType, customTxType);
    }

    // async getBalance(addr: Address) {
    //     const err = checkParams({ addr }, ['addr'], [{
    //         name: 'addr',
    //         func: isValidAddress
    //     }]);
    //     if (err) {
    //         return Promise.reject(err);
    //     }

    //     const data = await this.batch([ {
    //         methodName: _ledger.getAccountByAccAddr,
    //         params: [addr]
    //     }, {
    //         methodName: onroad.getOnroadInfoByAddress,
    //         params: [addr]
    //     } ]);

    //     if (!data || (data instanceof Array && data.length < 2)) {
    //         return null;
    //     }

    //     return {
    //         balance: data[0].result,
    //         onroad: data[1].result
    //     };
    // }

    // async getTxList({ addr, index, pageCount = 50, totalNum = null }: {
    //     addr: Address; index: number; pageCount?: number; totalNum?: number;
    // }) {
    //     const err = checkParams({ addr, index }, [ 'addr', 'index' ], [{
    //         name: 'addr',
    //         func: isValidAddress
    //     }]);
    //     if (err) {
    //         throw err;
    //     }

    //     index = index >= 0 ? index : 0;

    //     if (totalNum === 0) {
    //         return { totalNum, list: [] };
    //     }

    //     const requests: RPCrequest[] = [{
    //         methodName: _ledger.getBlocksByAccAddr,
    //         params: [ addr, index, pageCount ]
    //     }];
    //     if (!totalNum) {
    //         requests.push({
    //             methodName: _ledger.getAccountByAccAddr,
    //             params: [addr]
    //         });
    //     }

    //     const data = await this.batch(requests);

    //     let rawList;
    //     requests.forEach((_r, i) => {
    //         if (_r.methodName === _ledger.getAccountByAccAddr) {
    //             totalNum = data[i].result ? data[i].result.totalNumber : 0;
    //             return;
    //         }
    //         rawList = data[i].result || [];
    //     });

    //     const list: any[] = [];
    //     rawList.forEach((item: any) => {
    //         const typeObj = getTransactionType(item, this.customTxType);
    //         item.txType = typeObj.txType;

    //         const isDecodeTx = this.isDecodeTx && typeObj.contractAddress && typeObj.abi
    //             && (!this.decodeTxTypeList || this.decodeTxTypeList.indexOf(item.txType) !== -1);

    //         if (isDecodeTx) {
    //             item.contract = typeObj.contractAddress && typeObj.abi ? decodeBlockByContract({
    //                 accountBlock: item,
    //                 contractAddress: typeObj.contractAddress,
    //                 abi: typeObj.abi
    //             }) : null;
    //         }

    //         list.push(item);
    //     });

    //     if (list.length > totalNum) {
    //         console.warn('[client.getTxList] Please confirm that totalNum is correct.');
    //     }
    //     return { list, totalNum };
    // }

    // async callOffChainContract({ addr, abi, offChainCode, params }) {
    //     const jsonInterface = getAbi(abi, 'offchain');
    //     if (!jsonInterface) {
    //         throw new Error('Can\'t find offchain');
    //     }

    //     const data = encodeFunctionCall(jsonInterface, params || []);
    //     const result = await this.contract.callOffChainMethod({
    //         selfAddr: addr,
    //         offChainCode,
    //         data: Buffer.from(data, 'hex').toString('base64')
    //     });

    //     if (!result) {
    //         return result;
    //     }
    //     return decodeParameters(jsonInterface.outputs, Buffer.from(result, 'base64').toString('hex'));
    // }
}

export const client = ClientClass;
export default ClientClass;
