import IPC_WS from 'communication/ipc_ws';
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
            console.error(this.ERRORS.CONNECT(path));
            return this.ERRORS.CONNECT(path);
        }

        this.timeout = timeout;
        this.protocol = options.protocol;
        this.headers = options.headers;
        this.clientConfig = options.clientConfig;

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
            setTimeout(() => {
                times++;
                this.reconnect();
            }, options.retryInterval);
        });
    }

    reconnect() {
        this.socket = new Websocket(this.path, this.protocol, null, this.headers, null, this.clientConfig);
        this.socket.onopen = () => {
            (this.socket.readyState === this.socket.OPEN) && this._connected();
        };
        this.socket.onclose = () => {
            this._closed();
        };
        this.socket.onerror = () => {
            this._errored();
        };
        this.socket.onmessage = e => {
            const data = (typeof e.data === 'string') ? e.data : '';
            this._parse([data]);
        };
    }

    disconnect() {
        this.socket && this.socket.close && this.socket.close();
    }
}

const WS_RPC = WsRpc;
export default WS_RPC;
