import { paramsMissing } from 'const/error';
import { Hex, Address, SBPregBlock, block8, block7, revokeVotingBlock, quotaBlock, sendTxBlock, receiveTxBlock } from "const/type";
import { checkParams } from "utils/tools";
import { sign, getPublicKey } from "utils/ed25519";
import { privToAddr } from 'utils/address';
import client from 'client';

class Account {
    address: Address
    realAddress: string
    privateKey: Hex
    publicKey: Hex
    selfScryptsy: Function
    _client: client
    _lock: Boolean
    _autoReceive: Boolean
    balance

    constructor({ privateKey, client }: {
        privateKey?: Hex | Buffer, client: client
    }) {
        if (!client) {
            console.error(new Error(`${paramsMissing.message} Client.`));
            return;
        }

        if (!privateKey) {
            console.error(new Error(`${paramsMissing.message} PrivateKey or keystore.`));
            return;
        }
        
        if (privateKey) {
            let {
                addr, pubKey, privKey, hexAddr
            } = privToAddr.newHexAddr(privateKey);
            this.privateKey = privKey;
            this.publicKey = pubKey;
            this.address = hexAddr;
            this.realAddress = addr;
        }

        this._client = client;
        this._lock = true;
        this._autoReceive = false;
        this.balance = null;
    }

    getPublicKey() {
        if (this.publicKey) {
            return this.publicKey;
        }
        let privKey = Buffer.from(this.privateKey, 'hex');
        return getPublicKey(privKey);
    }

    sign(hexStr: Hex) {
        let privKey = Buffer.from(this.privateKey, 'hex');
        return sign(hexStr, privKey);
    }

