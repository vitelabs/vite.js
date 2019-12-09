"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = (function () {
    function EventEmitter(id, provider, isSubscribe) {
        this.id = id;
        this.callback = null;
        this.provider = provider;
        this.isSubscribe = isSubscribe;
        this.timeLoop = null;
    }
    EventEmitter.prototype.on = function (callback) {
        this.callback = callback;
    };
    EventEmitter.prototype.off = function () {
        this.stopLoop();
        this.provider.unsubscribe(this);
    };
    EventEmitter.prototype.emit = function (result) {
        this.callback && this.callback(result);
    };
    EventEmitter.prototype.startLoop = function (cb, time) {
        var _this = this;
        if (time === void 0) { time = 2000; }
        var loop = function () {
            _this.timeLoop = setTimeout(function () {
                _this.provider.request('subscribe_getChangesByFilterId', _this.id).then(function (data) {
                    cb && cb(data);
                    loop();
                }).catch(function () {
                    loop();
                });
            }, time);
        };
        loop();
    };
    EventEmitter.prototype.stopLoop = function () {
        if (!this.timeLoop) {
            return;
        }
        clearTimeout(this.timeLoop);
        this.timeLoop = null;
        this.provider.request('subscribe_uninstallFilter', this.id);
    };
    return EventEmitter;
}());
exports.default = EventEmitter;
