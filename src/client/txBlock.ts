import {
    Vite_TokenId, Snapshot_Gid,
    Quota_Addr, Vote_Addr, Register_Addr, Mintage_Addr,
    Register_Abi, UpdateRegistration_Abi, CancelRegister_Abi,
    Reward_Abi, Vote_Abi, CancelVote_Abi, Pledge_Abi, CancelPledge_Abi,
    Mint_Abi, Issue_Abi, Burn_Abi, ChangeTokenType_Abi, TransferOwner_Abi, Mint_CancelPledge_Abi
} from '~@vite/vitejs-constant';
import { tools } from '~@vite/vitejs-utils';
import { no } from '~@vite/vitejs-error';
import {
    getAccountBlock as _getAccountBlock,
    getSendTxBlock,
    getReceiveTxBlock,
    validReqAccountBlock,
    formatAccountBlock,
    getCreateContractData
} from '~@vite/vitejs-accountblock';
import { encodeFunctionCall } from '~@vite/vitejs-abi';

import {
    SBPregBlock, block8, block7, revokeVotingBlock, quotaBlock,
    sendTxBlock, receiveTxBlock, formatBlock,
    createContractBlock, callContractBlock,
    mintageBlock, mintageIssueBlock, mintageBurnBlock, changeTokenTypeBlock, changeTransferOwnerBlock
} from '../type';
import client from '.';

