import { IPC_WS } from '@vite/vitejs-communication';
const websocket = require('websocket').w3cwebsocket;

class WS_RPC extends IPC_WS {
    constructor(url = 'ws://localhost:31420', timeout = 60000, options = {
        protocol: '',
        headers: '',
        clientConfig: '',
        retryTimes: 10,
        retryInterval: 10000
    }) {
        super({
            onEventTypes: ['error', 'close', 'connect'],
            sendFuncName: 'send'
        });

        if (!url) {
            console.error( this.ERRORS.CONNECT(url) );
            return this.ERRORS.CONNECT(url);
        }

        this.type = 'ws';
        this.url = url;
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
        this.socket = new websocket(this.url, this.protocol, undefined, this.headers, undefined, this.clientConfig);
        this.socket.onopen = () => {
            (this.socket.readyState === this.socket.OPEN) && this._connected();
        };
        this.socket.onclose = ()=>{
            this._closed();
        };
        this.socket.onerror = ()=>{
            this._errored();
        };
        this.socket.onmessage = (e) => {
            let data = (typeof e.data === 'string') ? e.data : '';
            this._parse([data]);
        };
    }

    _send(payloads) {
        if (!this.connectStatus) {
            return Promise.reject( this.ERRORS.CONNECT(this.url) );
        }
        this.socket.send( JSON.stringify(payloads) );
        return this._onSend(payloads);
    }

    disconnect() {
        this.socket && this.socket.close && this.socket.close();
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

export default WS_RPC;
