const assert = require('assert');
import ViteJS from '../../index.js';

const Jsonrpc = new ViteJS.Jsonrpc({
    timeout: 200
});

describe('jsonrpc_batch', function () {
    it('batch_no_requests', function (done) {
        Jsonrpc.batch().then(() => {
            done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
        }).catch(() => {
            done();
        });
    });

    it('batch_requests_no_length', function (done) {
        Jsonrpc.batch([]).then(() => {
            done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
        }).catch(() => {
            done();
        });
    });

    it('batch_requests_all_request_all_success', function (done) {
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
        ]).then((res) => {
            assert.deepEqual(res, [
                {
                    error: null,
                    result: 3
                }, {
                    error: null,
                    result: 11
                }, {
                    error: null,
                    result: 'okno'
                }, {
                    error: null,
                    result: 3
                }
            ]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_all_request_some_success', function (done) {
        Jsonrpc.batch([
            {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }, {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            assert.deepEqual(res, [
                {
                    error: null,
                    result: 3
                }, {
                    result: null,
                    error: {
                        code: 0,
                        message: '[5,6]'
                    }
                }, {
                    result: null,
                    error: {
                        code: 0,
                        message: '[5,6]'
                    }
                }, {
                    error: null,
                    result: 3
                }
            ]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_all_request_all_error', function (done) {
        Jsonrpc.batch([
            {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [1, 2]
            }, {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [1, 2]
            }
        ]).then((res) => {
            assert.deepEqual(res, [
                {
                    result: null,
                    error: {
                        code: 0,
                        message: '[1,2]'
                    }
                }, {
                    result: null,
                    error: {
                        code: 0,
                        message: '[5,6]'
                    }
                }, {
                    result: null,
                    error: {
                        code: 0,
                        message: '[5,6]'
                    }
                }, {
                    result: null,
                    error: {
                        code: 0,
                        message: '[1,2]'
                    }
                }
            ]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_all_request_some_timeout', function (done) {
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
                methodName: 'jsonrpcTimeoutError',
                params: ['ok', 'no']
            }, {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            done(res);
        }).catch(() => {
            done();
        });
    });

    it('batch_requests_all_request_timeout_success', function (done) {
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
        ]).then((res) => {
            assert.deepEqual(res, [
                {
                    error: null,
                    result: 3
                }, {
                    error: null,
                    result: 11
                }, {
                    error: null,
                    result: 'okno'
                }, {
                    error: null,
                    result: 3
                }
            ]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_all_notification_all_success', function (done) {
        Jsonrpc.batch([
            {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [5, 6]
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: ['ok', 'no']
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            assert.deepEqual(res, [null, null, null, null]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_all_notification_some_success', function (done) {
        Jsonrpc.batch([
            {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcError',
                params: [5, 6]
            }, {
                type: 'notification',
                methodName: 'jsonrpcError',
                params: ['ok', 'no']
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            assert.deepEqual(res, [null, null, null, null]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_all_notification_all_error', function (done) {
        Jsonrpc.batch([
            {
                type: 'notification',
                methodName: 'jsonrpcError',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcError',
                params: [5, 6]
            }, {
                type: 'notification',
                methodName: 'jsonrpcError',
                params: ['ok', 'no']
            }, {
                type: 'notification',
                methodName: 'jsonrpcError',
                params: [1, 2]
            }
        ]).then((res) => {
            assert.deepEqual(res, [null, null, null, null]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_all_notification_some_timeout', function (done) {
        Jsonrpc.batch([
            {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [5, 6]
            }, {
                type: 'notification',
                methodName: 'jsonrpcTimeoutError',
                params: ['ok', 'no']
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            done(res);
        }).catch(() => {
            done();
        });
    });

    it('batch_requests_all_notification_some_timeout_success', function (done) {
        Jsonrpc.batch([
            {
                type: 'notification',
                methodName: 'jsonrpcTimeoutSuccess',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcTimeoutSuccess',
                params: [5, 6]
            }, {
                type: 'notification',
                methodName: 'jsonrpcTimeoutSuccess',
                params: ['ok', 'no']
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            assert.deepEqual(res, [null, null, null, null]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_some_notification_all_success', function (done) {
        Jsonrpc.batch([
            {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 1]
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            assert.deepEqual(res, [{
                error: null,
                result: 3
            }, null, {
                error: null,
                result: 2
            }, null]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_some_notification_some_success', function (done) {
        Jsonrpc.batch([
            {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcError',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [1, 1]
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            assert.deepEqual(res, [{
                error: null,
                result: 3
            }, null, {
                error: {
                    code: 0,
                    message: '[1,1]'
                },
                result: null
            }, null]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_some_notification_all_error', function (done) {
        Jsonrpc.batch([
            {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcError',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [1, 1]
            }, {
                type: 'notification',
                methodName: 'jsonrpcError',
                params: [1, 2]
            }
        ]).then((res) => {
            assert.deepEqual(res, [{
                result: null,
                error: {
                    code: 0,
                    message: '[1,2]'
                }
            }, null, {
                result: null,
                error: {
                    code: 0,
                    message: '[1,1]'
                }
            }, null]);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it('batch_requests_some_notification_some_timeout', function (done) {
        Jsonrpc.batch([
            {
                type: 'request',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcTimeoutError',
                params: ['ok', 'no']
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            done(res);
        }).catch(() => {
            done();
        });
    });

    it('batch_requests_some_notification_some_timeout_success_one_Error', function (done) {
        Jsonrpc.batch([
            {
                type: 'request',
                methodName: 'jsonrpcError',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'jsonrpcTimeoutError',
                params: [5, 6]
            }, {
                type: 'request',
                methodName: 'jsonrpcTimeoutSuccess',
                params: [1, 1]
            }, {
                type: 'notification',
                methodName: 'jsonrpcSuccess',
                params: [1, 2]
            }
        ]).then((res) => {
            done(res);
        }).catch(() => {
            done();
        });
    });
});