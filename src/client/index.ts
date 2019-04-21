import { methods as _methods } from '~@vite/vitejs-constant';
import netProcessor from '~@vite/vitejs-netprocessor';

import { checkParams, blake2bHex } from '~@vite/vitejs-utils';
import { isValidHexAddr, getAddrFromHexAddr } from '~@vite/vitejs-privtoaddr';
import { getBuiltinTxType, signAccountBlock, validReqAccountBlock } from '~@vite/vitejs-accountblock';

import TxBlock from './txBlock';
import { Address, testapiFunc, RPCrequest, BuiltinTxType, subscribeFunc, walletFunc, netFunc, onroadFunc, contractFunc, pledgeFunc, registerFunc, voteFunc, mintageFunc, ledgerFunc, txFunc, powFunc } from '../type';

const { onroad } = _methods;
const _ledger = _methods.ledger;


export default class Client extends netProcessor {
    buildinTxBlock: TxBlock

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

    constructor(provider: any, firstConnect: Function) {
        super(provider, firstConnect);

        this.buildinTxBlock = new TxBlock(this);

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
            return Promise.reject(err);
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
            const txType = getBuiltinTxType(item.toAddress, item.data, Number(item.blockType));
            item.txType = BuiltinTxType[txType];
            list.push(item);
        });

        return { list, totalNum };
    }

    async sendAutoPowRawTx({ accountBlock, privateKey, usePledgeQuota = true }) {
        const err = checkParams({ accountBlock, privateKey }, [ 'accountBlock', 'privateKey' ], [{
            name: 'accountBlock',
            func: _a => !validReqAccountBlock(_a)
        }]);
        if (err) {
            throw err;
        }

        const powTx = await this.getPowRawTx(accountBlock, usePledgeQuota);
        return this.sendRawTx(powTx.accountBlock, privateKey);
    }

    async sendRawTx(accountBlock, privateKey) {
        const _accountBlock = signAccountBlock(accountBlock, privateKey);

        try {
            return await this.tx.sendRawTx(_accountBlock);
        } catch (err) {
            const _err = err;
            _err.accountBlock = _accountBlock;
            throw _err;
        }
    }

    async getPowRawTx(accountBlock, usePledgeQuota) {
        const data = await this.tx.calcPoWDifficulty({
            selfAddr: accountBlock.accountAddress,
            prevHash: accountBlock.prevHash,
            blockType: accountBlock.blockType,
            toAddr: accountBlock.toAddress,
            data: accountBlock.data,
            usePledgeQuota
        });

        if (!data.difficulty) {
            return {
                accountBlock,
                ...data
            };
        }

        const realAddr = getAddrFromHexAddr(accountBlock.accountAddress);
        const rawHashBytes = Buffer.from(realAddr + accountBlock.prevHash, 'hex');
        const hash = blake2bHex(rawHashBytes, null, 32);

        const nonce = await this.pow.getPowNonce(data.difficulty, hash);

        accountBlock.nonce = nonce;
        accountBlock.difficulty = data.difficulty;
        return {
            accountBlock,
            ...data
        };
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
