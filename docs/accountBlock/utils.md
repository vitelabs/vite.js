# Utils

## Methods

### isValidAccountBlockWithoutHash
Verify if the given account block is valid regardless of block hash

- **Parameters** 
    * `__namedParameters: Object` AccountBlock
        - `blockType: BlockType`
        - `address: Address`
        - `height: Uint64`
        - `previousHash: Hex`
        - `fee?: BigInt`
        - `amount?: BigInt`
        - `toAddress?: Address`
        - `tokenId?: TokenId`
        - `data?: Base64`
        - `sendBlockHash?: Hex`
        - `difficulty?: BigInt`
        - `nonce?: Base64`

- **Return**
    * `Boolean` If `true`, the account block is valid

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { utils } = accountBlock;

utils.isValidAccountBlockBeforeHash({
    address: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    amount: '0',
    blockType: 2,
    data: 'pinFMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB',
    fee: '0',
    hash: '156a47de8b5a690562278360e41e337ee4f1b4aa8d979f377beb0cc70f939032',
    height: '105',
    previousHash: '558c6873d27c903ec9067cf54432e9d16d9b31474adab165ad1f6cc392beeb8d',
    producer: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    toAddress: 'vite_0000000000000000000000000000000000000004d28108e76b',
    tokenId: 'tti_5649544520544f4b454e6e40'
});
```

### isValidAccountBlockWithoutSignature
Verify if the given account block is valid regardless of signature

- **Parameters** 
    * `__namedParameters: Object` AccountBlock
        - `blockType: BlockType`
        - `address: Address`
        - `height: Uint64`
        - `previousHash: Hex`
        - `hash: Hex`
        - `fee?: BigInt`
        - `amount?: BigInt`
        - `toAddress?: Address`
        - `tokenId?: TokenId`
        - `data?: Base64`
        - `sendBlockHash?: Hex`
        - `difficulty?: BigInt`
        - `nonce?: Base64`

- **Return**
    * `Boolean` If `true`, the account block is valid

### isValidAccountBlock
Verify if the given account block is complete and ready to be sent 

- **Parameters** 
    * `__namedParameters: Object` AccountBlock
        - `blockType: BlockType`
        - `address: Address`
        - `height: Uint64`
        - `previousHash: Hex`
        - `hash: Hex`
        - `signature: Base64`
        - `publicKey: Base64`
        - `fee?: BigInt`
        - `amount?: BigInt`
        - `toAddress?: Address`
        - `tokenId?: TokenId`
        - `data?: Base64`
        - `sendBlockHash?: Hex`
        - `difficulty?: BigInt`
        - `nonce?: Base64`

- **Return**
    * `Boolean` If `true`, the account block is valid

### getAccountBlockHash
Return hash of the given account block

- **Parameters**
    * `__namedParameters: object` AccountBlock
        - `blockType: BlockType`
        - `address: Address`
        - `hash?: Hex`
        - `height?: Uint64`
        - `previousHash?: Hex`
        - `fromAddress?: Address`
        - `toAddress?: Address`
        - `sendBlockHash?: Hex`
        - `tokenId?: TokenId`
        - `amount?: BigInt`
        - `fee?: BigInt`
        - `data?: Base64`
        - `difficulty?: BigInt`
        - `nonce?: Base64`
        - `vmlogHash?: Hex`
        - `triggeredSendBlockList?: AccountBlockType[]`

- **Return**
    * `Hex` Hash of AccountBlock
 
- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { utils } = accountBlock;

const hash = utils.getAccountBlockHash({
    address: 'vite_ab24ef68b84e642c0ddca06beec81c9acb1977bbd7da27a87a',
    blockType: 2,
    previousHash: 'd517e8d4dc9c676876b72ad0cbb4c45890804aa438edd1f171ffc66276202a95',
    height: '2',
    tokenId: 'tti_5649544520544f4b454e6e40',
    toAddress: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
    amount: '1000000000000000000000000',
    hash: '9c3f2b59408aa6a5c76f6f30cab40085eb181d200d574a029323b0822f54eef1',
    signature: 'sGELMXeZ/ZTvwec5n2kvo2hz/i824QTadKHC35sQcdVhSAPS6+uzanfcjPqp7qaQFEEorTfFNnd90hgbJpSNCw==',
    publicKey: 'WHZinxslscE+WaIqrUjGu2scOvorgD4Q+DQOOcDBv4M='
});
```

### signAccountBlock
Sign account block

- **Parameters**
    * `__namedParameters: object` AccountBlock
        - `address: Address`
        - `blockType: BlockType`
        - `hash: Hex`
        - `height: Uint64`
        - `previousHash: Hex`
        - `toAddress?: Address`
        - `tokenId?: TokenId`
        - `amount?: BigInt`
        - `sendBlockHash?: Hex`
        - `data?: Base64`
        - `fee?: BigInt`
        - `difficulty?: BigInt`
        - `nonce?: Base64`
    * `Hex` privateKey 
  
- **Return**
    * `Object`
        - `signature: Base64`
        - `publicKey: Base64`

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { utils } = accountBlock;

