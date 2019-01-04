export declare type Hex = string;
export declare type Address = string;
export declare type AddrObj = {
    addr: string, 
    pubKey: Hex, 
    privKey: Hex, 
    hexAddr: Address
}
export enum LangList {
    english = 'english',
    japanese = 'japanese',
    chineseSimplified = 'chinese_simplified',
    chineseTraditional = 'chinese_traditional',
    french = 'french',
    italian = 'italian',
    korean = 'korean',
    spanish = 'spanish'
}
