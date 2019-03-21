import WS_RPC from '../../../libs/WS';

const WS = new WS_RPC({ timeout: 200 });

let resultCount = 0;

function addResCount() {
    resultCount++;
    if (resultCount === 2) {
        WS.disconnect();
    }
}

describe('ws_rpc_request', function () {
    it('request_no_method', function (done) {
        WS.request().then(() => {
            addResCount();
            done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
        }).catch(() => {
            addResCount();
            done();
        });
    });

    it('request_success', function (done) {
        WS.request('wallet_listAddress').then(() => {
            addResCount();
            done();
        }).catch(err => {
            addResCount();
            done(err);
        });
    });

    // it('request_timeout_error', function (done) {
    //     const Params = [1, 2];
    //     WS.request('jsonrpcTimeoutError', Params).then((res) => {
    //         addResCount();
    //         done(res);
    //     }).catch(() => {
    //         addResCount();
    //         done();
    //     });
    // });
});
