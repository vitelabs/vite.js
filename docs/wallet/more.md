---
order: 3
---

# More Methods

## getEntropyFromMnemonics
Get entropy from mnemonic phrase

- **Parameters** 
    * `String` Mnemonic phrase
    * `number` Number of bits of the entropy, optional. Default is `256`. (256-bit entropy will generate 24-word phrase while 128 bits will create 12-word mnemonics)
    * `Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`

- **Return**
    * `Hex` Entropy

## getSeedFromMnemonics
Get seed from mnemonic phrase

- **Parameters** 
    * `String` Mnemonic phrase
    * `String` Passphrase, optional. Default is `''`
    * `Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`

- **Return**
    * `Object`
        - `seed: Buffer` Seed buffer
        - `seedHex: Hex` Seed in hex string

## createSeed
Create seed

- **Parameters** 
    * `number` Number of bits of the entropy, optional. Default is `256`. (256-bit entropy will generate 24-word phrase while 128 bits will create 12-word mnemonics)
    * `String` Passphrase, optional. Default is `''`
    * `Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`

- **Return**
    * `Object`
        - `mnemonic: String` Mnemonic phrase
        - `seed: Buffer` Seed buffer
        - `seedHex: Hex` Seed in hex string

## getMnemonicsFromEntropy
Get mnemonic phrase from entropy

- **Parameters** 
    * `Hex` Entropy
    * `Array<String>` Wordlist, optional. Default is `bip39.wordlists.EN`

- **Return**
    * `String` Mnemonic phrase

## getPath
Get derivation path

- **Parameters** 
    * `number` Address index 

- **Return**
    * `String` Derivation path

## deriveKeyPairByPath
Derive key pair by path

- **Parameters** 
    * `String` Seed
    * `String` Derivation path of address

- **Return**
    * `Object` Key pair
        - `privateKey: Hex` Private key
        - `publicKey: Hex` Public key

## deriveKeyPairByIndex
Derive key pair by index

- **Parameters** 
    * `String` Seed
    * `number` Address index

- **Return**
    * `Object` Key pair
        - `privateKey: Hex` Private key
        - `publicKey: Hex` Public key

## createAddressByPrivateKey
Get address from private key

- **Parameters** 
    * `Hex?` Private key, optional. If not present, private key will be generated in method

- **Return**
    * `AddressObj`
        - `originalAddress: Hex` Original address
        - `publicKey: Hex`  Public key
        - `privateKey: Hex` Private key
        - `address: Address` Address

## getAddressFromPublicKey
Get address from public key

- **Parameters** 
    * `Hex` Public key

- **Return**
    * `Address` Address

## getOriginalAddressFromAddress
Get original address from address

- **Parameters** 
    * `Address` Address

- **Return**
    * `originalAddress` Original address

## getAddressFromOriginalAddress
Get address from original address

- **Parameters** 
    * `originalAddress` Original address

- **Return**
    * `Address` Address
