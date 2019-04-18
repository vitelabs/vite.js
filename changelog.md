2.1.0
    ==> premainnet

    keyPair return => 
        privateKey: keys.secretKey,
        publicKey: keys.publicKey
    method
        ledger.getAccountByAccAddr => ledger.getAccount
        mintage.getMintageData => mintage.getMintData
    blockType add
        'SendRefund',
        'GenesisReceive'
    no snapshotHash and timestamp

    Mint_CancelPledge => CancelMintPledge
    Mint_CancelPledge_Abi => CancelMintPledge_Abi

    change Vote_Addr and Register_Addr
    receiveTx({ fromBlockHash }) => receiveTx(fromBlockHash)
