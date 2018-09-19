import basicStruct from '../basicStruct.js';
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

    createTxWithPassphrase({
        selfAddr, toAddr, passphrase, tokenTypeId, amount
    }) {
        return this.provider.request('ledger_createTxWithPassphrase', {
            selfAddr, toAddr, passphrase, tokenTypeId, amount
        });
    }

    getBlocksByAccAddr ({
        accAddr, index, count = 20, needTokenInfo = false
    }) {
        return this.provider.request('ledger_getBlocksByAccAddr', {
            accAddr, index, count, needTokenInfo
        });
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

            let height = latestBlock.meta.height ? new BigNumber(latestBlock.meta.height).plus(1).toFormat() : 1;
            let timestamp = new BigNumber(new Date().getTime()).dividedToIntegerBy(1000).toFormat();

            return {
                meta: {
                    height
                },
                accountAddress: addr,
                fromHash: block.hash,
                prevHash: latestBlock.hash,
                timestamp,
                tokenId: block.tokenId,
                data: block.data,
                snapshotTimestamp: latestSnapshotChainHash,
                nonce: '0000000000',
                difficulty: '0000000000',
                fAmount: '0'
            };
        });
    }
}

export default Ledger;