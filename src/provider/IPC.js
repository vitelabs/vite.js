import IPC_WS from './Communication/ipc_ws';
const net = require('net');

class IPC_RPC extends IPC_WS {
    constructor(path = '', timeout = 60000, options = {
        delimiter: '\n',
        retryTimes: 10,
        retryInterval: 10000
    }) {
        super({
            onEventTypes: ['error', 'end', 'timeout', 'data', 'close', 'connect'],
            sendFuncName: 'write',
            path
        });

        if (!path) {
            console.error( this.ERRORS.CONNECT() );
            return this.ERRORS.CONNECT();
        }

        this.type = 'ipc';
        this.timeout = timeout;
        this.delimiter = options.delimiter;

        // Try to reconnect.
        let times = 0;
        this.socket = net.connect({ path });
        
        this.socket.on('connect', ()=>{
            times = 0;
            this._connected();
        });
        this.socket.on('close', ()=>{
            this._closed();
            if (times > options.retryTimes) {
                return;
            }
            setTimeout(() => {
                times++;
                this.reconnect();
            }, options.retryInterval);
        });
        this.socket.on('error', ()=>{
            this._errored();
        });
        this.socket.on('end', (err) => {
            this._connectEnd && this._connectEnd(err);
        });
        this.socket.on('timeout', (err) => {
            this._connectTimeout && this._connectTimeout(err);
        });

        let ipcBuffer = '';
        this.socket.on('data', (data) => {
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

    // _send(payloads) {
    //     if (!this.connectStatus) {
    //         return Promise.reject( this.ERRORS.CONNECT(this.path) );
    //     }
    //     this.socket.write( JSON.stringify(payloads) );
    //     return this._onSend(payloads);
    // }

    reconnect() {
        this.socket.connect({ path: this.path });
    }

    disconnect() {
        this.socket && this.socket.destroy && this.socket.destroy();
    }

    request(methodName, params) {
        let requestObj = this._getRequestPayload(methodName, params);

        if (requestObj instanceof Error) {
            return Promise.reject(requestObj);
        }
        return this._send(requestObj);
    }

    notification(methodName, params) {
        let requestObj = this._getNotificationPayload(methodName, params);

        if (requestObj instanceof Error) {
            return requestObj;
        }

        this._send(requestObj);
    }

    /**
     * batch
     * @param {*} requests [{type, methodName, params}]
     */
    batch(requests = []) {
        let _requests = this._getBatchPayload(requests);

        if (_requests instanceof Error) {
            return Promise.reject(_requests);
        }

        return this._send(_requests);
    }
}

export default IPC_RPC;
