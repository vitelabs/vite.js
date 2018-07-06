const assert = require('assert');
import ViteJS from '../../index.js';
import errors from '../../lib/tools/errors.js';

const Jsonrpc = new ViteJS.Jsonrpc({
    timeout: 200
});

describe('jsonrpc_reset', function () {
    it('reset_finish_requests', function (done) {
        Jsonrpc.batch([
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
            Jsonrpc.reset();
        }, 50);

        Jsonrpc.batch([
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
            assert.equal(err.message, errors.ABORT_ERROR().message);
            done();
        });
    });

    it('reset_timeout_requests', function (done) {
        const errMsg = errors.ABORT_ERROR().message;
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
            Jsonrpc.reset();
        }, 50);

        Jsonrpc.batch([{
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

        Jsonrpc.notification('jsonrpcTimeoutSuccess', [1, 2]).then(() => {
            pushResult('notificationTimeout');
        }).catch((err) => {            
            pushResult('notificationTimeout', err.message);
        });

        Jsonrpc.request('jsonrpcTimeoutSuccess', [1, 2]).then(() => {
            pushResult('requestTimeout');
        }).catch((err) => {
            pushResult('requestTimeout', err.message);
        });

        Jsonrpc.request('jsonrpcSuccess', [1, 2]).then(() => {
            pushResult('requestSuccess');
        }).catch((err) => {
            pushResult('requestSuccess', err.message);
        });
    });
});