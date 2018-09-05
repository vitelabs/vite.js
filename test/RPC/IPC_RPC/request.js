import ViteJS from '../../../index.js';

const IPC_RPC = new ViteJS.IPC_RPC({
    path: '/Users/sisi/viteisbest/vite.ipc',
    timeout: 200
});

let resultCount = 0;

function addResCount() {
    resultCount++;
    if (resultCount ===  2) {
        IPC_RPC.disconnect();
    }
}

IPC_RPC.on('connect', ()=>{
    describe('ipc_rpc_request', function () {
        it('request_no_method', function (done) {
            IPC_RPC.request().then(() => {
                addResCount();
                done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
            }).catch(() => {                
                addResCount();
                done();
            });
        });
    
        it('request_success', function (done) {
            IPC_RPC.request('wallet.ListAddress').then(() => {
                addResCount();
                done();
            }).catch((err) => {
                addResCount();
                done(err);
            });
        });
    
        it('request_timeout_error', function (done) {
            const Params = [1, 2];
            IPC_RPC.request('jsonrpcTimeoutError', Params).then((res) => {
                addResCount();
                done(res);
            }).catch(() => {
                addResCount();
                done();
            });
        });
    });
});
