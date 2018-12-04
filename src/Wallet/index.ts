import { tx, onroad } from 'const/method';
import { signTX } from 'utils/tools';
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

        let { hash, signature, pubKey } = signTX(accountBlock, privKey);
        accountBlock.hash = hash;
        accountBlock.publicKey = Buffer.from(pubKey, 'hex').toString('base64');
        accountBlock.signature = Buffer.from(signature, 'hex').toString('base64');

        return this.request(tx.sendRawTx, accountBlock).then(() => {
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

function receiveTx(address, privKey, errorCb) {
    return new Promise((res, rej) => {
        this.request(onroad.getOnroadBlocksByAddress,address, 0, 1).then((result) => {
            if (!result || !result.length) {
                return res();
            }

            this.builtin.receiveBlock({
                accountAddress: address,
                blockHash: result[0].hash
            }).then((accountBlock) => {
                this.sendRawTx(accountBlock, privKey).then((data) => {
                    res(data);
                }).catch((err) => {
                    if (!errorCb) {
                        return rej(err);
                    }
                    errorCb(err, accountBlock, res, rej);
                });
            }).catch((err) => {
                return rej(err);
            });
        }).catch((err) => {
            return rej(err);
        });
    });
}

export default Wallet;