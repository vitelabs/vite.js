---
order: 4
---

# Auto-Receive AccountBlock

Enable auto-receive on the account for incoming transactions

## Constructor

- **Constructor Parameters**
    * `__namedParameters: object`        
        - `address: Address` Address of account, mandatory
        - `provider: ViteAPI` `ViteAPI` instance
        - `privateKey: Hex` privateKey
        - `sign?: Function`<Badge text="v2.3.6"/>  Used for when you can't get the `privateKey`, such as the privateKey is on the hardware wallet. You can use this function to set signature. See bellow Examples. 

- **Example**

With private key:

```javascript
import { accountBlock } from '@vite/vitejs';

const { ReceiveAccountBlockTask } = accountBlock;

const ReceiveTask = new ReceiveAccountBlockTask({
    address: 'your address',
    privateKey: 'your privateKey',
    provider: viteProvider,
});

ReceiveTask.onSuccess((result) => {
    console.log('success', result);
});
ReceiveTask.onError((error) => {
    console.log('error', error);
});
ReceiveTask.start({
    checkTime: 3000,
    transctionNumber: 10
});
```

Without private key, such as using hardware wallet to sign tx:

```javascript
import { accountBlock } from '@vite/vitejs';

const { ReceiveAccountBlockTask } = accountBlock;


const signWithHardWallet = async () => {
    let signature = '';
    // Sign with hard wallet, and return signature

    return signature;
}

const ReceiveTask = new ReceiveAccountBlockTask({
    address: 'your address',
    provider: viteProvider,
    sign: async (_accountBlock) => {
        let signature = await signWithHardWallet();
        // Set publicKey if not
        _accountBlock.setPublicKey(this.publicKey);
        // Set signature, this is required
        _accountBlock.setSignature(signature);
    }
});

ReceiveTask.onSuccess((result) => {
    console.log('success', result);
});
ReceiveTask.onError((error) => {
    console.log('error', error);
});
ReceiveTask.start({
    checkTime: 3000,
    transctionNumber: 10
});
```

## Methods

### start
Start auto-receive account blocks

- **Parameters** 
    * `__namedParameters: object`
        - `checkTime?: number` Polling interval of unreceived transactions. Default is 3000(ms)
        - `transctionNumber?: number` Transactions handled in each poll. Default is 5

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { ReceiveAccountBlockTask } = accountBlock;

const ReceiveTask = new ReceiveAccountBlockTask({
    address: 'your address',
    privateKey: 'your privateKey',
    provider: viteProvider,
});

ReceiveTask.start({
    checkTime: 3000,
    transctionNumber: 10
});
```

### stop
Stop auto-receive account blocks

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { ReceiveAccountBlockTask } = accountBlock;

const ReceiveTask = new ReceiveAccountBlockTask({
    address: 'your address',
    privateKey: 'your privateKey',
    provider: viteProvider,
});

ReceiveTask.start({
    checkTime: 3000,
    transctionNumber: 10
});
ReceiveTask.stop();
```

### onError
Receive failed handler

- **Parameters** 
    * `errorCB: Function` Event handler on receive failure

- **error** Error message
    - `status: 'error'`
    - `message: string` Error message
    - `timestamp: number` Timestamp
    - `unreceivedHash?: Hex` Hash of AccountBlock that was received unsuccessfully
    - `error: any` RPC error message

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { ReceiveAccountBlockTask } = accountBlock;

const ReceiveTask = new ReceiveAccountBlockTask({
    address: 'your address',
    privateKey: 'your privateKey',
    provider: viteProvider,
});

ReceiveTask.onError((error) => {
    console.log('error', error);
});
ReceiveTask.start({
    checkTime: 3000,
    transactionNumber: 10
});
```

### onSuccess
Receive succeeded handler

- **Parameters** 
    * `successCB: Function` Event handler on receive success

- **success** Success message
    - `status: 'ok'`
    - `message: string` Success message
    - `timestamp: number` Timestamp
    - `accountBlockList?: AccountBlock[]` AccountBlockList that has been received

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { ReceiveAccountBlockTask } = accountBlock;

const ReceiveTask = new ReceiveAccountBlockTask({
    address: 'your address',
    privateKey: 'your privateKey',
    provider: viteProvider,
});

ReceiveTask.onSuccess((result) => {
    console.log('success', result);
});
ReceiveTask.start({
    checkTime: 3000,
    transactionNumber: 10
});
```
