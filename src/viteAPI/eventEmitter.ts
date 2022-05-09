import { ProviderType } from './type';

class EventEmitter {
    id: string;
    readonly isSubscribe: boolean;
    readonly payload: {method: string, params: any};
    private provider: ProviderType;
    private timeLoop: any;
    private callback: Function;

    constructor(id: string, provider: ProviderType, isSubscribe: boolean, payload: {method: string, params: any}) {
        this.id = id;
        this.callback = null;
        this.provider = provider;
        this.isSubscribe = isSubscribe;
        this.payload = payload;
        this.timeLoop = null;
    }

    // call this method to register the subscription event handler
    on(callback: Function) {
        this.callback = callback;
    }

    off() {
        this.stopLoop();
        this.provider.unsubscribe(this);
    }

    // called by provider when received subscription event
    emit(result) {
        this.callback && this.callback(result);
    }

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
