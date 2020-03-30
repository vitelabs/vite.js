import { ProviderType } from './type';

class EventEmitter {
    readonly id: string
    readonly isSubscribe: boolean
    private provider: ProviderType
    private timeLoop: any
    private callback: Function

    constructor(id: string, provider: ProviderType, isSubscribe: boolean) {
        this.id = id;
        this.callback = null;
        this.provider = provider;
        this.isSubscribe = isSubscribe;

        this.timeLoop = null;
    }

    on(callback: Function) {
        this.callback = callback;
    }

    off() {
        this.stopLoop();
        this.provider.unsubscribe(this);
    }

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
