const jsonrpcLite = require('jsonrpc-lite');
const XMLHttpRequest = typeof window !== 'undefined' && window.XMLHttpRequest ? window.XMLHttpRequest : require('xhr2');
const Promise = typeof window !== 'undefined' && window.Promise ? window.Promise : require('es6-promise');

class Jsonrpc {
    constructor(host, headers, timeout) {
        this.host = host || 'http://localhost:8415';
        this.timeout = timeout || 0;
        this.headers = headers;
        this._requestId = 0;
    }

    reset(host, timeout = 0, headers) {
        // [TODO]
        // this.host = host;
        // this.timeout = timeout;
        // this.headers = headers;
    }

    _getRequest(async = true) {
        let request = new XMLHttpRequest();

        async && (request.timeout = this.timeout);

        request.open('POST', this.host, async);

        // set headers
        request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        this.headers && this.headers.forEach(function (header) {
            request.setRequestHeader(header.name, header.value);
        });

        return request;
    }

    _getRequestPayload(methodName, params) {
        this._requestId++;
        return jsonrpcLite.request(this._requestId, methodName, params);
    }

    _getNotificationPayload(methodName, params) {
        return jsonrpcLite.notification(methodName, params);
    }

    _batchPayload(requests = []) {
        if (!requests || !this.requests.length) {
            return new Error(`CONNECTION ERROR: Couldn\'t connect to node ${host}.`);
        }

        let _requests = [];
        let notificationNum = 0;
        for (let i = 0; i < requests.length; i++) {
            let request = requests[i];

            // error
            if (!request || !request.type || (request.type !== 'request' && request.type !== 'notification')) {
                return new Error(`CONNECTION ERROR: Couldn\'t connect to node ${host}.`);
            }

            if (request.type === 'notification') {
                notificationNum++;
                _requests.push(this._getNotificationPayload(request.methodName, request.params));
                continue;
            }

            _requests.push(this._getRequestPayload(request.methodName, request.params));
        }

        return _requests;
    }

    _send(payload) {
        return new Promise((res, rej) => {
            let request = this._getRequest();
            request.onreadystatechange = () => {
                if (request.readyState !== 4 || request.timeout === 1) {
                    return;
                }

                let result = request.responseText;
                let error = null;

                try {
                    result = JSON.parse(result);
                } catch (e) {
                    error = !!result && !!result.error && !!result.error.message ?
                        new Error(result.error.message) :
                        new Error('Invalid JSON RPC response: ' + JSON.stringify(result));
                }

                if (error) {
                    return rej(error);
                }
                return res(result);
            };

            request.ontimeout = () => {
                let error = new Error(`CONNECTION TIMEOUT: timeout of ${this.timeout} ms achived`);
                return rej(error);
            };

            try {
                request.send(JSON.stringify(payload));
            } catch (err) {
                let error = new Error(`CONNECTION ERROR: Couldn\'t connect to node ${host}.`);
                return rej(error);
            }
        });
    }

    request(methodName, params) {
        return this._send(this._getRequestPayload(methodName, params));
    }

    notification(methodName, params) {
        return this._send(this._getNotificationPayload(methodName, params));
    }

    /**
     * batch
     * @param {*} requests [{type, methodName, params}]
     */
    batch(requests = []) {
        let _requests = this._batchPayload(requests);

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

                _results.push(results[i]);
                i++;
            });

            results = null;
            _requests = null;

            return _results;
        });
    }
}

module.exports = Jsonrpc;