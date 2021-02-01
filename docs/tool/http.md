# HTTP

## Installation

:::demo
```bash tab:npm
npm install @vite/vitejs-http --save
```

```bash tab:yarn
yarn add @vite/vitejs-http
```
:::

## Module Import

:::demo
```javascript tab:ES6
import HTTP_RPC from "@vite/vitejs-http";
```

```javascript tab:require
const { HTTP_RPC } = require('@vite/vitejs-http');
```
:::

## Constructor

- **Constructor Parameters**: 
    * `url : string` Connection URL. Default is `http://localhost:8415`
    * `timout : number` Timeout(ms). Default is `60000`
    * `Object` 
        - `headers : object` : Request header

- **Example**:
```javascript
import HTTP_RPC from "@vite/vitejs-http";

const httpProvider = new HTTP_RPC("http://localhost:8080");
```

## Properties

|  Name  | Type | Description |
|:------------:|:-----:|:-----:|
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
