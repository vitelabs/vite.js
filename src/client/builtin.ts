const BigNumber = require('bn.js');
import {isValidHexAddr} from '../utils/address';
import {utf8ToBytes} from '../utils/encoder';
import { blockType ,txType} from "../const/type";

import {Pledge_Addr,Vote_Addr,Register_Addr,defaultHash} from "../const/address"
import { RPCresponse } from "."
import { accountBlock } from '../utils/tools';


export declare type accountBlock = {
    accountAddress?: string,
    prevHash?: string,
    height: number,
    timestamp: number,
    snapshotHash: string,
    blockType?: blockType,
    fee: string,
    data?: string,
    tokenId?: string,
    toAddress?: string,
    amount?: string,
    fromBlockHash?: string,
    logHash?: string,
    nonce?: string,
    hash?: string
}

export class Builtin  {
    constructor(provider: any) {
        this.provider=provider
    }
    provider:any
    getBlocks({
        addr, index, pageCount = 50
    }: {
            addr: string, index: number, pageCount: number
        }) {
        return this.provider.batch([{
            type: 'request',
            methodName: 'ledger_getBlocksByAccAddr',
            params: [addr, index, pageCount]
        }, {
            type: 'request',
            methodName: 'ledger_getAccountByAccAddr',
            params: [addr]
        }]).then((data: RPCresponse[]) => {
            if (!data || data.length < 2) {
                return null;
            }
            let account = data[1].result;
            let rawList = data[0].result || [];

            let list: any[] = [];
            rawList.forEach((item: any) => {
                if (item.blockType !== 2) {
                    item.txType = 10;
                    list.push(item);
                    return;
                }

                let toAddress = item.toAddress;
                let data = Buffer.from(item.data || '', 'base64').toString('hex');
                let dataPrefix = data.slice(0, 8);
                const key =`${dataPrefix}_${toAddress}`;
                const type = txType[key]===undefined?10:txType[key];

                item.txType = type;
                list.push(item);
            });

            return {
                list,
                totalNum: account && account.totalNumber ? account.totalNumber : 0
            };
        });
    }

    getBalance(addr:string) {
        return this.provider.batch([{
            type: 'request',
            methodName: 'ledger_getAccountByAccAddr',
            params: [addr]
        }, {
            type: 'request',
            methodName: 'onroad_getAccountOnroadInfo',
            params: [addr]
        }]).then((data:RPCresponse[]) => {
            if (!data || !data.length || data.length < 2) {
                return null;
            }

            let result = {
                balance: data[0].result,
                onroad: data[1].result
            };
            return result;
        });
    }

    getAccountBlock({
        blockType,
        fromBlockHash,
        message, data,
        accountAddress, toAddress, tokenId, amount
    }
    :any) {
        // 1: create contract send, 2: tx send, 3: reward send, 4: tx receive, 5: tx receive fail 
        // 1 2 3: send，4 5: receive
        // ps: normal tx: send is 2, receive is 4

        if (!accountAddress || !isValidHexAddr(accountAddress)) {
            return Promise.reject(new Error('AccountAddress error'));
        }

        if (!blockType || +blockType < 0 || +blockType > 5) {
            return Promise.reject(new Error('BlockType error'));
        }

        blockType = +blockType;

        if (blockType === 4 && !fromBlockHash) {
            return Promise.reject(new Error('FromBlockHash error'));
        }

        // if (blockType === 2 && 
        //     (!toAddress || !tokenId || !amount) ){
        //     return Promise.reject( new Error('ToAddress, tokenId or amount error') );
        // }

        if (message && data) {
            return Promise.reject(new Error('Message or data, only one'));
        }

        return this.provider.batch([{
            type: 'request',
            methodName: 'ledger_getLatestBlock',
            params: [accountAddress]
        }, {
            type: 'request',
            methodName: 'ledger_getFittestSnapshotHash',
            params: [accountAddress, fromBlockHash]
        }]).then((req:RPCresponse[]) => {
            if (!req || !req.length || req.length < 2) {
                return Promise.reject(new Error('Batch error'));
            }

            if (!req[1].result) {
                return Promise.reject(req);
            }

            let latestBlock = req[0].result;
            let height = latestBlock && latestBlock.height ?
                new BigNumber(latestBlock.height).add(new BigNumber(1)).toString() : '1';
            let timestamp = new BigNumber(new Date().getTime()).div(new BigNumber(1000)).toNumber();

            let accountBlock:accountBlock = {
                accountAddress,
                prevHash: latestBlock && latestBlock.hash ? latestBlock.hash : defaultHash,
                height,
                timestamp,
                snapshotHash: req[1].result,
                blockType,
                fee: '0'
            };

            if (message) {
                let utf8bytes = utf8ToBytes(message);
                let base64Str = Buffer.from(utf8bytes).toString('base64');
                accountBlock.data = base64Str;
            } else {
                data && (accountBlock.data = data);
            }

            if (blockType === 2) {
                accountBlock.tokenId = tokenId;
                accountBlock.toAddress = toAddress;
                accountBlock.amount = amount;
            }

            if (blockType === 4) {
                accountBlock.fromBlockHash = fromBlockHash || '';
            }

            return accountBlock;
        });
    }

