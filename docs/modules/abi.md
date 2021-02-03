---
order: 2
---

# ABI

## Installation

```bash
npm install @vite/vitejs-abi --save
```

## Module Import

```javascript
import { abi } from '@vite/vitejs';
// Or
import * as abi from '@vite/vitejs-abi';
```

## Parameter Types
Contract methods (including constructors, asynchronous calls, offline queries) can contain multiple parameters, where the offline methods can also have multiple return values.
Currently, the following parameter types are supported:


| Type | Name | Example | Value | Encoded Value |
|:------------:|:-----------:|:-----------:|:-----------:|:-----------:|
| `uint<M>` | Unsigned integer, 0 < M <= 256, M % 8 == 0 | uint256 | '2345675643' | '000000000000000000000000000000000000000000000000000000008bd02b7b' |
| `int<M>` | Signed integer, 0 < M <= 256, M % 8 == 0 | int8 | '2' | '0000000000000000000000000000000000000000000000000000000000000002' |
| `uint` | Equivalent to uint256 | uint | '2345675643' | '000000000000000000000000000000000000000000000000000000008bd02b7b' |
| `int` | Equivalent to  int256 | int | '2' | '0000000000000000000000000000000000000000000000000000000000000002' |
| `tokenId` | Token id | tokenId | 'tti_5649544520544f4b454e6e40' | '000000000000000000000000000000000000000000005649544520544f4b454e' |
| `address` | Address of account | address | 'vite_010000000000000000000000000000000000000063bef3da00' | '0000000000000000000000010000000000000000000000000000000000000000' |
| `gid` | Consensus group id | gid | '01000000000000000000' | '0000000000000000000000000000000000000000000001000000000000000000' |
| `bool` | Boolean | bool | true | '0000000000000000000000000000000000000000000000000000000000000001' |
| `bytes<M>` | Fixed-length byte array, 0 < M <= 32 | bytes32 | '0x0100000000000000000000000000000000000000000000000000000000000000' | '0100000000000000000000000000000000000000000000000000000000000000' |
| `bytes` | Variable-length byte array | bytes | '0xdf3234' | '00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000' | 
| `string` | Variable-length string | string | 'foobar' | '0000000000000000000000000000000000000000000000000000000000000006666f6f6261720000000000000000000000000000000000000000000000000000' |
| `<type>[M]` | Fixed-length array of type, M >= 0. Range of values:`uint<M>`, `int<M>`, `uint`, `int`, `tokenId`, `address`, `gid`, `bool` and `string` | uint8[2] | ['1','2'] | '00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002' |
| `<type>[]` | Variable-length array of type. Range of values: `uint<M>`, `int<M>`, `uint`, `int`, `tokenId`, `address`, `gid`, `bool` and `string` | uint256[] | ['1','2'] | '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002' |

- **Example jsonInterface**

```json
{
    "type": "event",
    "name": "methodName",
    "inputs": [
        { "name": "input1", "type": "address" }
    ]
}
```

## Methods

### encodeLogSignature

- **Parameters**
    * `jsonInterface | Array<jsonInterface>` 
    * `methodName?` Name of method to encode, mandatory if the first parameter is a `jsonInterface` array.

- **Return**
    * `hexString`

- **Example**
```js
let encodeLogSignatureResult1 = abi.encodeLogSignature({
    'type': 'event',
    'name': 'balance',
    'inputs': [{'name':'in','type':'uint256'}]
});
// 8a3390b86e28f274e3a88354b3b83cf0f8780a1f0975f629966bd2a2d38eb188

let encodeLogSignatureResult22 = abi.encodeLogSignature([
    {'type':'event','name':'heck','inputs':[{'name':'t','type':'address'}]},
    {'type':'event','name':'check','inputs':[{'name':'t','type':'address'},{'name':'b','type':'uint256'}]},
    {'type':'event','name':'eck','inputs':[]},
], 'check');
// 17c53855485cba60b5dea781a996394bb9d3b44bc8932b3adf79ac70e908b220
```    

### encodeFunctionSignature

