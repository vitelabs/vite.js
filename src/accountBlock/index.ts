import { checkParams, isObject } from '~@vite/vitejs-utils';

import _AccountBlock from './accountBlock';
import _Account from './account';
import { ReceiveAccountBlockTask as _ReceiveAccountBlockTask } from './receiveAccountBlockTask';
import * as _utils from './utils';

export const AccountBlock = _AccountBlock;
export const Account = _Account;
export const ReceiveAccountBlockTask = _ReceiveAccountBlockTask;
export const utils = _utils;
export type ContractInfo = _utils.ContractInfo;

/**
 * Create an account block instance according to method name.
 * @param methodName Methods of Account class
 * @param params
 */
export function createAccountBlock(methodName: string, params: {
    address: string,
    [name: string]: any;
}) {
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
    if (!a[methodName] || [ 'constructor', 'setProvider', 'setPrivateKey' ].includes(methodName)) {
        throw new Error(`Don\'t support transaction type ${ methodName }`);
    }

    return a[methodName](params);
}
