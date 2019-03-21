import netProcessor from './index';
import { subscribe } from '../type';

class EventEmitter {
    id: string
    callback: Function
    netProcessor: netProcessor
    timeLoop: any
    isSubscribe: boolean

    constructor(subscription, netProcessor, isSubscribe) {
        this.id = subscription;
        this.callback = null;
        this.netProcessor = netProcessor;
        this.isSubscribe = isSubscribe;

        this.timeLoop = null;
    }

    on(callback) {
        this.callback = callback;
    }

    off() {
        this.stopLoop();
        this.netProcessor.unSubscribe(this);
    }

    emit(result) {
        this.callback && this.callback(result);
    }

    startLoop(cb, time = 2000) {
        const loop = () => {
            this.timeLoop = setTimeout(() => {
                this.netProcessor.request(subscribe.getFilterChanges, this.id).then(data => {
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
        this.netProcessor.request(subscribe.uninstallFilter, this.id);
    }
}

export default EventEmitter;
