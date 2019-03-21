"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("../type");
var EventEmitter = (function () {
    function EventEmitter(subscription, netProcessor, isSubscribe) {
        this.id = subscription;
        this.callback = null;
        this.netProcessor = netProcessor;
        this.isSubscribe = isSubscribe;
        this.timeLoop = null;
    }
    EventEmitter.prototype.on = function (callback) {
        this.callback = callback;
    };
    EventEmitter.prototype.off = function () {
        this.stopLoop();
        this.netProcessor.unSubscribe(this);
    };
    EventEmitter.prototype.emit = function (result) {
        this.callback && this.callback(result);
    };
    EventEmitter.prototype.startLoop = function (cb, time) {
        var _this = this;
        if (time === void 0) { time = 2000; }
        var loop = function () {
            _this.timeLoop = setTimeout(function () {
                _this.netProcessor.request(type_1.subscribe.getFilterChanges, _this.id).then(function (data) {
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
        this.netProcessor.request(type_1.subscribe.uninstallFilter, this.id);
    };
    return EventEmitter;
}());
exports.default = EventEmitter;
