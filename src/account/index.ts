import * as privToAddr from '~@vite/vitejs-privtoaddr';
import { paramsMissing } from '~@vite/vitejs-error';
import { tools, ed25519 } from '~@vite/vitejs-utils';
import client from '~@vite/vitejs-client';
import addrAccount from '~@vite/vitejs-addraccount';

import { Hex, SBPregBlock, block8, block7, revokeVotingBlock, quotaBlock, sendTxBlock, receiveTxBlock } from '../type';

const { checkParams } = tools;
const { sign, getPublicKey } = ed25519;


class Account extends addrAccount {
    privateKey: Hex
    publicKey: Hex
    balance
    _lock: Boolean
    _autoReceive: Boolean

    constructor({ privateKey, client }: {
        privateKey?: Hex | Buffer; client: client;
    }) {
        if (!client) {
            super();
            throw new Error(`${ paramsMissing.message } Client.`);
        }

        const { pubKey, privKey, hexAddr } = privToAddr.newHexAddr(privateKey);

        super({ address: hexAddr, client });

        this.privateKey = privKey;
        this.publicKey = pubKey;

        this._lock = true;
        this._autoReceive = false;
        this.balance = null;
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

    activate(intervals: number = 2000, receiveFailAction: Function = null) {
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

                if (balanceInfos) {
                    this.autoReceiveTx(intervals, receiveFailAction);
                    return;
                }

                this.stopAutoReceiveTx();
                _t();
            }).catch(() => {
                _t();
            });
        };

        loop();
    }

    freeze() {
        this._lock = true;
    }

    autoReceiveTx(intervals: number = 2000, receiveFailAction: Function = null) {
        if (this._autoReceive) {
            return;
        }

        this._autoReceive = true;

        const _receive = async () => {
            const result = await this._client.onroad.getOnroadBlocksByAddress(this.address, 0, 1);
            if (!result || !result.length) {
                return null;
            }
            const fromBlockHash = result[0].hash;

            try {
                const data = await this.receiveTx({ fromBlockHash });
                return data;
            } catch (err) {
                if (!receiveFailAction) {
                    return Promise.reject(err);
                }
                return receiveFailAction(err);
            }
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
        return this._client.buildinLedger.sendRawTx(accountBlock, this.privateKey);
    }

    async sendTx({ toAddress, tokenId, amount, message }) {
        const reqBlock: sendTxBlock = {
            accountAddress: this.address,
            toAddress,
            tokenId,
            amount,
            message
        };
        const _sendTxBlock = await this._client.buildinTxBlock.asyncSendTx(reqBlock);
        return this._client.buildinLedger.sendRawTx(_sendTxBlock, this.privateKey);
    }

    async receiveTx({ fromBlockHash }) {
        const reqBlock: receiveTxBlock = {
            accountAddress: this.address,
            fromBlockHash
        };
        const _receiveTxBlock = await this._client.buildinTxBlock.asyncReceiveTx(reqBlock);
        return this._client.buildinLedger.sendRawTx(_receiveTxBlock, this.privateKey);
    }

    async SBPreg({ nodeName, toAddress, amount, tokenId }) {
        const reqBlock: SBPregBlock = {
            accountAddress: this.address,
            nodeName,
            toAddress,
            amount,
            tokenId
        };
        const _SBPregBlock = await this._client.buildinTxBlock.SBPreg(reqBlock);
        return this._client.buildinLedger.sendRawTx(_SBPregBlock, this.privateKey);
    }

    async updateReg({ nodeName, toAddress, tokenId }) {
        const reqBlock: block8 = {
            accountAddress: this.address,
            nodeName,
            toAddress,
            tokenId
        };
        const _updateRegBlock = await this._client.buildinTxBlock.updateReg(reqBlock);
        return this._client.buildinLedger.sendRawTx(_updateRegBlock, this.privateKey);
    }

    async revokeReg({ nodeName, tokenId }) {
        const reqBlock: block7 = {
            accountAddress: this.address,
            nodeName,
            tokenId
        };
        const _revokeRegBlock = await this._client.buildinTxBlock.revokeReg(reqBlock);
        return this._client.buildinLedger.sendRawTx(_revokeRegBlock, this.privateKey);
    }

    async retrieveReward({ nodeName, toAddress, tokenId }) {
        const reqBlock: block8 = {
            accountAddress: this.address,
            nodeName,
            toAddress,
            tokenId
        };
        const _retrieveRewardBlock = await this._client.buildinTxBlock.retrieveReward(reqBlock);
        return this._client.buildinLedger.sendRawTx(_retrieveRewardBlock, this.privateKey);
    }

    async voting({ nodeName, tokenId }) {
        const reqBlock: block7 = {
            accountAddress: this.address,
            nodeName,
            tokenId
        };
        const _votingBlock = await this._client.buildinTxBlock.voting(reqBlock);
        return this._client.buildinLedger.sendRawTx(_votingBlock, this.privateKey);
    }

    async revokeVoting({ tokenId }) {
        const reqBlock: revokeVotingBlock = {
            accountAddress: this.address,
            tokenId
        };
        const _revokeVotingBlock = await this._client.buildinTxBlock.revokeVoting(reqBlock);
        return this._client.buildinLedger.sendRawTx(_revokeVotingBlock, this.privateKey);
    }

    async getQuota({ toAddress, tokenId, amount }) {
        const reqBlock: quotaBlock = {
            accountAddress: this.address,
            toAddress,
            tokenId,
            amount
        };
        const _getQuotaBlock = await this._client.buildinTxBlock.getQuota(reqBlock);
        return this._client.buildinLedger.sendRawTx(_getQuotaBlock, this.privateKey);
    }

    async withdrawalOfQuota({ toAddress, tokenId, amount }) {
        const reqBlock: quotaBlock = {
            accountAddress: this.address,
            toAddress,
            tokenId,
            amount
        };
        const _withdrawalOfQuotaBlock = await this._client.buildinTxBlock.withdrawalOfQuota(reqBlock);
        return this._client.buildinLedger.sendRawTx(_withdrawalOfQuotaBlock, this.privateKey);
    }

    async createContract({ hexCode, abi, params, tokenId, amount, fee = '10000000000000000000' }) {
        const _createContractBlock = await this._client.buildinTxBlock.createContract({
            accountAddress: this.address,
            hexCode,
            abi,
            params,
            tokenId,
            amount,
            fee
        });
        return this._client.buildinLedger.sendRawTx(_createContractBlock, this.privateKey);
    }

    async callContract({ toAddress, abi, params, methodName, tokenId, amount }) {
        const _callContractBlock = await this._client.buildinTxBlock.callContract({
            accountAddress: this.address,
            toAddress,
            abi,
            params,
            methodName,
            tokenId,
            amount
        });
        return this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey);
    }

    async mintage({ feeType = 'burn', tokenName, isReIssuable, maxSupply, ownerBurnOnly, totalSupply, decimals, tokenSymbol }) {
        const _callContractBlock = await this._client.buildinTxBlock.mintage({
            accountAddress: this.address,
            feeType,
            tokenName,
            isReIssuable,
            maxSupply,
            ownerBurnOnly,
            totalSupply,
            decimals,
            tokenSymbol
        });
        return this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey);
    }

    async mintageCancelPledge({ tokenId }) {
        const _callContractBlock = await this._client.buildinTxBlock.mintageCancelPledge({
            accountAddress: this.address,
            tokenId
        });
        return this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey);
    }

    async mintageIssue({ tokenId, amount, beneficial }) {
        const _callContractBlock = await this._client.buildinTxBlock.mintageIssue({
            accountAddress: this.address,
            tokenId,
            amount,
            beneficial
        });
        return this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey);
    }

    async mintageBurn({ amount, tokenId }) {
        const _callContractBlock = await this._client.buildinTxBlock.mintageBurn({
            accountAddress: this.address,
            amount,
            tokenId
        });
        return this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey);
    }

    async changeTokenType({ tokenId }) {
        const _callContractBlock = await this._client.buildinTxBlock.changeTokenType({
            accountAddress: this.address,
            tokenId
        });
        return this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey);
    }

    async changeTransferOwner({ ownerAddress, tokenId }) {
        const _callContractBlock = await this._client.buildinTxBlock.changeTransferOwner({
            accountAddress: this.address,
            tokenId,
            ownerAddress
        });
        return this._client.buildinLedger.sendRawTx(_callContractBlock, this.privateKey);
    }
}

export default Account;
