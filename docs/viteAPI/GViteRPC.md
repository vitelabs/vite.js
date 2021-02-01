
# How to Call Gvite-RPC Methods

## RPC Interface

See the following links for detailed description of RPC API definitions
- [Wallet](/api/rpc/wallet_v2.md) 
- [Ledger](/api/rpc/ledger_v2.md) 
- [Contract](/api/rpc/contract_v2.md)

## Example

- **Call `provider.request`**

- **Parameters** 
    * `methodName: string` RPC API name
    * `...args` Passed-in parameters

- **Example**
```javascript
import { HTTP_RPC } from '@vite/vitejs-http';
import { ViteAPI } from '@vite/vitejs';

const provider = new ViteAPI(new HTTP_RPC('http://example.com'), () => {
    console.log('Connetct');
});

provider.request('ledger_getSnapshotChainHeight').then((height) => {
    console.log(height);
}).catch((err) => {
    console.warn(err);
});

provider.request(
    'contract_createContractAddress', 
    "vite_a5a7f08011c2f0e40ccd41b5b79afbfb818d565f566002d3c6", 
    "2", 
    "3a56babeb0a8140b12ac55e91d2e05c41f908ebe99767b0e4aa5cd7af22d6de7"
).then((contractAddress) => {
    console.log(contractAddress)
}).catch((err) => {
    console.warn(err);
});

provider.request('contract_callOffChainMethod', {
    address: "vite_22f4f195b6b0f899ea263241a377dbcb86befb8075f93eeac8",
    code: "YIBgQFJgBDYQYEJXYAA1fAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkARj/////xaAY8GjSGUUYERXYEJWWwBbYEpgYFZbYEBRgIKBUmAgAZFQUGBAUYCRA5DzW2AAYABgAFBUkFBgblZbkFb+oWVienpyMFggSaCBXUGf/Mh5lfHDLvGQt9g3K+aLjE2PrRxcLb6RSWQAKQ==",
    data: "waNIZQ=="
}).then((result) => {
    console.log(result)
}).catch((err) => {
    console.warn(err);
});
```
