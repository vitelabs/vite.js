import * as privToAddr from '~@vite/vitejs-privtoaddr';
import { paramsMissing } from '~@vite/vitejs-error';
import { checkParams, ed25519 } from '~@vite/vitejs-utils';
import client from '~@vite/vitejs-client';
import addrAccount from '~@vite/vitejs-addraccount';
import { signAccountBlock } from '~@vite/vitejs-accountblock';

import { Hex } from '../type';

const { sign, getPublicKey } = ed25519;


class Account extends addrAccount {
    privateKey: Hex
    publicKey: Hex
    balance
    autoPow: Boolean
    usePledgeQuota: boolean
    private _lock: Boolean
    private _autoReceive: Boolean

    constructor({ privateKey, client }: {
        privateKey?: Hex | Buffer; client: client;
    }, { autoPow = false, usePledgeQuota = true }: {
        autoPow?: boolean;
        usePledgeQuota? : boolean;
    } = { autoPow: false, usePledgeQuota: true }) {
        if (!client) {
            throw new Error(`${ paramsMissing.message } Client.`);
        }

        const { pubKey, privKey, hexAddr } = privToAddr.newHexAddr(privateKey);

        super({ address: hexAddr, client });

        this.privateKey = privKey;
        this.publicKey = pubKey;

        this._lock = true;
        this._autoReceive = false;
        this.balance = null;

        this.autoPow = autoPow;
        this.usePledgeQuota = usePledgeQuota;
        this._setTxMethod();
    }

    getPublicKey() {
        if (this.publicKey) {
            return Buffer.from(this.publicKey, 'hex');
        }
        const privKey = Buffer.from(this.privateKey, 'hex');
        return getPublicKey(privKey);
    }

    sign(hexStr: Hex) {
        const privKey = Buffer.from(this.privateKey, 'hex');
        return sign(hexStr, privKey);
    }

    signAccountBlock(accountBlock) {
        return signAccountBlock(accountBlock, this.privateKey);
    }

    activate(intervals: number = 2000, autoPow?, usePledgeQuota?) {
        if (!this._lock) {
            return;
        }

        this._lock = false;

        const loop = () => {
            if (this._lock) {
                return;
            }

            const _t = () => {
                let loopTimeout = setTimeout(() => {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                    loop();
                }, intervals);
            };

            this.getBalance().then(balance => {
                this.balance = balance;

                const onroad = this.balance && this.balance.onroad ? this.balance.onroad : null;
                const balanceInfos = onroad && onroad.tokenBalanceInfoMap ? onroad.tokenBalanceInfoMap : null;
                _t();

                if (balanceInfos) {
                    this.autoReceiveTx(intervals, autoPow, usePledgeQuota);
                    return;
                }
                this.stopAutoReceiveTx();
            }).catch(() => {
                _t();
            });
        };

        loop();
    }

    freeze() {
        this._lock = true;
    }

    autoReceiveTx(intervals: number = 2000, autoPow?, usePledgeQuota?) {
        if (this._autoReceive) {
            return;
        }

        this._autoReceive = true;

        const _receive = async () => {
            const result = await this.getOnroadBlocks({
                index: 0,
                pageCount: 1
            });

            if (!result || !result.length) {
                return null;
            }

            const fromBlockHash = result[0].hash;

            return this['receiveTx']({ fromBlockHash }, autoPow, usePledgeQuota);
        };

        const loop = () => {
            if (!this._autoReceive) {
                return;
            }

            const _t = () => {
                let loopTimeout = setTimeout(() => {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                    loop();
                }, intervals);
            };

            _receive().then(() => {
                _t();
            }).catch(() => {
                _t();
            });
        };

        loop();
    }

    stopAutoReceiveTx() {
        this._autoReceive = false;
    }

    sendRawTx(accountBlock) {
        checkParams({ accountBlock }, ['accountBlock'], [{
            name: 'accountBlock',
            func: _a => !_a.accountAddress || (_a.accountAddress === this.address),
            msg: 'AccountAddress is wrong.'
        }]);

        accountBlock.accountAddress = this.address;
        return this._client.sendRawTx(accountBlock, this.privateKey);
    }

    sendAutoPowRawTx(accountBlock, usePledgeQuota?) {
        const _usePledgeQuota = usePledgeQuota === true || usePledgeQuota === false ? usePledgeQuota : !!this.usePledgeQuota;

        return this._client.sendAutoPowRawTx({
            accountBlock,
            privateKey: this.privateKey,
            usePledgeQuota: _usePledgeQuota
        });
    }

    async sendPowTx({
        methodName,
        params,
        beforeCheckPow,
        beforePow,
        beforeSendTx
    }) {
        let lifeCycle = 'start';
        let checkPowResult;

        // First: get block
        let accountBlock = await this.getBlock[methodName](...params);

        // Step 1: check PoW
        const checkFunc = async (usePledgeQuota = true) => {
            checkPowResult = await this._client.tx.calcPoWDifficulty({
                selfAddr: accountBlock.accountAddress,
                prevHash: accountBlock.prevHash,
                blockType: accountBlock.blockType,
                toAddr: accountBlock.toAddress,
                data: accountBlock.data,
                usePledgeQuota
            });

            // Don't need PoW
            if (!checkPowResult.difficulty) {
                return _beforeSendTx(accountBlock);
            }

            return _beforePow();
        };

        // Step 2: is continue directly
        const _beforePow = async () => {
            // Don't have the function beforePow, continue directly.
            lifeCycle = 'checkPowDone';

            if (!beforePow) {
                return powFunc();
            }
            return beforePow(accountBlock, checkPowResult, powFunc);
        };

            // Step 3: run PoW
        const powFunc = async (isReject = false) => {
            if (isReject) {
                return { lifeCycle, checkPowResult, accountBlock };
            }

            accountBlock = await this._client.getPowRawTx(accountBlock, checkPowResult.difficulty);
            return _beforeSendTx(accountBlock);
        };

            // Step 4: is send TX
        const _beforeSendTx = async accountBlock => {
            lifeCycle = 'powDone';

            // Don't have the function beforeSendTx, break.
            if (!beforeSendTx) {
                return sendTxFunc();
            }
            return beforeSendTx(accountBlock, checkPowResult, sendTxFunc);
        };

            // Step 5: send TX
        const sendTxFunc = async (isReject = false) => {
            if (isReject) {
                return { lifeCycle, checkPowResult, accountBlock };
            }

            const result = await this.sendRawTx(accountBlock);
            return {
                lifeCycle: 'finish',
                result
            };
        };

        lifeCycle = 'beforeCheckPow';
        const result = beforeCheckPow ? beforeCheckPow(accountBlock, checkFunc) : checkFunc();
        return result;
    }

    private _sendRawTx(accountBlock, autoPow?, usePledgeQuota?) {
        const _autoPow = autoPow === true || autoPow === false ? autoPow : !!this.autoPow;

        if (!_autoPow) {
            return this.sendRawTx(accountBlock);
        }

        return this.sendAutoPowRawTx(accountBlock, usePledgeQuota);
    }

    private _setTxMethod() {
        for (const key in this._client.builtinTxBlock) {
            if (key === '_client' || key.endsWith('Block')) {
                continue;
            }

            let _key = key;
            if (_key.startsWith('async')) {
                _key = _key.replace('async', '');
                _key = _key[0].toLocaleLowerCase() + _key.slice(1);
            }

            this[_key] = async (params, autoPow?, usePledgeQuota?) => {
                params.accountAddress = this.address;
                const block = await this.getBlock[key](params);
                return this._sendRawTx(block, autoPow, usePledgeQuota);
            };
        }
    }
}

export default Account;
