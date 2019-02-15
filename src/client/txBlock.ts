import { no } from "const/error";
import { Quota_Addr, Vote_Addr, Register_Addr, Snapshot_Gid, Delegate_Gid } from "const/contract";
import { RPCresponse, SBPregBlock, block8, block7, revokeVotingBlock, quotaBlock, sendTxBlock, receiveTxBlock, formatBlock, createContractBlock, callContractBlock } from "const/type";

import { checkParams, validNodeName } from "utils/tools";
import { formatAccountBlock, validReqAccountBlock } from "utils/builtin";
import { getAccountBlock as _getAccountBlock, getSendTxBlock, getReceiveTxBlock } from 'utils/accountBlock';
import { encodeFunctionCall, encodeParameters } from "utils/abi";
import { isArray } from 'utils/encoder';

import client from '.';

export default class tx {
    _client: client
    getAccountBlock: {
        sync: Function,
        async: Function
    }
    receiveTx: {
        sync: Function,
        async: Function
    }
    sendTx: {
        sync: Function,
        async: Function
    }

    constructor(client) {
        this._client = client;

        this.getAccountBlock = {
            sync: _getAccountBlock,
            async: this.asyncAccountBlock.bind(this)
        }
        this.receiveTx = {
            sync: getReceiveTxBlock,
            async: this.asyncReceiveTx.bind(this)
        }
        this.sendTx = {
            sync: getSendTxBlock,
            async: this.asyncSendTx.bind(this)
        }
    }

    async asyncAccountBlock({
        blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, toAddress, tokenId, amount, fee
    }: formatBlock) {
        let reject = (error, errMsg = '') => {
            let message = `${error.msg} ${errMsg}`;
            return Promise.reject({
                code: error.code,
                message
            });
        }

        let err = validReqAccountBlock({
            blockType, fromBlockHash, accountAddress, message, data, toAddress, amount
        });

        if (err) {
            return reject(err);
        }

        let requests = [];
        if (!height || !prevHash) {
            requests.push({
                methodName: 'ledger_getLatestBlock',
                params: [ accountAddress ]
            })
        }
        if (!snapshotHash) {
            requests.push({
                methodName: 'ledger_getFittestSnapshotHash',
                params: [ accountAddress, fromBlockHash ]
            })
        }

        if (!requests) {
            return reject(no);
        }

        let req = await this._client.batch(requests);
        let latestBlock;

        requests.forEach((_r, index) =>{
            if (_r.methodName === 'ledger_getLatestBlock') {
                latestBlock = req[index].result;
                return;
            }
            snapshotHash = req[index].result;
        })

        height = latestBlock && latestBlock.height ? latestBlock.height : '';
        prevHash = latestBlock && latestBlock.hash ? latestBlock.hash : '';

        return formatAccountBlock({
            blockType, fromBlockHash, accountAddress, message, data, height, prevHash, snapshotHash, toAddress, tokenId, amount, fee
        });
    }

