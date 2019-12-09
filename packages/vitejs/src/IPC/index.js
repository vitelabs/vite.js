import IPC_WS from './../communication/ipc_ws';
const net = require('net');

class IpcRpc extends IPC_WS {
    constructor(path = '', timeout = 60000, options = {
        delimiter: '\n',
        retryTimes: 10,
        retryInterval: 10000
    }) {
        super({
            onEventTypes: [ 'error', 'end', 'timeout', 'data', 'close', 'connect' ],
            sendFuncName: 'write',
            path
        });

        if (!path) {
            throw this.ERRORS.CONNECT();
        }

        this.type = 'ipc';
        this.timeout = timeout;
        this.delimiter = options.delimiter;

        // Try to reconnect.
        let times = 0;
        this.socket = net.connect({ path });

        this.socket.on('connect', () => {
            times = 0;
            this._connected();
        });
        this.socket.on('close', () => {
            this._closed();
            if (times > options.retryTimes) {
                return;
            }
            setTimeout(() => {
                times++;
                this.reconnect();
            }, options.retryInterval);
        });
        this.socket.on('error', () => {
            this._errored();
        });
        this.socket.on('end', err => {
            this._connectEnd && this._connectEnd(err);
        });
        this.socket.on('timeout', err => {
            this._connectTimeout && this._connectTimeout(err);
        });

        let ipcBuffer = '';
        this.socket.on('data', data => {
            data = data ? data.toString() : '';
            if (data.slice(-1) !== this.delimiter || data.indexOf(this.delimiter) === -1) {
                ipcBuffer += data;
                return;
            }

            data = ipcBuffer + data;
            ipcBuffer = '';
            data = data.split(this.delimiter);

            this._parse(data);
        });
    }

    reconnect() {
        this.socket.connect({ path: this.path });
    }

    disconnect() {
        this.socket && this.socket.destroy && this.socket.destroy();
    }
}

export const IPC_RPC = IpcRpc;
export default IPC_RPC;
