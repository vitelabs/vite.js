import { ProviderType } from './type';

class EventEmitter {
    id: string;
    readonly isSubscribe: boolean;
    readonly payload: {method: string, params: any};
    private provider: ProviderType;
    private timeLoop: any;
    private callback: Function;

    /**
     * Create a new EventEmitter instance
     * @param id Subscription id, returned by rpc subscription api
     * @param provider
     * @param isSubscribe `false` means http provider is used
     * @param payload Request payload, including json-rpc request method name and arguments
     */
    constructor(id: string, provider: ProviderType, isSubscribe: boolean, payload: {method: string, params: any}) {
        this.id = id;
        this.callback = null;
        this.provider = provider;
        this.isSubscribe = isSubscribe;
        this.payload = payload;
        this.timeLoop = null;
    }

    /**
     * Call this function to register subscription event handler. e.g. How will the event be processed
     * @param callback User-defined event handler
     */
    on(callback: Function) {
        this.callback = callback;
    }

    /**
     * Stop subscription
     */
    off() {
        this.stopLoop();
        this.provider.unsubscribe(this);
    }

    /**
     * Pass in a subscription event and trigger the handler. Called by provider
     * @param result
     */
    emit(result) {
        this.callback && this.callback(result);
    }

    /**
     * Poll for new events and pass into the handler at given interval. For http provider only.
     * @param cb
     * @param time Polling interval. Default is 2000 ms
     */
    startLoop(cb: Function, time = 2000) {
        const loop = () => {
            this.timeLoop = setTimeout(() => {
                this.provider.request('subscribe_getChangesByFilterId', this.id).then(data => {
                    cb && cb(data);
                    loop();
                }).catch(() => {
                    loop();
                });
            }, time);
        };
        loop();
    }

    /**
     * Stop polling and uninstall the subscription filter. For http provider only.
     */
    stopLoop() {
        if (!this.timeLoop) {
            return;
        }
        clearTimeout(this.timeLoop);
        this.timeLoop = null;
        this.provider.request('subscribe_uninstallFilter', this.id);
    }
}

export default EventEmitter;
