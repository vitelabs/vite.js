import client from "client";
import { paramsMissing, addressIllegal, addressMissing} from 'const/error';
import { Address, AddrObj, Hex } from "const/type";
import { checkParams } from 'utils/tools';
import { newAddr, getId, validateMnemonic, getEntropyFromMnemonic, getAddrsFromMnemonic, isValidHexAddr, getAddrFromMnemonic } from 'utils/address/hdAddr';
import Account from './account';

class Wallet {
    addrList: Array<AddrObj>
    mnemonic: string
    addrNum: number
    addrStartInx: number
    entropy: string
    addrTotalNum: number
    id: Hex
    activeAccount: Account
    _client: client

    constructor({
        client, mnemonic, bits=256, addrNum = 1
    }, {
        addrTotalNum = 10,
        addrStartInx = 0
    }) {
        let err = checkParams({ mnemonic, client }, ['client'], [{
            name: 'mnemonic',
            func: validateMnemonic
        }]);
        if (err) {
            console.error(new Error(err.message));
            return;
        }

        this._client = client;

        this.addrTotalNum = addrTotalNum;
        let _addrNum = +addrNum && +addrNum > 0 ? +addrNum : 1;
        _addrNum = _addrNum > addrTotalNum ? addrTotalNum : _addrNum;
        this.addrNum = _addrNum;
        
        if (mnemonic) {
            this.mnemonic = mnemonic;
            this.entropy = getEntropyFromMnemonic(mnemonic);
        } else {
            const { entropy, mnemonic } = newAddr(bits);
            this.mnemonic = mnemonic;
            this.entropy = entropy;
        }

        this.addrStartInx= addrStartInx;
        this.addrList = getAddrsFromMnemonic(this.mnemonic, addrStartInx, this.addrNum);
        this.id = getId(this.mnemonic);

        this.activeAccount = null;

        let funcName = ['getBalance', 'sendRawTx', 'sendTx', 'receiveTx', 'SBPreg', 'updateReg', 'revokeReg', 'retrieveReward', 'voting', 'revokeVoting', 'getQuota', 'withdrawalOfQuota'];
        funcName.forEach((name) => {
            this[name] = (...args) => {
                return this.activeAccount[name](...args);
            };
        });
    }

    activateAccount({
        address, index = this.addrStartInx
    }: { address?: Address, index?: number }, {
        intervals = 2000, 
        receiveFailAction = null,
        duration = 5 * 60 * 1000
    }: { intervals?: number, receiveFailAction?: null, duration?: number }) {
        index = validAddrParams({
            address, index
        });
        if (index === null) {
            return null;
        }

        let addrObj: AddrObj = this.addrList[index];
        let activeAccount = new Account({
            privateKey: addrObj.privKey,
            client: this._client
        });

        activeAccount.activate(intervals, receiveFailAction);
        if (duration > 0) {
            setTimeout(() => {
                this.freezeAccount();
            }, duration);
        }

        this.activeAccount = activeAccount;
        return activeAccount;
    }

    freezeAccount() {
        if (!this.activeAccount) {
            return;
        }
        this.activeAccount.freeze();
        this.activeAccount = null;
    }

    addAddr() {
        let index =  this.addrList.length;
        if (index >= this.addrTotalNum) {
            return null;
        }

        let addrObj = getAddrFromMnemonic(this.mnemonic, index);
        if (!addrObj) {
            return null;
        }
        this.addrList.push(addrObj);
        return addrObj;
    }

    get balance() {
        if (!this.activeAccount) {
            return null;
        }
        return this.activeAccount.balance;
    }
}

export const walletAccount = Wallet;

export const account = Account;



function validAddrParams({
    address, index = this.addrStartInx
}: { address?: Address, index?: number }) {
    if (!address && !index && index !== 0) {
        console.error( new Error(`${paramsMissing.message} Address or index.`) );
        return null;
    }

    if (address && !isValidHexAddr) {
        console.error( new Error(`${addressIllegal.message}`) );
        return null;
    }

    if (!address) {
        return index;
    }

    let i;
    for (i = 0; i < this.addrList.length; i++) {
        if (this.addrList[i].hexAddr === address) {
            break;
        }
    }
    if (i === this.addrList.length) {
        console.error( new Error(`${addressMissing.message}`) );
        return null;
    }
    return i;
}
