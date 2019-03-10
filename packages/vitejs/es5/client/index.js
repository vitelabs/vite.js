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
var txBlock_1 = require("./txBlock");
var ledger_1 = require("./ledger");
var constant_1 = require("constant");
var netProcessor_1 = require("netProcessor");
var client = (function (_super) {
    __extends(client, _super);
    function client(provider, firstConnect) {
        var _this = _super.call(this, provider, firstConnect) || this;
        _this.buildinTxBlock = new txBlock_1.default(_this);
        _this.buildinLedger = new ledger_1.default(_this);
        _this._setMethodsName();
        return _this;
    }
    client.prototype.setProvider = function (provider, firstConnect, abort) {
        this._setProvider(provider, firstConnect, abort);
        var providerType = this._provider.type || 'http';
        if (providerType.toLowerCase !== 'ipc' || this.wallet) {
            return;
        }
        this._setMethodsName();
    };
    client.prototype._setMethodsName = function () {
        var _this = this;
        var providerType = (this._provider.type || 'http').toLowerCase();
        for (var namespace in constant_1.methods) {
            if (providerType === 'ipc' && namespace === 'wallet') {
                this.wallet = null;
                continue;
            }
            var _namespace = namespace === 'subscribe' ? 'subscribeFunc' : namespace;
            if (this[_namespace]) {
                continue;
            }
            var spaceMethods = constant_1.methods[namespace];
            this[_namespace] = {};
            var _loop_1 = function (methodName) {
                var name = spaceMethods[methodName];
                this_1[_namespace][methodName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.request.apply(_this, [name].concat(args));
                };
            };
            var this_1 = this;
            for (var methodName in spaceMethods) {
                _loop_1(methodName);
            }
        }
    };
    return client;
}(netProcessor_1.default));
exports.default = client;
