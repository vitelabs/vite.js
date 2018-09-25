"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errors = _interopRequireDefault(require("./errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var jsonrpc = require('jsonrpc-lite');

var Communication =
/*#__PURE__*/
function () {
  function Communication() {
    _classCallCheck(this, Communication);

    this.ERRORS = _errors.default;
    this.jsonrpc = jsonrpc;
    this._requestManager = [];
    this._requestId = 0;
  }

  _createClass(Communication, [{
    key: "reset",
    value: function reset() {
      var _this = this;

      var abort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (!abort) {
        return;
      }

      this._requestManager.forEach(function (_ref) {
        var request = _ref.request,
            rej = _ref.rej;
        request.abort();
        rej(_this.ERRORS.ABORT());
      });

      this._requestManager = [];
    }
  }, {
    key: "_addReq",
    value: function _addReq(_ref2) {
      var request = _ref2.request,
          rej = _ref2.rej;
      var _request = {
        request: request,
        rej: rej
      };

      this._requestManager.push(_request);

      return _request;
    }
  }, {
    key: "_removeReq",
    value: function _removeReq(_request) {
      for (var i = 0; i < this._requestManager.length; i++) {
        if (this._requestManager[i] === _request) {
          this._requestManager.splice(i, 1);

          break;
        }
      }
    }
  }, {
    key: "_getRequestPayload",
    value: function _getRequestPayload(methodName, params) {
      if (!methodName) {
        return _errors.default.PARAMS();
      }

      this._requestId++;
      return this.jsonrpc.request(this._requestId, methodName, params);
    }
  }, {
    key: "_getNotificationPayload",
    value: function _getNotificationPayload(methodName, params) {
      if (!methodName) {
        return _errors.default.PARAMS();
      }

      return this.jsonrpc.notification(methodName, params);
    }
  }, {
    key: "_getBatchPayload",
    value: function _getBatchPayload() {
      var requests = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!requests || !requests.length) {
        return _errors.default.PARAMS();
      }

      var _requests = [];

      for (var i = 0; i < requests.length; i++) {
        var request = requests[i];

        if (!request || !request.type || request.type !== 'request' && request.type !== 'notification') {
          return _errors.default.PARAMS();
        }

        var requestObj = request.type === 'notification' ? this._getNotificationPayload(request.methodName, request.params) : this._getRequestPayload(request.methodName, request.params);

        if (requestObj instanceof Error) {
          return requestObj;
        }

        _requests.push(requestObj);
      }

      return _requests;
    }
  }]);

  return Communication;
}();

var _default = Communication;
exports.default = _default;