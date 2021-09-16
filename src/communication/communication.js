const jsonrpc = require('jsonrpc-lite');

import errors from './errors';

class Communication {
    constructor() {
        this.ERRORS = errors;
        this.jsonrpc = jsonrpc;

        this._requestManager = {};
        this._requestId = 0;
    }

    abort() {
        Object.values(this._requestManager).forEach(({ request, rej }) => {
            request.abort();
            rej(this.ERRORS.ABORT());
        });
        this._requestManager = {};
    }

    _addReq({ request, rej }) {
        const _request = { request, rej };
        this._requestManager[request.id] = _request;
        return _request;
    }

    _removeReq(_request) {
        delete this._requestManager[_request.request.id];
    }

    _getRequestPayload(methodName, params) {
        if (!methodName) {
            return errors.PARAMS();
        }

        this._requestId++;
        return this.jsonrpc.request(this._requestId, methodName, params);
    }

    _getNotificationPayload(methodName, params) {
        if (!methodName) {
            return errors.PARAMS();
        }

        return this.jsonrpc.notification(methodName, params);
    }

    _getBatchPayload(requests = []) {
        if (!requests || !requests.length) {
            return errors.PARAMS();
        }

        const _requests = [];
        for (let i = 0; i < requests.length; i++) {
            const request = requests[i];

            if (!request || !request.type || (request.type !== 'request' && request.type !== 'notification')) {
                return errors.PARAMS();
            }

            const requestObj = request.type === 'notification'
                ? this._getNotificationPayload(request.methodName, request.params)
                : this._getRequestPayload(request.methodName, request.params);

            if (requestObj instanceof Error) {
                return requestObj;
            }

            _requests.push(requestObj);
        }

        return _requests;
    }
}

export default Communication;
