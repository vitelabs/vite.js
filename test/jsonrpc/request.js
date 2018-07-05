const assert = require('assert');
import ViteJS from '../../index.js';

const Jsonrpc = new ViteJS.Jsonrpc({
    timeout: 200
});

describe('jsonrpc_request', function () {
    it('request_no_method', function (done) {
        Jsonrpc.request().then(() => {
            done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
        }).catch(() => {
            done();
        });
    });

    it('request_success', function (done) {
        Jsonrpc.request('jsonrpcSuccess', [1, 2]).then((res) => {
            assert.deepEqual(res, {
                result: 3,
                error: null
            });
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('request_error', function (done) {
        const Params = [1, 2];
        Jsonrpc.request('jsonrpcError', Params).then((res) => {
            assert.deepEqual(res, {
                result: null,
                error: {
                    code: 0,
                    message: JSON.stringify(Params)
                }
            });
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('request_timeout_success', function (done) {
        const Params = [1, 2];
        Jsonrpc.request('jsonrpcTimeoutSuccess', Params).then((res) => {
            assert.deepEqual(res, {
                result: 3,
                error: null
            });
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('request_timeout_error', function (done) {
        const Params = [1, 2];
        Jsonrpc.request('jsonrpcTimeoutError', Params).then(() => {
            done('it should be timeout, but not.');
        }).catch(() => {
            done();
        });
    });
});