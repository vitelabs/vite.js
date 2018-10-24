export default {
    wallet: [
        'listAddress', 'newAddress', 'status', 'unlockAddress', 'lockAddress', 
        'reloadAndFixAddressFile', 'isMayValidKeystoreFile', 'getDataDir', 'createTxWithPassphrase'
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
        'getLatestBlock', 'getTokenMintage', 'getBlocksByHash', 'getSnapshotChainHeight'
    ],
    pow: [
        'getPowNonce'
    ],
    tx: [
        'sendRawTx'
    ]
};