import addressUtils from '@vite/vitejs-wallet';
import { checkParams, isHexString } from '@vite/vitejs-utils';

import Account from './account';

import { Address, Hex, ProviderType, AccountBlockBlock } from './type';

export class ReceiveAccountBlockTask {
    address: Address;

    private provider: ProviderType;
    private sign?: Function;
    private privateKey: Hex | undefined | null;
    private _account: Account;
    private _timer: any;
    private successCB?: Function;
    private errorCB?: Function;

    constructor({ address, provider, privateKey, sign }: {
        address: Address; provider: ProviderType; privateKey?: Hex; sign?: Function;
    }) {
        const err = checkParams({ address, provider, privateKey }, [ 'address', 'provider' ], [ {
            name: 'address',
            func: addressUtils.isValidAddress
        }, {
            name: 'privateKey',
            func: function (str: string | undefined | null): boolean {
                if (!sign && !privateKey) return false;
                if (str === undefined || str === null) {
                    return true;
                }
                return isHexString(str);
            }
        } ]);
        if (err) {
            throw err;
        }


        this.address = address;
        this.provider = provider;
        this.sign = sign;
        this.privateKey = privateKey;

        this._account = new Account(address);
        this._account.setProvider(provider);

        if (privateKey) {
            this._account.setPrivateKey(privateKey);
        }

        this._timer = null;

        this.successCB = undefined;
        this.errorCB = undefined;
    }

    start({
        checkTime = 3000,
        transactionNumber = 5
    }: {
        checkTime: number;
        transactionNumber: number;
    } = {
        checkTime: 3000,
        transactionNumber: 5
    }) {
        this.stop();

        const toReceive = () => {
            this._timer = setTimeout(async () => {
                await this.receive(transactionNumber);
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

    private async receive(pageSize: number) {
        let unreceivedBlocks: any = undefined;
        try {
            unreceivedBlocks = await this.getUnreceivedBlocks(pageSize);
        } catch (error) {
            this.emitError({
                message: 'Get unreceivedAccountBlocks error',
                error
            });
            return;
        }

        if (!unreceivedBlocks || !unreceivedBlocks.length) {
            this.emitSuccess({ message: 'Don\'t have unreceivedAccountBlocks.' });
            return;
        }

        const accountBlockList: AccountBlockBlock[] = [];
        for (const unreceivedBlock of unreceivedBlocks) {
            const previousAccountBlock = accountBlockList.length
                ? accountBlockList[accountBlockList.length - 1]
                : null;

            const sendBlockHash = unreceivedBlock.hash;
            let accountBlock: AccountBlockBlock | undefined = undefined;

            try {
                accountBlock = await this.receiveAccountBlockByPrevious({
                    sendBlockHash: unreceivedBlock.hash,
                    previousAccountBlock
                });
                if (accountBlock){
                    accountBlockList.push(accountBlock);
                }
            } catch (error) {
                accountBlockList.length && this.emitSuccess({
                    message: 'Receive accountBlock success',
                    accountBlockList
                });

                this.emitError({
                    message: `Receive accountBlock ${ sendBlockHash } error`,
                    unreceivedHash: sendBlockHash,
                    error
                });
                return;
            }
        }

        this.emitSuccess({
            message: 'Receive accountBlock success',
            accountBlockList
        });
        return;
    }

    private emitSuccess(result: { message: string; accountBlockList?: AccountBlockBlock[] }) {
        this.successCB && this.successCB({
            status: 'ok',
            timestamp: new Date().getTime(),
            ...result
        });
    }

    private emitError(error: { message: string; error: any; unreceivedHash?: Hex; }) {
        this.errorCB && this.errorCB({
            status: 'error',
            timestamp: new Date().getTime(),
            ...error
        });
    }

    private async getUnreceivedBlocks(pageSize) {
        const data = await this.provider.request('ledger_getUnreceivedBlocksByAddress', this.address, 0, pageSize);
        if (!data || !data.length) {
            return undefined;
        }
        return data;
    }

    private async receiveAccountBlockByPrevious({ sendBlockHash, previousAccountBlock }) {
        const accountBlock = this._account.receive({ sendBlockHash });

        if (this.privateKey) {
            if (!previousAccountBlock) {
                return accountBlock.autoSendByPoW();
            }

            accountBlock.setPreviousAccountBlock(previousAccountBlock);
            return accountBlock.sendByPoW();
        } else if (previousAccountBlock) {
            accountBlock.setPreviousAccountBlock(previousAccountBlock);
        } else {
            await accountBlock.autoSetPreviousAccountBlock();
        }

        if (this.sign){
            await accountBlock.PoW();
            await this.sign(accountBlock);
            return accountBlock.send();
        }
    }
}
