import { methods as _methods, Contracts } from '~@vite/vitejs-constant';
import netProcessor from '~@vite/vitejs-netprocessor';

import { checkParams } from '~@vite/vitejs-utils';
import { isValidHexAddr } from '~@vite/vitejs-privtoaddr';
import { getTxType, signAccountBlock, decodeBlockByContract } from '~@vite/vitejs-accountblock';
import { isAccountBlock, getAbi, getContractTxType } from '~@vite/vitejs-accountblock/builtin';
import { encodeFunctionCall, decodeParameters } from '~@vite/vitejs-abi';

import TxBlock from './txBlock';
import { Address, testapiFunc, RPCrequest, subscribeFunc, walletFunc, netFunc, onroadFunc, contractFunc, pledgeFunc, registerFunc, voteFunc, mintageFunc, ledgerFunc, txFunc, powFunc } from './type';

const { onroad } = _methods;
const _ledger = _methods.ledger;


class ClientClass extends netProcessor {
    builtinTxBlock: TxBlock
    customTxType: Object
    isDecodeTx: boolean

    wallet: walletFunc
    net: netFunc
    onroad: onroadFunc
    contract: contractFunc
    pledge: pledgeFunc
    register: registerFunc
    vote: voteFunc
    mintage: mintageFunc
    ledger: ledgerFunc
    tx: txFunc
    subscribeFunc: subscribeFunc
    pow: powFunc
    testapi: testapiFunc

    constructor(provider: any, firstConnect: Function, config: { isDecodeTx?: boolean } = { isDecodeTx: false }) {
        super(provider, firstConnect);

        this.builtinTxBlock = new TxBlock(this);
        this.isDecodeTx = !!config.isDecodeTx;
        this.customTxType = null;       // { [funcSign + contractAddr]: {contractAddr, abi, txType} }

        this._setMethodsName();
    }

    setProvider(provider, firstConnect, abort) {
        this._setProvider(provider, firstConnect, abort);

        const providerType = this._provider.type || 'http';
        if (providerType.toLowerCase !== 'ipc' || this.wallet) {
            return;
        }

        this._setMethodsName();
    }

    // { [txType]: { contractAddr, abi } }
    addTxType(contractList: Object = {}) {
        for (const txType in contractList) {
            if (Contracts[txType]) {
                throw new Error(`Please rename it. Your txType ${ txType } conflicts with default txType.`);
            }
            if (this.customTxType && this.customTxType[txType]) {
                throw new Error(`Please rename it. Your txType ${ txType } conflicts with this.customTxType.`);
            }
        }

        const customTxType = getContractTxType(contractList);
        this.customTxType = Object.assign({}, this.customTxType, customTxType);
    }

    async getBalance(addr: Address) {
        const err = checkParams({ addr }, ['addr'], [{
            name: 'addr',
            func: isValidHexAddr
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const data = await this.batch([ {
            methodName: _ledger.getAccountByAccAddr,
            params: [addr]
        }, {
            methodName: onroad.getOnroadInfoByAddress,
            params: [addr]
        } ]);

        if (!data || (data instanceof Array && data.length < 2)) {
            return null;
        }

        return {
            balance: data[0].result,
            onroad: data[1].result
        };
    }

    async getTxList({ addr, index, pageCount = 50, totalNum = null }: {
        addr: Address; index: number; pageCount?: number; totalNum?: number;
    }) {
        const err = checkParams({ addr, index }, [ 'addr', 'index' ], [{
            name: 'addr',
            func: isValidHexAddr
        }]);
        if (err) {
            throw err;
        }

        index = index >= 0 ? index : 0;

        if (totalNum === 0) {
            return { totalNum, list: [] };
        }

        const requests: RPCrequest[] = [{
            methodName: _ledger.getBlocksByAccAddr,
            params: [ addr, index, pageCount ]
        }];
        if (!totalNum) {
            requests.push({
                methodName: _ledger.getAccountByAccAddr,
                params: [addr]
            });
        }

        const data = await this.batch(requests);

        let rawList;
        requests.forEach((_r, i) => {
            if (_r.methodName === _ledger.getAccountByAccAddr) {
                totalNum = data[i].result ? data[i].result.totalNumber : 0;
                return;
            }
            rawList = data[i].result || [];
        });

        const list: any[] = [];
        rawList.forEach((item: any) => {
            const typeObj = getTxType(item, this.customTxType);
            item.txType = typeObj.txType;

            if (this.isDecodeTx) {
                item.contract = typeObj.contractAddr && typeObj.abi ? decodeBlockByContract({
                    accountBlock: item,
                    contractAddr: typeObj.contractAddr,
                    abi: typeObj.abi
                }) : null;
            }
            list.push(item);
        });

        if (list.length > totalNum) {
            console.warn('[client.getTxList] Please confirm that totalNum is correct.');
        }
        return { list, totalNum };
    }

    async callOffChainContract({ addr, abi, offChainCode, params }) {
        const jsonInterface = getAbi(abi, 'offchain');
        if (!jsonInterface) {
            throw new Error('Can\'t find offchain');
        }

        const data = encodeFunctionCall(jsonInterface, params || []);
        const result = await this.contract.callOffChainMethod({
            selfAddr: addr,
            offChainCode,
            data: Buffer.from(data, 'hex').toString('base64')
        });

        if (!result) {
            return result;
        }
        return decodeParameters(jsonInterface.outputs, Buffer.from(result, 'base64').toString('hex'));
    }

    async sendTx(accountBlock, privateKey) {
        const _accountBlock = signAccountBlock(accountBlock, privateKey);
        return this.sendRawTx(_accountBlock);
    }

    async sendAutoPowTx({ accountBlock, privateKey, usePledgeQuota = true }) {
        let err = checkParams({ accountBlock, privateKey }, [ 'accountBlock', 'privateKey' ]);
        if (err) {
            throw err;
        }

        err = isAccountBlock(accountBlock);
        if (err) {
            throw err;
        }

        const powTx = await this.builtinTxBlock.autoPow(accountBlock, usePledgeQuota);
        return this.sendTx(powTx.accountBlock, privateKey);
    }

    async sendRawTx(accountBlock) {
        try {
            await this.tx.sendRawTx(accountBlock);
            return accountBlock;
        } catch (err) {
            const _err = err;
            _err.accountBlock = accountBlock;
            throw _err;
        }
    }

    private _setMethodsName() {
        const providerType = (this._provider.type || 'http').toLowerCase();

        for (const namespace in _methods) {
            if (providerType !== 'ipc' && namespace === 'wallet') {
                this.wallet = null;
                continue;
            }

            const _namespace = namespace === 'subscribe' ? 'subscribeFunc' : namespace;
            if (this[_namespace]) {
                continue;
            }

            const spaceMethods = _methods[namespace];
            this[_namespace] = {};

            for (const methodName in spaceMethods) {
                const name = spaceMethods[methodName];
                this[_namespace][methodName] = (...args: any[]) => this.request(name, ...args);
            }
        }
    }
}

export const client = ClientClass;
export default ClientClass;
