import methods from "const/method";
import { Builtin } from "./builtin";
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
export class Client {
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
export async function initClientWithHttp(opt: httpClientOpt) {
    const WS_RPC = new httpProvider(opt);
    const client = new Client(WS_RPC);
    return client
}
export async function initClientWithWs(opt: wsClientOpt) {
        const WS_RPC = new wsProvider(opt);
        const client = new Client(WS_RPC);
        return client;
    // return new Promise((res, rej) => {
    //     const WS_RPC = new wsProvider(opt);
    //     WS_RPC._connectConnect = function () {
    //         const client = new Client(WS_RPC);
    //        res(client)
    //     }
    //     WS_RPC
    //     WS_RPC._connectErr=function(){
    //         rej(new Error("ERROR"))
    //     }
    //     WS_RPC._connectTimeout=function(){
    //         rej(new Error("TIMEOUT"))
    //     }
    // })
}
export async function initClientWithIpc(opt: ipcClientOpt) {
    const IPC_RPC = new ipcProvider(opt);
    const client = new Client(IPC_RPC);
    return client
}
