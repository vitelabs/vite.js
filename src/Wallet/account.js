import { hexToBytes, bytesToHex, getBytesSize } from 'utils/encoder';
import {tx,onroad} from 'const/method';
import {signTX} from 'utils/tools';

const nacl = require('@sisi/tweetnacl-blake2b');
const scryptsy = require('scryptsy');
const crypto = typeof window !== 'undefined' ? require('browserify-aes') : require('crypto');

const loopTime = 2000;
const scryptName = 'scrypt';
const len = 32;
const versions = [1, 2];
const algorithms = ['aes-256-gcm'];

const version = 2;
// LightScryptN is the N parameter of Scrypt encryption algorithm, using 4MB
// memory and taking approximately 100ms CPU time on a modern processor.
const n = 4096;
// LightScryptP is the P parameter of Scrypt encryption algorithm, using 4MB
// memory and taking approximately 100ms CPU time on a modern processor.
const p = 6;
const scryptR = 8;
const scryptKeyLen = 32;
const algorithm = 'aes-256-gcm';
class Account {
    constructor(client) {
        this.client = client;
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
        accountBlock.publicKey = Buffer.from(pubKey).toString('base64');
        accountBlock.signature = Buffer.from(signature).toString('base64');

        return this.client.request(tx.sendRawTx,accountBlock).then(() => {
            return accountBlock;
        });
    }
}

export default Account;
export function encrypt(key, pwd, scryptP, selfScryptsy) {
    let scryptParams = scryptP && scryptP.scryptParams ? scryptP.scryptParams : {
        n: scryptP && scryptP.n ? scryptP.n : n,
        r: scryptP && scryptP.r ? scryptP.r : scryptR,
        p: scryptP && scryptP.p ? scryptP.p : p,
        keylen: scryptP && scryptP.keylen ? scryptP.keylen : scryptKeyLen,
        salt: scryptP && scryptP.salt ? scryptP.salt : bytesToHex(nacl.randomBytes(32)),
    };

    let getResult = (encryptPwd, res, rej) => {
        try {
            let nonce = nacl.randomBytes(12);
            let encryptEntropy = cipherText({
                hexData: key,
                pwd: encryptPwd,
                nonce,
                algorithm: algorithm
            });

            let cryptoJSON = {
                cipherName: algorithm,
                KDF: scryptName,
                salt: scryptParams.salt,
                Nonce: bytesToHex(nonce)
            };

            let encryptedKeyJSON = {
                encryptEntropy,
                crypto: cryptoJSON,
                version: version,
                timestamp: new Date().getTime()
            };
            res(JSON.stringify(encryptedKeyJSON).toLocaleLowerCase());
        } catch (err) {
            rej(err);
        }
    };

    return new Promise((res, rej) => {
        if (scryptP && scryptP.encryptPwd) {
            let encryptPwd = hexToBytes(scryptP.encryptPwd);
            getResult(encryptPwd, res, rej);
        } else {
            encryptKey(pwd, scryptParams, selfScryptsy).then((result) => {
                getResult(result, res, rej);
            }).catch((err) => {
                rej(err);
            });
        }
    });
}

export function decrypt(keystore, pwd, selfScryptsy) {
    let keyJson = isValid(keystore);
    if (!keyJson) {
        return Promise.reject(false);
    }

    let scryptParams = {
        n: keystore.scryptParams ? keystore.scryptParams.n || n : n,
        r: keystore.scryptParams ? keystore.scryptParams.scryptR || scryptR : scryptR,
        p: keystore.scryptParams ? keystore.scryptParams.p || p : p,
        keylen: keystore.scryptParams ? keystore.scryptParams.scryptKeyLen || scryptKeyLen : scryptKeyLen,
        salt: keyJson.crypto.salt,
    };

    let getResult = (encryptPwd, res, rej) => {
        let ciphertext = keyJson.encryptentropy.slice(0, keyJson.encryptentropy.length - len);
        let tag = keyJson.encryptentropy.slice(keyJson.encryptentropy.length - len);

        let entropy;
        try {
            const decipher = crypto.createDecipheriv(keyJson.crypto.ciphername, encryptPwd, hexToBytes(keyJson.crypto.nonce));
            decipher.setAuthTag(hexToBytes(tag));

            entropy = decipher.update(hexToBytes(ciphertext), 'utf8', 'hex');
            entropy += decipher.final('hex');
        } catch (err) {
            return rej(err);
        }

        return res(entropy);
    };

    return new Promise((res, rej) => {
        encryptKey(pwd, scryptParams, selfScryptsy).then((result) => {
            getResult(result, res, rej);
        }).catch((err) => {
            rej(err);
        });
    });
}

export function verify(scryptP, str, selfScryptsy) {
    if (!isValidVersion1.call(this, scryptP)) {
        return Promise.reject(false);
    }

    return new Promise((res, rej) => {
        encryptKey(str, scryptP.scryptParams, selfScryptsy).then((encryptP) => {
            return res(encryptP.toString('hex') === scryptP.encryptP);
        }).catch(err => {
            rej(err);
        });
    });
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
        this.client.request(onroad.getOnroadBlocksByAddress,address, 0, 1).then((data) => {
            if (!data || !data.result || !data.result.length) {
                return res();
            }

            this.client.builtin.receiveBlock({
                accountAddress: address,
                blockHash: data.result[0].hash
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

function encryptKey(pwd, scryptParams, selfScryptsy) {
    let salt = hexToBytes(scryptParams.salt);
    if (!selfScryptsy) {
        return Promise.resolve(
            scryptsy(pwd, Buffer.from(salt), +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen)
        );
    }
    return selfScryptsy(pwd, Array.from(salt), +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen);
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
        hexToBytes(scryptParams.salt);
    } catch (err) {
        return false;
    }

    return true;
}

function isValid(keystore) {
    // Out keystore file size is about 500 so if a file is very large it must not be a keystore file
    if (getBytesSize(keystore) > 2 * 1024) {
        return false;
    }

    // Must be a JSON-string
    let keyJson = {};
    try {
        keyJson = JSON.parse(keystore.toLowerCase());
    } catch (err) {
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

        hexToBytes(keyJson.encryptentropy);
        hexToBytes(crypto.nonce);
        hexToBytes(crypto.salt);
    } catch (err) {
        console.warn(err);
        return false;
    }

    return keyJson;
}

function cipherText({ hexData, pwd, nonce, algorithm }) {
    let cipher = crypto.createCipheriv(algorithm, pwd, nonce);

    let ciphertext = cipher.update(hexToBytes(hexData), 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    let tag = cipher.getAuthTag().toString('hex');

    return ciphertext + tag;
}