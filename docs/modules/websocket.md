---
order: 6
---

# Websocket

## Installation

```bash
npm install @vite/vitejs-ws --save
```

## Module Import

```javascript
import WS_RPC from "@vite/vitejs-ws";
```

## Constructor

- **Constructor Parameters**: 
    * `url : string` Connection URL. Default is `ws://localhost:31420`
    * `timeout? : number` Timeout(ms). Default is `60000`
    * `__namedParameters? : object` 
        - `headers? : object` : Request header
        - `protocol?` : Protocol
        - `clientConfig? : object`: [require('websocket').w3cwebsocket ==> clientConfig](https://github.com/theturtle32/WebSocket-Node/blob/58f301a6e245ee25c4ca50dbd6e3d30c69c9d3d1/docs/WebSocketClient.md)
        - `retryTimes? : number`: Retry times. Default is `10`
        - `retryInterval? : number`: Retry interval(ms). Default is `10000`

- **Example**:
```javascript
import WS_RPC from "@vite/vitejs-ws";
const wsProvider = new WS_RPC("ws://localhost:8080");
```

## Properties

|  Name  | Type | Description |
|:------------:|:-----:|:-----:|
| url | string | Connection URL |
| protocol | string | Protocol |
| headers | object | Request header |
| clientConfig | object | Client config object |
| type |  string | Protocol type |
| timeout | number(ms) | Timeout |

## Methods

### abort
Abort current connection and discard all pending requests

### request
Call RPC API and return response

- **Parameters**: 
  * `methodName : string` Name of API method
  * `params : any` Passed-in parameters

- **Returns**:
    - Promise<`JsonRPC response`> RPC response

### sendNotification
Call RPC API and do not return response

- **Parameters**: 
  * `methodName : string` Name of API method
  * `params : any` Passed-in parameters

### batch
Call a batch of RPC APIs

- **Parameters**: 
  * `requests : array<object>` 
	- `type : string<request | notification | batch>` : Type
    - `methodName : string`: Name of API method
    - `params : any`: Passed-in parameters

- **Returns**:
    - Promise<`JsonRPC response`> RPC response

### reconnect
Reconnect

### disconnect
Disconnect

### subscribe
Subscribe to event

- **Parameters**: 
  * `callback : Function` Callback function will be called when the event occurs

### unsubscribe
Cancel subscription
