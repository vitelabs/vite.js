export default {
    CONNECT(host) {
        return new Error(`CONNECTION ERROR: Couldn\'t connect to node ${ host }.`);
    },
    ABORT() {
        return new Error('ABORT ERROR: Request already aborted.');
    },
    PARAMS() {
        return new Error('PARAMS ERROR.');
    },
    TIMEOUT(timeout) {
        return new Error(`CONNECTION TIMEOUT: timeout of ${ timeout } ms achived`);
    },
    INVAILID_RESPONSE(res) {
        return new Error(`Invalid JSON RPC response: ${ JSON.stringify(res) }`);
    },
    IPC_ON(type) {
        return new Error(`Invalid IPC event on: ${ JSON.stringify(type) }`);
    },
    IPC_ON_CB(type) {
        return new Error(`The IPC on event ${ JSON.stringify(type) }, cb is necessary`);
    }
};
