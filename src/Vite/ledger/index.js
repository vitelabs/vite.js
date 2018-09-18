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

    createTx(AccountBlock) {
        return this.provider.request('ledger_createTx', [AccountBlock]);
    }

    // SelfAddr: string of addr 
    // ToAddr: string of addr
    // Passphrase: string
    // TokenTypeId: string of tokentypeid
    // Amount:big int
    createTxWithPassphrase(AccountBlock) {
        return this.provider.request('ledger_createTxWithPassphrase', AccountBlock);
    }

    getBlocksByAccAddr ({
        accAddr, index, count = 20
    }) {
        return this.provider.request('ledger_getBlocksByAccAddr', {
            Addr: accAddr,
            Index: index,
            Count: count
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

            let height = latestBlock.meta.height ? new BigNumber(block.meta.height).plus(1).toFormat() : 1;
            return {
                meta: {
                    height
                },
                accountAddress: addr,
                fromHash: block.hash,
                prevHash: latestBlock.hash,
                timestamp: new Date().getTime(),
                tokenId: block.tokenId,
                data: block.data,
                snapshotTimestamp: latestSnapshotChainHash,
                nonce: '0000000000',
                difficulty: '0000000000'
            };
        });
    }
}

export default Ledger;