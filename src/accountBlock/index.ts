import { checkParams, isObject } from '~@vite/vitejs-utils';

import _AccountBlock from './accountBlock';
import _Transaction from './transaction';
import { ReceiveAccountBlockTask as _ReceiveAccountBlockTask } from './receiveAccountBlockTask';
import * as _utils from './utils';

export const AccountBlock = _AccountBlock;
export const Transaction = _Transaction;
export const ReceiveAccountBlockTask = _ReceiveAccountBlockTask;
export const utils = _utils;

export function createAccountBlock(methodName: string, params: any) {
    const err = checkParams({ methodName, params }, [ 'methodName', 'params' ], [ {
        name: 'methodName',
        func: _m => typeof methodName === 'string'
    }, {
        name: 'params',
        func: isObject
    } ]);
    if (err) {
        throw err;
    }

    const tx = new _Transaction(params.address);
    if (!tx[methodName]) {
        throw new Error(`Don\'t support transaction type ${ methodName }`);
    }

    return tx[methodName](params);
}
