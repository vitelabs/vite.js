import BigNumber from 'bn.js';
import address from '../address';
import libUtils from '../../libs/utils';
import basicStruct from './basicStruct.js';

const defaultHash = libUtils.bytesToHex(new BigNumber(0).toArray('big', 32));
const Pledge_Addr = 'vite_000000000000000000000000000000000000000309508ba646';
const Vote_Addr = 'vite_000000000000000000000000000000000000000270a48cc491';
const Register_Addr = 'vite_0000000000000000000000000000000000000001c9e9f25417';

class Ledger extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    getBlocks({
        addr, index, pageCount = 50
    }) {
        return this.provider.batch([{
            type: 'request',                    
            methodName: 'ledger_getBlocksByAccAddr',
            params: [addr, index, pageCount]
        }, {
            type: 'request',
            methodName: 'ledger_getAccountByAccAddr',
            params: [addr]
        }]).then((data) => {
            if (!data || data.length < 2) {
                return null;
            }
            let account = data[1].result;
            return {
                list: data[0].result || [],
                totalNum: account && account.totalNumber ? account.totalNumber : 0
            };
        });
    }

    getBalance(addr) {
        return this.provider.batch([{
            type: 'request',
            methodName: 'ledger_getAccountByAccAddr',
            params: [ addr ]
        },{
            type: 'request',
            methodName: 'onroad_getAccountOnroadInfo',
            params: [ addr ]
        }]).then((data)=>{
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
    }) {
        // 1: create contract send, 2: tx send, 3: reward send, 4: tx receive, 5: tx receive fail 
        // 1 2 3: send，4 5: receive
        // ps: normal tx: send is 2, receive is 4

        if (!accountAddress || !address.isValidHexAddr(accountAddress)) {
            return Promise.reject( new Error('AccountAddress error') );
        }

        if (!blockType || +blockType < 0 || +blockType > 5) {
            return Promise.reject( new Error('BlockType error') );
        }

        blockType = +blockType;

        if (blockType === 4 && !fromBlockHash) {
            return Promise.reject( new Error('FromBlockHash error') );
        }

        // if (blockType === 2 && 
        //     (!toAddress || !tokenId || !amount) ){
        //     return Promise.reject( new Error('ToAddress, tokenId or amount error') );
        // }

        if (message && data) {
            return Promise.reject( new Error('Message or data, only one') );
        }

        return this.provider.batch([{
            type: 'request',
            methodName: 'ledger_getLatestBlock',
            params: [ accountAddress ]
        }, {
            type: 'request',
            methodName: 'ledger_getFittestSnapshotHash'
        }]).then((req) => {
            if (!req || !req.length || req.length < 2) {
                return Promise.reject( new Error('Batch error') );
            }

            if (!req[1].result) {
                return Promise.reject(req);
            }

            let latestBlock = req[0].result;
            let height = latestBlock && latestBlock.height ? 
                new BigNumber(latestBlock.height).add( new BigNumber(1) ).toString() : '1';
            let timestamp = new BigNumber(new Date().getTime()).div( new BigNumber(1000) ).toNumber();
    
            let accountBlock = {
                accountAddress,
                prevHash: latestBlock && latestBlock.hash ? latestBlock.hash : defaultHash,
                height,
                timestamp,
                snapshotHash: req[1].result,
                blockType,
                fee: '0'
            };

            if (message) {
                let utf8bytes = libUtils.utf8ToBytes(message);
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
    }) {
        return this.getAccountBlock({
            blockType: 4,
            fromBlockHash: blockHash,
            accountAddress
        });
    }

    sendBlock({
        accountAddress, toAddress, tokenId, amount, message
    }) {
        return this.getAccountBlock({
            blockType: 2,
            accountAddress, toAddress, tokenId, amount, message
        });
    }

    pledgeBlock({
        accountAddress, toAddress, tokenId, amount
    }) {
        return this.provider.request('pledge_getPledgeData', [toAddress]).then((data) => {
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
    }) {
        return this.provider.request('pledge_getCancelPledgeData', [toAddress, amount]).then((data) => {
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
        accountAddress, nodeName, Gid,tokenId
    }) {
        return this.provider.request('vote_getVoteData', [Gid, nodeName]).then((data) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress,
                toAddress: Vote_Addr,
                tokenId,
                data: data.result
            });
        });
    }

    cancelVoteBlock({
        accountAddress, Gid
    }) {
        return this.provider.request('vote_getCancelVoteData', Gid).then((data) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress, 
                toAddress: Vote_Addr,
                data: data.result
            });
        });
    }

    registerBlock({
        accountAddress, nodeName, producerAddr, amount, tokenId, Gid
    }) {
        return this.provider.request('register_getRegisterData', [Gid, nodeName, producerAddr]).then((data) => {
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
        accountAddress, nodeName, producerAddr, amount, tokenId, Gid
    }) {
        return this.provider.request('register_getUpdateRegistrationData', [Gid, nodeName, producerAddr]).then((data) => {
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

    cancelRegisterBlock({
        accountAddress, nodeName, tokenId, Gid
    }) {
        return this.provider.request('register_getCancelRegisterData', [Gid, nodeName]).then((data) => {
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
        accountAddress, nodeName, rewardAddress, Gid
    }) {
        return this.provider.request('register_getRewardData', [Gid, nodeName, rewardAddress]).then((data) => {
            if (!data || !data.result) {
                return Promise.reject(data);
            }

            return this.getAccountBlock({
                blockType: 2,
                accountAddress,        
                toAddress: Register_Addr,
                data: data.result
            });
        });
    }
}

export default Ledger;
