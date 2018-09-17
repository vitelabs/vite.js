import basicStruct from '../basicStruct.js';

class P2P extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    networkAvailable() {
        return this.provider.request('p2p_networkAvailable');
    }

    peersCount() {
        return this.provider.request('p2p_peersCount');
    }
}

export default P2P;