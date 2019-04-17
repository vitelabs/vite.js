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
var ipc_ws_1 = require("./../communication/ipc_ws");
var Websocket = require('websocket').w3cwebsocket;
var WsRpc = (function (_super) {
    __extends(WsRpc, _super);
    function WsRpc(path, timeout, options) {
        if (path === void 0) { path = 'ws://localhost:31420'; }
        if (timeout === void 0) { timeout = 60000; }
        if (options === void 0) { options = {
            protocol: '',
            headers: '',
            clientConfig: '',
            retryTimes: 10,
            retryInterval: 10000
        }; }
        var _this = _super.call(this, {
            onEventTypes: ['error', 'close', 'connect'],
            sendFuncName: 'send',
            path: path
        }) || this;
        if (!path) {
            console.error(_this.ERRORS.CONNECT(path));
            return _this.ERRORS.CONNECT(path);
        }
        _this.timeout = timeout;
        _this.protocol = options.protocol;
        _this.headers = options.headers;
        _this.clientConfig = options.clientConfig;
        _this.reconnect();
        var times = 0;
        _this.on('connect', function () {
            times = 0;
        });
        _this.on('close', function () {
            if (times > options.retryTimes) {
                return;
            }
            setTimeout(function () {
                times++;
                _this.reconnect();
            }, options.retryInterval);
        });
        return _this;
    }
    WsRpc.prototype.reconnect = function () {
        var _this = this;
        this.socket = new Websocket(this.path, this.protocol, null, this.headers, null, this.clientConfig);
        this.socket.onopen = function () {
            (_this.socket.readyState === _this.socket.OPEN) && _this._connected();
        };
        this.socket.onclose = function () {
            _this._closed();
        };
        this.socket.onerror = function () {
            _this._errored();
        };
        this.socket.onmessage = function (e) {
            var data = (typeof e.data === 'string') ? e.data : '';
            _this._parse([data]);
        };
    };
    WsRpc.prototype.disconnect = function () {
        this.socket && this.socket.close && this.socket.close();
    };
    return WsRpc;
}(ipc_ws_1.default));
exports.WS_RPC = WsRpc;
exports.default = exports.WS_RPC;
