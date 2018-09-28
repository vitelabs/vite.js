import basicStruct from './basicStruct.js';
import BigNumber from 'bignumber.js';

BigNumber.config({ 
    FORMAT: {
        decimalSeparator: '.',
        groupSeparator: '',
        groupSize: 0,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
    }
});

class Ledger extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    sendTx(accountBlock) {
        return this.provider.request('ledger_sendTx', [ accountBlock ]);
    }

    getBlocksByAccAddr ({
        accAddr, index, count = 20, needTokenInfo = false
    }) {
        return this.provider.request('ledger_getBlocksByAccAddr', [
            accAddr, index, count, needTokenInfo
        ]);
    }

    getAccountByAccAddr (accAddr) {
        return this.provider.request('ledger_getAccountByAccAddr', accAddr);
    }

    getUnconfirmedInfo (accAddr) {
        return this.provider.request('ledger_getUnconfirmedInfo', accAddr);
    }

    getUnconfirmedBlocksByAccAddr (accAddr) {
        return this.provider.request('ledger_getUnconfirmedBlocksByAccAddr', accAddr);
    }
    
    getLatestBlock (accAddr) {
        return this.provider.request('ledger_getLatestBlock', accAddr);
    }
    
    getTokenMintage () {
        return this.provider.request('ledger_getTokenMintage');
    }

    getBlocksByHash (accAddr) {
        return this.provider.request('ledger_getBlocksByHash', accAddr);
    }

    getInitSyncInfo() {
        return this.provider.request('ledger_getInitSyncInfo');
    }

    getSnapshotChainHeight() {
        return this.provider.request('ledger_getSnapshotChainHeight');
    }

    getReceiveBlock(addr) {
        return this.provider.batch([{
            type: 'request',                    
            methodName: 'ledger_getUnconfirmedBlocksByAccAddr',
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
            baseTx.fromHash = block.hash;
            baseTx.tokenId = block.tokenId;
            block.data && (baseTx.data = block.data);

            return baseTx;
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
            baseTx.to = toAddr;
            baseTx.amount = amount;

            return baseTx;
        });
    }
}

export default Ledger;

function getBaseTx(accountAddress, latestBlock, snapshotTimestamp) {
    let height = latestBlock && latestBlock.meta && latestBlock.meta.height ? 
        new BigNumber(latestBlock.meta.height).plus(1).toFormat() : '1';
    let timestamp = new BigNumber(new Date().getTime()).dividedToIntegerBy(1000).toNumber();

    let baseTx = {
        accountAddress,
        meta: { height },
        timestamp,
        snapshotTimestamp,
        nonce: '0000000000',
        difficulty: '0000000000',
        fAmount: '0'
    };

    if (latestBlock && latestBlock.hash) {
        baseTx.prevHash = latestBlock.hash;
    }
    
    return baseTx;
}