const { signature, publicKey } = utils.signAccountBlock({
    accountAddress: 'vite_13f1f8e230f2ffa1e030e664e525033ff995d6c2bb15af4cf9',
    blockType: 4,
    prevHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
    height: '4',
    fromBlockHash: '6388daf1e34e9aa9000006f455737ec3d191c7cb7b0d79a882cb976200f55b68',
    nonce: 'Sg0sdhyaEus=',
    difficulty: '65534',
    hash: '23b9a085f0280eb5309f27094bd00420ba2e2c5b16ef98dc40b1c778820f31a7'
}, /** your privateKey */);
```

### messageToData
Encode comment of transaction into base64 data of AccountBlock according to [VEP-8](../../../vep/vep-8.md)

- **Parameters**
    * `String` Comment of transaction

- **Return**
    * `Base64-string` data of account block

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { utils } = accountBlock;
const data = utils.messageToData('1212hhhh');
```

## More Methods

### isRequestBlock
Verify if an account block is request block based on `blockType`

- **Parameters**
    * `BlockType`: Block type

- **Return**
    * `boolean`: If `true`, the block is request block

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { utils } = accountBlock;
utils.isRequestBlock(1);
```

### isResponseBlock
Verify if an account block is response block based on `blockType`

- **Parameters**
    * `BlockType`: Block type

- **Return**
    * `boolean`: If `true`, the block is response block

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { utils } = accountBlock;
utils.isResponseBlock(1);
```

### getCreateContractData
Generate data of AccountBlock for creating smart contract

- **Parameters**
    * `__namedParameters: object`
        - `responseLatency?: Uint8` Response latency
        - `quotaMultiplier?: Uint8` Quota multiplier
        - `randomDegree?: Uint8` Random degree
        - `code?: Hex` Code of contract
        - `abi?: Object | Array<Object>` ABI
        - `params?: string | Array<string | boolean>` Passed-in parameters of contract constructor

- **Return**
    * `Base64`: AccountBlock.data

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { utils } = accountBlock;

const data = utils.getCreateContractData({
    'responseLatency': 2,
    'randomDegree': 1,
    'quotaMultiplier': 10,
    'code': '608060405234801561001057600080fd5b506101ca806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806380ae0ea114610046575b600080fd5b6100bd6004803603602081101561005c57600080fd5b810190808035906020019064010000000081111561007957600080fd5b82018360208201111561008b57600080fd5b803590602001918460208302840111640100000000831117156100ad57600080fd5b90919293919293905050506100bf565b005b60006002838390508115156100d057fe5b061415156100dd57600080fd5b600080905060008090505b8383905081101561018a576000848483818110151561010357fe5b9050602002013590506000858560018501818110151561011f57fe5b905060200201359050808401935080841015151561013c57600080fd5b600081111561017d578173ffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff168260405160405180820390838587f1505050505b50506002810190506100e8565b50348114151561019957600080fd5b50505056fea165627a7a723058203cef4a3f93b33e64e99e0f88f586121282084394f6d4b70f1030ca8c360b74620029',
    'params': ''
});
```

### getCallContractData
Generate data of AccountBlock for calling smart contract

- **Parameters**
    * `__namedParameters: object`
        - `abi: Object | Array<Object>`
        - `params?: any`
        - `methodName?: string`

- **Return**
    * `Base64`: AccountBlock.data

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { utils } = accountBlock;

const params = [ '00000000000000000001', 'ss', 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2' ];
const abi = Contracts.RegisterSBP.abi;
const data = utils.getCallContractData({ params, abi });
```

### getTransactionType 
Return transaction type

- **Parameters**
    * `__namedParameters: object`
        - `toAddress : HexAddr` ToAddress
        - `data : string` `accountBlock.data` Data of account block
        - `blockType : BlockType` Block type

- **Return**
    * `txType : TxType` Transaction type

- **Example**
```javascript
import { accountBlock } from '@vite/vitejs';

const { utils } = accountBlock;

const RevokeVoting = {
    blockType: 2,
    data: 'pinFMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB',
    toAddress: 'vite_000000000000000000000000000000000000000270a48cc491'
};

const txType = utils.getTransactionType(RevokeVoting);
// txType === 'RevokeVoting'
```

### decodeAccountBlockByContract
Decode account block of smart contract

- **Parameters**
    * `__namedParameters: object`
        - `accountBlock: AccountBlock` Account block
        - `contractAddr: Address` Address of contract
        - `abi: jsonInterface | Array<jsonInterface>` ABI
        - `topics?: Array<hexString>` Optional topics
        - `mehtodName?: string` Name of method to decode, mandatory if the parameter of `abi` is a `jsonInterface` array.

- **Return**
    * `decodeResult`: Decoding result. If the input account block and ABI do not match，return null

- **Example**
```javascript
import { accountblock, constant } from '@vite/vitejs';

const { utils } = accountBlock;

// Just Example
const SBPregAccountBlock = {
    accountAddress: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
    blockType: 2,
    data: '8pxs4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAFU0YryhN7rCn0QOmvSrLiwbuCSTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACc3MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
    toAddress: 'vite_0000000000000000000000000000000000000004d28108e76b'
}

const decodeResult = utils.decodeAccountBlockByContract({
    accountBlock: SBPregAccountBlock,
    contractAddr: constant.Contracts.SBPreg.contractAddr,
    abi: constant.Contracts.SBPreg.abi
});

/** decodeResult like
    { 
        '0': '00000000000000000001',
        '1': 'ss',
        '2': 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2',
        gid: '00000000000000000001',
        name: 'ss',
        nodeAddr: 'vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2' 
    }
*/
```
