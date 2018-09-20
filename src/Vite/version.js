import basicStruct from './basicStruct.js';

class Version extends basicStruct {
    constructor(provider) {
        super(provider);

        this.viteServer = null;
        this.getViteServerVersion();
    }

    getViteServerVersion() {

    }

    getP2PVersion() {

    }

    getLedgerVersion() {

    }

    getAccountVersion() {

    }

    getKeystoreVersion() {
        
    }
}

export default Version;
