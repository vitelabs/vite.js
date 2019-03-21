"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("error");
var eventEmitter_1 = require("./eventEmitter");
var NetProcessor = (function () {
    function NetProcessor(provider, firstConnect) {
        this._provider = provider;
        this.isConnected = false;
        this.connectedOnce(firstConnect);
        this.requestList = [];
        this.subscriptionList = [];
    }
    NetProcessor.prototype._setProvider = function (provider, firstConnect, abort) {
        abort && this._provider.abort(abort);
        this.clearSubscriptions();
        this._provider = provider;
        this.isConnected = false;
        this.connectedOnce(firstConnect);
    };
    NetProcessor.prototype.connectedOnce = function (cb) {
        var _this = this;
        var connectedCB = function () {
            _this.isConnected = true;
            _this.requestList.forEach(function (_q) {
                _q && _q();
            });
            cb && cb(_this);
        };
        if (this._provider.type === 'http' || this._provider.connectStatus) {
            connectedCB();
            return;
        }
        this._provider.on('connect', function () {
            connectedCB();
            _this._provider.remove('connect');
        });
    };
    NetProcessor.prototype.unSubscribe = function (event) {
        var i;
        for (i = 0; i < this.subscriptionList.length; i++) {
            if (this.subscriptionList[i] === event) {
                break;
            }
        }
        if (i >= this.subscriptionList.length) {
            return;
        }
        event && event.stopLoop();
        this.subscriptionList.splice(i, 1);
        if (!this.subscriptionList || !this.subscriptionList.length) {
            this._provider.unSubscribe && this._provider.unSubscribe();
        }
    };
    NetProcessor.prototype.clearSubscriptions = function () {
        this.subscriptionList.forEach(function (s) {
            s.stopLoop();
        });
        this.subscriptionList = [];
        this._provider.unSubscribe && this._provider.unSubscribe();
    };
    NetProcessor.prototype.request = function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var rep;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected) {
                            return [2, this._onReq.apply(this, ['request', methods].concat(args))];
                        }
                        return [4, this._provider.request(methods, args)];
                    case 1:
                        rep = _a.sent();
                        if (rep.error) {
                            throw rep.error;
                        }
                        return [2, rep.result];
                }
            });
        });
    };
    NetProcessor.prototype.notification = function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.isConnected) {
                    return [2, this._onReq.apply(this, ['notification', methods].concat(args))];
                }
                return [2, this._provider.notification(methods, args)];
            });
        });
    };
    NetProcessor.prototype.batch = function (reqs) {
        return __awaiter(this, void 0, void 0, function () {
            var reps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected) {
                            return [2, this._onReq('batch', reqs)];
                        }
                        reqs.forEach(function (v) {
                            v.type = v.type || 'request';
                        });
                        return [4, this._provider.batch(reqs)];
                    case 1:
                        reps = _a.sent();
                        return [2, reps];
                }
            });
        });
    };
    NetProcessor.prototype.subscribe = function (methodName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var subMethodName, params, rep, subscription, event;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subMethodName = this._provider.subscribe ? 'subscribe_subscribe' : "subscribe_" + methodName + "Filter";
                        params = this._provider.subscribe ? [methodName].concat(args) : args;
                        if (!this.isConnected) return [3, 2];
                        return [4, this._provider.request(subMethodName, params)];
                    case 1:
                        rep = _a.sent();
                        rep = rep.result;
                        return [3, 4];
                    case 2: return [4, this._onReq.apply(this, ['request', subMethodName].concat(params))];
                    case 3:
                        rep = _a.sent();
                        _a.label = 4;
                    case 4:
                        subscription = rep;
                        if (!this.subscriptionList || !this.subscriptionList.length) {
                            this.subscriptionList = [];
                            this._provider.subscribe && this._provider.subscribe(function (jsonEvent) {
                                _this.subscribeCallback(jsonEvent);
                            });
                        }
                        event = new eventEmitter_1.default(subscription, this, !!this._provider.subscribe);
                        if (!this._provider.subscribe) {
                            event.startLoop(function (jsonEvent) {
                                _this.subscribeCallback(jsonEvent);
                            });
                        }
                        this.subscriptionList.push(event);
                        return [2, event];
                }
            });
        });
    };
    NetProcessor.prototype._offReq = function (_q) {
        var i;
        for (i = 0; i < this.requestList.length; i++) {
            if (this.requestList[i] === _q) {
                break;
            }
        }
        if (i === this.requestList.length) {
            return;
        }
        this.requestList.splice(i, 1);
    };
    NetProcessor.prototype._onReq = function (type, methods) {
        var _this = this;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return new Promise(function (res, rej) {
            var _q = function () {
                _this[type].apply(_this, [methods].concat(args)).then(function (data) {
                    clearTimeout(_timeout);
                    _this._offReq(_q);
                    res(data);
                }).catch(function (err) {
                    _this._offReq(_q);
                    clearTimeout(_timeout);
                    rej(err);
                });
            };
            _this.requestList.push(_q);
            var _timeout = setTimeout(function () {
                _this._offReq(_q);
                rej(error_1.requestTimeout);
            }, _this._provider._timeout || 30000);
        });
    };
    NetProcessor.prototype.subscribeCallback = function (jsonEvent) {
        if (!jsonEvent) {
            return;
        }
        var id = jsonEvent.params && jsonEvent.params.subscription ? jsonEvent.params.subscription : jsonEvent.subscription || '';
        if (!id) {
            return;
        }
        this.subscriptionList && this.subscriptionList.forEach(function (s) {
            if (s.id !== id) {
                return;
            }
            var result = jsonEvent.params && jsonEvent.params.result ? jsonEvent.params.result : jsonEvent.result || null;
            if (!result) {
                return;
            }
            s.emit(result);
        });
    };
    return NetProcessor;
}());
exports.default = NetProcessor;
