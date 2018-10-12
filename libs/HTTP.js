import Communication from './Communication/index.js';
const XMLHttpRequest = typeof window !== 'undefined' && window.XMLHttpRequest ?
    window.XMLHttpRequest : require('xhr2');

class HTTP_RPC extends Communication {
    constructor({ 
        host = 'http://localhost:8415', 
        headers, 
        timeout = 0 
    }) {
        super();

        this.host = host;
        this.timeout = timeout;
        this.headers = headers;
    }

    _getRequest() {
        let request = new XMLHttpRequest();

        request.open('POST', this.host);

        // Set headers
        request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        this.headers && this.headers.forEach(function (header) {
            request.setRequestHeader(header.name, header.value);
        });

        return request;
    }

    _send(payload) {
        return new Promise((res, rej) => {
            // Init request
            let resetAbort = false;
            let request = this._getRequest();
            let _request = this._addReq({
                request,
                rej: (err)=>{
                    resetAbort = true;
                    rej(err);
                }
            });
            
            let clearRequestAndTimeout = () => {
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
                return rej( this.ERRORS.TIMEOUT(this.timeout) );
            }, this.timeout) : null;

            // Request finish
            request.onreadystatechange = () => {
                if (request.readyState !== 4 || resetAbort) {
                    return;
                }
 
                clearRequestAndTimeout();
                let result = request.responseText;

                try {
                    result = result ? JSON.parse(result) : null;
                    if (result && result.error) {
                        return rej(result);
                    }
                } catch (e) {
                    return rej( this.ERRORS.INVAILID_RESPONSE(result) );
                }

                return res(result);
            };

            // Send request
            try {
                request.send( JSON.stringify(payload) );
            } catch (err) {
                clearRequestAndTimeout();
                return rej( this.ERRORS.CONNECT(this.host) );
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
                throw this.ERRORS.INVAILID_RESPONSE(res);
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

export default HTTP_RPC;
