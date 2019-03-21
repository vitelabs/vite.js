import WS_RPC from '../../../libs/WS';

const WS = new WS_RPC({ timeout: 200 });

let resultCount = 0;
function addResCount() {
    resultCount++;
    if (resultCount === 4) {
        WS.disconnect();
    }
}

describe('ws_rpc_batch', function () {
    it('batch_no_requests', function (done) {
        WS.batch().then(() => {
            addResCount();
            done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
        }).catch(() => {
            addResCount();
            done();
        });
    });

    it('batch_requests_no_length', function (done) {
        WS.batch([]).then(() => {
            addResCount();
            done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
        }).catch(() => {
            addResCount();
            done();
        });
    });

    it('batch_requests_all_notification_all_success', function (done) {
        const err = WS.batch([
            {
                type: 'notification',
                methodName: 'wallet_reloadAndFixAddressFile'
            }, {
                type: 'notification',
                methodName: 'wallet_reloadAndFixAddressFile'
            }, {
                type: 'notification',
                methodName: 'wallet_reloadAndFixAddressFile'
            }
        ]);
        addResCount();
        done(err);
    });

    // it('batch_requests_all_request_all_success', function (done) {
    //     WS.batch([
    //         {
    //             type: 'request',
    //             methodName: 'wallet_listAddress'
    //         }, {
    //             type: 'notification',
    //             methodName: 'wallet_reloadAndFixAddressFile'
    //         }, {
    //             type: 'request',
    //             methodName: 'wallet_status'
    //         }
    //     ]).then(() => {
    //         addResCount();
    //         done();
    //     }).catch((err) => {
    //         addResCount();
    //         done(err);
    //     });
    // });
});

