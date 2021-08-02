---
order: 4
---

# Utils

## Module Import

```javascript
import { utils } from '@vite/vitejs';
```

## uriStringify
Generate a [VEP-6](https://docs.vite.org/go-vite/vep/vep-6.html) compatible Vite schema URI based on the given parameters

- **Parameters**
    * `opt : object`
        - `opt.schema:string?` Default is 'vite'
        - `opt.target_address:vite Address string` Address of transaction's recipient
        - `opt.chain_id?` Network id. Default is 1 (Vite Mainnet)
        - `opt.function_name?` Method name of contract to be called
        - `opt.params:object?` Passed-in parameters

- **Return**
    * `uri : string` Vite schema URI string

- **Passed-in parameters**
  | Parameter name | Type          | Description                          | Example                                 |
  | ---------- | ------------- | ---------------------------------------- | --------------------------------------- |
  | amount     | number        | Amount to transfer. Basic unit is VITE. Default is `0`       | amount=1 (standing for 1 VITE) |
  | data       | base64 string | Additional data. Default is nil	        | data=MTIzYWJjZA                                  |
  | fee        | number        | Transaction fee. Basic unit is VITE. Default is `0`          | fee=1 (standing for 1 VITE)    |
  | tti        | token_type_id | Token id. Default is the tti of VITE token | tti=tti_5649544520544f4b454e6e40 |

## isValidTokenId
Verify token id

- **Parameters**
    * `TokenId` Token id

- **Return**
    * `boolean` If `true`, the token id is valid

## getOriginalTokenIdFromTokenId
Get original token id from token id

- **Parameters**
    * `tokenId : TokenId` Token id

- **Return**
    * `rawTokenId : RawTokenId` Original token id

## getTokenIdFromOriginalTokenId
Get token id from original token id

- **Parameters**
    * `OriginalTokenId` Original token id

- **Return**
    * `TokenId` Token id

## isValidSBPName 
Verify SBP name

- **Parameters**
    * `string`  Name of SBP

- **Return**
    * `boolean` If `true`, the SBP name is valid 
  
## isInteger
Check if the input is integer

- **Parameters**
    * `string`  Input string

- **Return**
    * `boolean` If `true`, the input string is integer

## isNonNegativeInteger
Check if the input is non-negative integer

- **Parameters**
    * `string`  Input string

- **Return**
    * ` boolean` If `true`, the input string is non-negative integer

## isSafeInteger
Check if the input is safe integer

- **Parameters**
    * `string | number` Input number or string

- **Return**
    * `number` -1: Not integer; 0: Un-safe integer or decimal; 1: Safe integer


## isArray
Check if the input is array

- **Parameters**
    * `any` Input value

- **Return**
    * `boolean` If `true`, the input is array

## isObject
Check if the input is object

- **Parameters**
    * `any` Input value

- **Return**
    * `boolean` If `true`, the input is object

## isHexString
Check if the input is hex string

- **Parameters**
    * `string` Input string

- **Return**
    * `boolean` If `true`, the input is hex string

## isBase64String
Check if the input is base64 string

- **Parameters**
    * `string` Input string

- **Return**
    * `boolean` If `true`, the input is base64 string

## blake2b 
Hash function. For more information about blake2b, refer to [blakejs/blake2b](https://www.npmjs.com/package/blakejs)

## blake2bHex
Hash function. For more information about blake2bHex, refer to [blakejs/blake2b](https://www.npmjs.com/package/blakejs)

## _Buffer 
A quick reference to buffer

## _bn
A quick reference to bn.js

## ed25519

### keyPair 
Get key pair

- **Return**
    * Object : Key pair
        - `publicKey : Uint8Array with 32-byte public key`
        - `privateKey : Uint8Array with 64-byte private key`

### getPublicKey
Get public key from private key. The private key must be derived from key pair

- **Parameters**
    * `Buffer` privateKey

- **Return**
    * `Uint8Array with 32-byte public key` publicKey

### sign 
Sign

- **Parameters**
    * `Hex` Original text
    * `Hex` Private key

- **Return**
    * `Hex` Signature
  
### verify
Verify signature

- **Parameters**
    * `Hex` Original text
    * `Hex` Signature
    * `Hex` Public key

- **Return**
    * `Boolean` If `true`, the signature is valid
  
### random
Generate random number

- **Parameters**
    * `number` byte length. Default is `32`
  
- **Return**
    * `num : Uint8Array` Random number
