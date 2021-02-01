---
order: 1
parent:
  title: Vite API
  order: 1
---

# Start

ViteAPI wraps and extends Gvite-RPC API. Functions of network request/listening are included. 

## Module Import

ES6:

```javascript
import { ViteAPI } from '@vite/vitejs';
```

Common:

```javascript
const { ViteAPI } = require('@vite/vitejs');
```

## Constructor

- **Constructor Parameters**
    * `provider : Provider`
    * `onInitCallback : function` : Callback function that will be called when connection is established

- **Example**

```javascript
import WS_RPC from '@vite/vitejs-ws';
import { ViteAPI } from '@vite/vitejs';

const wsService = new WS_RPC("ws://example.com");

const api = new ViteAPI(wsService, () => {
    console.log("Connected.");
});

api.request('ledger_getSnapshotChainHeight').then((height) => {
    console.log(height);
});
```

## Methods

### getBalanceInfo
Return account balance, including balance not received

- **Parameters** 
    * `Address` Address of account

- **Return**
    * Promise<`{ balance, unreceived }`>

- **Example**
```javascript
// ...

provider.getBalanceInfo('vite_098dfae02679a4ca05a4c8bf5dd00a8757f0c622bfccce7d68')
.then(({ balance, unreceived }) => {
    console.log(balance, unreceived);
})
.catch(err => {
    console.warn(err);
});
```

### getTransactionList
Return transaction list by account

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of account
        - `pageIndex: number` Page index
        - `pageSize?: number` Page size. Default is 50
    * `String[] | 'all'` The contract transaction type of which the internal fields of contract need to be resolved. For default, all contract transactions are resolved

- **Return**:
    * Promise<`Array<Transaction>`>

- **Example**

Request:

```javascript
provider.getTransactionList({
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    pageIndex: 0,
    pageSize: 50
});
```

Responce:

```json
[{
    "accountAddress": "vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2",
    "amount": "100000000",
    "blockType": 2,
    "data": "y/Dk+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjhvJvwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI4byb8EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtjc3Rlc3R0b2tlbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQ1NUVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    "toAddress": "vite_000000000000000000000000000000000000000595292d996d",
    "transactionType": "Mintage",
    "contractParams": {
        "0": "1",
        "1": "cstesttoken",
        "2": "CSTT",
        "3": "10000000000000000",
        "4": "2",
        "5": "10000000000000000",
        "6": "1",
        "decimals": "2",
        "isReIssuable": "1",
        "maxSupply": "10000000000000000",
        "ownerBurnOnly": "1",
        "tokenName": "cstesttoken",
        "tokenSymbol": "CSTT",
        "totalSupply": "10000000000000000"
    }
}]
```

### callOffChainContract
Call contract's offchain method 

- **Parameters** 
    * `__namedParameters: object`
        - `address : Address` Address of contract
        - `abi` ABI
        - `code : Base64` Binary code for offchain query. This is the value of "OffChain Binary" section generated when compiling the contract with `--bin`
        - `params` Encoded passed-in parameters

- **Return**:
    * Promise<`Base64`>

### addTransactionType
Add new transaction type. When `provider.getTransactionList` is called, transactions returned will be grouped by transaction type.

- **Parameters** 
    * `__namedParameters: Object` Name of transaction type is stored as the key
        - `contractAddress : Address` Address of contract
        - `abi` ABI

- **Example**
```js
// ...

provider.addTransactionType({ 
    helloWorld: { 
        contractAddr: 'vite_0000000000000000000000000000000000000003f6af7459b9', 
        abi: { methodName: 'hello', inputs: [], type: 'function' }
    }
});
```

### setProvider
Set new provider

- **Parameters**
    * `provider : Provider Instance` New provider
    * `onInitCallback : Function` Callback function that will be called when connection is established
    * `abort : boolean` If `true`, the ongoing request connection of original provider will be interrupted

### request
Call RPC API and return response

- **Parameters**
    * `methods : string` Name of API method
    * `...args` Passed-in parameters

- **Returns**:
    * Promise<`JsonRPC response`> RPC response

- **Example**
```javascript
// ......

// {
//     jsonrpc: "2.0",
//     id: 33
//     method: "rpcMethodName"
//     params: [1, 1, 2]
// }
myNetProcessor.request('rpcMethodName', 1, 1, 2).then(() => {
    // ...
});
```

### sendNotification
Call RPC API and do not return response

- **Parameters**
    * `methods : string` Name of API method
    * `...args` Passed-in parameters

### batch 
Call a batch of RPC APIs

- **Parameters** (RPCrequest[])
    * `__namedParameters: Object`
        - `type: string<request | notification>`
        - `methodName: string` Name of API method
        - `params: any` Passed-in parameters

- **Returns**:
    * Promise<`JsonRPC response`> RPC response

- **Example**
```javascript
// ......

// [{
//     jsonrpc: "2.0",
//     id: 33
//     method: "rpcMethodName"
//     params: [1, 1, 2]
// }]
myNetProcessor.batch([
    type: 'request',
    methodName: 'rpcMethodName', 
    params: [1, 1, 2]
]).then(() => {
    // ...
});
```

### subscribe
Subscribe to event

:::tip Tips
Polling, instead of subscription, will be used by the method if gvite connection is established in HTTP. 
Refer to [Vite RPC Subscription](/api/rpc/subscribe_v2)
:::

- **Parameters**
    * `methods : string` Name of method
    * `...args` Passed-in parameters

- **Returns**:
    - Promise<`event`> Event

- **event**: 
    - on(`callback : Function`): Start listening to the event. The callback function will be called when the event occurs.
    - off: Stop listening

- **Example**
```javascript
// ...

provider.subscribe('newAccountBlocks').then((event) => {
    event.on((result) => {
        console.log(result);
    });
    // event.off();
}).catch(err => {
    console.warn(err);
});
```

### unsubscribe
Cancel subscription

- **Parameters**: 
  * `event`: Event returned by `subscribe` method 

- **Example**
```javascript
// ...
provider.unsubscribe(event);
```

### unsubscribeAll
Cancel all subscriptions

- **Example**
```javascript
// ...
provider.unsubscribeAll();
```
