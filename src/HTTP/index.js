import Communication from '~@vite/vitejs-communication/communication.js';
import { AbortController } from 'node-abort-controller';
const fetch = typeof window !== 'undefined' && window.fetch
    ? window.fetch : require('node-fetch').default;

class HttpRpc extends Communication {
    constructor(host = 'http://localhost:8415', timeout = 60000, options = { headers: [] }) {
        super();

        this.type = 'http';
        this.host = host;
        this.timeout = timeout;
        this.headers = options.headers;
        this.requestId = 0;
    }

    _getRequest(payload) {
        const headers = {'Content-Type': 'application/json;charset=utf-8'};
        this.headers && this.headers.forEach(function (header) {
            headers[header.name] = header.value;
        });

        const controller = new AbortController();
        const request = fetch(this.host, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        request.id = this.requestId++;
        request.abort = () => controller.abort();

        return request;
    }

    _send(payload) {
        return new Promise((res, rej) => {
            // Init request
            let resetAbort = false;
            const request = this._getRequest(payload);
            const _request = this._addReq({
                request,
                rej: err => {
                    resetAbort = true;
                    rej(err);
                }
            });

            const clearRequestAndTimeout = () => {
                requestTimeout && clearTimeout(requestTimeout);
                requestTimeout = null;
                this._removeReq(_request);
            };

            // Set request timeout
            let requestTimeout = this.timeout ? setTimeout(() => {
                if (resetAbort) {
                    return;
                }

                request.abort();
                clearRequestAndTimeout();
                return rej(this.ERRORS.TIMEOUT(this.timeout));
            }, this.timeout) : null;

            // Request finish
            request.then(response => {
                if (!response.ok) {
                    return rej(this.ERRORS.INVAILID_RESPONSE(response));
                }
                return response.json().then(responseText => {
                    if (resetAbort) {
                        return;
                    }
                    clearRequestAndTimeout();
                    const result = responseText;
                    if (result && result.error) {
                        return rej(result);
                    }
                    return res(result);
                }).catch(err => rej(this.ERRORS.INVAILID_RESPONSE(err)));
            }).catch(err => {
                clearRequestAndTimeout();
                return rej(this.ERRORS.CONNECT(this.host));
            });
        });
    }

    request(methodName, params) {
        const requestObj = this._getRequestPayload(methodName, params);

        if (requestObj instanceof Error) {
            return Promise.reject(requestObj);
        }

        return this._send(requestObj).then(res => {
            if (!res) {
                throw this.ERRORS.INVAILID_RESPONSE(res);
            }

            return {
                result: res.result || null,
                error: res.error || null
            };
        });
    }

    sendNotification(methodName, params) {
        const requestObj = this._getNotificationPayload(methodName, params);

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

        return this._send(_requests).then(results => {
            results = (results || []).sort((a, b) => a.id - b.id);

            const _results = [];
            let i = 0;
            _requests.forEach(_request => {
                // notification
                if (!_request.id) {
                    _results.push(null);
                    return;
                }
                _results.push({
                    result: results && results[i] ? results[i].result || null : null,
                    error: results && results[i] ? results[i].error || null : null
                });
                i++;
            });

            results = null;
            _requests = null;

            return _results;
        });
    }
}

export const HTTP_RPC = HttpRpc;
export default HTTP_RPC;

