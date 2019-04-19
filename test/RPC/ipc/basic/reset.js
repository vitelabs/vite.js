const assert = require('assert');
import IpcProvider from 'provider/IPC_RPC';

const IPC_RPC = new IpcProvider({
    path: '/Users/sisi/viteisbest/vite.ipc',
    timeout: 200
});

let resultCount = 0;
function addResCount() {
    resultCount++;
    if (resultCount === 1) {
        IPC_RPC.disconnect();
    }
}

// IPC_RPC.on('connect', ()=>{
describe('ipc_rpc_reset', function () {
    it('reset_timeout_batch_request', function (done) {
        setTimeout(() => {
            IPC_RPC.reset();
        }, 0);

        IPC_RPC.batch([
            {
                type: 'request',
                methodName: 'wallet_listAddress'
            }, {
                type: 'notification',
                methodName: 'wallet_reloadAndFixAddressFile'
            }, {
                type: 'request',
                methodName: 'wallet.sdsdsd'
            }
        ]).then(res => {
            addResCount();
            done(res);
        }).catch(err => {
            addResCount();
            assert.equal(err.message, IPC_RPC.ERRORS.ABORT().message);
            done();
        });
    });
});
// });