    async SBPreg({
        accountAddress, nodeName, toAddress, amount, tokenId, Gid = Snapshot_Gid, height, prevHash, snapshotHash
    }: SBPregBlock, requestType = 'async') {
        let err = checkParams({ 
            toAddress, nodeName, tokenId, amount, requestType
        }, ['toAddress', 'nodeName', 'tokenId', 'amount'], [{
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const result:RPCresponse = await this._client.register.getRegisterData(Gid, nodeName, toAddress);
        return this[`${requestType}AccountBlock`]({
            blockType: 2,
            accountAddress,
            toAddress: Register_Addr,
            data: result,
            tokenId, amount, height, prevHash, snapshotHash
        });
    }

    async updateReg({
        accountAddress, nodeName, toAddress, tokenId, Gid = Snapshot_Gid, height, prevHash, snapshotHash
    }: block8, requestType = 'async') {
        let err = checkParams({ 
            toAddress, nodeName, tokenId, requestType
        }, ['toAddress', 'nodeName', 'tokenId'], [{
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const result:RPCresponse = await this._client.register.getUpdateRegistrationData(Gid, nodeName, toAddress);
        return this[`${requestType}AccountBlock`]({
            blockType: 2,
            accountAddress,
            toAddress: Register_Addr,
            data: result,
            tokenId, height, prevHash, snapshotHash
        });
    }

    async revokeReg({
        accountAddress, nodeName, tokenId, Gid = Snapshot_Gid, height, prevHash, snapshotHash
    }: block7, requestType = 'async') {
        let err = checkParams({ 
            nodeName, tokenId, requestType
        }, ['nodeName', 'tokenId'], [{
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const result:RPCresponse = await this._client.register.getCancelRegisterData(Gid, nodeName);
        return this[`${requestType}AccountBlock`]({
            blockType: 2,
            accountAddress,
            toAddress: Register_Addr,
            data: result,
            tokenId, height, prevHash, snapshotHash
        });
    }

    async retrieveReward({
        accountAddress, nodeName, toAddress, tokenId, Gid = Snapshot_Gid, height, prevHash, snapshotHash
    }: block8, requestType = 'async') {
        let err = checkParams({ 
            toAddress, nodeName, tokenId, requestType
        }, ['toAddress', 'nodeName', 'tokenId'], [{
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const result:RPCresponse = await this._client.register.getRewardData(Gid, nodeName, toAddress);
        return this[`${requestType}AccountBlock`]({
            blockType: 2,
            accountAddress,
            toAddress: Register_Addr,
            data: result,
            tokenId, height, prevHash, snapshotHash
        });
    }

    async voting({
        accountAddress, nodeName, tokenId, Gid = Snapshot_Gid, height, prevHash, snapshotHash
    }: block7, requestType = 'async') {
        let err = checkParams({ 
            nodeName, tokenId, requestType
        }, ['nodeName', 'tokenId'], [{
            name: 'nodeName',
            func: validNodeName
        }, {
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const result:RPCresponse = await this._client.vote.getVoteData(Gid, nodeName);
        return this[`${requestType}AccountBlock`]({
            blockType: 2,
            accountAddress,
            toAddress: Vote_Addr,
            data: result,
            tokenId, height, prevHash, snapshotHash
        });
    }

    async revokeVoting({
        accountAddress, tokenId, Gid = Snapshot_Gid, height, prevHash, snapshotHash
    }: revokeVotingBlock, requestType = 'async') {
        let err = checkParams({ tokenId, requestType }, ['tokenId'], [{
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const result:RPCresponse = await this._client.vote.getCancelVoteData(Gid);
        return this[`${requestType}AccountBlock`]({
            blockType: 2,
            accountAddress,
            toAddress: Vote_Addr,
            data: result,
            tokenId, height, prevHash, snapshotHash
        });
    }
    
    async getQuota({
        accountAddress, toAddress, tokenId, amount, height, prevHash, snapshotHash
    }: quotaBlock, requestType = 'async') {
        let err = checkParams({ toAddress, tokenId, amount, requestType }, ['toAddress', 'tokenId', 'amount'], [{
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const result:RPCresponse = await this._client.pledge.getPledgeData(toAddress);
        return this[`${requestType}AccountBlock`]({
            blockType: 2,
            toAddress: Quota_Addr,
            data: result,
            accountAddress, tokenId, amount, height, prevHash, snapshotHash
        });
    }

    async withdrawalOfQuota({
        accountAddress, toAddress, tokenId, amount, height, prevHash, snapshotHash
    }: quotaBlock, requestType = 'async') {
        let err = checkParams({ toAddress, tokenId, amount, requestType }, ['toAddress', 'tokenId', 'amount'], [{
            name: 'requestType',
            func: validReqType
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const result:RPCresponse = await this._client.pledge.getCancelPledgeData(toAddress, amount);
        return this[`${requestType}AccountBlock`]({
            blockType: 2,
            toAddress: Quota_Addr,
            data: result,
            accountAddress, tokenId, height, prevHash, snapshotHash
        });
    }

    async asyncSendTx ({
        accountAddress, toAddress, tokenId, amount, message, height, prevHash, snapshotHash
    }: sendTxBlock) {
        let err = checkParams({ toAddress, tokenId, amount }, ['toAddress', 'tokenId', 'amount']);
        if (err) {
            return Promise.reject(err);
        }

        return this.asyncAccountBlock({
            blockType: 2,
            accountAddress, toAddress, tokenId, amount, message, height, prevHash, snapshotHash
        });
    }

    async asyncReceiveTx({
        accountAddress, fromBlockHash, height, prevHash, snapshotHash
    }: receiveTxBlock) {
        let err = checkParams({ fromBlockHash }, ['fromBlockHash']);
        if (err) {
            return Promise.reject(err);
        }

        return this.asyncAccountBlock({
            blockType: 4,
            fromBlockHash, accountAddress, height, prevHash, snapshotHash
        });
    }

    async createContract({
        accountAddress, tokenId, amount, fee, hexCode, abi, params, height, prevHash, snapshotHash
    }: createContractBlock, requestType = 'async') {
        let err = checkParams({ hexCode, abi, tokenId, amount, fee}, ['hexCode', 'abi', 'tokenId', 'amount', 'fee']);
        if (err) {
            return Promise.reject(err);
        }

        let block = requestType === 'async' ? await this.asyncAccountBlock({
            blockType: 1, accountAddress, height, prevHash, snapshotHash, tokenId, amount, fee
        }) : _getAccountBlock({
            blockType: 1, accountAddress, height, prevHash, snapshotHash, tokenId, amount, fee
        });

        let toAddress = await this._client.contract.getCreateContractToAddress(accountAddress, block.height, block.prevHash, block.snapshotHash);
        block.toAddress = toAddress;

        let jsonInterface = getConstructor(abi);
        let data = Delegate_Gid + '01' + hexCode;
        if (jsonInterface) {
            let inputs = jsonInterface.inputs;
            let types = [];
            inputs.forEach(({ type }) => {
                types.push(type);
            });
        }

        block.data = Buffer.from(data, 'hex').toString('base64');
        return block;
    }

    async callContract({
        accountAddress, toAddress, tokenId, amount, jsonInterface, params=[], height, prevHash, snapshotHash
    }: callContractBlock, requestType = 'async') {
        let err = checkParams({ toAddress, jsonInterface, tokenId, amount }, ['toAddress', 'jsonInterface','tokenId', 'amount']);
        if (err) {
            return Promise.reject(err);
        }

        return this[`${requestType}AccountBlock`]({
            blockType: 2,
            accountAddress,
            toAddress,
            data: Buffer.from(encodeFunctionCall(jsonInterface,params),"hex").toString("base64"),
            height, prevHash, snapshotHash, tokenId, amount
        });
    }

    async mintage({
        accountAddress, tokenName, totalSupply, decimals, tokenSymbol, height, prevHash, snapshotHash
    }, requestType = 'async') {

    }

    async mintageIssue({
        accountAddress, tokenId, amount, beneficial, height, prevHash, snapshotHash
    }, requestType = 'async') {

    }

    async mintageBurn({
        accountAddress, height, prevHash, snapshotHash
    }, requestType = 'async') {
        
    }

    async changeTokenType({
        accountAddress, tokenId, height, prevHash, snapshotHash
    }, requestType = 'async') {

    }

    async changeTransferOwner({
        accountAddress, ownerAddress, tokenId, height, prevHash, snapshotHash
    }, requestType = 'async') {

    }
}



function validReqType(type) {
    return type === 'async' || type == 'sync';
}

function getConstructor(jsonInterfaces) {
    if ( !isArray(jsonInterfaces) ) {
        if (jsonInterfaces.type === 'constructor') {
            return jsonInterfaces;
        }
    }

    for (let i=0; i<jsonInterfaces.length; i++) {
        if (jsonInterfaces[i].type === 'constructor') {
            return jsonInterfaces[i];
        }
    }
}
