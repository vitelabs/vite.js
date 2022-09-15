import IPC_WS from '~@vite/vitejs-communication/ipc_ws';
const Websocket = require('websocket').w3cwebsocket;

class WsRpc extends IPC_WS {
    constructor(path = 'ws://localhost:23457', timeout = 60000, options = {
        protocol: '',
        headers: '',
        clientConfig: {
            keepalive: true,
            keepaliveInterval: 30 * 1000
        }
    }) {
        super({
            onEventTypes: [ 'error', 'close', 'connect' ],
            sendFuncName: 'send',
            path
        });

        if (!path) {
            throw this.ERRORS.CONNECT(path);
        }
        // request timeout
        this.timeout = timeout;
        this.protocol = options.protocol;
        this.headers = options.headers;
        this.clientConfig = options.clientConfig;

        this._destroyed = false;

        this.reconnect();
    }

    reconnect() {
        if (this._destroyed) return;
        this.socket && (this.socket.onclose = () => {}); // reset before disconnect to avoid unnecessary reconnect
        this.disconnect();

        // create new websocket connection and register listeners
        this.socket = new Websocket(this.path, this.protocol, null, this.headers, null, this.clientConfig);
        this.socket.onopen = () => {
            (this.socket.readyState === this.socket.OPEN) && this._connected();
        };
        this.socket.onclose = () => {
            this._closed();
        };
        this.socket.onerror = err => {
            this._errored(err);
        };
        this.socket.onmessage = e => {
            const data = (typeof e.data === 'string') ? e.data : '';
            this._parse([data]);
        };
    }

    disconnect() {
        this.socket && this.socket.close && this.socket.close();
        this.socket = null;
    }

    destroy() {
        this.remove('error');
        this.remove('close');
        this.remove('connect');
        this.disconnect();
        this._destroyed = true;
    }
}

export const WS_RPC = WsRpc;
export default WS_RPC;
