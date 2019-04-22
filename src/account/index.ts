import * as privToAddr from '~@vite/vitejs-privtoaddr';
import { paramsMissing } from '~@vite/vitejs-error';
import { checkParams, ed25519 } from '~@vite/vitejs-utils';
import client from '~@vite/vitejs-client';
import addrAccount from '~@vite/vitejs-addraccount';
import { signAccountBlock } from '~@vite/vitejs-accountblock';
import { Vite_TokenId } from '~@vite/vitejs-constant';

import { Hex, SBPregBlock, block8, block7, revokeVotingBlock, quotaBlock, sendTxBlock, receiveTxBlock } from '../type';

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

            return this.receiveTx(fromBlockHash, autoPow, usePledgeQuota);
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

    sendAutoPowRawTx(accountBlock, usePledgeQuota) {
        const _usePledgeQuota = usePledgeQuota === true || usePledgeQuota === false ? usePledgeQuota : !!this.usePledgeQuota;

        return this._client.sendAutoPowRawTx({
            accountBlock,
            privateKey: this.privateKey,
            usePledgeQuota: _usePledgeQuota
        });
    }

    async sendTx({ toAddress, tokenId, amount, message }, autoPow?, usePledgeQuota?) {
        const reqBlock: sendTxBlock = {
            accountAddress: this.address,
            toAddress,
            tokenId,
            amount,
            message
        };
        const _sendTxBlock = await this._client.buildinTxBlock.asyncSendTx(reqBlock);
        return this._sendRawTx(_sendTxBlock, autoPow, usePledgeQuota);
    }

    async receiveTx(fromBlockHash, autoPow?, usePledgeQuota?) {
        const reqBlock: receiveTxBlock = {
            accountAddress: this.address,
            fromBlockHash
        };
        const _receiveTxBlock = await this._client.buildinTxBlock.asyncReceiveTx(reqBlock);
        return this._sendRawTx(_receiveTxBlock, autoPow, usePledgeQuota);
    }

    async SBPreg({ nodeName, toAddress, amount, tokenId = Vite_TokenId }, autoPow?, usePledgeQuota?) {
        const reqBlock: SBPregBlock = {
            accountAddress: this.address,
            nodeName,
            toAddress,
            amount,
            tokenId
        };
        const _SBPregBlock = await this._client.buildinTxBlock.SBPreg(reqBlock);
        return this._sendRawTx(_SBPregBlock, autoPow, usePledgeQuota);
    }

    async updateReg({ nodeName, toAddress, tokenId = Vite_TokenId }, autoPow?, usePledgeQuota?) {
        const reqBlock: block8 = {
            accountAddress: this.address,
            nodeName,
            toAddress,
            tokenId
        };
        const _updateRegBlock = await this._client.buildinTxBlock.updateReg(reqBlock);
        return this._sendRawTx(_updateRegBlock, autoPow, usePledgeQuota);
    }

    async revokeReg({ nodeName, tokenId = Vite_TokenId }, autoPow?, usePledgeQuota?) {
        const reqBlock: block7 = {
            accountAddress: this.address,
            nodeName,
            tokenId
        };
        const _revokeRegBlock = await this._client.buildinTxBlock.revokeReg(reqBlock);
        return this._sendRawTx(_revokeRegBlock, autoPow, usePledgeQuota);
    }

    async retrieveReward({ nodeName, toAddress, tokenId }, autoPow?, usePledgeQuota?) {
        const reqBlock: block8 = {
            accountAddress: this.address,
            nodeName,
            toAddress,
            tokenId
        };
        const _retrieveRewardBlock = await this._client.buildinTxBlock.retrieveReward(reqBlock);
        return this._sendRawTx(_retrieveRewardBlock, autoPow, usePledgeQuota);
    }

    async voting({ nodeName, tokenId = Vite_TokenId }, autoPow?, usePledgeQuota?) {
        const reqBlock: block7 = {
            accountAddress: this.address,
            nodeName,
            tokenId
        };
        const _votingBlock = await this._client.buildinTxBlock.voting(reqBlock);
        return this._sendRawTx(_votingBlock, autoPow, usePledgeQuota);
    }

    async revokeVoting({ tokenId = Vite_TokenId } = { tokenId: Vite_TokenId }, autoPow?, usePledgeQuota?) {
        const reqBlock: revokeVotingBlock = {
            accountAddress: this.address,
            tokenId
        };
        const _revokeVotingBlock = await this._client.buildinTxBlock.revokeVoting(reqBlock);
        return this._sendRawTx(_revokeVotingBlock, autoPow, usePledgeQuota);
    }

    async getQuota({ toAddress, tokenId, amount }, autoPow?, usePledgeQuota?) {
        const reqBlock: quotaBlock = {
            accountAddress: this.address,
            toAddress,
            tokenId,
            amount
        };
        const _getQuotaBlock = await this._client.buildinTxBlock.getQuota(reqBlock);
        return this._sendRawTx(_getQuotaBlock, autoPow, usePledgeQuota);
    }

    async withdrawalOfQuota({ toAddress, tokenId, amount }, autoPow?, usePledgeQuota?) {
        const reqBlock: quotaBlock = {
            accountAddress: this.address,
            toAddress,
            tokenId,
            amount
        };
        const _withdrawalOfQuotaBlock = await this._client.buildinTxBlock.withdrawalOfQuota(reqBlock);
        return this._sendRawTx(_withdrawalOfQuotaBlock, autoPow, usePledgeQuota);
    }

    async createContract({ hexCode, abi, params, confirmTimes, amount, fee = '10000000000000000000' }, autoPow?, usePledgeQuota?) {
        const _createContractBlock = await this._client.buildinTxBlock.createContract({
            accountAddress: this.address,
            hexCode,
            abi,
            params,
            confirmTimes,
            amount,
            fee
        });
        return this._sendRawTx(_createContractBlock, autoPow, usePledgeQuota);
    }

    async callContract({ toAddress, abi, params, methodName, tokenId, amount }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.callContract({
            accountAddress: this.address,
            toAddress,
            abi,
            params,
            methodName,
            tokenId,
            amount
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async mintage({ feeType = 'burn', tokenName, isReIssuable, maxSupply, ownerBurnOnly, totalSupply, decimals, tokenSymbol }, autoPow?, usePledgeQuota?) {
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
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async mintageCancelPledge({ tokenId }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.mintageCancelPledge({
            accountAddress: this.address,
            tokenId
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async mintageIssue({ tokenId, amount, beneficial }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.mintageIssue({
            accountAddress: this.address,
            tokenId,
            amount,
            beneficial
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async mintageBurn({ amount, tokenId }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.mintageBurn({
            accountAddress: this.address,
            amount,
            tokenId
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async changeTokenType({ tokenId }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.changeTokenType({
            accountAddress: this.address,
            tokenId
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async changeTransferOwner({ ownerAddress, tokenId }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.changeTransferOwner({
            accountAddress: this.address,
            tokenId,
            ownerAddress
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async dexFundUserDeposit({ tokenId, amount }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.dexFundUserDeposit({
            accountAddress: this.address,
            tokenId,
            amount
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async dexFundUserWithdraw({ tokenId, amount }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.dexFundUserDeposit({
            accountAddress: this.address,
            tokenId,
            amount
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async dexTradeCancelOrder({ orderId, tradeToken, side, quoteToken }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.dexTradeCancelOrder({
            accountAddress: this.address,
            orderId,
            tradeToken,
            side,
            quoteToken
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async dexFundNewOrder({ tradeToken, quoteToken, side, price, quantity }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.dexFundNewOrder({
            accountAddress: this.address,
            tradeToken,
            quoteToken,
            side,
            price,
            quantity
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    async dexFundNewMarket({ tokenId, amount, tradeToken, quoteToken }, autoPow?, usePledgeQuota?) {
        const _callContractBlock = await this._client.buildinTxBlock.dexFundNewMarket({
            accountAddress: this.address,
            tokenId,
            amount,
            tradeToken,
            quoteToken
        });
        return this._sendRawTx(_callContractBlock, autoPow, usePledgeQuota);
    }

    private _sendRawTx(accountBlock, autoPow?, usePledgeQuota?) {
        const _autoPow = autoPow === true || autoPow === false ? autoPow : !!this.autoPow;

        if (!_autoPow) {
            return this.sendRawTx(accountBlock);
        }

        return this.sendAutoPowRawTx(accountBlock, usePledgeQuota);
    }
}

export default Account;
