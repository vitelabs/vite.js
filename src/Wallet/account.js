const nacl = require('../../libs/nacl_blake2b');
const scryptsy = require('scryptsy');

import libUtils from '../../libs/utils';

const loopTime = 2000;

class Account {
    constructor(Vite) {
        this.Vite = Vite;
        this.addrList = [];

        this.version = 1;
        // LightScryptN is the N parameter of Scrypt encryption algorithm, using 4MB
        // memory and taking approximately 100ms CPU time on a modern processor.
        this.n = 4096;
        // LightScryptP is the P parameter of Scrypt encryption algorithm, using 4MB
        // memory and taking approximately 100ms CPU time on a modern processor.
        this.p = 6;
        this.scryptR = 8;
        this.scryptKeyLen = 32;
    }

    getUnLockAddrList () {
        return this.addrList;
    }

    unlock(address, privKey) {
        this.addrList = this.addrList || [];
        if (this.addrList.indexOf(address) >= 0) {
            return;
        }
        this.addrList.push(address);
        this._loopAddr(address, privKey);
    }

    lock(address) {
        let i = this.addrList.indexOf(address);
        if (i < 0) {
            return;
        }
        this.addrList.splice(i, 1);
    }

    _loopAddr(address, privKey) {
        if (this.addrList.indexOf(address) < 0) {
            return;
        }

        let loop = ()=>{
            let loopTimeout = setTimeout(()=>{
                clearTimeout(loopTimeout);
                loopTimeout = null;
                this._loopAddr(address, privKey);
            }, loopTime);
        };

        this.receiveTx(address, privKey).then(()=>{
            loop();
        }).catch((err)=>{
            console.warn(err);
            loop();
        });
    }

    receiveTx(address, privKey) {
        return new Promise((res, rej) => {
            this.Vite.Ledger.getReceiveBlock(address).then((accountBlock)=>{
                if (!accountBlock) {
                    return res();
                }
    
                let { hash, signature, pubKey } = this.Vite.Account.signTX(accountBlock, privKey);
                accountBlock.publicKey = pubKey;
                accountBlock.hash = hash;
                accountBlock.signature = signature;

                this.Vite.Ledger.sendTx(accountBlock).then((data)=>{
                    if (data && data.error) {
                        return rej(data.error);
                    }
                    return res(data);
                }).catch((err)=>{
                    return rej(err);
                });
            }).catch((err)=>{
                return rej(err);
            });
        });
    }

    sendTx({
        fromAddr, toAddr, tokenId, amount, message
    }, privKey) {
        if ( !this.Vite.Types.isValidHexAddr(fromAddr) ) {
            return Promise.reject('FromAddr error');
        }
        if ( !this.Vite.Types.isValidHexAddr(toAddr) ) {
            return Promise.reject('ToAddr error');
        }
        if ( !amount ) {
            return Promise.reject('Amount error');
        }

        return new Promise((res, rej) => {
            this.Vite.Ledger.getSendBlock({
                fromAddr, toAddr, tokenId, amount, message
            }).then((accountBlock)=>{
                let { hash, signature, pubKey } = this.Vite.Account.signTX(accountBlock, privKey);
                accountBlock.publicKey = pubKey;
                accountBlock.hash = hash;
                accountBlock.signature = signature;
  
                this.Vite.Ledger.sendTx(accountBlock).then((data)=>{
                    return res(data);
                }).catch((err)=>{
                    return rej(err);
                });
            }).catch((err)=>{
                return rej(err);
            });
        });
    }

    encrypt(str) {
        let scryptParams = {
            n: this.n,
            r: this.scryptR,
            p: this.p,
            keylen: this.scryptKeyLen,
            salt: libUtils.bytesToHex(nacl.randomBytes(32)),
        };
        let encryptP = encryptKey(str, scryptParams);

        return {
            encryptP: encryptP.toString('hex'),
            scryptParams,
            version: this.version
        };
    }

    verify(scryptP, str) {
        if ( !isValid.call(this, scryptP) ) {
            return false;
        }

        let encryptP = encryptKey(str, scryptP.scryptParams);
        return encryptP.toString('hex') === scryptP.encryptP;
    }
}

export default Account;

function encryptKey(pwd, scryptParams) {
    let pwdBuff = Buffer.from(pwd);
    let salt = libUtils.hexToBytes(scryptParams.salt);
    salt = Buffer.from(salt);
    return scryptsy(pwdBuff, salt, +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen);
}

function isValid(scryptP) {
    if (!scryptP.scryptParams || 
        !scryptP.encryptP || 
        !scryptP.version || 
        scryptP.version !== 1) {
        return false;
    }

    let scryptParams = scryptP.scryptParams;
    if (!scryptParams.n || 
        !scryptParams.r ||
        !scryptParams.p ||
        !scryptParams.keylen ||
        !scryptParams.salt) {
        return false;
    }

    try {
        libUtils.hexToBytes(scryptParams.salt);
    } catch(err) {
        return false;
    }

    return true;
}
