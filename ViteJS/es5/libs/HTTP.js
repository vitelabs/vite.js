"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./Communication/index.js"));

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

var XMLHttpRequest = typeof window !== 'undefined' && window.XMLHttpRequest ? window.XMLHttpRequest : require('xhr2');

var HTTP_RPC =
/*#__PURE__*/
function (_Communication) {
  _inherits(HTTP_RPC, _Communication);

  function HTTP_RPC(_ref) {
    var _this;

    var _ref$host = _ref.host,
        host = _ref$host === void 0 ? 'http://localhost:8415' : _ref$host,
        headers = _ref.headers,
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;

    _classCallCheck(this, HTTP_RPC);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HTTP_RPC).call(this));
    _this.host = host;
    _this.timeout = timeout;
    _this.headers = headers;
    return _this;
  }

  _createClass(HTTP_RPC, [{
    key: "_getRequest",
    value: function _getRequest() {
      var request = new XMLHttpRequest();
      request.open('POST', this.host); // Set headers

      request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
      this.headers && this.headers.forEach(function (header) {
        request.setRequestHeader(header.name, header.value);
      });
      return request;
    }
  }, {
    key: "_send",
    value: function _send(payload) {
      var _this2 = this;

      return new Promise(function (res, _rej) {
        // Init request
        var resetAbort = false;

        var request = _this2._getRequest();

        var _request = _this2._addReq({
          request: request,
          rej: function rej(err) {
            resetAbort = true;

            _rej(err);
          }
        });

        var clearRequestAndTimeout = function clearRequestAndTimeout() {
          requestTimeout && clearTimeout(requestTimeout);
          requestTimeout = null;

          _this2._removeReq(_request);
        }; // Set request timeout


        var requestTimeout = _this2.timeout ? setTimeout(function () {
          if (resetAbort) {
            return;
          }

          request.abort();
          clearRequestAndTimeout();
          return _rej(_this2.ERRORS.TIMEOUT(_this2.timeout));
        }, _this2.timeout) : null; // Request finish

        request.onreadystatechange = function () {
          if (request.readyState !== 4 || resetAbort) {
            return;
          }

          clearRequestAndTimeout();
          var result = request.responseText;

          try {
            result = result ? JSON.parse(result) : null;

            if (result && result.error) {
              return _rej(result);
            }
          } catch (e) {
            return _rej(_this2.ERRORS.INVAILID_RESPONSE(result));
          }

          return res(result);
        }; // Send request


        try {
          request.send(JSON.stringify(payload));
        } catch (err) {
          clearRequestAndTimeout();
          return _rej(_this2.ERRORS.CONNECT(_this2.host));
        }
      });
    }
  }, {
    key: "request",
    value: function request(methodName, params) {
      var _this3 = this;

      var requestObj = this._getRequestPayload(methodName, params);

      if (requestObj instanceof Error) {
        return Promise.reject(requestObj);
      }

      return this._send(requestObj).then(function (res) {
        if (!res) {
          throw _this3.ERRORS.INVAILID_RESPONSE(res);
        }

        return {
          result: res.result || null,
          error: res.error || null
        };
      });
    }
  }, {
    key: "notification",
    value: function notification(methodName, params) {
      var requestObj = this._getNotificationPayload(methodName, params);

      if (requestObj instanceof Error) {
        return Promise.reject(requestObj);
      }

      return this._send(requestObj);
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

      return this._send(_requests).then(function (results) {
        results = (results || []).sort(function (a, b) {
          return a.id - b.id;
        });
        var _results = [];
        var i = 0;

        _requests.forEach(function (_request) {
          // notification
          if (!_request.id) {
            _results.push(null);

            return;
          }

          _results.push({
            result: results[i].result || null,
            error: results[i].error || null
          });

          i++;
        });

        results = null;
        _requests = null;
        return _results;
      });
    }
  }]);

  return HTTP_RPC;
}(_index.default);

var _default = HTTP_RPC;
exports.default = _default;