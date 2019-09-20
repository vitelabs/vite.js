import subscription from './index';
import { subscribe } from './type';

class EventEmitter {
    id: string
    callback: Function
    subscription: subscription
    timeLoop: any
    isSubscribe: boolean

    constructor(id, subscription, isSubscribe) {
        this.id = id;
        this.callback = null;
        this.subscription = subscription;
        this.isSubscribe = isSubscribe;

        this.timeLoop = null;
    }

    on(callback) {
        this.callback = callback;
    }

    off() {
        this.stopLoop();
        this.subscription.unSubscribe(this);
    }

    emit(result) {
        this.callback && this.callback(result);
    }

    startLoop(cb, time = 2000) {
        const loop = () => {
            this.timeLoop = setTimeout(() => {
                this.subscription.request(subscribe.getFilterChanges, this.id).then(data => {
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
        this.subscription.request(subscribe.uninstallFilter, this.id);
    }
}

export default EventEmitter;
