import basicStruct from '../basicStruct.js';

class P2P extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    isNetworkAvailable() {
        return this.provider.request('p2p.NetworkAvailable');
    }
}

export default P2P;