    activate(intervals:number = 2000, receiveFailAction:Function = null) {
        if (!this._lock) {
            return;
        }

        this._lock = false;

        let loop = () => {
            if (this._lock) {
                return;
            }

            let _t = () => {
                let loopTimeout = setTimeout(() => {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                    loop();
                }, intervals);
            }

            this.getBalance().then(() => {
                console.log(this.balance);

                let onroad = this.balance && this.balance.onroad ? this.balance.onroad : null;
                let balanceInfos = onroad && onroad.tokenBalanceInfoMap ? onroad.tokenBalanceInfoMap : null;

                if (balanceInfos) {
                    for (let tokenId in balanceInfos) {
                        if ( +balanceInfos[tokenId].totalAmount)  {
                            this.autoReceiveTx(intervals, receiveFailAction);
                            _t();
                            return;
                        }
                    }
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

    autoReceiveTx(intervals:number = 2000, receiveFailAction:Function = null) {
        console.log()
        if (this._autoReceive) {
            return;
        }

        this._autoReceive = true;

        let _receive = async () => {
            const result = await this._client.onroad.getOnroadBlocksByAddress(this.address, 0, 1)
            if (!result || !result.length) {
                return null;
            }
            let fromBlockHash = result[0].hash;
            
            try {
                const data = await this.receiveTx({ fromBlockHash });
                return data;
            } catch(err) {
                if (!receiveFailAction) {
                    return Promise.reject(err);
                }
                return receiveFailAction(err);
            }
        };

        let loop = () => {
            if (!this._autoReceive) {
                return;
            }

            let _t = () => {
                let loopTimeout = setTimeout(() => {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                    loop();
                }, intervals);
            }

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

    getBalance() {
        return this._client.buildinLedger.getBalance(this.address).then((balance) => {
            this.balance = balance;
            return balance;
        });
    }

    sendRawTx(accountBlock) {
        checkParams({ accountBlock }, ['accountBlock'], [{
            name: 'accountBlock',
            func: (_a) => {
                return !_a.accountAddress || (_a.accountAddress === this.address);
            },
            msg: 'AccountAddress is wrong.'
        }]);

        accountBlock.accountAddress = this.address;
        return this._client.buildinLedger.sendRawTx(accountBlock, this.privateKey);
    }

    async sendTx({
        toAddress, tokenId, amount, message
    }) {
        let reqBlock: sendTxBlock = {
            accountAddress: this.address, 
            toAddress, tokenId, amount, message
        };
        const _sendTxBlock = await this._client.buildinTxBlock.asyncSendTx(reqBlock);
        return this._client.buildinLedger.sendRawTx(_sendTxBlock, this.privateKey);
    }

    async receiveTx({
        fromBlockHash
    }) {
        let reqBlock: receiveTxBlock = {
            accountAddress: this.address, 
            fromBlockHash
        };
        const _receiveTxBlock = await this._client.buildinTxBlock.asyncReceiveTx(reqBlock);
        return this._client.buildinLedger.sendRawTx(_receiveTxBlock, this.privateKey);
    }

    async SBPreg({
        nodeName, toAddress, amount, tokenId
    }) {
        let reqBlock: SBPregBlock = {
            accountAddress: this.address, 
            nodeName, toAddress, amount, tokenId
        };
        const _SBPregBlock = await this._client.buildinTxBlock.SBPreg(reqBlock);
        return this._client.buildinLedger.sendRawTx(_SBPregBlock, this.privateKey);
    }

    async updateReg({
        nodeName, toAddress, tokenId
    }) {
        let reqBlock: block8 = {
            accountAddress: this.address, 
            nodeName, toAddress, tokenId
        };
        const _updateRegBlock = await this._client.buildinTxBlock.updateReg(reqBlock);
        return this._client.buildinLedger.sendRawTx(_updateRegBlock, this.privateKey);

    }

    async revokeReg({
        nodeName, tokenId
    }) {
        let reqBlock: block7 = {
            accountAddress: this.address, 
            nodeName, tokenId
        };
        const _revokeRegBlock = await this._client.buildinTxBlock.revokeReg(reqBlock);
        return this._client.buildinLedger.sendRawTx(_revokeRegBlock, this.privateKey);
    }

    async retrieveReward({
        nodeName, toAddress, tokenId
    }) {
        let reqBlock: block8 = {
            accountAddress: this.address, 
            nodeName, toAddress, tokenId
        };
        const _retrieveRewardBlock = await this._client.buildinTxBlock.retrieveReward(reqBlock);
        return this._client.buildinLedger.sendRawTx(_retrieveRewardBlock, this.privateKey);
    }

    async voting({
        nodeName, tokenId
    }) {
        let reqBlock: block7 = {
            accountAddress: this.address, 
            nodeName, tokenId
        };
        const _votingBlock = await this._client.buildinTxBlock.voting(reqBlock);
        return this._client.buildinLedger.sendRawTx(_votingBlock, this.privateKey);
    }

    async revokeVoting({
        tokenId
    }) {
        let reqBlock: revokeVotingBlock = {
            accountAddress: this.address, 
            tokenId
        };
        const _revokeVotingBlock = await this._client.buildinTxBlock.revokeVoting(reqBlock);
        return this._client.buildinLedger.sendRawTx(_revokeVotingBlock, this.privateKey);
    }

    async getQuota({
        toAddress, tokenId, amount
    }) {
        let reqBlock: quotaBlock = {
            accountAddress: this.address, 
            toAddress, tokenId, amount
        };
        const _getQuotaBlock = await this._client.buildinTxBlock.getQuota(reqBlock);
        return this._client.buildinLedger.sendRawTx(_getQuotaBlock, this.privateKey);
    }

    async withdrawalOfQuota({
        toAddress, tokenId, amount
    }) {
        let reqBlock: quotaBlock = {
            accountAddress: this.address, 
            toAddress, tokenId, amount
        };
        const _withdrawalOfQuotaBlock = await this._client.buildinTxBlock.getQuota(reqBlock);
        return this._client.buildinLedger.sendRawTx(_withdrawalOfQuotaBlock, this.privateKey);
    }
}

export default Account;
