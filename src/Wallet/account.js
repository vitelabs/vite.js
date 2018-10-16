import libUtils from '../../libs/utils';
import utils from '../../libs/utils';

const nacl = require('../../libs/nacl_blake2b');
const scryptsy = require('scryptsy');
const crypto = typeof window !== 'undefined' ? require('browserify-aes') : require('crypto');

const loopTime = 2000;
const scryptName = 'scrypt';
const len = 64;
const versions = [1, 2];
const algorithms = ['aes-256-gcm'];

class Account {
    constructor(Vite) {
        this.Vite = Vite;
        this.addrList = [];

        this.version = 2;
        // LightScryptN is the N parameter of Scrypt encryption algorithm, using 4MB
        // memory and taking approximately 100ms CPU time on a modern processor.
        this.n = 4096;
        // LightScryptP is the P parameter of Scrypt encryption algorithm, using 4MB
        // memory and taking approximately 100ms CPU time on a modern processor.
        this.p = 6;
        this.scryptR = 8;
        this.scryptKeyLen = 32;
        this.algorithm = 'aes-256-gcm';
    }

    getUnLockAddrList () {
        return this.addrList;
    }

    autoReceiveTX(address, privKey) {
        this.addrList = this.addrList || [];
        if (this.addrList.indexOf(address) >= 0) {
            return;
        }
        this.addrList.push(address);
        loopAddr.call(this, address, privKey);
    }

    stopAutoReceiveTX(address) {
        let i = this.addrList.indexOf(address);
        if (i < 0) {
            return;
        }
        this.addrList.splice(i, 1);
    }

