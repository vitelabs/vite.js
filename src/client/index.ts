import methods from "const/method";
import {Builtin} from "./builtin";
import { httpProvider, ipcProvider, wsProvider } from "../provider/index";

export declare interface RPCrequest {
    types?: string;
    Method: methods;
    params: any[];
}
export declare interface RPCresponse {
    jsonrpc?: string;
    id?: number;
    result?: any;
    error?: RPCerror
}
export declare interface RPCerror {
    code: number,
    message: string
}
export class client {
    _provider: any
    builtin: Builtin
    constructor(provider: any) {
        this._provider = provider;
        this.builtin = new Builtin(this._provider)
    }
    get provider() {
        return this._provider
    }
    set provider(v) {
        this._provider = v;
    }
    async request(methods: methods, ...args: any[]) {
        const rep: RPCresponse = await this._provider.request(methods, args);
        if (rep.error) { throw rep.error };
        return rep.result;
    }
    async batch(reqs: RPCrequest[]) {
        reqs.forEach(v => {
            v.types = v.types || 'request'
        });
        const reps: RPCresponse[] = await this._provider.batch(reqs);
        return reps;
    }
    async subscribe() {

    }
    async unSubscribe() {

    }
}
export declare type httpClientOpt = {
    host?: string,
    headers?: Object,
    timeout?: 0
}
export declare type ipcClientOpt = {
    path?: string,
    delimiter?: string,
    timeout?: number
}
export declare type wsClientOpt = {
    url?: string,
    protocol: string,
    headers: object,
    clientConfig: object,
    timeout?: number
}
export function initClientWithHttp(opt: httpClientOpt) {
    return new client(new httpProvider(opt))
}
export function initClientWithWs(opt: ipcClientOpt) {
    return new client(new ipcProvider(opt))
}
export function initClientWithIpc(opt: wsClientOpt) {
    return new client(new wsProvider(opt))
}
