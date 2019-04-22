import {
    methods, Vite_TokenId, Snapshot_Gid,
    Pledge_Addr, Vote_Addr, Register_Addr, Mintage_Addr, DexFund_Addr, DexTrade_Addr,
    Register_Abi, UpdateRegistration_Abi, CancelRegister_Abi,
    Reward_Abi, Vote_Abi, CancelVote_Abi, Pledge_Abi, CancelPledge_Abi,
    Mint_Abi, Issue_Abi, Burn_Abi, ChangeTokenType_Abi, TransferOwner_Abi, CancelMintPledge_Abi,
    DexFundUserDeposit_Abi, DexFundUserWithdraw_Abi, DexTradeCancelOrder_Abi, DexFundNewOrder_Abi, DexFundNewMarket_Abi
} from '~@vite/vitejs-constant';
import { checkParams, validNodeName } from '~@vite/vitejs-utils';
import {
    getAccountBlock as _getAccountBlock,
    getSendTxBlock,
    getReceiveTxBlock,
    validReqAccountBlock,
    formatAccountBlock,
    getCreateContractData
} from '~@vite/vitejs-accountblock';
import { encodeFunctionCall } from '~@vite/vitejs-abi';
import { newHexAddr } from  '~@vite/vitejs-privtoaddr';

import {
    SBPregBlock, block8, block7, revokeVotingBlock, quotaBlock,
    sendTxBlock, receiveTxBlock, formatBlock,
    createContractBlock, callContractBlock,
    mintageBlock, mintageIssueBlock, mintageBurnBlock, changeTokenTypeBlock, changeTransferOwnerBlock
} from '../type';
import client from '.';

const ledger = methods.ledger;

export default class Tx {
    _client: client
    getAccountBlock: {
        sync: Function;
        async: Function;
    }

    receiveTx: {
        sync: Function;
        async: Function;
    }

    sendTx: {
        sync: Function;
        async: Function;
    }

    constructor(client) {
        this._client = client;

        this.getAccountBlock = {
            sync: _getAccountBlock,
            async: this.asyncAccountBlock.bind(this)
        };
        this.receiveTx = {
            sync: getReceiveTxBlock,
            async: this.asyncReceiveTx.bind(this)
        };
        this.sendTx = {
            sync: getSendTxBlock,
            async: this.asyncSendTx.bind(this)
        };
    }

