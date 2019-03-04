import client from './index';

class EventEmitter {
    id: string
    callback: Function
    client: client

    constructor(subscription, client) {
        this.id = subscription;
        this.callback = null;
        this.client = client;
    }

    on(callback) {
        this.callback = callback;
    }

    off() {
        this.client.unSubscribe(this);
    }

    emit(result) {
        this.callback && this.callback(result);
    }
}

export default EventEmitter;
