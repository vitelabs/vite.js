import methods,{ledger} from "const/method";

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
export default class client {
    _provider:any
    constructor(provider:any){
        this._provider=provider;
    }
    get provider(){
        return this._provider
    }
    set provider(v){
        this._provider=v;
    }
    async request(methods:methods,...args:any[]){
        const rep:RPCresponse= await this._provider.request(methods,args);
        if(rep.error){throw rep.error};
        return rep.result;
    }
    async batch(reqs:RPCrequest[]){
        reqs.forEach(v=>{
            v.types=v.types||'request'
        });
        const reps:RPCresponse[]=await this._provider.batch(reqs);
        return reps;
    }
    async subscribe(){
        
    }
    async unSubscribe(){

    }
}