    receiveTx(address, privKey) {
        return new Promise((res, rej) => {
            this.Vite.Ledger.getReceiveBlock(address).then((accountBlock)=>{
                if (!accountBlock) {
                    return res();
                }
    
                let { hash, signature, pubKey } = this.Vite.Account.signTX(accountBlock, privKey);
                accountBlock.hash = hash;
                accountBlock.publicKey = Buffer.from(pubKey).toString('base64');
                accountBlock.signature = Buffer.from(signature).toString('base64');

                this.Vite['tx_sendRawTx'](accountBlock).then((data)=>{
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
        if ( !this.Vite.Account.isValidHexAddr(fromAddr) ) {
            return Promise.reject('FromAddr error');
        }
        if ( !this.Vite.Account.isValidHexAddr(toAddr) ) {
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
                accountBlock.hash = hash;
                accountBlock.publicKey = Buffer.from(pubKey).toString('base64');
                accountBlock.signature = Buffer.from(signature).toString('base64');

                this.Vite['tx_sendRawTx'](accountBlock).then((data)=>{
                    return res(data);
                }).catch((err)=>{
                    return rej(err);
                });
            }).catch((err)=>{
                return rej(err);
            });
        });
    }

    encrypt(key, pwd, scryptP) {
        let scryptParams = scryptP && scryptP.scryptParams ? scryptP.scryptParams : {
            n: scryptP && scryptP.n ? scryptP.n : this.n,
            r: scryptP && scryptP.r ? scryptP.r : this.scryptR,
            p: scryptP && scryptP.p ? scryptP.p : this.p,
            keylen: scryptP && scryptP.keylen ? scryptP.keylen : this.scryptKeyLen,
            salt: scryptP && scryptP.salt ? scryptP.salt : libUtils.bytesToHex(nacl.randomBytes(32)),
        };
        let encryptPwd = scryptP && scryptP.encryptPwd ? utils.hexToBytes(scryptP.encryptPwd) : encryptKey(pwd, scryptParams);

        let nonce = nacl.randomBytes(12);
        let encryptEntropy = cipherText({
            hexData: key,
            pwd: encryptPwd, 
            nonce, 
            algorithm: this.algorithm
        });

        let cryptoJSON = {
            cipherName: this.algorithm,
            KDF: scryptName,
            salt: scryptParams.salt,
            Nonce: libUtils.bytesToHex(nonce)
        };
    
        let encryptedKeyJSON = {
            encryptEntropy,
            crypto: cryptoJSON,
            version: this.version,
            timestamp: new Date().getTime()
        };
        return JSON.stringify(encryptedKeyJSON).toLocaleLowerCase();
    }

    decrypt(keystore, pwd) {
        let keyJson = isValid(keystore);
        if (!keyJson) {
            return false;
        }

        let scryptParams = {
            n: keystore.scryptParams ? keystore.scryptParams.n || this.n : this.n,
            r: keystore.scryptParams ? keystore.scryptParams.scryptR || this.scryptR : this.scryptR,
            p: keystore.scryptParams ? keystore.scryptParams.p || this.p : this.p,
            keylen: keystore.scryptParams ? keystore.scryptParams.scryptKeyLen || this.scryptKeyLen : this.scryptKeyLen,
            salt: keyJson.crypto.salt,
        };
        let encryptPwd = encryptKey(pwd, scryptParams);

        let ciphertext = keyJson.encryptentropy.slice(0, len);
        let tag = keyJson.encryptentropy.slice(len);

        let entropy;
        try {
            const decipher = crypto.createDecipheriv(keyJson.crypto.ciphername, encryptPwd, libUtils.hexToBytes(keyJson.crypto.nonce));
            decipher.setAuthTag( libUtils.hexToBytes(tag) );
    
            entropy = decipher.update(libUtils.hexToBytes(ciphertext), 'utf8', 'hex');
            entropy += decipher.final('hex');
        } catch(err) {
            console.warn(err);
            return false;
        }

        return entropy;
    }

    verify(scryptP, str) {
        if ( !isValidVersion1.call(this, scryptP) ) {
            return false;
        }

        let encryptP = encryptKey(str, scryptP.scryptParams);
        return encryptP.toString('hex') === scryptP.encryptP;
    }
}

export default Account;

function loopAddr(address, privKey) {
    if (this.addrList.indexOf(address) < 0) {
        return;
    }

    let loop = ()=>{
        let loopTimeout = setTimeout(()=>{
            clearTimeout(loopTimeout);
            loopTimeout = null;
            loopAddr.call(this, address, privKey);
        }, loopTime);
    };

    this.receiveTx(address, privKey).then(()=>{
        loop();
    }).catch((err)=>{
        console.warn(err);
        loop();
    });
}

function encryptKey(pwd, scryptParams) {
    let pwdBuff = Buffer.from(pwd);
    let salt = libUtils.hexToBytes(scryptParams.salt);
    salt = Buffer.from(salt);
    return scryptsy(pwdBuff, salt, +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen);
}

function isValidVersion1(scryptP) {
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

function isValid(keystore) {
    // Out keystore file size is about 500 so if a file is very large it must not be a keystore file
    if (libUtils.getBytesSize(keystore) > 2 * 1024) {
        return false;
    }

    // Must be a JSON-string
    let keyJson = {};
    try {
        keyJson = JSON.parse(keystore.toLowerCase());
    } catch(err) {
        console.warn(err);
        return false;
    }

    // Required parameter
    if (!keyJson.crypto || 
        !keyJson.encryptentropy ||
        !keyJson.version) {
        return false;
    }

    if (versions.indexOf(+keyJson.version) === -1) {
        return false;
    }

    // Check cryptoJSON
    let crypto = keyJson.crypto;
    try {
        if (algorithms.indexOf(crypto.ciphername) === -1 ||
            crypto.kdf !== scryptName ||
            !crypto.salt) {
            return false;
        }

        libUtils.hexToBytes(keyJson.encryptentropy);
        libUtils.hexToBytes(crypto.nonce);
        libUtils.hexToBytes(crypto.salt);
    } catch(err) {
        console.warn(err);
        return false;
    }

    return keyJson;
}

function cipherText({ hexData, pwd, nonce, algorithm }) {
    let cipher = crypto.createCipheriv(algorithm, pwd, nonce);

    let ciphertext = cipher.update(libUtils.hexToBytes(hexData), 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    let tag = cipher.getAuthTag().toString('hex');

    return ciphertext + tag;
}
