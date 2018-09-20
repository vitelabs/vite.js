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

    getunLockAddrList () {
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

        this.Vite.Ledger.getReceiveBlock(address).then((accountBlock)=>{
            if (this.addrList.indexOf(address) < 0) {
                return;
            }
            
            if (!accountBlock) {
                loop();
                return;
            }

            let { hash, signature } = this.Vite.Account.signTX(accountBlock, privKey);
            accountBlock.hash = hash;
            accountBlock.signature = signature;

            this.Vite.Ledger.sendTx(accountBlock).then((data)=>{
                console.log(data);
            }).catch((err)=>{
                console.log(err);
            });
            loop();
        }).catch((err)=>{
            console.error(err);
            loop();
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
