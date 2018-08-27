import basicStruct from '../basicStruct.js';

class Ledger extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    createTX() {

    }

    getBlocks (accAddr) {
        console.log(accAddr);
    }

    getUnconfirmedBlocks (accAddr) {
        console.log(accAddr);
    }

    getAccount (accAddr) {
        console.log(accAddr);
    }

    getUnconfirmedInfo (accAddr) {
        console.log(accAddr);
    }

    getInitSyncInfo() {

    }

    getSnapshotChainHeight() {

    }
}

export default Ledger;