export default {
    wallet: [
        'listAddress', 'newAddress', 'status', 'unlockAddress', 'lockAddress', 
        'reloadAndFixAddressFile', 'isMayValidKeystoreFile', 'getDataDir', 'createTxWithPassphrase'
    ],
    p2p: [
        'networkAvailable', 'peersCount'
    ],
    ledger: [
        'getBlocksByAccAddr', 'getAccountByAccAddr', 'getLatestSnapshotChainHash', 
        'getLatestBlock', 'getTokenMintage', 'getBlocksByHash', 'getSnapshotChainHeight'
    ],
    onroad: [
        'getOnroadBlocksByAddress', 'getAccountOnroadInfo', 'listWorkingAutoReceiveWorker', 
        'startAutoReceive', 'stopAutoReceive'
    ],
    contracts: [
        'getPledgeData', 'getCancelPledgeData', 'getMintageData', 
        'getMintageCancelPledgeData', 'getCreateContractToAddress', 'getRegisterData', 
        'getCancelRegisterData', 'getRewardData', 'getUpdateRegistrationData',
        'getVoteData', 'getCancelVoteData', 'getConditionRegisterOfPledge',
        'getConditionVoteOfDefault', 'getConditionVoteOfKeepToken', 'getCreateConsensusGroupData',
        'getCancelConsensusGroupData', 'getReCreateConsensusGroupData'
    ],
    pow: [
        'getPowNonce'
    ],
    tx: [
        'sendRawTx'
    ]
};