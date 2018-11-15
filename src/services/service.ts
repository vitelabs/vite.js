interface request {
    Method: String;
    params:Array<any>;
}
interface response {
    code:Number;
    message:String;
    result:any;
}
export default class services {
    _provider:any
    constructor(provider:any){
        this._provider=provider;
    }
    request(){

    }
    batch(){

    }
}
