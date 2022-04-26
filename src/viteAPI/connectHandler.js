class ConnectHandler {
    init(provider) {
        this.provider = provider;

        this.connectedCB = () => {
            this.provider.isConnected = true;
            this.provider.requestList && Object.values(this.provider.requestList).forEach(_q => {
                _q && _q(); // execute the pending requests stored in requestList when connected
            });
            this.onInitCallback && this.onInitCallback(this.provider); // execute user-defined callback
        };
    }

    onConnect(callback) {
        if (typeof callback === 'function') {
            this.onInitCallback = callback;
        }
        if (this.provider._provider.type === 'http' || this.provider._provider.connectStatus) {
            this.connectedCB();
        } else if (this.provider._provider.on) {
            this.provider._provider.on('connect', () => { // triggered when the ws/ipc connection is established
                this.connectedCB();
                this.provider._provider.remove('connect');
            });
            this.setReconnect(); // set reconnect policy
        }
    }

    setReconnect() {}
}

/**
 * ReconnectHandler supports for auto reconnect when the ws/ipc connection is broken,
 * it uses `retryTimes` and `retryInterval` for maximum number of retries and the
 * reconnection interval.
 */
export class ReconnectHandler extends ConnectHandler {
    times = 1;

    constructor(retryTimes = 10, retryInterval = 10000) {
        super();
        this.retryTimes = retryTimes;
        this.retryInterval = retryInterval;
    }

    setReconnect() {
        this.provider._provider.on('close', () => {
            if (this.times > this.retryTimes) {
                return;
            }
            setTimeout(() => {
                this.times++;
                this.provider._provider.reconnect();
            }, this.retryInterval);
        });
    }
}

/**
 * Always reconnect when the connection is broken, regardless the `retryTimes` defined
 * in ReconnectCallback
 */
export class AlwaysReconnect extends ReconnectHandler {
    constructor(retryInterval = 10000) {
        super(1, retryInterval);
    }

    onConnect(callback) {
        super.onConnect(callback);
        this.provider._provider.on && this.provider._provider.on('connect', () => {
            this.connectedCB();
            this.times = 0; // reset counter
        });
    }
}

/**
 * Renew existing subscriptions when the connection is re-established
 */
export class RenewSubscription extends ReconnectHandler {
    onConnect(callback) {
        super.onConnect(callback);
        this.provider._provider.on && this.provider._provider.on('connect', () => {
            this.connectedCB();
            Object.values(this.provider.subscriptionList).forEach(async p => {
                if (p.isSubscribe && p.payload) {
                    const _id = await this.provider._provider.request(p.payload.method, p.payload.params);
                    p.id = _id.result;
                }
            });
        });
    }
}

export default ConnectHandler;
