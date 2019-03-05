import client from './index';

class EventEmitter {
    id: string
    callback: Function
    client: client
    timeLoop: any
    isSubscribe: boolean

    constructor(subscription, client, isSubscribe) {
        this.id = subscription;
        this.callback = null;
        this.client = client;
        this.isSubscribe = isSubscribe;

        this.timeLoop = null;
    }

    on(callback) {
        this.callback = callback;
    }

    off() {
        this.stopLoop();
        this.client.unSubscribe(this);
    }

    emit(result) {
        this.callback && this.callback(result);
    }

    startLoop(cb, time = 2000) {
        let loop = () => {
            this.timeLoop = setTimeout(() => {
                this.client.subscribeFunc.getFilterChanges(this.id).then((data) => {
                    cb && cb(data);
                    loop();
                }).catch(err => {
                    loop();     
                });
            }, time);
        }
        loop();
    }

    stopLoop() {
        if (!this.timeLoop) {
            return;
        }
        clearTimeout(this.timeLoop);
        this.timeLoop = null;
        this.client.subscribeFunc.uninstallFilter(this.id);
    }
}

export default EventEmitter;
