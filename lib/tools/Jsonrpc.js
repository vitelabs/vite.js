const jsonrpcLite = require('jsonrpc-lite');
const XMLHttpRequest = typeof window !== 'undefined' && window.XMLHttpRequest ?
    window.XMLHttpRequest : require('xhr2');
const Promise = typeof window !== 'undefined' && window.Promise ?
    window.Promise :
    typeof Promise !== 'undefined' ? Promise : require('es6-promise');
import errors from './errors';

// ...maybe problems
let requestCount = 0;

class Jsonrpc {
    constructor({ host = 'http://localhost:8415', headers, timeout = 0 } = { host: 'http://localhost:8415', headers, timeout: 0 }) {
        this.host = host;
        this.timeout = timeout;
        this.headers = headers;
        this._requestId = 0;
        this._requestManager = [];
    }

    reset({ host = 'http://localhost:8415', timeout = 0, headers, abort = true } = { host: 'http://localhost:8415', headers, timeout: 0, abort: true }) {
        // something wrong ??
        // if (abort) {
        //     this._requestManager.forEach(({ request, rej }) => {
        //         request.abort();
        //         rej(errors.ABORT_ERROR());
        //     });
        //     this._requestManager = [];
        // }

        this.host = host;
        this.timeout = timeout;
        this.headers = headers;
    }

    _getRequest() {
        let request = new XMLHttpRequest();

        request.open('POST', this.host);
        // set headers
        request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        this.headers && this.headers.forEach(function (header) {
            request.setRequestHeader(header.name, header.value);
        });

        return request;
    }

    _getRequestPayload(methodName, params) {
        if (!methodName) {
            return errors.PARAMS_ERROR();
        }

        this._requestId++;
        return jsonrpcLite.request(this._requestId, methodName, params);
    }

    _getNotificationPayload(methodName, params) {
        if (!methodName) {
            return errors.PARAMS_ERROR();
        }

        return jsonrpcLite.notification(methodName, params);
    }

    _getBatchPayload(requests = []) {
        if (!requests || !requests.length) {
            return errors.PARAMS_ERROR();
        }

        let _requests = [];
        for (let i = 0; i < requests.length; i++) {
            let request = requests[i];

            if (!request || !request.type || (request.type !== 'request' && request.type !== 'notification')) {
                return errors.PARAMS_ERROR();
            }

            let requestObj = request.type === 'notification' ?
                this._getNotificationPayload(request.methodName, request.params) :
                this._getRequestPayload(request.methodName, request.params);

            if (requestObj instanceof Error) {
                return requestObj;
            }

            _requests.push(requestObj);
        }

        return _requests;
    }

    _send(payload) {
        return new Promise((res, rej) => {
            let request = this._getRequest();
            let _request = {
                id: ++requestCount,
                request,
                rej
            };
            this._requestManager.push(_request);

            let clearRequestAndTimeout = () => {
                requestTimeout && clearTimeout(requestTimeout);
                requestTimeout = null;
                let i;
                for (i = 0; i < this._requestManager.length; i++) {
                    if (this._requestManager[i].requestCount === _request.id) {
                        break;
                    }
                }
                if (i === this._requestManager.length) {
                    return;
                }
                this._requestManager.splice(i, 1);
            };

            let requestTimeout = this.timeout ? setTimeout(() => {
                request.abort();
                clearRequestAndTimeout();
                return rej(errors.TIMEOUT_ERROR());
            }, this.timeout) : null;

            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }
                clearRequestAndTimeout();

                let result = request.responseText;
                try {
                    result = result ? JSON.parse(result) : null;
                } catch (e) {
                    return rej(errors.INVAILID_RESPONSE(result));
                }

                return res(result);
            };

            try {
                request.send(JSON.stringify(payload));
            } catch (err) {
                clearRequestAndTimeout();
                let error = new Error(errors.CONNECT_ERROR());
                return rej(error);
            }
        });
    }

    request(methodName, params) {
        let requestObj = this._getRequestPayload(methodName, params);

        if (requestObj instanceof Error) {
            return Promise.reject(requestObj);
        }

        return this._send(requestObj).then((res) => {
            if (!res) {
                throw errors.INVAILID_RESPONSE(res);
            }

            return {
                result: res.result || null,
                error: res.error || null
            };
        });
    }

    notification(methodName, params) {
        let requestObj = this._getNotificationPayload(methodName, params);

        if (requestObj instanceof Error) {
            return Promise.reject(requestObj);
        }

        return this._send(requestObj);
    }

    /**
     * batch
     * @param {*} requests [{type, methodName, params}]
     */
    batch(requests = []) {
        let _requests = this._getBatchPayload(requests);

        if (_requests instanceof Error) {
            return Promise.reject(_requests);
        }

        return this._send(_requests).then((results) => {
            results = (results || []).sort((a, b) => {
                return a.id - b.id;
            });

            let _results = [];
            let i = 0;
            _requests.forEach((_request) => {
                // notification
                if (!_request.id) {
                    _results.push(null);
                    return;
                }

                _results.push({
                    result: results[i].result || null,
                    error: results[i].error || null
                });
                i++;
            });

            results = null;
            _requests = null;

            return _results;
        });
    }
}

export default Jsonrpc;