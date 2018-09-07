import Communication from '../Communication/index.js';
const websocket = require('websocket').w3cwebsocket;

class WS_RPC extends Communication {
    constructor({
        url = 'ws://localhost:31420',
        protocol,
        headers,
        clientConfig,
        delimiter = '/n',
        timeout = 0
    }) {
        super();

        if (!url) {
            console.error( this.ERRORS.CONNECT(url) );
            return this.ERRORS.CONNECT(url);
        }

        this.url = url;
        this.protocol = protocol;
        this.timeout = timeout;
        this.delimiter = delimiter;
        this.connectStatus = false;

        this._connectErr= null;
        this._connectConnect = null;
        this._connectClose = null;

        this.responseCbs = {};

        this.socket = new websocket(url, protocol, undefined, headers, undefined, clientConfig);

        this.socket.onopen = () => {
            if (this.socket.readyState !== this.socket.OPEN) {
                return;
            }

            this.connectStatus = true;
            this._connectConnect && this._connectConnect();
        };

        this.socket.onclose = () => {
            this.connectStatus = false;
            this._connectClose && this._connectClose();
        };

        this.socket.onerror = (err) => {
            console.log(err);
            this._connectErr && this._connectErr(err);
        };

        // let ipcBuffer = '';
        this.socket.onmessage = (e) => {
            let data = (typeof e.data === 'string') ? e.data : '';

            // if (data.slice(-1) !== this.delimiter || data.indexOf(this.delimiter) === -1) {
            //     ipcBuffer += data;
            //     return;
            // }
    
            // data = ipcBuffer + data;
            // ipcBuffer = '';
    
            data = this._parse(data);
            data.forEach((ele) => {
                if ( !(ele instanceof Array) && !ele.id) {
                    return;
                }

                if (ele.id) {
                    this.responseCbs[ele.id] && this.responseCbs[ele.id](ele);
                    return;
                }

                for(let i=0; i<ele.length; i++) {
                    if (!ele[i].id) {
                        continue;
                    }

                    let id = ele[i].id;
                    if (!this.responseCbs[id]) {
                        continue;
                    }

                    this.responseCbs[id](ele);
                }
            });
        };
    }

    on (type, cb) {
        let eventType = checkOnType(type);
        if ( eventType < 0 ) {
            return this.ERRORS.IPC_ON(type);
        }
        if (!cb) {
            return this.ERRORS.IPC_ON_CB(type);
        }
        this[eventType] = cb;
    }

    remove(type) {
        let eventType = checkOnType(type);
        eventType && (this[eventType] = null);
    }

    _parse (data) {
        data = data.split(this.delimiter);

        let results = [];
        data.forEach(ele => {
            if (!ele) {
                return;
            }

            try {
                let res = JSON.parse(ele);
                if ( !(res instanceof Array) && res.result ) {
                    // Compatible: somtimes data.result is a json string, sometimes not.
                    try {
                        res.result = JSON.parse(res.result);
                    } catch (e) {
                        // console.log(e);
                    }
                }
                
                results.push(res);
            } catch (error) {
                console.log(error);
            }
        });

        data = null;
        return results;
    }

    _send(payloads) {
        if (!this.connectStatus) {
            return Promise.reject( this.ERRORS.CONNECT(this.url) );
        }

        this.socket.send( JSON.stringify(payloads) );

        let id;
        if (payloads instanceof Array) {
            for (let i=0; i<payloads.length; i++) {
                if (payloads[i].id) {
                    id = payloads[i].id;
                    break;
                }
            }
        } else {
            id = payloads.id || null;
        }

        if (!id) {
            return;
        }

        return new Promise((res, rej) => {
            let resetAbort = false;
            let request = { 
                id,
                abort: ()=>{
                    resetAbort = true;
                }
            };

            this.responseCbs[id] = (data)=>{
                clearRequestAndTimeout();
                res(data);
            };
            let _request = this._addReq({
                request, 
                rej: (err)=>{
                    clearRequestAndTimeout();
                    rej(err);
                }
            });

            let clearRequestAndTimeout = () => {
                requestTimeout && clearTimeout(requestTimeout);
                requestTimeout = null;
                this._removeReq(_request);
                for( let key in this.responseCbs ) {
                    if (this.responseCbs[key] === id) {
                        delete this.responseCbs[key];
                        break;
                    }
                }
            };

            let requestTimeout = this.timeout ? setTimeout(() => {
                if (resetAbort) {
                    return;
                }

                clearRequestAndTimeout();
                return rej( this.ERRORS.TIMEOUT(this.timeout) );
            }, this.timeout) : null;
        });
    }

    reconnect() {
        this.socket.connect({ path: this.path });
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

function checkOnType(type) {
    let i = ['error', 'close', 'connect'].indexOf(type);
    if (i < 0) {
        return false;
    }

    let eventType = type.substring(0,1).toUpperCase() + type.substring(1);
    return `_connect${eventType}`;
}