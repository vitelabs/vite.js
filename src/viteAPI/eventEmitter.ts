import { ProviderType } from './type';

class EventEmitter {
    readonly id: string
    readonly isSubscribe: boolean
    private viteProvider: ProviderType
    private timeLoop: any
    private callback: Function

    constructor(id: string, viteProvider: ProviderType, isSubscribe: boolean) {
        this.id = id;
        this.callback = null;
        this.viteProvider = viteProvider;
        this.isSubscribe = isSubscribe;

        this.timeLoop = null;
    }

    on(callback: Function) {
        this.callback = callback;
    }

    off() {
        this.stopLoop();
        this.viteProvider.unsubscribe(this);
    }

    emit(result) {
        this.callback && this.callback(result);
    }

    startLoop(cb: Function, time: number = 2000) {
        const loop = () => {
            this.timeLoop = setTimeout(() => {
                this.viteProvider.request('subscribe_getChangesByFilterId', this.id).then(data => {
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
        this.viteProvider.request('subscribe_uninstallFilter', this.id);
    }
}

export default EventEmitter;
