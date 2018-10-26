let blake = require('blakejs/blake2b');

import BigNumber from 'bn.js';
import address from '../address';
import libUtils from '../../libs/utils';
import basicStruct from './basicStruct.js';

const defaultHash = libUtils.bytesToHex(new BigNumber(0).toArray('big', 32));

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

    getReceiveBlock(addr, isGetPow = true) {
        return this.provider.batch([{
            type: 'request',                    
            methodName: 'onroad_getOnroadBlocksByAddress',
            params: [addr, 0, 1]
        }, {
            type: 'request',
            methodName: 'ledger_getLatestBlock',
            params: [addr]
        }, {
            type: 'request',
            methodName: 'ledger_getLatestSnapshotChainHash'
        }]).then((data)=>{
            if (!data) {
                return null;
            }

            let blocks = data[0].result;
            let latestBlock = data[1].result;
            let latestSnapshotChainHash = data[2].result;

            if (!blocks || !blocks.length) {
                return null;
            }

            let block = blocks[0];
            let baseTx = getBaseTx(addr, latestBlock, latestSnapshotChainHash);
            baseTx.blockType = 4;
            baseTx.data = null;
            baseTx.fromBlockHash = block.hash || '';

            if (!isGetPow) {
                return baseTx;
            }
            return getNonce.call(this, addr, baseTx.prevHash, baseTx);
        });
    }

    getSendBlock({
        fromAddr, toAddr, tokenId, amount, message
    }, pledgeType = '', isGetPow = false) {
        let requests = [{
            type: 'request',
            methodName: 'ledger_getLatestBlock',
            params: [ fromAddr ]
        }, {
            type: 'request',
            methodName: 'ledger_getLatestSnapshotChainHash'
        }];

        if (pledgeType) {
            pledgeType === 'get' && requests.push({
                type: 'request',
                methodName: 'pledge_getPledgeData',
                params: [ toAddr ]
            });
            pledgeType === 'getCancel' && requests.push({
                type: 'request',
                methodName: 'pledge_getCancelPledgeData',
                params: [ toAddr ]
            });
        }

        return this.provider.batch(requests).then((data)=>{
            if (!data || data.length < 2 || 
                (pledgeType && (data.length < 3 || !data[2].result))) {
                return null;
            }

            let latestBlock = data[0].result;
            let latestSnapshotChainHash = data[1].result;
            let baseTx = getBaseTx(fromAddr, latestBlock, latestSnapshotChainHash);

            if (!pledgeType && message) {
                let utf8bytes = libUtils.utf8ToBytes(message);
                let base64Str = Buffer.from(utf8bytes).toString('base64');
                baseTx.data = base64Str;
            } else if (pledgeType) {
                baseTx.data = data[2].result;
            }

            baseTx.tokenId = tokenId;
            baseTx.toAddress = pledgeType ? 'vite_000000000000000000000000000000000000000309508ba646' : toAddr;
            baseTx.amount = amount;
            baseTx.blockType = 2;

            if (!isGetPow) {
                return baseTx;
            }
            return getNonce.call(this, fromAddr, baseTx.prevHash, baseTx);
        });
    }
}

export default Ledger;

function getBaseTx(accountAddress, latestBlock, snapshotHash) {
    let height = latestBlock && latestBlock.height ? 
        new BigNumber(latestBlock.height).add( new BigNumber(1) ).toString() : '1';
    let timestamp = new BigNumber(new Date().getTime()).div( new BigNumber(1000) ).toNumber();

    let baseTx = {
        accountAddress,
        height,
        timestamp,
        snapshotHash,
        difficulty: '65535',    // 18446743798831644672
        fee: '0'
    };
    baseTx.prevHash = latestBlock && latestBlock.hash ? latestBlock.hash : defaultHash;
    
    return baseTx;
}

function getNonce(addr, prevHash, baseTx) {
    let prev = prevHash || defaultHash;
    let realAddr = address.getAddrFromHexAddr(addr);
    let hash = libUtils.bytesToHex(blake.blake2b(realAddr + prev, null, 32));

    return this.provider.request('pow_getPowNonce', [baseTx.difficulty, hash]).then((data) => {
        baseTx.nonce = data.result;
        return baseTx;
    });
}