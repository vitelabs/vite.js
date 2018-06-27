const assert = require('assert');
import ViteJS from '../index.js';

const Jsonrpc = new ViteJS.Jsonrpc({
    timeout: 200
});
let reset = false;

// reset some wrong
// setTimeout(() => {
//     reset = true;
//     Jsonrpc.reset();
// }, 100);

describe('Jsonrpc Base Library Test: lib/tools/Jsonrpc.js', function () {

    describe('payload should be in the correct format', function () {
        const Method_Name = 'request_payload_method';
        const Params = { x: 1, y: 2 };

        const Request_Payload = Jsonrpc._getRequestPayload(Method_Name, Params);
        const Request_Payload_Result = {
            jsonrpc: '2.0',
            method: Method_Name,
            params: Params,
            id: Jsonrpc._requestId
        };
        const Request_Payload_No_Method = Jsonrpc._getRequestPayload();

        const Notification_Payload = Jsonrpc._getNotificationPayload(Method_Name, Params);
        const Notification_Payload_Result = {
            jsonrpc: '2.0',
            method: Method_Name,
            params: Params
        };
        const Notification_Payload_No_Method = Jsonrpc._getNotificationPayload();

        let currentId = Jsonrpc._requestId;
        const Batch_Payload = Jsonrpc._getBatchPayload([
            {
                type: 'request',
                methodName: 'request1',
                params: [1, 2]
            }, {
                type: 'notification',
                methodName: 'notification1'
            }, {
                type: 'notification',
                methodName: 'notification2',
                params: ['ok', 'no']
            }, {
                type: 'request',
                methodName: 'request1'
            }
        ]);
        const Batch_Payload_Result = [
            {
                jsonrpc: '2.0',
                method: 'request1',
                params: [1, 2],
                id: currentId + 1
            }, {
                jsonrpc: '2.0',
                method: 'notification1'
            }, {
                jsonrpc: '2.0',
                method: 'notification2',
                params: ['ok', 'no']
            }, {
                jsonrpc: '2.0',
                method: 'request1',
                id: currentId + 2
            },
        ];
        const Batch_Payload_No_Requests = Jsonrpc._getBatchPayload();
        const Batch_Payload_No_Requests_Length = Jsonrpc._getBatchPayload([]);

        it('request_payload', function () {
            assert.deepEqual(Request_Payload, Request_Payload_Result);
        });
        it('request_payload_no_method', function () {
            assert.deepEqual(Request_Payload_No_Method instanceof Error, true);
        });

        it('notification_payload', function () {
            assert.deepEqual(Notification_Payload, Notification_Payload_Result);
        });
        it('notification_payload_no_method', function () {
            assert.deepEqual(Notification_Payload_No_Method instanceof Error, true);
        });

        it('batch_payload', function () {
            assert.deepEqual(Batch_Payload, Batch_Payload_Result);
        });
        it('batch_payload_no_requests', function () {
            assert.deepEqual(Batch_Payload_No_Requests instanceof Error, true);
        });
        it('batch_payload_no_requests_length', function () {
            assert.deepEqual(Batch_Payload_No_Requests_Length instanceof Error, true);
        });
    });

    describe('jsonrpc_request', function () {
        it('request_no_method', function (done) {
            Jsonrpc.request().then(() => {
                done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
            }).catch((err) => {
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
                done(reset ? null : err);
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
                done(reset ? null : err);
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
                done(reset ? null : err);
            });
        });

        it('request_timeout_error', function (done) {
            const Params = [1, 2];
            Jsonrpc.request('jsonrpcTimeoutError', Params).then((res) => {
                done('it should be timeout, but not.');
            }).catch((err) => {
                done();
            });
        });
    });

    describe('jsonrpc_notification', function () {
        it('notification_no_method', function (done) {
            Jsonrpc.notification().then(() => {
                done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
            }).catch((err) => {
                done();
            });
        });

        it('notification_success', function (done) {
            Jsonrpc.notification('jsonrpcSuccess', [1, 2]).then((result) => {
                assert.equal(result, null);
                done();
            }).catch((err) => {
                done(reset ? null : err);
            });
        });

        it('notification_error', function (done) {
            Jsonrpc.notification('jsonrpcError', [1, 2]).then((result) => {
                assert.equal(result, null);
                done();
            }).catch((err) => {
                done(reset ? null : err);
            });
        });

        it('notification_timeout_success', function (done) {
            const Params = [1, 2];
            Jsonrpc.notification('jsonrpcTimeoutSuccess', Params).then((res) => {
                assert.equal(res, null);
                done();
            }).catch((err) => {
                done(reset ? null : err);
            });
        });

        it('notification_timeout_error', function (done) {
            const Params = [1, 2];
            Jsonrpc.notification('jsonrpcTimeoutError', Params).then((res) => {
                done('it should be timeout, but not.');
            }).catch((err) => {
                done();
            });
        });
    });

    describe('jsonrpc_batch', function () {
        it('batch_no_requests', function (done) {
            Jsonrpc.batch().then(() => {
                done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
            }).catch((err) => {
                done();
            });
        });

        it('batch_requests_no_length', function (done) {
            Jsonrpc.batch([]).then(() => {
                done('the test case don\'t have param \'methodName\', should return error, but now, return success.');
            }).catch((err) => {
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
                done(reset ? null : err);
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
                done(reset ? null : err);
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
                done(reset ? null : err);
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
            }).catch((err) => {
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
                done(reset ? null : err);
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
                done(reset ? null : err);
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
                done(reset ? null : err);
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
                done(reset ? null : err);
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
            }).catch((err) => {
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
                done(reset ? null : err);
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
                done(reset ? null : err);
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
                done(reset ? null : err);
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
                done(reset ? null : err);
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
            }).catch((err) => {
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
            }).catch((err) => {
                done();
            });
        });
    });
});