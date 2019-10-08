import { ViteAPI } from './type';

class EventEmitter {
    readonly id: string
    readonly viteAPI: ViteAPI
    readonly isSubscribe: boolean
    private timeLoop: any
    private callback: Function

    constructor(id: string, viteAPI: ViteAPI, isSubscribe: boolean) {
        this.id = id;
        this.callback = null;
        this.viteAPI = viteAPI;
        this.isSubscribe = isSubscribe;

        this.timeLoop = null;
    }

    on(callback: Function) {
        this.callback = callback;
    }

    off() {
        this.stopLoop();
        this.viteAPI.unsubscribe(this);
    }

    emit(result) {
        this.callback && this.callback(result);
    }

    startLoop(cb: Function, time: number = 2000) {
        const loop = () => {
            this.timeLoop = setTimeout(() => {
                this.viteAPI.request('subscribe_getChangesByFilterId', this.id).then(data => {
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
        this.viteAPI.request('subscribe_uninstallFilter', this.id);
    }
}

export default EventEmitter;
