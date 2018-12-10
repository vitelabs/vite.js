const assert = require('assert');
import httpProvider from 'provider/HTTP_RPC';

const HTTP_RPC = new httpProvider({
    timeout: 200
});

describe('http_rpc_reset', function () {
    it('reset_finish_requests', function (done) {
        HTTP_RPC.batch([
            {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }, {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: ['ok', 'no']
            }, {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then(() => {
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('reset_timeout_batch_request', function (done) {
        setTimeout(() => {
            HTTP_RPC.reset();
        }, 50);

        HTTP_RPC.batch([
            {
                type: 'request',
                methodName: 'jsonrpcTimeoutSuccess',
                params: [1, 2]
            }, {
                type: 'request',
                methodName: 'jsonrpcTimeoutSuccess',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcTimeoutSuccess',
                params: ['ok', 'no']
            }, {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then(() => {
            done('already reset: request should be aborted');
        }).catch((err) => {
            assert.equal(err.message, HTTP_RPC.ERRORS.ABORT().message);
            done();
        });
    });

    it('reset_timeout_requests', function (done) {
        const errMsg = HTTP_RPC.ERRORS.ABORT().message;
        let doneResult = null;

        let testCount = 0;
        let pushResult = (request, result) => {
            let errList = ['batchTimeout', 'notificationTimeout', 'requestTimeout'];
            let successList = ['requestSuccess'];

            if (doneResult) {
                return;
            }

            if (errList.indexOf(request) !== -1 && !result) {
                doneResult = `${request} should be aborted, but it is success`;
                done(doneResult);
            } else if (errList.indexOf(request) !== -1 && result !== errMsg) {
                doneResult = result;
                done(doneResult);
            }

            testCount++;
            if (testCount === (errList.length + successList.length) && !doneResult) {
                done();
                return;
            }
        };

        setTimeout(() => {
            HTTP_RPC.reset();
        }, 50);

        HTTP_RPC.batch([{
            type: 'request',
            methodName: 'jsonrpcTimeoutError',
            params: [1, 2]
        }, {
            type: 'request',
            methodName: 'jsonrpcTimeoutSuccess',
            params: [5, 6]
        }, {
            type: 'request',
            methodName: 'jsonrpcTimeoutSuccess',
            params: ['ok', 'no']
        }, {
            type: 'request',
            methodName: 'jsonrpcSuccess',
            params: [1, 2]
        }]).then(() => {
            pushResult('batchTimeout');
        }).catch((err) => {
            pushResult('batchTimeout', err.message);
        });

        HTTP_RPC.notification('jsonrpcTimeoutSuccess', [1, 2]).then(() => {
            pushResult('notificationTimeout');
        }).catch((err) => {            
            pushResult('notificationTimeout', err.message);
        });

        HTTP_RPC.request('jsonrpcTimeoutSuccess', [1, 2]).then(() => {
            pushResult('requestTimeout');
        }).catch((err) => {
            pushResult('requestTimeout', err.message);
        });

        HTTP_RPC.request('jsonrpcSuccess', [1, 2]).then(() => {
            pushResult('requestSuccess');
        }).catch((err) => {
            pushResult('requestSuccess', err.message);
        });
    });
});