    async asyncAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, height, prevHash, toAddress, tokenId = Vite_TokenId, amount, fee }: formatBlock) {
        const reject = (error, errMsg = '') => {
            const message = `${ error.msg } ${ errMsg }`;
            return Promise.reject({
                code: error.code,
                message
            });
        };

        const err = validReqAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, toAddress, amount });

        if (err) {
            return reject(err);
        }

        const latestBlock = await this._client.request(ledger.getLatestBlock, accountAddress);
        height = latestBlock && latestBlock.height ? latestBlock.height : '';
        prevHash = latestBlock && latestBlock.hash ? latestBlock.hash : '';

        return formatAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, height, prevHash, toAddress, tokenId, amount, fee });
    }

    asyncSendTx({ accountAddress, toAddress, tokenId, amount, message, height, prevHash }: sendTxBlock) {
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

    async createContract({ accountAddress, tokenId, amount, fee, hexCode, abi, params, height, prevHash, confirmTimes = 0 }: createContractBlock, requestType = 'async') {
        const err = checkParams({ hexCode, abi, tokenId, amount, fee, confirmTimes }, [ 'hexCode', 'abi', 'tokenId', 'amount', 'fee', 'confirmTimes' ], [{
            name: 'confirmTimes',
            func: _c => _c >= 0 && _c <= 75
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const block = requestType === 'async'
            ? await this.asyncAccountBlock({ blockType: 1, accountAddress, height, prevHash, tokenId, amount, fee })
            : _getAccountBlock({ blockType: 1, accountAddress, height, prevHash, tokenId, amount, fee });

        const toAddress = await this._client.contract.getCreateContractToAddress(accountAddress, block.height, block.prevHash);
        const data = getCreateContractData({ abi, hexCode, params, confirmTimes });

        block.toAddress = toAddress;
        block.data = data;

        return block;
    }

    async callContract({ accountAddress, toAddress, tokenId = Vite_TokenId, amount, abi, methodName, params = [], fee, height, prevHash }: callContractBlock, requestType = 'async') {
        const err = checkParams({ toAddress, abi, requestType }, [ 'toAddress', 'abi', 'requestType' ], [{
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const data = encodeFunctionCall(abi, params, methodName);
        return this[`${ requestType }AccountBlock`]({
            blockType: 2,
            accountAddress,
            toAddress,
            data: Buffer.from(data, 'hex').toString('base64'),
            height,
            fee,
            prevHash,
            tokenId,
            amount
        });
    }

    async SBPreg({ accountAddress, nodeName, toAddress, amount, tokenId, height, prevHash }: SBPregBlock, requestType = 'async') {
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

    async updateReg({ accountAddress, nodeName, toAddress, tokenId, height, prevHash }: block8, requestType = 'async') {
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

    async revokeReg({ accountAddress, nodeName, tokenId, height, prevHash }: block7, requestType = 'async') {
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

    async retrieveReward({ accountAddress, nodeName, toAddress, tokenId, height, prevHash }: block8, requestType = 'async') {
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

    async voting({ accountAddress, nodeName, tokenId, height, prevHash }: block7, requestType = 'async') {
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

    async revokeVoting({ accountAddress, tokenId, height, prevHash }: revokeVotingBlock, requestType = 'async') {
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

    async getQuota({ accountAddress, toAddress, tokenId, amount, height, prevHash }: quotaBlock, requestType = 'async') {
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

    async withdrawalOfQuota({ accountAddress, toAddress, tokenId, amount, height, prevHash }: quotaBlock, requestType = 'async') {
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

    async mintage({ accountAddress, feeType = 'burn', tokenName, isReIssuable, maxSupply, ownerBurnOnly, totalSupply, decimals, tokenSymbol, height, prevHash }: mintageBlock, requestType = 'async') {
        const err = checkParams({ tokenName, isReIssuable, maxSupply, ownerBurnOnly, totalSupply, decimals, tokenSymbol, feeType },
            [ 'tokenName', 'isReIssuable', 'maxSupply', 'ownerBurnOnly', 'totalSupply', 'decimals', 'tokenSymbol' ],
            [{
                name: 'feeType',
                func: type => type === 'burn' || type === 'stake'
            }]);
        if (err) {
            return Promise.reject(err);
        }

        const spendAmount = '100000000000000000000000';
        const spendFee = '1000000000000000000000';
        feeType = feeType === 'burn' ? 'fee' : 'amount';

        const requestBlock = {
            abi: Mint_Abi,
            toAddress: Mintage_Addr,
            params: [ isReIssuable, tokenName, tokenSymbol, totalSupply, decimals, maxSupply, ownerBurnOnly ],
            accountAddress,
            height,
            prevHash
        };
        requestBlock[feeType] = feeType === 'fee' ? spendFee : spendAmount;

        return this.callContract(requestBlock, requestType);
    }

    async mintageCancelPledge({ accountAddress, tokenId, height, prevHash }: changeTokenTypeBlock, requestType = 'async') {
        const err = checkParams({ tokenId }, ['tokenId']);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: CancelMintPledge_Abi,
            params: [tokenId],
            toAddress: Mintage_Addr,
            accountAddress,
            height,
            prevHash
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

    async changeTransferOwner({ accountAddress, ownerAddress, tokenId, height, prevHash }: changeTransferOwnerBlock, requestType = 'async') {
        const err = checkParams({ tokenId, ownerAddress }, [ 'tokenId', 'ownerAddress' ]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: TransferOwner_Abi,
            toAddress: Mintage_Addr,
            params: [ tokenId, ownerAddress ],
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

    async dexTradeCancelOrder({ accountAddress, orderId, tradeToken, side, quoteToken }, requestType = 'async') {
        return this.callContract({
            accountAddress,
            tokenId: tradeToken,
            toAddress: DexTrade_Addr,
            abi: DexTradeCancelOrder_Abi,
            params: [ `0x${ Buffer.from(orderId, 'base64').toString('hex') }`, tradeToken, quoteToken, side ]
        }, requestType);
    }

    async dexFundNewOrder({ accountAddress, tradeToken, quoteToken, side, price, quantity }, requestType = 'async') {
        const err = checkParams({ tradeToken, quoteToken, side, price, quantity },
            [ 'tradeToken', 'quoteToken', 'side', 'price', 'quantity' ]);
        if (err) {
            return Promise.reject(err);
        }

        const orderId = getOrderId();

        return this.callContract({
            accountAddress,
            toAddress: DexFund_Addr,
            abi: DexFundNewOrder_Abi,
            params: [ `0x${ orderId }`, tradeToken, quoteToken, side, 0, price, quantity ],
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
}


function getOrderId() {
    return newHexAddr().addr;
}

function validReqType(type) {
    return type === 'async' || type === 'sync';
}
