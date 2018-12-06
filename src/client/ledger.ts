import { RPCresponse, BuiltinTxType, Address } from "const/type";
import { getBuiltinTxType } from 'utils/accountBlock';
import { checkParams, validInteger } from 'utils/tools';
import { isValidHexAddr } from 'utils/address/privToAddr';

export default class ledger {
    _client: any

    constructor(client) {
        this._client = client;
    }

    async getBalance(addr: Address) {
        let err = checkParams({ addr }, ['addr' ], [{
            name: 'addr',
            func: isValidHexAddr
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const data:RPCresponse[] = await this._client.batch([{
            methodName: 'ledger_getAccountByAccAddr',
            params: [addr]
        }, {
            methodName: 'onroad_getAccountOnroadInfo',
            params: [addr]
        }]);

        if (!data || +data.length < 2) {
            return null;
        }

        return {
            balance: data[0].result,
            onroad: data[1].result
        };
    }

    async getTxList({
        addr, index, pageCount = 50, totalNum = null
    }: {
        addr: Address, index: number, pageCount?: number, totalNum?: number
    }) {
        let err = checkParams({ addr, index }, ['addr', 'index'], [{
            name: 'index',
            func: validInteger
        }, {
            name: 'addr',
            func: isValidHexAddr
        }]);
        if (err) {
            return Promise.reject(err);
        }

        if (totalNum === 0) {
            return {
                totalNum, list: []
            }
        }

        let requests = [{
            methodName: 'ledger_getBlocksByAccAddr',
            params: [addr, index, pageCount]
        }];
        if (!totalNum) {
            requests.push({
                methodName: 'ledger_getAccountByAccAddr',
                params: [addr]
            })
        }

        const data:RPCresponse[] = await this._client.batch(requests);

        let rawList;
        requests.forEach((_r, i) => {
            if (_r.methodName === 'ledger_getAccountByAccAddr') {
                totalNum = data[i].result ? data[i].result.totalNum : 0;
                return;
            }
            rawList = data[i].result || [];
        })

        let list: any[] = [];
        rawList.forEach((item: any) => {
            let txType = getBuiltinTxType(item.toAddress, item.data, +item.blockType);
            item.txType = BuiltinTxType[txType];
            list.push(item);
        });

        return { list, totalNum };
    }
}
