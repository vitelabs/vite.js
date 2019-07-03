import {
    methods, Vite_TokenId, Snapshot_Gid,
    Pledge_Addr, Vote_Addr, Register_Addr, Mintage_Addr, DexFund_Addr, DexTrade_Addr,
    Register_Abi, UpdateRegistration_Abi, CancelRegister_Abi,
    Reward_Abi, Vote_Abi, CancelVote_Abi, Pledge_Abi, CancelPledge_Abi,
    Mint_Abi, Issue_Abi, Burn_Abi, ChangeTokenType_Abi, TransferOwner_Abi,
    DexFundUserDeposit_Abi, DexFundUserWithdraw_Abi, DexTradeCancelOrder_Abi, DexFundNewOrder_Abi, DexFundNewMarket_Abi,
    DexFundConfigMineMarket_Abi, DexFundPledgeForVx_Abi, DexFundPledgeForVip_Abi
} from '~@vite/vitejs-constant';
import { checkParams, validNodeName, blake2bHex } from '~@vite/vitejs-utils';
import { getAccountBlock, getSendTxBlock, getReceiveTxBlock } from '~@vite/vitejs-accountblock';
import { formatAccountBlock, isAccountBlock, getCreateContractData } from '~@vite/vitejs-accountblock/builtin';
import { encodeFunctionCall } from '~@vite/vitejs-abi';
import { getAddrFromHexAddr } from  '~@vite/vitejs-privtoaddr';

import {
    SBPregBlock, block8, block7, revokeVotingBlock, quotaBlock,
    sendTxBlock, receiveTxBlock, formatBlock,
    createContractBlock, callContractBlock,
    mintageBlock, mintageIssueBlock, mintageBurnBlock, changeTokenTypeBlock, changeTransferOwnerBlock
} from './type';
import client from './index';

const ledger = methods.ledger;

export default class Tx {
    _client: client

    constructor(client) {
        this._client = client;
    }

    getAccountBlock(block) {
        return getAccountBlock(block);
    }

    getReceiveTxBlock(block) {
        return getReceiveTxBlock(block);
    }

    getSendTxBlock(block) {
        return getSendTxBlock(block);
    }

