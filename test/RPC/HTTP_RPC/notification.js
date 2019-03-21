const assert = require('assert');
import HttpProvider from 'provider/HTTP_RPC';

const HTTP_RPC = new HttpProvider({ timeout: 200 });

describe('http_rpc_notification', function () {
    it('notification_no_method', function (done) {
        HTTP_RPC.notification().then(() => {
            done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
        }).catch(() => {
            done();
        });
    });

    it('notification_success', function (done) {
        HTTP_RPC.notification('jsonrpcSuccess', [ 1, 2 ]).then(result => {
            assert.equal(result, null);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('notification_error', function (done) {
        HTTP_RPC.notification('jsonrpcError', [ 1, 2 ]).then(result => {
            assert.equal(result, null);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('notification_timeout_success', function (done) {
        const Params = [ 1, 2 ];
        HTTP_RPC.notification('jsonrpcTimeoutSuccess', Params).then(res => {
            assert.equal(res, null);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('notification_timeout_error', function (done) {
        const Params = [ 1, 2 ];
        HTTP_RPC.notification('jsonrpcTimeoutError', Params).then(() => {
            done('it should be timeout, but not.');
        }).catch(() => {
            done();
        });
    });
});
