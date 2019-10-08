// const bip39 = require('bip39');

// // import { createAddress, getId, validateMnemonic, getEntropyFromMnemonic, getAddrsFromMnemonic, isValidAddress, getAddrFromMnemonic } from '~@vite/vitejs-hdwallet';
// import Account from '~@vite/vitejs-account';
// import client from '~@vite/vitejs-client';
// import { paramsMissing, addressIllegal, addressMissing } from '~@vite/vitejs-error';
// import { checkParams } from '~@vite/vitejs-utils';

// import { Address, AddrObj, Hex } from './type';

// // [TODO]  AddrList {0, 1, address1, address2}
// // [TODO]  Add Wallet: Save and Load, browser only || node


// class HdAccountClass {
//     addrList: Array<AddrObj>
//     wordList: Array<String>
//     pwd: string
//     mnemonic: string
//     addrNum: number
//     addrStartInx: number
//     entropy: string
//     maxAddrNum: number
//     id: Hex
//     activeAccountList: Array<Account>
//     _client: client

//     constructor({ client, mnemonic, bits = 256, addrNum = 1, wordList, pwd = '' }, {
//         maxAddrNum = 10,
//         addrStartInx = 0
//     } = {
//         maxAddrNum: 10,
//         addrStartInx: 0
//     }) {
//         const err = checkParams({ mnemonic, client }, ['client'], [{
//             name: 'mnemonic',
//             func: _mnemonic => validateMnemonic(_mnemonic, wordList)
//         }]);
//         if (err) {
//             throw new Error(err.message);
//         }

//         this._client = client;

//         this.maxAddrNum = maxAddrNum;
//         let _addrNum = Number(addrNum) && Number(addrNum) > 0 ? Number(addrNum) : 1;
//         _addrNum = _addrNum > maxAddrNum ? maxAddrNum : _addrNum;
//         this.addrNum = _addrNum;

//         this.wordList = wordList || bip39.wordlists.EN;
//         this.pwd = pwd;
//         if (mnemonic) {
//             this.mnemonic = mnemonic;
//             this.entropy = getEntropyFromMnemonic(mnemonic, this.wordList);
//         } else {
//             const { entropy, mnemonic } = createAddress(bits, this.wordList, this.pwd);
//             this.mnemonic = mnemonic;
//             this.entropy = entropy;
//         }

//         this.addrStartInx = addrStartInx;
//         this.addrList = getAddrsFromMnemonic(this.mnemonic, addrStartInx, this.addrNum, this.wordList, this.pwd);
//         this.id = getId(this.mnemonic, this.wordList, this.pwd);

//         this.activeAccountList = [];
//     }

//     activateAccount({
//         address,
//         index = 0
//     }: {
//         address?: Address;
//         index?: number;
//     } = { index: 0 }, {
//         intervals = 2000,
//         duration = 5 * 60 * 1000,
//         autoPow = false,
//         usePledgeQuota = true
//     }: {
//         intervals?: number;
//         autoPow?: boolean;
//         usePledgeQuota?: boolean;
//         duration?: number;
//     } = {
//         intervals: 2000,
//         duration: 5 * 60 * 1000,
//         autoPow: false,
//         usePledgeQuota: true
//     }) {
//         const activeAccount = this.getAccount({ address, index });

//         activeAccount.activate(intervals, autoPow, usePledgeQuota);
//         if (duration > 0) {
//             setTimeout(() => {
//                 this.freezeAccount(activeAccount);
//             }, duration);
//         }

//         this.activeAccountList.push(activeAccount);
//         return activeAccount;
//     }

//     freezeAccount(activeAccount: Account) {
//         if (!this.activeAccountList || !this.activeAccountList.length || !activeAccount) {
//             return;
//         }

//         activeAccount.freeze && activeAccount.freeze();

//         let i;
//         for (i = 0; i < this.activeAccountList.length; i++) {
//             if (this.activeAccountList[i] === activeAccount) {
//                 break;
//             }
//         }
//         this.activeAccountList.splice(i, 1);
//         activeAccount = null;
//     }

//     getAccount({
//         address,
//         index = 0,
//         autoPow = false,
//         usePledgeQuota = true
//     }: {
//         address?: Address;
//         index?: number;
//         autoPow?: boolean;
//         usePledgeQuota? : boolean;
//     } = {
//         index: 0,
//         autoPow: false,
//         usePledgeQuota: true
//     }) {
//         index = this.validAddrParams({ address, index });
//         const addrObj: AddrObj = this.addrList[index];

//         let i;
//         for (i = 0; i < this.activeAccountList.length; i++) {
//             const account = this.activeAccountList[i];
//             if (account.address === addrObj.address) {
//                 break;
//             }
//         }

//         if (i < this.activeAccountList.length) {
//             return this.activeAccountList[i];
//         }

//         return new Account({
//             privateKey: addrObj.privateKey,
//             client: this._client
//         }, { autoPow, usePledgeQuota });
//     }

//     addAddr() {
//         const index = this.addrList.length;
//         if (index >= this.maxAddrNum) {
//             return null;
//         }

//         const addrObj = getAddrFromMnemonic(this.mnemonic, index, this.wordList, this.pwd);
//         if (!addrObj) {
//             return null;
//         }
//         this.addrList.push(addrObj);
//         return addrObj;
//     }

//     private validAddrParams({ address, index = 0 }: { address?: Address; index?: number }) {
//         if (!address && !index && index !== 0) {
//             throw new Error(`${ paramsMissing.message } Address or index.`);
//         }

//         if (address && !isValidAddress(address)) {
//             throw new Error(`${ addressIllegal.message }`);
//         }

//         if (!address && index >= this.addrList.length) {
//             throw new Error('Illegal index. Index should be smaller than this.addrList.length.');
//         }

//         if (!address) {
//             return index;
//         }

//         let i;
//         for (i = 0; i < this.addrList.length; i++) {
//             if (this.addrList[i].address === address) {
//                 break;
//             }
//         }

//         if (i === this.addrList.length) {
//             throw new Error(`${ addressMissing.message }`);
//         }
//         return i;
//     }
// }

// export const hdAccount = HdAccountClass;
// export default HdAccountClass;
