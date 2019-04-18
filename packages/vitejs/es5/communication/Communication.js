"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonrpc = require('jsonrpc-lite');
var errors_1 = require("./errors");
var Communication = (function () {
    function Communication() {
        this.ERRORS = errors_1.default;
        this.jsonrpc = jsonrpc;
        this._requestManager = [];
        this._requestId = 0;
    }
    Communication.prototype.abort = function () {
        var _this = this;
        this._requestManager.forEach(function (_a) {
            var request = _a.request, rej = _a.rej;
            request.abort();
            rej(_this.ERRORS.ABORT());
        });
        this._requestManager = [];
    };
    Communication.prototype._addReq = function (_a) {
        var request = _a.request, rej = _a.rej;
        var _request = { request: request, rej: rej };
        this._requestManager.push(_request);
        return _request;
    };
    Communication.prototype._removeReq = function (_request) {
        for (var i = 0; i < this._requestManager.length; i++) {
            if (this._requestManager[i] === _request) {
                this._requestManager.splice(i, 1);
                break;
            }
        }
    };
    Communication.prototype._getRequestPayload = function (methodName, params) {
        if (!methodName) {
            return errors_1.default.PARAMS();
        }
        this._requestId++;
        return this.jsonrpc.request(this._requestId, methodName, params);
    };
    Communication.prototype._getNotificationPayload = function (methodName, params) {
        if (!methodName) {
            return errors_1.default.PARAMS();
        }
        return this.jsonrpc.notification(methodName, params);
    };
    Communication.prototype._getBatchPayload = function (requests) {
        if (requests === void 0) { requests = []; }
        if (!requests || !requests.length) {
            return errors_1.default.PARAMS();
        }
        var _requests = [];
        for (var i = 0; i < requests.length; i++) {
            var request = requests[i];
            if (!request || !request.type || (request.type !== 'request' && request.type !== 'notification')) {
                return errors_1.default.PARAMS();
            }
            var requestObj = request.type === 'notification'
                ? this._getNotificationPayload(request.methodName, request.params)
                : this._getRequestPayload(request.methodName, request.params);
            if (requestObj instanceof Error) {
                return requestObj;
            }
            _requests.push(requestObj);
        }
        return _requests;
    };
    return Communication;
}());
exports.default = Communication;
