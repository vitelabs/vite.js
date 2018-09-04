import basicStruct from '../basicStruct.js';

class Ledger extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    createTX(pass) {
        return this.provider.request('ledger.CreateTxWithPassphrase', pass);
    }

    getBlocks (accAddr) {
        return this.provider.request('ledger.GetBlocksByAccAddr', accAddr);
    }

    getUnconfirmedBlocks (accAddr) {
        return this.provider.request('ledger.GetUnconfirmedBlocksByAccAddr', accAddr);
    }

    getAccount (accAddr) {
        return this.provider.request('ledger.GetAccountByAccAddr', accAddr);
    }

    getUnconfirmedInfo (accAddr) {
        return this.provider.request('ledger.GetUnconfirmedInfo', accAddr);
    }

    getInitSyncInfo() {
        return this.provider.request('ledger.GetInitSyncInfo');
    }

    getSnapshotChainHeight() {
        return this.provider.request('ledger.GetSnapshotChainHeight');
    }
}

export default Ledger;