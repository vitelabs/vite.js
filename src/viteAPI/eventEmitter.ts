import { ClientClassType } from './type';

class EventEmitter {
    readonly id: string
    readonly client: ClientClassType
    readonly isSubscribe: boolean
    private timeLoop: any
    private callback: Function

    constructor(id: string, client: ClientClassType, isSubscribe: boolean) {
        this.id = id;
        this.callback = null;
        this.client = client;
        this.isSubscribe = isSubscribe;

        this.timeLoop = null;
    }

    on(callback: Function) {
        this.callback = callback;
    }

    off() {
        this.stopLoop();
        this.client.unsubscribe(this);
    }

    emit(result) {
        this.callback && this.callback(result);
    }

    startLoop(cb: Function, time: number = 2000) {
        const loop = () => {
            this.timeLoop = setTimeout(() => {
                this.client.request('subscribe_getChangesByFilterId', this.id).then(data => {
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
        this.client.request('subscribe_uninstallFilter', this.id);
    }
}

export default EventEmitter;
