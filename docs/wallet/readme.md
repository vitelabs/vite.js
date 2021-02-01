---
order: 1
parent:
  title: Wallet
  order: 3
---

# Start

## Module Import

```javascript
import { wallet } from '@vite/vitejs';
```

## Common Types

```typescript
export declare type AddressObj = {
    originalAddress: Hex;
    publicKey: Hex;
    privateKey: Hex;
    address: Address;
}

export declare type WalletAddressObj {
    publicKey: Hex;
    privateKey: Hex;
    originalAddress: Hex;
    address: Address;
    path: String;
}
```

:::warning Passphrase

BIP-39 uses PBKDF2 to generate seed, where mnemonic phrase is feed as password and passphrase as salt. Losing passphrase will result in lost of private key.

See [here](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) for details

:::

## Methods

### createMnemonics
Create mnemonic phrase

- **Parameters** 
    * `number` Number of bits of the entropy, optional. Default is `256`. (256-bit entropy will generate 24-word phrase while 128 bits will create 12-word mnemonics)
    * `Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`

- **Return**
    * `String` Mnemonic phrase

- **Example**
```javascript
const bip39 = require('bip39');
import { wallet } from '@vite/vitejs';

const { createMnemonics } = wallet;

const myMnemonics = createMnemonics();
// In case of other language
const myJapanMnemonics = createMnemonics(256, bip39.wordlists.japanese)
```

### validateMnemonics
Verify mnemonic phrase

- **Parameters** 
    * `string` Mnemonic phrase
    * `Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`

- **Return**
    * `boolean` If `true`, the mnemonic phrase is valid

- **Example**
```javascript
const bip39 = require('bip39');
import { wallet } from '@vite/vitejs';

const result = wallet.validateMnemonics('your menemonics');
// In case of other language
const myJapanMnemonics = wallet.validateMnemonics('your menemonics', bip39.wordlists.japanese);
```

### deriveAddress
Derive new address based on mnemonic phrase

- **Parameters** 
    * `__namedParameters: Object`
        - `mnemonics: String` Mnemonic phrase
        - `index?: number` Address index, optional. Default is `0`
        - `wordlist?: Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`
        - `passphrase?: String` Passphrase, optional. Default is `''`

- **Return**
    * `AddressObj` { originalAddress, publicKey, privateKey, address }

- **Example**
```javascript
import { wallet } from '@vite/vitejs';

const { originalAddress, publicKey, privateKey, address } = wallet.deriveAddress({ 
    mnemonics: 'your mnemonics', 
    index: 0 
});
```

### deriveAddressList
Derive a list of new addresses based on mnemonic phrase

- **Parameters** 
    * `__namedParameters: Object`
        - `mnemonics: String` Mnemonic phrase
        - `startIndex: number` Start index, included
        - `endIndex: number` End index, included
        - `wordlist?: Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`
        - `passphrase?: String` Passphrase, optional. Default is `''`

- **Return**
    * `AddressObj[]` [{ originalAddress, publicKey, privateKey, address }, ...]

- **Example**
```javascript
import { wallet } from '@vite/vitejs';

const addressList = wallet.deriveAddressList({ 
    mnemonics: 'your mnemonics', 
    startIndex: 0,
    endIndex: 9
});
```

### isValidAddress
Verify address

- **Parameters** 
    * `string` Address

- **Return**
    * `0 | 1 | 2` Illegal: 0; Account Address: 1; Contract Address: 2

- **Example**
```javascript
import { wallet } from '@vite/vitejs';

const addrType = wallet.isValidAddress('vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2');  // addrType === 1
const addrType2 = wallet.isValidAddress('32323');  // addrType2 === 0
```

### createWallet
Create wallet. Wallet is responsible for managing private keys.

- **Parameters** 
    * `number` Number of bits of the entropy, optional. Default is `256`. (256-bit entropy will generate 24-word phrase while 128 bits will create 12-word mnemonics)
    * `Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`
    * `string` Passphrase, optional. Default is `''`

- **Return**
    * Wallet instance

- **Example**
```javascript
import { wallet } from '@vite/vitejs';

const myWallet = wallet.createWallet();
```

### getWallet
Restore wallet based on mnemonic phrase

- **Parameters** 
    * `string` Mnemonic phrase
    * `number` Number of bits of the entropy, optional. Default is `256`. (256-bit entropy will generate 24-word phrase while 128 bits will create 12-word mnemonics)
    * `Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`
    * `string` Passphrase, optional. Default is `''`

- **Return**
    * Wallet instance


- **Example**
```javascript
import { wallet } from '@vite/vitejs';

const myWallet = wallet.getWallet('your mnemonics');
```
