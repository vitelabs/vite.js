import Communication from './index.js';
class IPC_WS extends Communication {
    constructor({
        onEventTypes, sendFuncName, path
    }) {
        super();

        this.path = path;
        this._onEventTypes = onEventTypes || [];
        this._sendFuncName = sendFuncName;

        this.connectStatus = false;
        this.responseCbs = {};

        this._connectEnd = null;
        this._connectErr= null;
        this._connectTimeout = null;
        this._connectConnect = null;
        this._connectClose = null;

        this.subscribeMethod = null;
    }

    _connected() {
        this.connectStatus = true;
        this._connectConnect && this._connectConnect();
    }

    _closed() {
        this.connectStatus = false;
        this._connectClose && this._connectClose();
    }

    _errored(err) {
        this._connectErr && this._connectErr(err);
    }

    _parse (data) {
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
                // console.log(error);
            }
        });

        results.forEach((ele) => {
            if ( !(ele instanceof Array) && !ele.id) {
                this.subscribeMethod && this.subscribeMethod(ele);
                return;
            }

            if (ele.id) {
                this.responseCbs[ele.id] && this.responseCbs[ele.id](ele);
                return;
            }

            for(let i=0; i<ele.length; i++) {
                if (!ele[i].id) {
                    this.subscribeMethod && this.subscribeMethod(ele[i]);
                    continue;
                }

                let id = ele[i].id;
                if (!this.responseCbs[id]) {
                    continue;
                }

                this.responseCbs[id](ele);
            }
        });
    }

    _checkOnType(type) {
        let i = this._onEventTypes.indexOf(type);
        if (i < 0) {
            return false;
        }
    
        let eventType = type.substring(0,1).toUpperCase() + type.substring(1);
        return `_connect${eventType}`;
    }

    _onSend(payloads) {
        let id = getIdFromPayloads(payloads);
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
                if (data && data.error) {
                    return rej(data);
                }
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

    _send(payloads) {
        if (!this.connectStatus) {
            return Promise.reject( this.ERRORS.CONNECT(this.path) );
        }
        this.socket[this._sendFuncName]( JSON.stringify(payloads) );
        return this._onSend(payloads);
    }

    on (type, cb) {
        let eventType = this._checkOnType(type);
        if ( eventType < 0 ) {
            return this.ERRORS.IPC_ON(type);
        }
        if (!cb) {
            return this.ERRORS.IPC_ON_CB(type);
        }
        this[eventType] = cb;
    }

    remove(type) {
        let eventType = this._checkOnType(type);
        eventType && (this[eventType] = null);
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

    subscribe(callback) {
        if (typeof callback !== 'function') {
            throw '[Error] callback should be a function.';
        }
        this.subscribeMethod = callback;
    }

    unSubscribe() {
        this.subscribeMethod = null;
    }
}

export default IPC_WS;



function getIdFromPayloads(payloads) {
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
    return id;
}
