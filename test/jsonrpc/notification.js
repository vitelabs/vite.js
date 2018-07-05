const assert = require('assert');
import ViteJS from '../../index.js';

const Jsonrpc = new ViteJS.Jsonrpc({
    timeout: 200
});

describe('jsonrpc_notification', function () {
    it('notification_no_method', function (done) {
        Jsonrpc.notification().then(() => {
            done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
        }).catch(() => {
            done();
        });
    });

    it('notification_success', function (done) {
        Jsonrpc.notification('jsonrpcSuccess', [1, 2]).then((result) => {
            assert.equal(result, null);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('notification_error', function (done) {
        Jsonrpc.notification('jsonrpcError', [1, 2]).then((result) => {
            assert.equal(result, null);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('notification_timeout_success', function (done) {
        const Params = [1, 2];
        Jsonrpc.notification('jsonrpcTimeoutSuccess', Params).then((res) => {
            assert.equal(res, null);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('notification_timeout_error', function (done) {
        const Params = [1, 2];
        Jsonrpc.notification('jsonrpcTimeoutError', Params).then(() => {
            done('it should be timeout, but not.');
        }).catch(() => {
            done();
        });
    });
});