    receiveBlock({
        accountAddress, blockHash
    }:{
        accountAddress:string, blockHash:string
    }) {
        return this.getAccountBlock({
            blockType: 4,
            fromBlockHash: blockHash,
            accountAddress
        });
    }

    sendBlock({
        accountAddress, toAddress, tokenId, amount, message
    }:{
        accountAddress:string, toAddress:string, tokenId:string, amount:string, message:string
    }) {
        return this.getAccountBlock({
            blockType: 2,
            accountAddress, toAddress, tokenId, amount, message
        });
    }

    pledgeBlock({
        accountAddress, toAddress, tokenId, amount
    }:{
        accountAddress:string, toAddress:string, tokenId:string, amount:string
    }) {
        return this.provider.request('pledge_getPledgeData', [toAddress]).then((data:RPCresponse) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress, tokenId, amount,
                toAddress: Pledge_Addr,
                data: data.result
            });
        });
    }

    cancelPledgeBlock({
        accountAddress, toAddress, tokenId, amount
    }:{
        accountAddress:string, toAddress:string, tokenId:string, amount:string
    }) {
        return this.provider.request('pledge_getCancelPledgeData', [toAddress, amount]).then((data:RPCresponse) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress, tokenId,
                toAddress: Pledge_Addr,
                data: data.result
            });
        });
    }

    voteBlock({
        accountAddress, nodeName, Gid, tokenId
    }:{
        accountAddress:string, nodeName:string, Gid:string, tokenId:string
    }) {
        return this.provider.request('vote_getVoteData', [Gid, nodeName]).then((data:RPCresponse) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress,
                toAddress: Vote_Addr,
                data: data.result,
                tokenId
            });
        });
    }

    cancelVoteBlock({
        accountAddress, Gid, tokenId
    }:{
        accountAddress:string, nodeName:string, Gid:string, tokenId:string
    }) {
        return this.provider.request('vote_getCancelVoteData', [Gid]).then((data:RPCresponse) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress,
                toAddress: Vote_Addr,
                data: data.result,
                tokenId
            });
        });
    }

    registerBlock({
        accountAddress, nodeName, producerAddr, amount, tokenId, Gid
    }:{
        accountAddress:string, nodeName:string, Gid:string, tokenId:string,producerAddr:string,amount:string
    }) {
        return this.provider.request('register_getRegisterData', [Gid, nodeName, producerAddr]).then((data:RPCresponse) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress,
                toAddress: Register_Addr,
                data: data.result,
                tokenId, amount
            });
        });
    }

    updateRegisterBlock({
        accountAddress, nodeName, producerAddr, tokenId, Gid
    }:{
        accountAddress:string, nodeName:string, Gid:string, tokenId:string,producerAddr:string
    }) {
        return this.provider.request('register_getUpdateRegistrationData', [Gid, nodeName, producerAddr]).then((data:RPCresponse) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress,
                toAddress: Register_Addr,
                data: data.result,
                tokenId
            });
        });
    }

    cancelRegisterBlock({
        accountAddress, nodeName, tokenId, Gid
    }
    :{
        accountAddress:string, nodeName:string, Gid:string, tokenId:string
    }) {
        return this.provider.request('register_getCancelRegisterData', [Gid, nodeName]).then((data:RPCresponse) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress,
                toAddress: Register_Addr,
                data: data.result,
                tokenId
            });
        });
    }

    rewardBlock({
        accountAddress, nodeName, rewardAddress, Gid, tokenId
    }:{
        accountAddress:string, nodeName:string, rewardAddress:string, Gid:string, tokenId:string
    }) {
        return this.provider.request('register_getRewardData', [Gid, nodeName, rewardAddress]).then((data:RPCresponse) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress,
                toAddress: Register_Addr,
                data: data.result,
                tokenId
            });
        });
    }
}