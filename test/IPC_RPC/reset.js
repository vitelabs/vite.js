const assert = require('assert');
import ViteJS from '../../index.js';

const IPC_RPC = new ViteJS.IPC_RPC({
    path: '/Users/sisi/viteisbest/vite.ipc',
    timeout: 200
});

let resultCount = 0;
function addResCount() {
    resultCount++;
    if (resultCount ===  1) {
        IPC_RPC.disconnect();
    }
}

IPC_RPC.on('connect', ()=>{
    describe('ipc_rpc_reset', function () {
        it('reset_timeout_batch_request', function (done) {
            setTimeout(() => {
                IPC_RPC.reset();
            }, 0);

            IPC_RPC.batch([
                {
                    type: 'request',
                    methodName: 'wallet.ListAddress'
                }, {
                    type: 'notification',
                    methodName: 'wallet.ReloadAndFixAddressFile'
                }, {
                    type: 'request',
                    methodName: 'wallet.sdsdsd'
                }
            ]).then((res) => {
                addResCount();
                done(res);
            }).catch((err) => {
                addResCount();
                assert.equal(err.message, IPC_RPC.ERRORS.ABORT().message);
                done();
            });
        });
    });
});