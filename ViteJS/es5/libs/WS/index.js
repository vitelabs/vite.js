"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ipc_ws = _interopRequireDefault(require("../Communication/ipc_ws"));

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

var websocket = require('websocket').w3cwebsocket;

var WS_RPC =
/*#__PURE__*/
function (_IPC_WS) {
  _inherits(WS_RPC, _IPC_WS);

  function WS_RPC(_ref) {
    var _this;

    var _ref$url = _ref.url,
        url = _ref$url === void 0 ? 'ws://localhost:31420' : _ref$url,
        protocol = _ref.protocol,
        headers = _ref.headers,
        clientConfig = _ref.clientConfig,
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;

    _classCallCheck(this, WS_RPC);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WS_RPC).call(this, {
      onEventTypes: ['error', 'close', 'connect'],
      sendFuncName: 'send'
    }));

    if (!url) {
      console.error(_this.ERRORS.CONNECT(url));
      return _possibleConstructorReturn(_this, _this.ERRORS.CONNECT(url));
    }

    _this.url = url;
    _this.protocol = protocol;
    _this.timeout = timeout;
    _this.socket = new websocket(url, protocol, undefined, headers, undefined, clientConfig);

    _this.socket.onopen = function () {
      _this.socket.readyState === _this.socket.OPEN && _this._connected();
    };

    _this.socket.onclose = function () {
      _this._closed();
    };

    _this.socket.onerror = function () {
      _this._errored();
    };

    _this.socket.onmessage = function (e) {
      var data = typeof e.data === 'string' ? e.data : '';

      _this._parse([data]);
    };

    return _this;
  }

  _createClass(WS_RPC, [{
    key: "_send",
    value: function _send(payloads) {
      if (!this.connectStatus) {
        return Promise.reject(this.ERRORS.CONNECT(this.url));
      }

      this.socket.send(JSON.stringify(payloads));
      return this._onSend(payloads);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.socket && this.socket.close && this.socket.close();
    }
  }, {
    key: "request",
    value: function request(methodName, params) {
      var requestObj = this._getRequestPayload(methodName, params);

      if (requestObj instanceof Error) {
        return Promise.reject(requestObj);
      }

      return this._send(requestObj);
    }
  }, {
    key: "notification",
    value: function notification(methodName, params) {
      var requestObj = this._getNotificationPayload(methodName, params);

      if (requestObj instanceof Error) {
        return requestObj;
      }

      this._send(requestObj);
    }
    /**
     * batch
     * @param {*} requests [{type, methodName, params}]
     */

  }, {
    key: "batch",
    value: function batch() {
      var requests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var _requests = this._getBatchPayload(requests);

      if (_requests instanceof Error) {
        return Promise.reject(_requests);
      }

      return this._send(_requests);
    }
  }]);

  return WS_RPC;
}(_ipc_ws.default);

var _default = WS_RPC;
exports.default = _default;