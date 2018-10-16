import Version from './version.js';
import Account from './account.js';
import Ledger from './ledger.js';

const Methods = {
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

class Vite {
    constructor(provider) {
        this._currentProvider = provider;

        for (let namespace in Methods) {
            Methods[namespace].forEach(name => {
                let methodName = `${namespace}_${name}`;
                this[methodName] = (...params) => {
                    return this._currentProvider.request(methodName, params);
                };
            });
        }

        this.Version = new Version(provider);
        this.Account = new Account(provider);
        this.Ledger = new Ledger(provider);
    }

    setProvider(provider, abort = true) {
        this._currentProvider.reset(abort);
        this._currentProvider = provider;
    }
}

export default Vite;