const { checkParams, validNodeName } = tools;

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

    async asyncAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, toAddress, tokenId = Vite_TokenId, amount, fee }: formatBlock) {
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

        const requests = [];
        if (!height || !prevHash) {
            requests.push({
                methodName: 'ledger_getLatestBlock',
                params: [accountAddress]
            });
        }
        if (!snapshotHash) {
            requests.push({
                methodName: 'ledger_getFittestSnapshotHash',
                params: [ accountAddress, fromBlockHash ]
            });
        }

        if (!requests) {
            return reject(no);
        }

        const req = await this._client.batch(requests);
        let latestBlock;

        requests.forEach((_r, index) => {
            if (_r.methodName === 'ledger_getLatestBlock') {
                latestBlock = req[index].result;
                return;
            }
            snapshotHash = req[index].result;
        });

        height = latestBlock && latestBlock.height ? latestBlock.height : '';
        prevHash = latestBlock && latestBlock.hash ? latestBlock.hash : '';

        return formatAccountBlock({ blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, toAddress, tokenId, amount, fee });
    }

    async createContract({ accountAddress, tokenId, amount, fee, hexCode, abi, params, height, prevHash, snapshotHash }: createContractBlock, requestType = 'async') {
        const err = checkParams({ hexCode, abi, tokenId, amount, fee }, [ 'hexCode', 'abi', 'tokenId', 'amount', 'fee' ]);
        if (err) {
            return Promise.reject(err);
        }

        const block = requestType === 'async' ? await this.asyncAccountBlock({ blockType: 1, accountAddress, height, prevHash, snapshotHash, tokenId, amount, fee }) : _getAccountBlock({ blockType: 1, accountAddress, height, prevHash, snapshotHash, tokenId, amount, fee });

        const toAddress = await this._client.contract.getCreateContractToAddress(accountAddress, block.height, block.prevHash, block.snapshotHash);
        block.toAddress = toAddress;
        block.data = getCreateContractData({ abi, hexCode, params });
        return block;
    }

    async callContract({ accountAddress, toAddress, tokenId = Vite_TokenId, amount, abi, methodName, params = [], fee, height, prevHash, snapshotHash }: callContractBlock, requestType = 'async') {
        const err = checkParams({ toAddress, abi }, [ 'toAddress', 'abi' ]);
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
            snapshotHash,
            tokenId,
            amount
        });
    }

    async asyncSendTx({ accountAddress, toAddress, tokenId, amount, message, height, prevHash, snapshotHash }: sendTxBlock) {
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
            prevHash,
            snapshotHash
        });
    }

    async asyncReceiveTx({ accountAddress, fromBlockHash, height, prevHash, snapshotHash }: receiveTxBlock) {
        const err = checkParams({ fromBlockHash }, ['fromBlockHash']);
        if (err) {
            return Promise.reject(err);
        }

        return this.asyncAccountBlock({
            blockType: 4,
            fromBlockHash,
            accountAddress,
            height,
            prevHash,
            snapshotHash
        });
    }

    async SBPreg({ accountAddress, nodeName, toAddress, amount, tokenId, height, prevHash, snapshotHash }: SBPregBlock, requestType = 'async') {
        const err = checkParams({ toAddress, nodeName, tokenId, amount, requestType }, [ 'toAddress', 'nodeName', 'tokenId', 'amount' ], [ {
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        } ]);
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
            prevHash,
            snapshotHash
        }, requestType);
    }

    async updateReg({ accountAddress, nodeName, toAddress, tokenId, height, prevHash, snapshotHash }: block8, requestType = 'async') {
        const err = checkParams({ toAddress, nodeName, tokenId, requestType }, [ 'toAddress', 'nodeName', 'tokenId' ], [ {
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        } ]);
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
            prevHash,
            snapshotHash
        }, requestType);
    }

    async revokeReg({ accountAddress, nodeName, tokenId, height, prevHash, snapshotHash }: block7, requestType = 'async') {
        const err = checkParams({ nodeName, tokenId, requestType }, [ 'nodeName', 'tokenId' ], [ {
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        } ]);
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
            prevHash,
            snapshotHash
        }, requestType);
    }

    async retrieveReward({ accountAddress, nodeName, toAddress, tokenId, height, prevHash, snapshotHash }: block8, requestType = 'async') {
        const err = checkParams({ toAddress, nodeName, tokenId, requestType }, [ 'toAddress', 'nodeName', 'tokenId' ], [ {
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        } ]);
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
            prevHash,
            snapshotHash
        }, requestType);
    }

    async voting({ accountAddress, nodeName, tokenId, height, prevHash, snapshotHash }: block7, requestType = 'async') {
        const err = checkParams({ nodeName, tokenId, requestType }, [ 'nodeName', 'tokenId' ], [ {
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        } ]);
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
            prevHash,
            snapshotHash
        }, requestType);
    }

    async revokeVoting({ accountAddress, tokenId, height, prevHash, snapshotHash }: revokeVotingBlock, requestType = 'async') {
        const err = checkParams({ tokenId, requestType }, ['tokenId'], [{
            name: 'requestType',
            func: validReqType
        }]);
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
            prevHash,
            snapshotHash
        }, requestType);
    }

    async getQuota({ accountAddress, toAddress, tokenId, amount, height, prevHash, snapshotHash }: quotaBlock, requestType = 'async') {
        const err = checkParams({ toAddress, tokenId, amount, requestType }, [ 'toAddress', 'tokenId', 'amount' ], [{
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: Pledge_Abi,
            toAddress: Quota_Addr,
            params: [toAddress],
            accountAddress,
            tokenId,
            height,
            prevHash,
            snapshotHash,
            amount
        }, requestType);
    }

    async withdrawalOfQuota({ accountAddress, toAddress, tokenId, amount, height, prevHash, snapshotHash }: quotaBlock, requestType = 'async') {
        const err = checkParams({ toAddress, tokenId, amount, requestType }, [ 'toAddress', 'tokenId', 'amount' ], [{
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: CancelPledge_Abi,
            toAddress: Quota_Addr,
            params: [ toAddress, amount ],
            accountAddress,
            tokenId,
            height,
            prevHash,
            snapshotHash
        }, requestType);
    }

    async mintage({ accountAddress, feeType = 'burn', tokenName, isReIssuable, maxSupply, ownerBurnOnly, totalSupply, decimals, tokenSymbol, height, prevHash, snapshotHash }: mintageBlock, requestType = 'async') {
        const err = checkParams({ tokenName, isReIssuable, maxSupply, ownerBurnOnly, totalSupply, decimals, tokenSymbol, requestType, feeType },
            [ 'tokenName', 'isReIssuable', 'maxSupply', 'ownerBurnOnly', 'totalSupply', 'decimals', 'tokenSymbol' ],
            [ { name: 'requestType', func: validReqType },
                {
                    name: 'feeType',
                    func: type => type === 'burn' || type === 'stake'
                }
            ]);
        if (err) {
            return Promise.reject(err);
        }

        const spendAmount = '100000000000000000000000';
        const spendFee = '1000000000000000000000';
        feeType = feeType === 'burn' ? 'fee' : 'amount';

        const requestBlock = { blockType: 2, toAddress: Mintage_Addr, accountAddress, height, prevHash, snapshotHash };
        requestBlock[feeType] = feeType === 'fee' ? spendFee : spendAmount;
        const block = requestType === 'async' ? await this.asyncAccountBlock(requestBlock) : _getAccountBlock(requestBlock);

        const tokenId = await this._client.mintage.newTokenId({
            selfAddr: accountAddress,
            height: block.height,
            prevHash: block.prevHash,
            snapshotHash: block.snapshotHash
        });
        const data = encodeFunctionCall(Mint_Abi, [ isReIssuable, tokenId, tokenName, tokenSymbol, totalSupply, decimals, maxSupply, ownerBurnOnly ]);
        block.data = Buffer.from(data, 'hex').toString('base64');

        return block;
    }

    async mintageCancelPledge({ accountAddress, tokenId, height, prevHash, snapshotHash }: changeTokenTypeBlock, requestType = 'async') {
        const err = checkParams({ tokenId }, ['tokenId'], [{ name: 'requestType', func: validReqType }]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: Mint_CancelPledge_Abi,
            params: [tokenId],
            toAddress: Mintage_Addr,
            accountAddress,
            height,
            prevHash,
            snapshotHash
        }, requestType);
    }

    async mintageIssue({ accountAddress, tokenId, amount, beneficial, height, prevHash, snapshotHash }: mintageIssueBlock, requestType = 'async') {
        const err = checkParams({ tokenId, amount, beneficial, requestType },
            [ 'tokenId', 'amount', 'beneficial' ],
            [{
                name: 'requestType',
                func: validReqType
            }]);
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
            prevHash,
            snapshotHash
        }, requestType);
    }

    async mintageBurn({ accountAddress, tokenId, amount, height, prevHash, snapshotHash }: mintageBurnBlock, requestType = 'async') {
        const err = checkParams({ amount, requestType }, ['amount'], [{ name: 'requestType', func: validReqType }]);
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
            prevHash,
            snapshotHash
        }, requestType);
    }

    async changeTokenType({ accountAddress, tokenId, height, prevHash, snapshotHash }: changeTokenTypeBlock, requestType = 'async') {
        return this.callContract({
            abi: ChangeTokenType_Abi,
            params: [tokenId],
            toAddress: Mintage_Addr,
            accountAddress,
            height,
            prevHash,
            snapshotHash
        }, requestType);
    }

    async changeTransferOwner({ accountAddress, ownerAddress, tokenId, height, prevHash, snapshotHash }: changeTransferOwnerBlock, requestType = 'async') {
        const err = checkParams({ tokenId, ownerAddress, requestType }, [ 'tokenId', 'ownerAddress' ], [{
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        return this.callContract({
            abi: TransferOwner_Abi,
            toAddress: Mintage_Addr,
            params: [ tokenId, ownerAddress ],
            accountAddress,
            height,
            prevHash,
            snapshotHash
        }, requestType);
    }
}


function validReqType(type) {
    return type === 'async' || type === 'sync';
}
