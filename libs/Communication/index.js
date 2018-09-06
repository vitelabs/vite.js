import errors from './errors';
const jsonrpc = require('jsonrpc-lite');

class Communication {
    constructor() {
        this.ERRORS = errors;
        this.jsonrpc = jsonrpc;

        this._requestManager = [];
        this._requestId = 0;
    }

    reset(abort = true) {
        if (!abort) {
            return;
        }

        this._requestManager.forEach(({ request, rej }) => {
            request.abort();
            rej( this.ERRORS.ABORT() );
        });
        this._requestManager = [];
    }

    _addReq({ request, rej }) {
        let _request = { request, rej };
        this._requestManager.push(_request);
        return _request;
    }

    _removeReq(_request) {
        for (let i = 0; i < this._requestManager.length; i++) {
            if (this._requestManager[i] === _request) {
                this._requestManager.splice(i, 1);
                break;
            }
        }
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

        let _requests = [];
        for (let i = 0; i < requests.length; i++) {
            let request = requests[i];

            if (!request || !request.type || (request.type !== 'request' && request.type !== 'notification')) {
                return errors.PARAMS();
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
}

export default Communication;