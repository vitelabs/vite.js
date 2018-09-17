import basicStruct from '../basicStruct.js';

class Ledger extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    createTx(AccountBlock) {
        return this.provider.request('ledger_createTx', AccountBlock);
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
}

export default Ledger;