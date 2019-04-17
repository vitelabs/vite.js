"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var communication_js_1 = require("./../communication/communication.js");
var XMLHttpRequest = typeof window !== 'undefined' && window.XMLHttpRequest
    ? window.XMLHttpRequest : require('xhr2');
var HttpRpc = (function (_super) {
    __extends(HttpRpc, _super);
    function HttpRpc(host, timeout, options) {
        if (host === void 0) { host = 'http://localhost:8415'; }
        if (timeout === void 0) { timeout = 60000; }
        if (options === void 0) { options = { headers: [] }; }
        var _this = _super.call(this) || this;
        _this.type = 'http';
        _this.host = host;
        _this.timeout = timeout;
        _this.headers = options.headers;
        return _this;
    }
    HttpRpc.prototype._getRequest = function () {
        var request = new XMLHttpRequest();
        request.open('POST', this.url);
        request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        this.headers && this.headers.forEach(function (header) {
            request.setRequestHeader(header.name, header.value);
        });
        return request;
    };
    HttpRpc.prototype._send = function (payload) {
        var _this = this;
        return new Promise(function (res, rej) {
            var resetAbort = false;
            var request = _this._getRequest();
            var _request = _this._addReq({
                request: request,
                rej: function (err) {
                    resetAbort = true;
                    rej(err);
                }
            });
            var clearRequestAndTimeout = function () {
                requestTimeout && clearTimeout(requestTimeout);
                requestTimeout = null;
                _this._removeReq(_request);
            };
            var requestTimeout = _this.timeout ? setTimeout(function () {
                if (resetAbort) {
                    return;
                }
                request.abort();
                clearRequestAndTimeout();
                return rej(_this.ERRORS.TIMEOUT(_this.timeout));
            }, _this.timeout) : null;
            request.onreadystatechange = function () {
                if (request.readyState !== 4 || resetAbort) {
                    return;
                }
                clearRequestAndTimeout();
                var result = request.responseText;
                try {
                    result = result ? JSON.parse(result) : null;
                    if (result && result.error) {
                        return rej(result);
                    }
                }
                catch (e) {
                    return rej(_this.ERRORS.INVAILID_RESPONSE(result));
                }
                return res(result);
            };
            try {
                request.send(JSON.stringify(payload));
            }
            catch (err) {
                clearRequestAndTimeout();
                return rej(_this.ERRORS.CONNECT(_this.url));
            }
        });
    };
    HttpRpc.prototype.request = function (methodName, params) {
        var _this = this;
        var requestObj = this._getRequestPayload(methodName, params);
        if (requestObj instanceof Error) {
            return Promise.reject(requestObj);
        }
        return this._send(requestObj).then(function (res) {
            if (!res) {
                throw _this.ERRORS.INVAILID_RESPONSE(res);
            }
            return {
                result: res.result || null,
                error: res.error || null
            };
        });
    };
    HttpRpc.prototype.notification = function (methodName, params) {
        var requestObj = this._getNotificationPayload(methodName, params);
        if (requestObj instanceof Error) {
            return Promise.reject(requestObj);
        }
        return this._send(requestObj);
    };
    HttpRpc.prototype.batch = function (requests) {
        if (requests === void 0) { requests = []; }
        var _requests = this._getBatchPayload(requests);
        if (_requests instanceof Error) {
            return Promise.reject(_requests);
        }
        return this._send(_requests).then(function (results) {
            results = (results || []).sort(function (a, b) { return a.id - b.id; });
            var _results = [];
            var i = 0;
            _requests.forEach(function (_request) {
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
    };
    return HttpRpc;
}(communication_js_1.default));
exports.HTTP_RPC = HttpRpc;
exports.default = exports.HTTP_RPC;
