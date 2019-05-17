# 2.1.0

## Pre-Mainnet
1. 新增生成合约地址（影响hdAddr, privToAddr）
2. 删除 accountBlock 以及所有接口中的 snapshotHash + timestamp
3. createContract 新增参数

## constant
1. Quota_Addr = > Pledge_Addr
2. contractAddrs.Quota => contractAddrs.Pledge
3. Mint_CancelPledge => CancelMintPledge
4. blockType 新增（SendRefund，GenesisReceive）
5. BuiltinTxType 新增（SendRefund，GenesisReceive）

## addrAccount
1. 新增 sendAccountBlock 
2. 新增 calloffChainContract
3. 删除 getFittestSnapshotHash
4. 新增 getTokenInByowner
5. 新增 getBlock

## client
1. buildinTxBlock => builtinTxBlock
2. 新增 pow
3. 新增 testapi
4. 新增 callOffChainContract
5. 新增 sendTx（为原有的sendRawTx）
6. 新增 sendAutoPowTx
7. 新增 sendRawTx （变更为发送已签名的账户块）

## HdAccount
1. constructor addrTotalNum  => maxAddrNum
2. activateAccount 新增参数
3. 新增 getAccount

## ed25519
1. keyPair 返回值 统一为 publicKey privateKey
