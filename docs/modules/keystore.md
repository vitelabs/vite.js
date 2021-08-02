---
order: 3
---

# Keystore

Legacy keystore interface. For new users, use [Wallet](../wallet/) to manage your private key and address.

## Installation

```bash
npm install @vite/vitejs-keystore --save
```

## Module Import

```javascript
import { keystore } from '@vite/vitejs';
// Or
import * as keystore from '@vite/vitejs-keystore';
```

## Keystore Structure

```json
{
    "uuid": "fe4a9460-0b3a-11e9-8975-e744cf968fe6",
    "crypto":{
        "ciphername": "aes-256-gcm",
        "ciphertext": "0f2eabd62c2b479e18a8445f2a6449cc77895c5ce24e8e93bf24356b0080de67373956a69499145a262a6bed36873e35",
        "nonce": "c1e22b37a56fc4280d1947a0",
        "kdf": "scrypt",
        "scryptparams": {
            "n": 4096,
            "r": 8,
            "p": 6,
            "keylen": 32,
            "salt": "11a75fdee6bc20084628e55ec3c26ea4120dd8053e39757e164f7642b3d0af73"
        }
    },
    "version": 3,
    "timestamp": 1546068361382
}
```

## Methods

### isValid 
Verify keystore

- **Parameters**
    * `keystore : string` Content of keystore

- **Return**
    * `validate : boolean` If `true`, the keystore is valid

- **Example**
```javascript
import { isValid } from '@vite/vitejs-keystore';

const result = isValid('{}'); // false
```

### decrypt
Decrypt keystore to get key string

- **Parameters**
    * `keystore : string` Content of keystore
    * `pwd : string` Passphrase

- **Return**
    * Promise<`key : string`> Plain key string

### encrypt
Encrypt key string into keystore

- **Parameters**
    * `key : string` Plain key string to be encrypted
    * `pwd : string` Passphrase
    * `scryptParams : Object` Scrypt parameters
        - n
        - r
        - p
        - keylen
        - salt
    
- **Return**
    * Promise<`keystore: string`> Keystore
