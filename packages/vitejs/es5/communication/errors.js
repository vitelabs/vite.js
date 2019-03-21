"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    CONNECT: function (host) {
        return new Error("CONNECTION ERROR: Couldn't connect to node " + host + ".");
    },
    ABORT: function () {
        return new Error('ABORT ERROR: Request already aborted.');
    },
    PARAMS: function () {
        return new Error('PARAMS ERROR.');
    },
    TIMEOUT: function (timeout) {
        return new Error("CONNECTION TIMEOUT: timeout of " + timeout + " ms achived");
    },
    INVAILID_RESPONSE: function (res) {
        return new Error("Invalid JSON RPC response: " + JSON.stringify(res));
    },
    IPC_ON: function (type) {
        return new Error("Invalid IPC event on: " + JSON.stringify(type));
    },
    IPC_ON_CB: function (type) {
        return new Error("The IPC on event " + JSON.stringify(type) + ", cb is necessary");
    }
};
