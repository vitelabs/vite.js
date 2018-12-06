import { tx, onroad } from 'const/method';
import { signAccountBlock } from 'utils/accountBlock';
import client from "../client";

const loopTime = 2000;

class Wallet extends client {
    addrList: Array<string>

    constructor(provider: any) {
        super(provider);

        this.addrList = [];
    }

    getUnLockAddrList() {
        return this.addrList;
    }

    autoReceiveTX(address, privKey, CB) {
        this.addrList = this.addrList || [];
        if (this.addrList.indexOf(address) >= 0) {
            return;
        }
        this.addrList.push(address);
        loopAddr.call(this, address, privKey, CB);
    }

    stopAutoReceiveTX(address) {
        let i = this.addrList.indexOf(address);
        if (i < 0) {
            return;
        }
        this.addrList.splice(i, 1);
    }

    sendRawTx(accountBlock, privKey) {
        if (!accountBlock) {
            return Promise.reject('AccountBlock must be required.');
        }

        let _accountBlock = signAccountBlock(accountBlock, privKey);
        if (!_accountBlock) {
            return Promise.reject(_accountBlock);
        }

        return this.request(tx.sendRawTx, _accountBlock).then(() => {
            return accountBlock;
        });
    }
}

function loopAddr(address, privKey, CB) {
    if (this.addrList.indexOf(address) < 0) {
        return;
    }

    let loop = () => {
        let loopTimeout = setTimeout(() => {
            clearTimeout(loopTimeout);
            loopTimeout = null;
            loopAddr.call(this, address, privKey, CB);
        }, loopTime);
    };

    receiveTx.call(this, address, privKey, CB).then(() => {
        loop();
    }).catch((err) => {
        console.warn(err);
        loop();
    });
}

async function receiveTx(address, privKey, errorCb) {
    const result = await this.request(onroad.getOnroadBlocksByAddress,address, 0, 1)
    if (!result || !result.length) {
        return null;
    }

    const accountBlock = await this.builtin.receiveBlock({
        accountAddress: address,
        blockHash: result[0].hash
    });

    try {
        const data = await this.sendRawTx(accountBlock, privKey);
        return data
    } catch(err) {
        if (!errorCb) {
            return Promise.reject(err);
        }
        errorCb(err, accountBlock, Promise.resolve, Promise.reject);
    }
}

export default Wallet;
