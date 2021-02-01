---
order: 2
---

# Wallet Class

:::warning Note

**Passphrase**

BIP-39 uses PBKDF2 to generate seed, where mnemonic phrase is feed as password and passphrase as salt. Losing passphrase will result in lost of the private key.

See [here](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) for details

:::

## How to Get Address in Wallet

```javascript
import { wallet } from '@vite/vitejs';

const myWallet = wallet.createWallet();

console.log('rootPath: ', myWallet.rootPath);
console.log('my mnemonics: ', myWallet.mnemonics);
console.log('my entropy: ', myWallet.entropy);
console.log('my seed: ', myWallet.seedHex);

const theFirstAddress = myWallet.deriveAddress(0);
const { originalAddress, publicKey, privateKey, address, path } = theFirstAddress;
```

## Properties

|  Name  | Type | Description |
|:------------:|:-----:|:-----:|
| rootPath | string | Root path of mnemonic derived address, read-only. For example, rootPath = `'m/44\'/666666\''` |
| mnemonics | string | Mnemonic phrase |
| entropy | Hex | Entropy of mnemonics |
| wordlist | String[] | Wordlist |
| passphrase | string | Passphrase, optional. Default is `''` |
| seed | Buffer | Seed |
| seedHex | Hex | Seed in hex string |
| id | Hex | Hash of address at index 0 |

## Methods

### getAddressList
Return a list of addresses that have been generated

- **Return**
    * Object{ index: `WalletAddressObj` } 

- **Example**
```javascript
// ....
const currentAddressList = myWallet.getAddressList();
```

### deriveAddress
Derive new address

- **Parameters**
    * `number` Address index

- **Return**
    * `WalletAddressObj` { originalAddress, publicKey, privateKey, address, path }

- **Example**

```javascript
import { wallet } from '@vite/vitejs';

const { createWallet } = wallet;

const myWallet = createWallet();
const addressObj = myWallet.deriveAddress(0);

console.log(addressObj.address)
console.log(addressObj.originalAddress)
console.log(addressObj.privateKey)
console.log(addressObj.publicKey)
console.log(addressObj.path)
```

### deriveAddressList
Derive a list of new addresses

- **Parameters**
    * `number` Start index, included
    * `number` End index, included

- **Return**
    * `WalletAddressObj[]` [{ originalAddress, publicKey, privateKey, address, path }, ...]

- **Example**
```javascript
import { wallet } from '@vite/vitejs';

const { createWallet } = wallet;

const myWallet = createWallet();
const addressObjList = myWallet.deriveAddressList(0, 9);
```
