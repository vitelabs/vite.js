import { newAddr, getId, validateMnemonic, getEntropyFromMnemonic, getAddrsFromMnemonic, isValidHexAddr, getAddrFromMnemonic } from '~@vite/vitejs-hdaddr';
import Account from '~@vite/vitejs-account';
import client from '~@vite/vitejs-client';
import { paramsMissing, addressIllegal, addressMissing } from '~@vite/vitejs-error';
import { checkParams } from '~@vite/vitejs-utils';

import { Address, AddrObj, Hex, LangList } from '../type';


class Wallet {
    addrList: Array<AddrObj>
    lang: LangList
    pwd: string
    mnemonic: string
    addrNum: number
    addrStartInx: number
    entropy: string
    addrTotalNum: number
    id: Hex
    activeAccountList: Array<Account>
    _client: client

    constructor({ client, mnemonic, bits = 256, addrNum = 1, lang = LangList.english, pwd = '' }, {
        addrTotalNum = 10,
        addrStartInx = 0
    } = {
        addrTotalNum: 10,
        addrStartInx: 0
    }) {
        const err = checkParams({ mnemonic, client }, ['client'], [{
            name: 'mnemonic',
            func: _mnemonic => validateMnemonic(_mnemonic, lang)
        }]);
        if (err) {
            throw new Error(err.message);
        }

        this._client = client;

        this.addrTotalNum = addrTotalNum;
        let _addrNum = Number(addrNum) && Number(addrNum) > 0 ? Number(addrNum) : 1;
        _addrNum = _addrNum > addrTotalNum ? addrTotalNum : _addrNum;
        this.addrNum = _addrNum;

        this.lang = lang || LangList.english;
        this.pwd = pwd;
        if (mnemonic) {
            this.mnemonic = mnemonic;
            this.entropy = getEntropyFromMnemonic(mnemonic, this.lang);
        } else {
            const { entropy, mnemonic } = newAddr(bits, this.lang, this.pwd);
            this.mnemonic = mnemonic;
            this.entropy = entropy;
        }

        this.addrStartInx = addrStartInx;
        this.addrList = getAddrsFromMnemonic(this.mnemonic, addrStartInx, this.addrNum, this.lang, this.pwd);
        this.id = getId(this.mnemonic, this.lang);

        this.activeAccountList = [];
    }

    activateAccount({
        address,
        index = this.addrStartInx
    }: {
        address?: Address;
        index?: number;
    } = { index: this.addrStartInx }, {
        intervals = 2000,
        duration = 5 * 60 * 1000,
        autoPow = false,
        usePledgeQuota = true
    }: {
        intervals?: number;
        autoPow?: boolean;
        usePledgeQuota?: boolean;
        duration?: number;
    } = {
        intervals: 2000,
        duration: 5 * 60 * 1000,
        autoPow: false,
        usePledgeQuota: true
    }) {
        const activeAccount = this.getAccount({ address, index, autoPow, usePledgeQuota });

        activeAccount.activate(intervals, autoPow, usePledgeQuota);
        if (duration > 0) {
            setTimeout(() => {
                this.freezeAccount(activeAccount);
            }, duration);
        }

        this.activeAccountList.push(activeAccount);
        return activeAccount;
    }

    freezeAccount(activeAccount: Account) {
        if (!this.activeAccountList || !this.activeAccountList.length || !activeAccount) {
            return;
        }

        activeAccount.freeze && activeAccount.freeze();

        let i;
        for (i = 0; i < this.activeAccountList.length; i++) {
            if (this.activeAccountList[i] === activeAccount) {
                break;
            }
        }
        this.activeAccountList.splice(i, 1);
        activeAccount = null;
    }

    getAccount({
        address,
        index = this.addrStartInx,
        autoPow = false,
        usePledgeQuota = true
    }: {
        address?: Address;
        index?: number;
        autoPow?: boolean;
        usePledgeQuota? : boolean;
    } = {
        index: this.addrStartInx,
        autoPow: false,
        usePledgeQuota: true
    }) {
        index = this.validAddrParams({ address, index });
        const addrObj: AddrObj = this.addrList[index];

        let i;
        for (i = 0; i < this.activeAccountList.length; i++) {
            const account = this.activeAccountList[i];
            if (account.address === addrObj.hexAddr) {
                break;
            }
        }

        if (i < this.activeAccountList.length) {
            return this.activeAccountList[i];
        }

        return new Account({
            privateKey: addrObj.privKey,
            client: this._client
        }, { autoPow, usePledgeQuota });
    }

    addAddr() {
        const index = this.addrList.length;
        if (index >= this.addrTotalNum) {
            return null;
        }

        const addrObj = getAddrFromMnemonic(this.mnemonic, index, this.lang, this.pwd);
        if (!addrObj) {
            return null;
        }
        this.addrList.push(addrObj);
        return addrObj;
    }

    private validAddrParams({ address, index = this.addrStartInx }: { address?: Address; index?: number }) {
        if (!address && !index && index !== 0) {
            throw new Error(`${ paramsMissing.message } Address or index.`);
        }

        if (address && !isValidHexAddr(address)) {
            throw new Error(`${ addressIllegal.message }`);
        }

        if (!address && index >= this.addrList.length) {
            throw new Error('Illegal index. Index should be smaller than this.addrList.length.');
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
            throw new Error(`${ addressMissing.message }`);
        }
        return i;
    }
}

export default Wallet;
