export default {
    wallet: [
        'listEntropyFilesInStandardDir', 'listAllEntropyFiles', 'unlock', 'lock', 
        'listEntropyStoreAddresses', 'newMnemonicAndEntropyStore', 'deriveForIndexPath',
        'recoverEntropyStoreFromMnemonic', 'globalCheckAddrUnlocked', 'isAddrUnlocked', 
        'isUnlocked', 'findAddr', 'globalFindAddr', 'createTxWithPassphrase', 'addEntropyStore'
    ],
    net: [
        'syncInfo', 'peers'
    ],
    onroad: [
        'getOnroadBlocksByAddress', 'getAccountOnroadInfo', 'listWorkingAutoReceiveWorker', 
        'startAutoReceive', 'stopAutoReceive'
    ],
    contract: [
        'getCreateContractToAddress'
    ],
    pledge: [
        'getPledgeData', 'getCancelPledgeData', 'getPledgeQuota', 'getPledgeList'
    ],
    register: [
        'getSignDataForRegister', 'getRegisterData', 'getCancelRegisterData', 
        'getRewardData', 'getUpdateRegistrationData'
    ],
    vote: [
        'getVoteData', 'getCancelVoteData'
    ],
    mintage: [
        'getMintageData', 'getMintageCancelPledgeData'
    ],
    consensusGroup: [
        'getConditionRegisterOfPledge', 'getConditionVoteOfDefault', 'getConditionVoteOfKeepToken',
        'getCreateConsensusGroupData', 'getCancelConsensusGroupData', 'getReCreateConsensusGroupData'
    ],
    ledger: [
        'getBlocksByAccAddr', 'getAccountByAccAddr', 'getLatestSnapshotChainHash', 
        'getLatestBlock', 'getTokenMintage', 'getBlocksByHash', 'getSnapshotChainHeight',
        'getFittestSnapshotHash'
    ],
    pow: [
        'getPowNonce'
    ],
    tx: [
        'sendRawTx'
    ]
};