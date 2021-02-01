# IPC 

## Installation

```bash
npm install @vite/vitejs-ipc --save
```

## Module Import

```javascript
import IPC_RPC from "@vite/vitejs-ipc";
```

## Constructor

- **Constructor Parameters**
    * `path : string` Connection path
    * `timeout? : number` Timeout(ms). Default is `60000`
    * `__namedParameters? : object` 
        - `delimiter? : string` : Delimiter. Default is `\n`
        - `retryTimes? : number`: Retry times in case the connection is broken. Default is `10`
        - `retryInterval? : number`: Retry interval(ms) in case the connection is broken. Default is `10000`

- **Example**
```javascript
import IPC_RPC from "@vite/vitejs-ipc";

const ipcProvider = new IPC_RPC("~/.gvite/testdata/gvite.ipc");
```

## Properties

|  Name  | Type | Description |
|:------------:|:-----:|:-----:|
| path | string | Connection path |
| delimiter | string | Delimiter |
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
