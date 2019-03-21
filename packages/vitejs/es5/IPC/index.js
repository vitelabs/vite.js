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
var ipc_ws_1 = require("communication/ipc_ws");
var net = require('net');
var IpcRpc = (function (_super) {
    __extends(IpcRpc, _super);
    function IpcRpc(path, timeout, options) {
        if (path === void 0) { path = ''; }
        if (timeout === void 0) { timeout = 60000; }
        if (options === void 0) { options = {
            delimiter: '\n',
            retryTimes: 10,
            retryInterval: 10000
        }; }
        var _this = _super.call(this, {
            onEventTypes: ['error', 'end', 'timeout', 'data', 'close', 'connect'],
            sendFuncName: 'write',
            path: path
        }) || this;
        if (!path) {
            console.error(_this.ERRORS.CONNECT());
            return _this.ERRORS.CONNECT();
        }
        _this.type = 'ipc';
        _this.timeout = timeout;
        _this.delimiter = options.delimiter;
        var times = 0;
        _this.socket = net.connect({ path: path });
        _this.socket.on('connect', function () {
            times = 0;
            _this._connected();
        });
        _this.socket.on('close', function () {
            _this._closed();
            if (times > options.retryTimes) {
                return;
            }
            setTimeout(function () {
                times++;
                _this.reconnect();
            }, options.retryInterval);
        });
        _this.socket.on('error', function () {
            _this._errored();
        });
        _this.socket.on('end', function (err) {
            _this._connectEnd && _this._connectEnd(err);
        });
        _this.socket.on('timeout', function (err) {
            _this._connectTimeout && _this._connectTimeout(err);
        });
        var ipcBuffer = '';
        _this.socket.on('data', function (data) {
            data = data ? data.toString() : '';
            if (data.slice(-1) !== _this.delimiter || data.indexOf(_this.delimiter) === -1) {
                ipcBuffer += data;
                return;
            }
            data = ipcBuffer + data;
            ipcBuffer = '';
            data = data.split(_this.delimiter);
            _this._parse(data);
        });
        return _this;
    }
    IpcRpc.prototype.reconnect = function () {
        this.socket.connect({ path: this.path });
    };
    IpcRpc.prototype.disconnect = function () {
        this.socket && this.socket.destroy && this.socket.destroy();
    };
    return IpcRpc;
}(ipc_ws_1.default));
var IPC_RPC = IpcRpc;
exports.default = IPC_RPC;
