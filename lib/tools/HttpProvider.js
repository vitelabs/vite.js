let axios = require('axios');
let jsonrpc = require('jsonrpc-lite');

class HttpProvider {
    constructor(host = 'http://localhost:8415', timeout = 0, headers) {
        this.host = host;
        this.timeout = timeout;
        this.headers = headers;
        this.requestId = 0;
    }

    clear() {

    }

    reset(host, timeout = 0, headers) {
        this.host = host;
        this.timeout = timeout;
        this.headers = headers;
    }

    request(method, params) {
        // this.requestId++
    }

    notification(method, params) {
        // this.requestId++
    }

    /**
     * batch
     * @param {*} requests [{type, method, params}]
     */
    batch(requests = []) {

    }
}

module.exports = HttpProvider;