- **Parameters**
    * `jsonInterface | Array<jsonInterface>` 
    * `methodName?` Name of method to encode, mandatory if the first parameter is a `jsonInterface` array.

- **Return**
    * `hexString`

- **Example**
```js
let encodeMethodResult1 = abi.encodeFunctionSignature({
    'type': 'function',
    'name': 'singleParam',
    'inputs': [{'name':'param1','type':'address'}]
}); 
// 053f71a4
```  

### encodeFunctionCall

- **Parameters**
    * `jsonInterface | Array<jsonInterface>` 
    * `params` Input parameters
    * `methodName?` Name of method to encode, mandatory if the first parameter is a `jsonInterface` array.

- **Return**
    * `hexString`

- **Example**
```js
let result = abi.encodeFunctionCall({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'string',
        name: 'myString'
    }]
}, ['2345675643', 'Hello!%']);
// 96173f6c000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000

let result1 = abi.encodeFunctionCall([{
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'string',
        name: 'myString'
    }]
}, {
    name: 'myethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'string',
        name: 'myString'
    }]
}], ['2345675643', 'Hello!%'], 'myMethod');
// 96173f6c000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000
```  

### encodeParameter

- **Parameters**
    * `type` Parameter type
    * `params` Input parameters. If the parameter type is array, an parameter array should be passed in 

- **Return**
    * `hexString`

- **Example**
```js ::Demo
let _r = abi.encodeParameter('uint256', '2345675643');
// 000000000000000000000000000000000000000000000000000000008bd02b7b

let encodeParameterResult4 = abi.encodeParameter('uint16[]', [1,2]);
// 000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002
```  

### decodeParameter

- **Parameters**
    * `type` Parameter type
    * `hexString` Encoded hex string

- **Return**
    * `decodeResult`

- **Example**
```js
let _r = abi.decodeParameter('uint256', '000000000000000000000000000000000000000000000000000000008bd02b7b');
// 2345675643

let encodeParameterResult2 = abi.decodeParameter('uint8[]', '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002');
// ['1','2']
```  

### encodeParameters

- **Parameters**
    * `jsonInterface | Array<type-string> | Array<jsonInterface>` 
    * `params<Array | json-string>` Input parameters
    * `methodName?` Name of method to encode, mandatory if the first parameter is an array.

- **Return**
    * `hexString`

- **Example**
```js
let encodeParametersResult1 = abi.encodeParameters({'type':'constructor','inputs':[
    {'type':'uint8[]'}, {'type': 'bytes'}
]}, [['34','43'], '324567ff']);

// Or json-string, eg
// let encodeParametersResult1 = abi.encodeParameters({'type':'constructor','inputs':[
//     {'type':'uint8[]'}, {'type': 'bytes'}
// ]}, JSON.stringfy([['34','43'], '324567ff']));

// 000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002b0000000000000000000000000000000000000000000000000000000000000004324567ff00000000000000000000000000000000000000000000000000000000

let encodeParametersResult4 = abi.encodeParameters(['tokenId','address'], ['tti_01000000000000000000fb5e', 'vite_010000000000000000000000000000000000000063bef3da00']);
// 00000000000000000000000000000000000000000000010000000000000000000000000000000000000000010000000000000000000000000000000000000000

let encodeParametersResult12 = abi.encodeParameters([
    {'type':'constructor', 'name': 'myMethods', 'inputs':[{'type':'uint8[]'}, {'type': 'bytes'}]},
    {'type':'constructor', 'name': 'myMetod', 'inputs':[{'type': 'bytes'}]},
    {'type':'constructor', 'name': 'myMethowed', 'inputs':[{'type':'uint8[]'}, {'type': 'bytes'}]},
    {'type':'constructor', 'name': 'myMethossssd', 'inputs':[{'type': 'bytes'}]}
], [['34','43'], '324567ff'], 'myMethowed');
// 000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002b0000000000000000000000000000000000000000000000000000000000000004324567ff00000000000000000000000000000000000000000000000000000000

```  