    async asyncAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, height, prevHash, toAddress, tokenId = Vite_TokenId, amount, fee }: formatBlock) {
        const err = isAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, toAddress, amount });
        if (err) {
            throw err;
        }

        if (!height || !prevHash) {
            const latestBlock = await this._client.request(ledger.getLatestBlock, accountAddress);
            height = latestBlock && latestBlock.height ? latestBlock.height : '';
            prevHash = latestBlock && latestBlock.hash ? latestBlock.hash : '';
        }

        return formatAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, height, prevHash, toAddress, tokenId, amount, fee });
    }

    async pow(accountBlock: formatBlock, difficulty) {
        const realAddr = getAddrFromHexAddr(accountBlock.accountAddress);
        const rawHashBytes = Buffer.from(realAddr + accountBlock.prevHash, 'hex');
        const hash = blake2bHex(rawHashBytes, null, 32);

        const nonce = await this._client.pow.getPowNonce(difficulty, hash);

        const _accountBlock = Object.assign({}, accountBlock, { nonce, difficulty });
        return _accountBlock;
    }

    async autoPow(accountBlock: formatBlock, usePledgeQuota) {
        const data = await this._client.tx.calcPoWDifficulty({
            selfAddr: accountBlock.accountAddress,
            prevHash: accountBlock.prevHash,
            blockType: accountBlock.blockType,
            toAddr: accountBlock.toAddress,
            data: accountBlock.data,
            usePledgeQuota
        });

        if (!data.difficulty) {
            return {
                accountBlock,
                ...data
            };
        }

        const block = await this.pow(accountBlock, data.difficulty);
        return {
            accountBlock: block,
            ...data
        };
    }

    asyncSendTx({ accountAddress, toAddress, tokenId, amount, message, data, height, prevHash }: sendTxBlock) {
        const err = checkParams({ toAddress, tokenId, amount }, [ 'toAddress', 'tokenId', 'amount' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.asyncAccountBlock({
            blockType: 2,
            accountAddress,
            toAddress,
            tokenId,
            amount,
            message,
            data,
            height,
            prevHash
        });
    }

    asyncReceiveTx({ accountAddress, fromBlockHash, height, prevHash }: receiveTxBlock) {
        const err = checkParams({ fromBlockHash }, ['fromBlockHash']);
        if (err) {
            return Promise.reject(err);
        }

        return this.asyncAccountBlock({
            blockType: 4,
            fromBlockHash,
            accountAddress,
            height,
            prevHash
        });
    }

    async createContract({ accountAddress, tokenId = Vite_TokenId, amount = '0', fee = '10000000000000000000', confirmTime = '0', quotaRatio = '10', seedCount = '0', hexCode, abi, params, height, prevHash }: createContractBlock, requestType = 'async') {
        const err = checkParams({ hexCode, abi, tokenId, amount, fee, confirmTime, requestType, quotaRatio, seedCount }, [ 'hexCode', 'abi', 'tokenId', 'amount', 'fee', 'confirmTime', 'quotaRatio', 'seedCount' ],
            [ {
                name: 'confirmTime',
                func: _c => Number(_c) >= 0 && Number(_c) <= 75
            }, {
                name: 'quotaRatio',
                func: _c => Number(_c) >= 10 && Number(_c) <= 100
            }, {
                name: 'seedCount',
                func: _c => Number(_c) >= 0 && Number(_c) <= 75
            }, {
                name: 'requestType',
                func: validReqType
            } ]);
        if (err) {
            throw err;
        }

        const block = requestType === 'async'
            ? await this.asyncAccountBlock({ blockType: 1, accountAddress, height, prevHash, tokenId, amount, fee })
            : getAccountBlock({ blockType: 1, accountAddress, height, prevHash, tokenId, amount, fee });

        const toAddress = await this._client.contract.getCreateContractToAddress(accountAddress, block.height, block.prevHash);
        const data = getCreateContractData({ abi, hexCode, params, confirmTime, quotaRatio, seedCount });

        block.toAddress = toAddress;
        block.data = data;

        return block;
    }

    async callContract({ accountAddress, toAddress, tokenId = Vite_TokenId, amount = '0', abi, methodName, params = [], fee, height, prevHash }: callContractBlock, requestType = 'async') {
        const err = checkParams({ toAddress, abi, requestType }, [ 'toAddress', 'abi', 'requestType' ], [{
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            throw err;
        }

        const data = encodeFunctionCall(abi, params, methodName);
        const item = {
            blockType: 2,
            accountAddress,
            toAddress,
            data: Buffer.from(data, 'hex').toString('base64'),
            height,
            fee,
            prevHash,
            tokenId,
            amount
        };

        if (requestType === 'sync') {
            return getAccountBlock(item);
        }

        return this.asyncAccountBlock(item);
    }

    async SBPreg({ accountAddress, nodeName, toAddress, amount, tokenId = Vite_TokenId, height, prevHash }: SBPregBlock, requestType = 'async') {
        const err = checkParams({ toAddress, nodeName, tokenId, amount }, [ 'toAddress', 'nodeName', 'tokenId', 'amount' ], [{
            name: 'nodeName',
            func: validNodeName
        }]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            abi: Register_Abi,
            toAddress: Register_Addr,
            params: [ Snapshot_Gid, nodeName, toAddress ],
            tokenId,
            amount,
            height,
            prevHash
        }, requestType);
    }

    async updateReg({ accountAddress, nodeName, toAddress, tokenId = Vite_TokenId, height, prevHash }: block8, requestType = 'async') {
        const err = checkParams({ toAddress, nodeName, tokenId }, [ 'toAddress', 'nodeName', 'tokenId' ], [{
            name: 'nodeName',
            func: validNodeName
        }]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            abi: UpdateRegistration_Abi,
            toAddress: Register_Addr,
            params: [ Snapshot_Gid, nodeName, toAddress ],
            tokenId,
            height,
            prevHash
        }, requestType);
    }

    async revokeReg({ accountAddress, nodeName, tokenId = Vite_TokenId, height, prevHash }: block7, requestType = 'async') {
        const err = checkParams({ nodeName, tokenId }, [ 'nodeName', 'tokenId' ], [{
            name: 'nodeName',
            func: validNodeName
        }]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            abi: CancelRegister_Abi,
            toAddress: Register_Addr,
            params: [ Snapshot_Gid, nodeName ],
            tokenId,
            height,
            prevHash
        }, requestType);
    }

    async retrieveReward({ accountAddress, nodeName, toAddress, tokenId = Vite_TokenId, height, prevHash }: block8, requestType = 'async') {
        const err = checkParams({ toAddress, nodeName, tokenId }, [ 'toAddress', 'nodeName', 'tokenId' ], [{
            name: 'nodeName',
            func: validNodeName
        }]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            abi: Reward_Abi,
            toAddress: Register_Addr,
            params: [ Snapshot_Gid, nodeName, toAddress ],
            tokenId,
            height,
            prevHash
        }, requestType);
    }

    async voting({ accountAddress, nodeName, tokenId = Vite_TokenId, height, prevHash }: block7, requestType = 'async') {
        const err = checkParams({ nodeName, tokenId }, [ 'nodeName', 'tokenId' ], [{
            name: 'nodeName',
            func: validNodeName
        }]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            abi: Vote_Abi,
            toAddress: Vote_Addr,
            params: [ Snapshot_Gid, nodeName ],
            tokenId,
            height,
            prevHash
        }, requestType);
    }

    async revokeVoting({ accountAddress, tokenId = Vite_TokenId, height, prevHash }: revokeVotingBlock, requestType = 'async') {
        const err = checkParams({ tokenId }, ['tokenId']);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            abi: CancelVote_Abi,
            toAddress: Vote_Addr,
            params: [Snapshot_Gid],
            tokenId,
            height,
            prevHash
        }, requestType);
    }

    async getQuota({ accountAddress, toAddress, tokenId = Vite_TokenId, amount, height, prevHash }: quotaBlock, requestType = 'async') {
        const err = checkParams({ toAddress, tokenId, amount }, [ 'toAddress', 'tokenId', 'amount' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: Pledge_Abi,
            toAddress: Pledge_Addr,
            params: [toAddress],
            accountAddress,
            tokenId,
            height,
            prevHash,
            amount
        }, requestType);
    }

    async withdrawalOfQuota({ accountAddress, toAddress, tokenId = Vite_TokenId, amount, height, prevHash }: quotaBlock, requestType = 'async') {
        const err = checkParams({ toAddress, tokenId, amount }, [ 'toAddress', 'tokenId', 'amount' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: CancelPledge_Abi,
            toAddress: Pledge_Addr,
            params: [ toAddress, amount ],
            accountAddress,
            tokenId,
            height,
            prevHash
        }, requestType);
    }

    async mintage({ accountAddress, tokenName, isReIssuable, maxSupply, ownerBurnOnly, totalSupply, decimals, tokenSymbol, height, prevHash }: mintageBlock, requestType = 'async') {
        const err = checkParams({ tokenName, isReIssuable, maxSupply, ownerBurnOnly, totalSupply, decimals, tokenSymbol },
            [ 'tokenName', 'isReIssuable', 'maxSupply', 'ownerBurnOnly', 'totalSupply', 'decimals', 'tokenSymbol' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: Mint_Abi,
            toAddress: Mintage_Addr,
            params: [ isReIssuable, tokenName, tokenSymbol, totalSupply, decimals, maxSupply, ownerBurnOnly ],
            accountAddress,
            height,
            prevHash,
            fee: '1000000000000000000000'
        }, requestType);
    }

    async mintageIssue({ accountAddress, tokenId, amount, beneficial, height, prevHash }: mintageIssueBlock, requestType = 'async') {
        const err = checkParams({ tokenId, amount, beneficial }, [ 'tokenId', 'amount', 'beneficial' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: Issue_Abi,
            toAddress: Mintage_Addr,
            params: [ tokenId, amount, beneficial ],
            accountAddress,
            amount: '0',
            height,
            prevHash
        }, requestType);
    }

    async mintageBurn({ accountAddress, tokenId, amount, height, prevHash }: mintageBurnBlock, requestType = 'async') {
        const err = checkParams({ amount }, ['amount']);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: Burn_Abi,
            toAddress: Mintage_Addr,
            fee: '0',
            amount,
            tokenId,
            accountAddress,
            height,
            prevHash
        }, requestType);
    }

    async changeTokenType({ accountAddress, tokenId, height, prevHash }: changeTokenTypeBlock, requestType = 'async') {
        return this.callContract({
            abi: ChangeTokenType_Abi,
            params: [tokenId],
            toAddress: Mintage_Addr,
            accountAddress,
            height,
            prevHash
        }, requestType);
    }

    async changeTransferOwner({ accountAddress, newOwner, tokenId, height, prevHash }: changeTransferOwnerBlock, requestType = 'async') {
        const err = checkParams({ tokenId, newOwner }, [ 'tokenId', 'newOwner' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: TransferOwner_Abi,
            toAddress: Mintage_Addr,
            params: [ tokenId, newOwner ],
            accountAddress,
            height,
            prevHash
        }, requestType);
    }

    async dexFundUserDeposit({ accountAddress, tokenId, amount }, requestType = 'async') {
        return this.callContract({
            accountAddress,
            toAddress: DexFund_Addr,
            abi: DexFundUserDeposit_Abi,
            tokenId,
            amount,
            params: []
        }, requestType);
    }

    async dexFundUserWithdraw({ accountAddress, tokenId, amount }, requestType = 'async') {
        return this.callContract({
            accountAddress,
            toAddress: DexFund_Addr,
            abi: DexFundUserWithdraw_Abi,
            params: [ tokenId, amount ],
            tokenId,
            amount: '0'
        }, requestType);
    }

    async dexTradeCancelOrder({ accountAddress, orderId, tradeToken }, requestType = 'async') {
        return this.callContract({
            accountAddress,
            tokenId: tradeToken,
            toAddress: DexTrade_Addr,
            abi: DexTradeCancelOrder_Abi,
            params: [`0x${ Buffer.from(orderId, 'base64').toString('hex') }`]
        }, requestType);
    }

    async dexFundNewOrder({ accountAddress, tradeToken, quoteToken, side, price, quantity }, requestType = 'async') {
        const err = checkParams({ tradeToken, quoteToken, side, price, quantity },
            [ 'tradeToken', 'quoteToken', 'side', 'price', 'quantity' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            toAddress: DexFund_Addr,
            abi: DexFundNewOrder_Abi,
            params: [ tradeToken, quoteToken, side, 0, price, quantity ],
            tokenId: tradeToken
        }, requestType);
    }

    async dexFundNewMarket({ accountAddress, tokenId = Vite_TokenId, amount, tradeToken, quoteToken }, requestType = 'async') {
        const err = checkParams({ tradeToken, quoteToken }, [ 'tradeToken', 'quoteToken' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            toAddress: DexFund_Addr,
            abi: DexFundNewMarket_Abi,
            params: [ tradeToken, quoteToken ],
            tokenId,
            amount
        }, requestType);
    }

    async dexFundConfigMineMarket({ accountAddress, tokenId = Vite_TokenId, amount, allowMine, tradeToken, quoteToken }, requestType = 'async') {
        const err = checkParams({ allowMine, tradeToken, quoteToken }, [ 'allowMine', 'tradeToken', 'quoteToken' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            toAddress: DexFund_Addr,
            abi: DexFundConfigMineMarket_Abi,
            params: [ allowMine, tradeToken, quoteToken ],
            tokenId,
            amount
        }, requestType);
    }

    async dexFundPledgeForVx({ accountAddress, tokenId = Vite_TokenId, actionType, amount }, requestType = 'async') {
        const err = checkParams({ actionType, amount }, [ 'actionType', 'amount' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            toAddress: DexFund_Addr,
            abi: DexFundPledgeForVx_Abi,
            params: [ actionType, amount ],
            tokenId
        }, requestType);
    }

    async dexFundPledgeForVip({ accountAddress, actionType, tokenId = Vite_TokenId, amount }, requestType = 'async') {
        const err = checkParams({ actionType, amount }, [ 'actionType', 'amount' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            accountAddress,
            toAddress: DexFund_Addr,
            abi: DexFundPledgeForVip_Abi,
            params: [actionType],
            tokenId,
            amount
        }, requestType);
    }
}

function validReqType(type) {
    return type === 'async' || type === 'sync';
}
