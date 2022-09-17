import IPC_WS from '~@vite/vitejs-communication/ipc_ws';
const net = require('net');

class IpcRpc extends IPC_WS {
    constructor(path = '', timeout = 60000, options = {delimiter: '\n'}) {
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
        this.socket = net.connect({ path });

        // register listeners
        this.socket.on('connect', () => {
            this._connected();
        });
        this.socket.on('close', () => {
            this._closed();
        });
        this.socket.on('error', err => {
            this._errored(err);
        });
        this.socket.on('end', msg => {
            this._connectEnd && this._connectEnd(msg);
        });
        this.socket.on('timeout', () => {
            this._connectTimeout && this._connectTimeout();
            this.socket.end();
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

    setTimeout(ms) {
        this.socket && this.socket.setTimeout(ms);
    }

    destroy() {
        this.remove('error');
        this.remove('close');
        this.remove('connect');
        this.remove('end');
        this.remove('timeout');
        this.disconnect();
        this.socket = null;
    }
}

export const IPC_RPC = IpcRpc;
export default IPC_RPC;