### decodeParameters

- **Parameters**
    * `jsonInterface | Array<type-string> | Array<jsonInterface>`
    * `hexString` Encoded hex string
    * `methodName?` Name of method to decode, mandatory if the first parameter is an array.

- **Return**
    * `decodeResult`

- **Example**
```js
let decodeParametersResult1 = abi.decodeParameters({'type':'constructor','inputs':[
    {'type':'uint8[]'}, {'type': 'bytes'}
]}, '000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002b0000000000000000000000000000000000000000000000000000000000000004324567ff00000000000000000000000000000000000000000000000000000000');
// [['34','43'], '324567ff']

let decodeParametersResult5 = abi.decodeParameters(['string', 'tokenId','address'], '000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f343832393438326e73646b6a736b640000000000000000000000000000000000');
// ['4829482nsdkjskd', 'tti_01000000000000000000fb5e', 'vite_00010000000000000000000000000000000000005cce05dbde']

let decodeParametersResult22 = abi.decodeParameters([
    {'type':'function','name':'singl','inputs':[{'name':'param1','type':'address'}]},
    {'type':'function','name':'singleParam','inputs':[
        {'name':'param1','type':'address'},
        {'name':'param1','type':'uint8[]'}
    ]}
], '00000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002', 'singleParam');
// ['vite_00010000000000000000000000000000000000005cce05dbde', [1,2]]
```  

### decodeLog

- **Parameters**
    * `jsonInterface.inputs | jsonInterface | Array<jsonInterface>`
    * `hexString` Encoded hex string
    * `Array<hexString>`
    * `methodName?` Name of method to decode, mandatory if the first parameter is a `jsonInterface` array.

- **Return**
    * `decodeResult`

- **Example**
```js
let decodeResult2 = abi.decodeLog(
    [
        {'indexed':true,'name':'from','type':'address'},
        {'indexed':true,'name':'to','type':'address'},
        {'indexed':false,'name':'value','type':'uint256'}
    ], 
    '00000000000000000000000000000000000000000000000000000000000f4240',
    ['0000000000000000000000000100000000000000000000000000000000000000', '0000000000000000000000000200000000000000000000000000000000000000']
);
// {
//     '0': 'vite_00010000000000000000000000000000000000005cce05dbde',
//     '1': 'vite_0002000000000000000000000000000000000000fe64322db1',
//     '2': '1000000',
//     from: 'vite_00010000000000000000000000000000000000005cce05dbde',
//     to: 'vite_0002000000000000000000000000000000000000fe64322db1',
//     value: '1000000'
// }

let decodeResult222 = abi.decodeLog([
    { 
        'type':'constructor',
        'name': '89xxx',
        'inputs':[{type:'string',name:'myString'}]
    },
    { 'name': '232', 'inputs':[] },
    { 
        'type':'constructor',
        'name': 'xxxxx',
        'inputs':[
            {type:'string',name:'myString'},
            {type:'uint256',name:'myNumber',indexed: true},
            {type: 'uint8',name: 'mySmallNumber',indexed: true}
        ]
    }
], 
'0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
['000000000000000000000000000000000000000000000000000000000000f310', '0000000000000000000000000000000000000000000000000000000000000010'], 'xxxxx');
// {
//     '0': 'Hello%!',
//     '1': '62224',
//     '2': '16',
//     myString: 'Hello%!',
//     myNumber: '62224',
//     mySmallNumber: '16'
// }

let decodeResult1 = abi.decodeLog({'type':'constructor','inputs':[
    {type:'string',name:'myString'},
    {type:'uint256',name:'myNumber',indexed: true},
    {type: 'uint8',name: 'mySmallNumber',indexed: true}
]}, 
'0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
['000000000000000000000000000000000000000000000000000000000000f310', '0000000000000000000000000000000000000000000000000000000000000010']);
// {
//     '0': 'Hello%!',
//     '1': '62224',
//     '2': '16',
//     myString: 'Hello%!',
//     myNumber: '62224',
//     mySmallNumber: '16'
// }
```  
