const { readAccountFileSync, writeAccountFile } = require('../utils/accountFile.js');
const accNamePre = 'account';

class Account {
    constructor() {
        // init account names
        let accountFile = readAccountFileSync();
        this.__fileAccountsMap = accountFile.namesMap || {};  // AccountName should be saved forever.
        this.__nameCount = accountFile.nameCount || 0;
        this.__lastLoginAccount = accountFile.lastLoginAccount || '';
    }

    __checkName(address, isSave = true) {
        if (this.__fileAccountsMap[address]) {
            return true;
        }
        let name = `${accNamePre}${++this.__nameCount}`;
        this.__fileAccountsMap[address] = name;
        isSave && this.__writeFile();
        return false;
    }

    __writeFile() {
        writeAccountFile(this.__fileAccountsMap, this.__nameCount, this.__lastLoginAccount);
    }

    create(name, pass) {
        return global.goViteIPC['wallet.NewAddress'](pass).then((address)=>{
            this.__fileAccountsMap[address] = name;
            this.__lastLoginAccount = address;
            this.__writeFile();
            return address;
        });
    }

    lockCurrentAcc() {
        if (!this.__lastLoginAccount) {
            return Promise.resolve();
        }
        return this.lock(this.__lastLoginAccount);
    }

    get(address) {
        return Promise.all([
            global.goViteIPC['ledger.GetUnconfirmedInfo'](address),
            global.goViteIPC['ledger.GetAccountByAccAddr'](address)
        ]).then((result) => {
            this.__checkName(address);

            let unconfirmedInfo = result[0] || {};
            let accountBalance = result[1] || {};

            let account = {
                address,
                name: this.__fileAccountsMap[address],
                fundFloat: {
                    balanceInfos: unconfirmedInfo.BalanceInfos || [],
                    len: unconfirmedInfo.UnConfirmedBlocksLen || ''
                },
                balanceInfos: accountBalance.BalanceInfos || [],
                blockHeight: accountBalance.BlockHeight || '0'
            };

            return account;
        });
    }

    getName(address) {
        this.__checkName(address);
        return this.__fileAccountsMap[address];
    }

    rename(address, name) {
        if (!address || !name) {
            return false;
        }

        this.__fileAccountsMap[address] = name;
        this.__writeFile();
        return true;
    }

    getList() {
        return global.goViteIPC['wallet.ListAddress']().then((data)=>{
            if (!data || !data.length) {
                return [];
            }

            let isChange = false;
            let list = [];

            data.forEach(address => {
                let change = !this.__checkName(address, false);
                isChange = isChange || change;
                list.push({
                    address,
                    name: this.__fileAccountsMap[address]
                });
            });

            // Write name-file only when data changes
            isChange && this.__writeFile();
            return list;
        });
    }

    unLock(address, pass) {
        return global.goViteIPC['wallet.UnLock']([address, pass, '0']).then((data)=>{
            this.__lastLoginAccount = address;
            this.__writeFile();
            return data;
        });
    }

    lock(address) {
        return global.goViteIPC['wallet.Lock'](address);
    }

    status(address) {
        return global.goViteIPC['wallet.Status']().then((data)=>{
            data = data || {};
            for (let addr in data) {
                if (addr === address) {
                    return data[addr];
                }
            }
            return '';
        });
    }

    getBalance(address) {
        return global.goViteIPC['ledger.GetAccountByAccAddr'](address);
    }

    getLast() {
        if (!this.__lastLoginAccount) {
            return null;
        }
        this.__checkName(this.__lastLoginAccount);
        return {
            address: this.__lastLoginAccount,
            name: this.__fileAccountsMap[this.__lastLoginAccount]
        };
    }
}

module.exports = Account;