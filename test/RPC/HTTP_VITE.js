import httpProvider from 'provider/HTTP_RPC';

const HTTP_RPC = new httpProvider({
    host: 'http://127.0.0.1:48132/',
    timeout: 200
});

it('request_success', function (done) {
    HTTP_RPC.request('common_logDir').then(() => {
        done();
    }).catch((err) => {
        done(err);
    });
});

it('batch_requests_all_request_all_success', function (done) {
    HTTP_RPC.batch([
        {
            type: 'request',
            methodName: 'common_logDir'
        }, {
            type: 'request',
            methodName: 'ledger_getInitSyncInfo'
        }
    ]).then(() => {
        done();
    }).catch((err) => {
        done(err);
    });
});
