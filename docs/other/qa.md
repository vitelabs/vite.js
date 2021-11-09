---
parent:
    title: Other
---

# Q&A

## Mnemonics

Multiple private keys can be derived from one mnemonic phrases, each having independent address. Refer to [HD Wallet](https://docs.vite.org/go-vite/reference/hdwallet.html) for more information

:::warning Note
Always keep your mnemonic phrase safe
:::

## Quota

Quota is necessary for sending transaction on Vite. In the Mainnet, quota can be obtained through PoW or staking. Refer to [Quota](https://docs.vite.org/go-vite/reference/quota.html) for details

## Token Issuance

Refer to [RPC Token Issuance API](https://docs.vite.org/go-vite/api/rpc/contract_v2.html#token-issuance-contract)

## Subscription

Event subscription is provided in `ViteAPI`. Refer to [ViteAPI](https://docs.vite.org/vite.js/viteAPI/#subscribe) for detailed information

## Sending Transaction

```javascript
import HTTP_RPC from '../../src/HTTP';
import { wallet, accountBlock, ViteAPI, constant } from '@vite/vitejs';

const { Vite_TokenId } = constant;
const { getWallet } = wallet;
const { createAccountBlock } = accountBlcok;

// 1. Get private key and account address from mnemonic phrase
const wallet = getWallet('yourMnemonic');
const { privateKey, address } = wallet.deriveAddress(0);  // get the private key at index 0.

// 2. Get provider by HTTP address
const httpService = new HTTP_RPC("http://example.com");
const provider = new ViteAPI(httpService);

// 3. Create accountBlock instance
const accountBlock = createAccountBlock('send', {
    toAddress: 'your toAddress', 
    tokenId: Vite_TokenId,
    amount: '1000000000000000000000'    // 10 Vite (18 decimals)
}, provider, privateKey);

// 4. Send accountBlock
const sendAccountBlock = async () => {
    await accountBlock.autoSetPreviousAccountBlock();
    return accountBlock.sign().send();
}

sendAccountBlock().then(() => {
    console.log('Send success');
}).catch((err) => {
    console.warn(err);
});
```
