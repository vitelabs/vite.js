import { checkParams, isObject } from '@vite/vitejs-utils';

import _AccountBlock from './accountBlock';
import _Account from './account';
import { ReceiveAccountBlockTask as _ReceiveAccountBlockTask } from './receiveAccountBlockTask';
import * as _utils from './utils';

export const AccountBlock = _AccountBlock;
export const Account = _Account;
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

    const a = new _Account(params.address);
    if (!a[methodName]) {
        throw new Error(`Don\'t support transaction type ${ methodName }`);
    }

    return a[methodName](params);
}
