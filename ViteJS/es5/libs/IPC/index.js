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

var net = require('net');

var IPC_RPC =
/*#__PURE__*/
function (_IPC_WS) {
  _inherits(IPC_RPC, _IPC_WS);

  function IPC_RPC(_ref) {
    var _this;

    var _ref$path = _ref.path,
        path = _ref$path === void 0 ? '' : _ref$path,
        _ref$delimiter = _ref.delimiter,
        delimiter = _ref$delimiter === void 0 ? '\n' : _ref$delimiter,
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;

    _classCallCheck(this, IPC_RPC);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IPC_RPC).call(this, {
      onEventTypes: ['error', 'end', 'timeout', 'data', 'close', 'connect'],
      sendFuncName: 'write'
    }));

    if (!path) {
      console.error(_this.ERRORS.CONNECT());
      return _possibleConstructorReturn(_this, _this.ERRORS.CONNECT());
    }

    _this.path = path;
    _this.delimiter = delimiter;
    _this.timeout = timeout;
    _this.socket = net.connect({
      path: path
    });

    _this.socket.on('connect', function () {
      _this._connected();
    });

    _this.socket.on('close', function () {
      _this._closed();
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

  _createClass(IPC_RPC, [{
    key: "_send",
    value: function _send(payloads) {
      if (!this.connectStatus) {
        return Promise.reject(this.ERRORS.CONNECT(this.path));
      }

      this.socket.write(JSON.stringify(payloads));
      return this._onSend(payloads);
    }
  }, {
    key: "reconnect",
    value: function reconnect() {
      this.socket.connect({
        path: this.path
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.socket && this.socket.destroy && this.socket.destroy();
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

  return IPC_RPC;
}(_ipc_ws.default);

var _default = IPC_RPC;
exports.default = _default;