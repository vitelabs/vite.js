---
order: 3
---


# Create AccountBlock

## createAccountBlock

Create an AccountBlock instance

- **Parameters** 
    * `type: String` See [AccountBlock Type](#accountblock-type)
    * `params: Object` Passed-in parameters

- **Return**
    * accountBlock instance

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { createAccountBlock, utils } = accountBlock;

const accountBlock = createAccountBlock('receive', {
    address,
    sendBlockHash: data[0].hash
});

async function sendAccountBlock(accountBlock) {
    accountBlock.setProvider(viteProvider).setPrivateKey(privateKey);
    await accountBlock.autoSetPreviousAccountBlock();
    const result = await accountBlock.sign().send();
    console.log('send success', result);
}
```

## AccountBlock Type

### receive 
Type of response

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account
        - `sendBlockHash: Hex` Hash of the block of request transaction

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('receive', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    sendBlockHash: '156a47de8b5a690562278360e41e337ee4f1b4aa8d979f377beb0cc70f939032'
});
```

### send 
Type of request

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account
        - `toAddress: Address` Address of transaction recipient
        - `tokenId: TokenId` Token id. Default is `Vite_TokenId`
        - `amount: BigInt` Amount to send, including decimals. Default is `0`. For example, fill in `10000000000000000000` for 10 VITE
        - `data: Base64` Additional data, optional

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('send', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    toAddress: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    tokenId: 'tti_5649544520544f4b454e6e40',
    amount: '0',
    data: 'pinFMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB'
});
```

### createContract 
Type of creating smart contract

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account (creator)
        - `code: Hex` Complied code of contract
        - `responseLatency?: Uint8` Response latency. Default is `0`, `responseLatency` must >= `randomDegree`
        - `quotaMultiplier?: Uint8` Quota multiplier. Default is `10`
        - `randomDegree?: Uint8` Random degree. Default is `0`
        - `abi?: Object | Array<Object>` ABI
        - `params?: string | Array<string | boolean>` Passed-in parameters of contract constructor

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('createContract', {
    abi:[{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"SayHello","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"transfer","type":"event"}],
    code: '608060405234801561001057600080fd5b50610141806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806391a6cb4b14610046575b600080fd5b6100896004803603602081101561005c57600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff16906020019092919050505061008b565b005b8074ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f1505050508074ffffffffffffffffffffffffffffffffffffffffff167faa65281f5df4b4bd3c71f2ba25905b907205fce0809a816ef8e04b4d496a85bb346040518082815260200191505060405180910390a25056fea165627a7a7230582023e9669dd6fec3b6b2a84a1fd7c9939f49197203d0e1db312278e633c219c2480029',
    responseLatency: 2,
    params: ['vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9']
});
```

### callContract 
Type of calling contract

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account
        - `toAddress: Address` Address of contract
        - `abi: Object | Array<Object>` ABI
        - `methodName?: string` Name of method
        - `params?: any` Passed-in parameters
        - `tokenId?: TokenId` Token id. Default is `Vite_TokenId`
        - `amount?: BigInt` Amount to send. Default is `0`
        - `fee?: BigInt` Transaction fee. Default is `0`

- **Return**
    * accountBlock instance

- **Example**
```javascript
import { constant } from '~@vite/vitejs';
const { Contracts, Vite_TokenId } = constant;

// ....

const accountBlock = createAccountBlock('callContract', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    abi: Contracts.RegisterSBP.abi,
    toAddress: Contracts.RegisterSBP.contractAddress,
    params: [ Snapshot_Gid, sbpName, blockProducingAddress ],
    tokenId: Vite_TokenId,
    amount: '1000000000000000000000000'
});
```

### registerSBP 
Type of SBP registration

To register an SBP node, transferring 1m `VITE` is required as stake. The transferred VITE will be locked for 7,776,000 snapshot blocks (about 3 months).

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account (register)
        - `sbpName: string` Name of SBP
        - `blockProducingAddress: Address` Block producing address

- **Return**
    * accountBlock instance

- **Example**
```javascript
import { constant } from '~@vite/vitejs';
const { Contracts, Vite_TokenId } = constant;

// ....

const accountBlock = createAccountBlock('registerSBP', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    sbpName: 'TEST_NODE', 
    blockProducingAddress: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2'
});
```

### updateSBPBlockProducingAddress 
Type of updating SBP's block producing address

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account. Must be the same as original registration address of the SBP
        - `sbpName: string` Name of SBP
        - `newBlockProducingAddress: Address` New block producing address

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('updateSBPBlockProducingAddress', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    sbpName: 'TEST_NODE',
    newBlockProducingAddress: 'vite_869a06b8963bd5d88a004723ad5d45f345a71c0884e2c80e88'
});
```

### revokeSBP 
Type of cancelling SBP

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account. Must be the same as original registration address of the SBP
        - `sbpName: string` Name of SBP

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('revokeSBP', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    sbpName: 'TEST_NODE'
});
```

