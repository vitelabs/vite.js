import { isValidAddress } from  '~@vite/vitejs-wallet/address';
import { checkParams, isHexString } from '~@vite/vitejs-utils';

import Transaction from './transaction';

import { Address, Hex, ProviderType } from './type';

export class ReceiveAccountBlockTask {
    address: Address;

    private provider: ProviderType
    private _transaction: Transaction
    private _timer: any
    private successCB: Function
    private errorCB: Function

    constructor({ address, provider, privateKey }: {
        address: Address; provider: ProviderType; privateKey: Hex;
    }) {
        const err = checkParams({ address, provider, privateKey }, [ 'address', 'provider', 'privateKey' ], [ {
            name: 'address',
            func: isValidAddress
        }, {
            name: 'privateKey',
            func: isHexString
        } ]);
        if (err) {
            throw err;
        }

        this.address = address;
        this.provider = provider;

        this._transaction = new Transaction(address);
        this._transaction.setProvider(provider).setPrivateKey(privateKey);

        this._timer = null;

        this.successCB = null;
        this.errorCB = null;
    }

    start({
        checkTime = 3000,
        receivedNumberATime = 5
    }: {
        checkTime: number;
        receivedNumberATime: number;
    }) {
        this.stop();

        const toReceive = () => {
            this._timer = setTimeout(async () => {
                try {
                    const result = await this.reveive(receivedNumberATime);
                    this.emitSuccess(result);
                } catch (error) {
                    this.emitError(error);
                }

                if (!this._timer) {
                    return;
                }
                toReceive();
            }, checkTime);
        };
        toReceive();
    }

    stop() {
        this._timer && clearTimeout(this._timer);
        this._timer = null;
    }

    onError(errorCB: Function) {
        this.errorCB = errorCB;
    }

    onSuccess(successCB: Function) {
        this.successCB = successCB;
    }

    private async reveive(pageSize: number): Promise<{ status: string; message: string }> {
        let unreceivedBlocks = null;
        try {
            unreceivedBlocks = await this.getUnreceivedBlocks(pageSize);
        } catch (error) {
            throw {
                status: 'error',
                message: 'Get unreceivedAccountBlocks error',
                error
            };
        }

        if (!unreceivedBlocks.length) {
            return {
                status: 'ok',
                message: 'Don\'t have unreceivedAccountBlocks.'
            };
        }

        const accountBlockList = [];
        for (let i = 0; i < unreceivedBlocks.length; i++) {
            const unreceivedBlock = unreceivedBlocks[i];
            const accountBlock = this._transaction.receive({ sendBlockHash: unreceivedBlock.hash });
            const previousAccountBlock = accountBlockList.length
                ? accountBlockList[accountBlockList.length - 1]
                : null;

            try {
                if (!previousAccountBlock) {
                    const sendBlock = await accountBlock.autoSendByPoW();
                    accountBlockList.push(sendBlock);
                    continue;
                }

                accountBlock.setPreviousAccountBlock(previousAccountBlock);
                const sendBlock = await accountBlock.sendByPoW();
                accountBlockList.push(sendBlock);
            } catch (error) {
                throw {
                    status: 'error',
                    message: `Receive accountBlock ${ unreceivedBlock.hash } error`,
                    error
                };
            }
        }

        return {
            status: 'ok',
            message: 'Receive accountBlock success'
        };
    }

    private emitSuccess(result: { status: string; message: string }) {
        this.successCB && this.successCB(result);
    }

    private emitError(error: { status: string; message: string; error: any }) {
        this.errorCB && this.errorCB(error);
    }

    private async getUnreceivedBlocks(pageSize) {
        const data = await this.provider.request('ledger_getUnreceivedBlocksByAddress', this.address, 0, pageSize);
        if (!data || !data.length) {
            return [];
        }
        return data;
    }
}
