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
var communication_js_1 = require("./communication.js");
var IpcWs = (function (_super) {
    __extends(IpcWs, _super);
    function IpcWs(_a) {
        var onEventTypes = _a.onEventTypes, sendFuncName = _a.sendFuncName, path = _a.path;
        var _this = _super.call(this) || this;
        _this.path = path;
        _this._onEventTypes = onEventTypes || [];
        _this._sendFuncName = sendFuncName;
        _this.connectStatus = false;
        _this.responseCbs = {};
        _this._connectEnd = null;
        _this._connectErr = null;
        _this._connectTimeout = null;
        _this._connectConnect = null;
        _this._connectClose = null;
        _this.subscribeMethod = null;
        return _this;
    }
    IpcWs.prototype._connected = function () {
        this.connectStatus = true;
        this._connectConnect && this._connectConnect();
    };
    IpcWs.prototype._closed = function () {
        this.connectStatus = false;
        this._connectClose && this._connectClose();
    };
    IpcWs.prototype._errored = function (err) {
        this._connectErr && this._connectErr(err);
    };
    IpcWs.prototype._parse = function (data) {
        var _this = this;
        var results = [];
        data.forEach(function (ele) {
            if (!ele) {
                return;
            }
            try {
                var res = JSON.parse(ele);
                if (!(res instanceof Array) && res.result) {
                    try {
                        res.result = JSON.parse(res.result);
                    }
                    catch (e) {
                    }
                }
                results.push(res);
            }
            catch (error) {
            }
        });
        results.forEach(function (ele) {
            if (!(ele instanceof Array) && !ele.id) {
                _this.subscribeMethod && _this.subscribeMethod(ele);
                return;
            }
            if (ele.id) {
                _this.responseCbs[ele.id] && _this.responseCbs[ele.id](ele);
                return;
            }
            for (var i = 0; i < ele.length; i++) {
                if (!ele[i].id) {
                    _this.subscribeMethod && _this.subscribeMethod(ele[i]);
                    continue;
                }
                var id = ele[i].id;
                if (!_this.responseCbs[id]) {
                    continue;
                }
                _this.responseCbs[id](ele);
            }
        });
    };
    IpcWs.prototype._checkOnType = function (type) {
        var i = this._onEventTypes.indexOf(type);
        if (i < 0) {
            return false;
        }
        var eventType = type.substring(0, 1).toUpperCase() + type.substring(1);
        return "_connect" + eventType;
    };
    IpcWs.prototype._onSend = function (payloads) {
        var _this = this;
        var id = getIdFromPayloads(payloads);
        if (!id) {
            return;
        }
        return new Promise(function (res, rej) {
            var resetAbort = false;
            var request = {
                id: id,
                abort: function () {
                    resetAbort = true;
                }
            };
            _this.responseCbs[id] = function (data) {
                clearRequestAndTimeout();
                if (data && data.error) {
                    return rej(data);
                }
                res(data);
            };
            var _request = _this._addReq({
                request: request,
                rej: function (err) {
                    clearRequestAndTimeout();
                    rej(err);
                }
            });
            var clearRequestAndTimeout = function () {
                requestTimeout && clearTimeout(requestTimeout);
                requestTimeout = null;
                _this._removeReq(_request);
                for (var key in _this.responseCbs) {
                    if (_this.responseCbs[key] === id) {
                        delete _this.responseCbs[key];
                        break;
                    }
                }
            };
            var requestTimeout = _this.timeout ? setTimeout(function () {
                if (resetAbort) {
                    return;
                }
                clearRequestAndTimeout();
                return rej(_this.ERRORS.TIMEOUT(_this.timeout));
            }, _this.timeout) : null;
        });
    };
    IpcWs.prototype._send = function (payloads) {
        if (!this.connectStatus) {
            return Promise.reject(this.ERRORS.CONNECT(this.path));
        }
        this.socket[this._sendFuncName](JSON.stringify(payloads));
        return this._onSend(payloads);
    };
    IpcWs.prototype.on = function (type, cb) {
        var eventType = this._checkOnType(type);
        if (!eventType) {
            return this.ERRORS.IPC_ON(type);
        }
        if (!cb) {
            return this.ERRORS.IPC_ON_CB(type);
        }
        this[eventType] = cb;
    };
    IpcWs.prototype.remove = function (type) {
        var eventType = this._checkOnType(type);
        eventType && (this[eventType] = null);
    };
    IpcWs.prototype.request = function (methodName, params) {
        var requestObj = this._getRequestPayload(methodName, params);
        if (requestObj instanceof Error) {
            return Promise.reject(requestObj);
        }
        return this._send(requestObj);
    };
    IpcWs.prototype.sendNotification = function (methodName, params) {
        var requestObj = this._getNotificationPayload(methodName, params);
        if (requestObj instanceof Error) {
            return requestObj;
        }
        this._send(requestObj);
    };
    IpcWs.prototype.batch = function (requests) {
        if (requests === void 0) { requests = []; }
        var _requests = this._getBatchPayload(requests);
        if (_requests instanceof Error) {
            return Promise.reject(_requests);
        }
        return this._send(_requests);
    };
    IpcWs.prototype.subscribe = function (callback) {
        if (typeof callback !== 'function') {
            throw new Error('[Error] callback should be a function.');
        }
        this.subscribeMethod = callback;
    };
    IpcWs.prototype.unsubscribe = function () {
        this.subscribeMethod = null;
    };
    return IpcWs;
}(communication_js_1.default));
var IPC_WS = IpcWs;
exports.default = IPC_WS;
function getIdFromPayloads(payloads) {
    var id;
    if (payloads instanceof Array) {
        for (var i = 0; i < payloads.length; i++) {
            if (payloads[i].id) {
                id = payloads[i].id;
                break;
            }
        }
    }
    else {
        id = payloads.id || null;
    }
    return id;
}