### withdrawSBPReward 
Type of withdrawing SBP rewards

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account. Must be the same as original registration address of the SBP
        - `sbpName: string` Name of SBP
        - `receiveAddress: Address` Address to receive rewards

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('withdrawSBPReward', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    sbpName: 'TEST_NODE',
    receiveAddress: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
});
```

### voteForSBP 
Type of voting for SBP

The balance of VITE in account will be used as voting weight

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account
        - `sbpName: string` Name of SBP

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('voteForSBP', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    sbpName: 'TEST_NODE'
});
```

### cancelVote 
Type of cancelling voting

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account
        
- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('cancelVote', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2'
});
```

### stakeForQuota 
Type of staking for quota

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account
        - `beneficiaryAddress: Address` Address of staking beneficiary
        - `amount: BigInt` Amount of VITE to stake, including decimals. A minimum amount of 134 is required. For example, staking 134 VITE, fill in `134000000000000000000`

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('stakeForQuota', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    beneficiaryAddress: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    amount: '134000000000000000000'
});
```

### cancelQuotaStake 
Type of cancelling quota staking

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account
        - `id: string` Staking id

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('cancelQuotaStake', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    id: '401d46c2330d3c76c8f0da6be2a24b17c5e3ece9c28d80a74e91146d1f95ad2e'
});
```

### issueToken 
Type of token issuance

An issuance fee of 1,000 VITE will be charged from the account of issuer, who will subsequently receive an amount of issued tokens equivalent to the total initial supply. 
Token has owner. The initial owner is token issuer.

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account (token issuer)     
        - `tokenName: string` Name of token in 1-40 characters, including uppercase/lowercase letters, spaces and underscores. Cannot have consecutive spaces or start/end with space
        - `tokenSymbol: string` Symbol of token in 1-10 characters, including uppercase/lowercase letters, spaces and underscores. Cannot use `VITE`, `VCP` or `VX`
        - `decimals: Uint8` Decimal places. Having $10^{decimals} \leq totalSupply$
        - `maxSupply: Uint256` Maximum supply. Mandatory for re-issuable token. Having $totalSupply \leq maxSupply \leq 2^{256}-1$. For non-reissuable token, fill in `0` 
        - `totalSupply: Uint256` Total supply. Having $totalSupply \leq 2^{256}-1$. For re-issuable token, this is initial total supply
        - `isReIssuable: boolean` If `true`, newly additional tokens can be minted after initial issuance
        - `isOwnerBurnOnly: boolean` If `true`, the token can only burned by owner. Mandatory for re-issuable token. For non-reissuable token, fill in `false`

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('issueToken', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    tokenName: 'testToken', 
    isReIssuable: true, 
    maxSupply: '10000000000000000000000000', 
    isOwnerBurnOnly: false, 
    totalSupply: '100000000000000000000000', 
    decimals: 2, 
    tokenSymbol: 'TestT'
});
```

### reIssueToken 
Type of reissuing token

Re-issuable token's owner can mint additional amount of tokens by re-issuance. Non applicable to non-reissuable token.

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account (token owner)        
        - `tokenId: TokenId` Token id
        - `amount: BigInd` Amount to mint, including decimals. For example, re-issuing 100 VITE, fill in `100000000000000000000`
        - `receiveAddress: Address` Address to receive newly minted tokens

- **Return**
    * accountBlock instance
   
- **Example**
```javascript
const accountBlock = createAccountBlock('reIssueToken', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    tokenId: 'your tokenId', // eg: tti_5649544520544f4b454e6e40
    amount: '100',
    receiveAddress: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2'
});
```

### burnToken 
Type of burning token

Re-issuable tokens can be burned by sending the amount of tokens to built-in token issuance contract. Non applicable to non-reissuable token.

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account     
        - `tokenId: TokenId` Token id
        - `amount: BigInd` Amount to burn, including decimals. For example, burning 100 VITE, fill in `100000000000000000000`

- **Return**
    * accountBlock instance
       
- **Example**
```javascript
const accountBlock = createAccountBlock('burnToken', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    tokenId: 'your tokenId', // eg: tti_5649544520544f4b454e6e40
    amount: '100'
});
```

### disableReIssueToken 
Type of changing re-issuable token to non-reissuable

Owner of re-issuable token can change the token to non-reissuable. Note: this action cannot be reversed

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account (owner)     
        - `tokenId: TokenId` Token id

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('disableReIssueToken', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    tokenId: 'your tokenId' // eg: tti_5649544520544f4b454e6e40
});
```

### transferTokenOwnership 
Type of transferring token's ownership. Only applicable to re-issuable tokens.

- **Parameters** 
    * `__namedParameters: object`
        - `address: Address` Address of current account (owner)       
        - `tokenId`: `string tokenId` Token id
        - `newOwnerAddress`: `string address` Address of new owner

- **Return**
    * accountBlock instance

- **Example**
```javascript
const accountBlock = createAccountBlock('transferTokenOwnership', {
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    tokenId: 'your tokenId', // eg: tti_5649544520544f4b454e6e40
    newOwnerAddress: 'vite_869a06b8963bd5d88a004723ad5d45f345a71c0884e2c80e88'
});
```
