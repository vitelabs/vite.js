export default {
    helpContent:'任意api下使用api.help即可查看使用说明文档',//vite.help
    wallet: {
        helpContent:'该命名空间包括钱包相关的api',
        listAddress: 'vite.wallet_listAddress(<none>) @return <Array>HexAddress-string ', newAddress: 'vite.wallet_newAddress(<password-string>) @return address-string', status: '', unlockAddress: '', lockAddress: '', reloadAndFixAddressFile: '', isMayValidKeystoreFile: '', getDataDir: '', createTxWithPassphrase: ''
    },
    p2p: {
        networkAvailable: '', peersCount: ''
    },
    ledger: {
        getBlocksByAccAddr: '', getAccountByAccAddr: '', getLatestSnapshotChainHash: '', getLatestBlock: '', getTokenMintage: '', getBlocksByHash: '', getSnapshotChainHeight: ''
    },
    onroad: {
        getOnroadBlocksByAddress: '', getAccountOnroadInfo: '', listWorkingAutoReceiveWorker: '', startAutoReceive: '', stopAutoReceive: ''
    },
    contracts: {
        getPledgeData: '', getCancelPledgeData: '', getMintageData: '', getMintageCancelPledgeData: '', getCreateContractToAddress: '', getRegisterData: '', getCancelRegisterData: '', getRewardData: '', getUpdateRegistrationData: '', getVoteData: '', getCancelVoteData: '', getConditionRegisterOfPledge: '', getConditionVoteOfDefault: '', getConditionVoteOfKeepToken: '', getCreateConsensusGroupData: '', getCancelConsensusGroupData: '', getReCreateConsensusGroupData: ''
    },
    pow: {
        getPowNonce: ''
    },
    tx: {
        sendRawTx: ''
    }
};