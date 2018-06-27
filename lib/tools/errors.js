export default {
    CONNECT_ERROR(host) {
        return new Error(`CONNECTION ERROR: Couldn\'t connect to node ${host}.`);
    },
    ABORT_ERROR() {
        return new Error('ABORT ERROR: Request already aborted.');
    },
    PARAMS_ERROR() {
        return new Error('PARAMS ERROR.');
    },
    TIMEOUT_ERROR(timeout) {
        return new Error(`CONNECTION TIMEOUT: timeout of ${timeout} ms achived`);
    },
    INVAILID_RESPONSE(res) {
        return new Error('Invalid JSON RPC response: ' + JSON.stringify(res));
    }
};