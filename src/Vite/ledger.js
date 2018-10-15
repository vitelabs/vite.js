let blake = require('blakejs/blake2b');

import basicStruct from './basicStruct.js';
import BigNumber from 'bn.js';
import address from '../address';
import libUtils from '../../libs/utils';

class Ledger extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    getBlocks({
        addr, index, pageCount = 50, needTokenInfo = false
    }) {
        return this.provider.batch([{
            type: 'request',                    
            methodName: 'ledger_getBlocksByAccAddr',
            params: [addr, index, pageCount, needTokenInfo]
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

    getReceiveBlock(addr) {
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
            baseTx.blockType = block.blockType;
            baseTx.fromBlockHash = block.fromBlockHash;
            baseTx.tokenId = block.tokenId;
            block.nonce && (baseTx.nonce = block.nonce);
            block.data && (baseTx.data = block.data);

            return new Promise((res, rej) => {
                let hash = getPowHash(addr, baseTx.prevHash);
                console.log(hash);
                return this.provider.request('pow_getPowNonce', ['', hash]).then((data) => {
                    baseTx.nonce = data.result;
                    return res(baseTx);
                }).catch((err) => {
                    return rej(err);
                });
            });
        });
    }

    getSendBlock({
        fromAddr, toAddr, tokenId, amount, message
    }) {
        return this.provider.batch([{
            type: 'request',
            methodName: 'ledger_getLatestBlock',
            params: [ fromAddr ]
        }, {
            type: 'request',
            methodName: 'ledger_getLatestSnapshotChainHash'
        }]).then((data)=>{
            if (!data) {
                return null;
            }

            let latestBlock = data[0].result;
            let latestSnapshotChainHash = data[1].result;
            let baseTx = getBaseTx(fromAddr, latestBlock, latestSnapshotChainHash);

            message && (baseTx.data = message);
            baseTx.tokenId = tokenId;
            baseTx.toAddress = toAddr;
            baseTx.amount = amount;
            baseTx.blockType = 2;

            return new Promise((res, rej) => {
                let hash = getPowHash(fromAddr, baseTx.prevHash);
                return this.provider.request('pow_getPowNonce', ['', hash]).then((data) => {
                    console.log(data);
                    // baseTx.nonce = ''; 
                    return res(baseTx);
                }).catch((err) => {
                    return rej(err);
                });
            });
        });
    }
}

export default Ledger;

function getBaseTx(accountAddress, latestBlock, snapshotHash) {
    let height = latestBlock && latestBlock.meta && latestBlock.meta.height ? 
        new BigNumber(latestBlock.meta.height).add( new BigNumber(1) ).toString() : '1';
    let timestamp = new BigNumber(new Date().getTime()).div( new BigNumber(1000) ).toNumber();

    let baseTx = {
        accountAddress,
        meta: { height },
        timestamp,
        snapshotHash,
        fee: '0'    // [TODO]
    };

    if (latestBlock && latestBlock.hash) {
        baseTx.prevHash = latestBlock.hash;
    }
    
    return baseTx;
}

function getPowHash(addr, prevHash) {
    let prev = prevHash || libUtils.bytesToHex(blake.blake2b('0', null, 32));
    let realAddr = address.getAddrFromHexAddr(addr);

    return libUtils.bytesToHex(blake.blake2b(realAddr + prev, null, 32));
}