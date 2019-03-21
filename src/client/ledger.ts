import { methods } from 'constant';
import { tools } from 'utils';
import { isValidHexAddr } from 'privToAddr';
import { getBuiltinTxType, signAccountBlock, validReqAccountBlock } from 'accountBlock';

import client from '.';
import { RPCrequest, BuiltinTxType, Address } from '../type';

const { onroad } = methods;
const { checkParams } = tools;
const _ledger = methods.ledger;


export default class Ledger {
    _client: client

    constructor(client) {
        this._client = client;
    }

    async getBalance(addr: Address) {
        const err = checkParams({ addr }, ['addr'], [{
            name: 'addr',
            func: isValidHexAddr
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const data = await this._client.batch([ {
            methodName: _ledger.getAccountByAccAddr,
            params: [addr]
        }, {
            methodName: onroad.getAccountOnroadInfo,
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

        const data = await this._client.batch(requests);

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

    async sendRawTx(accountBlock, privateKey) {
        const err = checkParams({ accountBlock, privateKey }, [ 'accountBlock', 'privateKey' ], [{
            name: 'accountBlock',
            func: _a => !validReqAccountBlock(_a)
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const _accountBlock = signAccountBlock(accountBlock, privateKey);

        try {
            return await this._client.tx.sendRawTx(_accountBlock);
        } catch (err) {
            const _err = err;
            _err.accountBlock = _accountBlock;
            return Promise.reject(_err);
        }
    }
}
