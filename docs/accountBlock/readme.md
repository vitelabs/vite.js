---
order: 1
parent:
  title: Account Block
  order: 2
---

# Start

## What is AccountBlock

Vite adopts the ledger structure of DAG (Directed Acyclic Graph). Each account has a chain composed of a list of account blocks.

If account A wants to send a transaction to account B, A will form an instance of AccountBlock with `toAddress` as the address of B, then send the block as a transaction. 
When the transaction is confirmed, the transfer is done.

Therefore, AccountBlock must contain two pieces of information.
1. Recipient's address and the amount to send
2. Hash of the previous account block so that account blocks can be linked into a chain

## AccountBlock in Vite.js

The following functions are integrated into the `accountBlock` library
1. Methods to generate account blocks for various types of transaction. Refer to [Create Account Block](./createAccountBlock.md)
2. How to create and send an AccountBlock. Refer to [accountBlock Class](./accountBlock.md) for more information
3. Related utility functions. See [utils](./utils.md) for details

## Module Import

```javascript
import { accountBlock } from '@vite/vitejs';

const { createAccountBlock, utils, AccountBlock } = accountBlock;
```
