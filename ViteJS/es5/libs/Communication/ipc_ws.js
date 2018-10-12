"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var IPC_WS =
/*#__PURE__*/
function (_Communication) {
  _inherits(IPC_WS, _Communication);

  function IPC_WS(_ref) {
    var _this;

    var onEventTypes = _ref.onEventTypes,
        sendFuncName = _ref.sendFuncName;

    _classCallCheck(this, IPC_WS);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IPC_WS).call(this));
    _this._onEventTypes = onEventTypes || [];
    _this._sendFuncName = sendFuncName;
    _this.connectStatus = false;
    _this.responseCbs = {};
    _this._connectEnd = null;
    _this._connectErr = null;
    _this._connectTimeout = null;
    _this._connectConnect = null;
    _this._connectClose = null;
    return _this;
  }

  _createClass(IPC_WS, [{
    key: "_connected",
    value: function _connected() {
      this.connectStatus = true;
      this._connectConnect && this._connectConnect();
    }
  }, {
    key: "_closed",
    value: function _closed() {
      this.connectStatus = false;
      this._connectClose && this._connectClose();
    }
  }, {
    key: "_errored",
    value: function _errored(err) {
      this._connectErr && this._connectErr(err);
    }
  }, {
    key: "_parse",
    value: function _parse(data) {
      var _this2 = this;

      var results = [];
      data.forEach(function (ele) {
        if (!ele) {
          return;
        }

        try {
          var res = JSON.parse(ele);

          if (!(res instanceof Array) && res.result) {
            // Compatible: somtimes data.result is a json string, sometimes not.
            try {
              res.result = JSON.parse(res.result);
            } catch (e) {// console.log(e);
            }
          }

          results.push(res);
        } catch (error) {
          console.log(error);
        }
      });
      results.forEach(function (ele) {
        if (!(ele instanceof Array) && !ele.id) {
          return;
        }

        if (ele.id) {
          _this2.responseCbs[ele.id] && _this2.responseCbs[ele.id](ele);
          return;
        }

        for (var i = 0; i < ele.length; i++) {
          if (!ele[i].id) {
            continue;
          }

          var id = ele[i].id;

          if (!_this2.responseCbs[id]) {
            continue;
          }

          _this2.responseCbs[id](ele);
        }
      });
    }
  }, {
    key: "_checkOnType",
    value: function _checkOnType(type) {
      var i = this._onEventTypes.indexOf(type);

      if (i < 0) {
        return false;
      }

      var eventType = type.substring(0, 1).toUpperCase() + type.substring(1);
      return "_connect".concat(eventType);
    }
  }, {
    key: "_onSend",
    value: function _onSend(payloads) {
      var _this3 = this;

      var id = getIdFromPayloads(payloads);

      if (!id) {
        return;
      }

      return new Promise(function (res, _rej) {
        var resetAbort = false;
        var request = {
          id: id,
          abort: function abort() {
            resetAbort = true;
          }
        };

        _this3.responseCbs[id] = function (data) {
          clearRequestAndTimeout();

          if (data && data.error) {
            return _rej(data);
          }

          res(data);
        };

        var _request = _this3._addReq({
          request: request,
          rej: function rej(err) {
            clearRequestAndTimeout();

            _rej(err);
          }
        });

        var clearRequestAndTimeout = function clearRequestAndTimeout() {
          requestTimeout && clearTimeout(requestTimeout);
          requestTimeout = null;

          _this3._removeReq(_request);

          for (var key in _this3.responseCbs) {
            if (_this3.responseCbs[key] === id) {
              delete _this3.responseCbs[key];
              break;
            }
          }
        };

        var requestTimeout = _this3.timeout ? setTimeout(function () {
          if (resetAbort) {
            return;
          }

          clearRequestAndTimeout();
          return _rej(_this3.ERRORS.TIMEOUT(_this3.timeout));
        }, _this3.timeout) : null;
      });
    }
  }, {
    key: "on",
    value: function on(type, cb) {
      var eventType = this._checkOnType(type);

      if (eventType < 0) {
        return this.ERRORS.IPC_ON(type);
      }

      if (!cb) {
        return this.ERRORS.IPC_ON_CB(type);
      }

      this[eventType] = cb;
    }
  }, {
    key: "remove",
    value: function remove(type) {
      var eventType = this._checkOnType(type);

      eventType && (this[eventType] = null);
    }
  }]);

  return IPC_WS;
}(_index.default);

var _default = IPC_WS;
exports.default = _default;

function getIdFromPayloads(payloads) {
  var id;

  if (payloads instanceof Array) {
    for (var i = 0; i < payloads.length; i++) {
      if (payloads[i].id) {
        id = payloads[i].id;
        break;
      }
    }
  } else {
    id = payloads.id || null;
  }

  return id;
}