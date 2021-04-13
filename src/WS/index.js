import IPC_WS from '~@vite/vitejs-communication/ipc_ws';
const Websocket = require('websocket').w3cwebsocket;

class WsRpc extends IPC_WS {
    constructor(path = 'ws://localhost:31420', timeout = 60000, options = {
        protocol: '',
        headers: '',
        clientConfig: '',
        retryTimes: 10,
        retryInterval: 10000
    }) {
        super({
            onEventTypes: [ 'error', 'close', 'connect' ],
            sendFuncName: 'send',
            path
        });

        if (!path) {
            throw this.ERRORS.CONNECT(path);
        }

        this.timeout = timeout;
        this.protocol = options.protocol;
        this.headers = options.headers;
        this.clientConfig = options.clientConfig;

        this._timeout = null;
        this._destroyed = false;

        this.reconnect();

        // Try to reconnect.
        let times = 0;
        this.on('connect', () => {
            times = 0;
        });
        this.on('close', () => {
            if (times > options.retryTimes) {
                return;
            }
            this._timeout = setTimeout(() => {
                times++;
                this.reconnect();
            }, options.retryInterval);
        });
    }

    reconnect() {
        if (this._destroyed) return;
        this.disconnect();
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
        clearTimeout(this._timeout);
        this.socket = null;
    }

    destroy() {
        this.disconnect();
        this.remove('error');
        this.remove('close');
        this.remove('connect');
        this._destroyed = true;
    }
}

export const WS_RPC = WsRpc;
export default WS_RPC;
