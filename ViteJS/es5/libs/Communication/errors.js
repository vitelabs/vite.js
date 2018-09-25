"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  CONNECT: function CONNECT(host) {
    return new Error("CONNECTION ERROR: Couldn't connect to node ".concat(host, "."));
  },
  ABORT: function ABORT() {
    return new Error('ABORT ERROR: Request already aborted.');
  },
  PARAMS: function PARAMS() {
    return new Error('PARAMS ERROR.');
  },
  TIMEOUT: function TIMEOUT(timeout) {
    return new Error("CONNECTION TIMEOUT: timeout of ".concat(timeout, " ms achived"));
  },
  INVAILID_RESPONSE: function INVAILID_RESPONSE(res) {
    return new Error('Invalid JSON RPC response: ' + JSON.stringify(res));
  },
  IPC_ON: function IPC_ON(type) {
    return new Error('Invalid IPC event on: ' + JSON.stringify(type));
  },
  IPC_ON_CB: function IPC_ON_CB(type) {
    return new Error("The IPC on event ".concat(JSON.stringify(type), ", cb is necessary"));
  }
};
exports.default = _default;