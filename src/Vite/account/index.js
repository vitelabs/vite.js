import basicStruct from '../basicStruct.js';
import utils from '../../utils/index';
import libUtils from '../../../libs/utils/index';

let uuid = require('pure-uuid');
let scryptsy = require('scryptsy');
let tweetnacl = require('tweetnacl-blake2b');

const crypto = typeof window !== 'undefined' ? require('browserify-aes') : require('crypto');

const aesMode = 'aes-256-gcm';
const scryptName = 'scrypt';
const keystoreVersion = 1;

// LightScryptN is the N parameter of Scrypt encryption algorithm, using 4MB
// memory and taking approximately 100ms CPU time on a modern processor.
const n = 4096;

// LightScryptP is the P parameter of Scrypt encryption algorithm, using 4MB
// memory and taking approximately 100ms CPU time on a modern processor.
const p = 6;

const scryptR = 8;
const scryptKeyLen = 32;
const additionData = libUtils.strToArrayBuffer('vite');

class Account extends basicStruct {
    constructor(provider) {
        super(provider);
    }

    newHexAddress(privKey) {
        return utils.newHexAddr(privKey);
    }

    encryptKeystore(key, pwd) {
        // TestData
        // cipherText('313132323333343435353636373738383939414141424243434243', libUtils.hexToArrayBuffer('3131313132323232333333333434343435353535363636363737373738383838'), libUtils.hexToArrayBuffer('95c9fc5de8a48943cdc96bd0'));
        // let cipher = 'c47a0f805282c664df34f0c32e5cc43331362585cf090734850001d32cb91f62971277056c222f0c904ee8'
        
        let {
            encryptPwd, salt
        } = encryptKey(pwd);

        let {
            text, nonce 
        } = cipherText(key.privKey, encryptPwd);

        let scryptParams = {
            N: n,
            R: scryptR,
            P: p,
            KeyLen: scryptKeyLen,
            Salt: salt,
        };
    
        let cryptoJSON = {
            CipherName: aesMode,
            CipherText: text,
            Nonce: nonce,
            KDF: scryptName,
            ScryptParams: scryptParams,
        };
    
        let encryptedKeyJSON = {
            HexAddress: key.hexAddr,
            Crypto: cryptoJSON,
            Id: libUtils.toHex( new uuid(4) ),
            keystoreversion: keystoreVersion,
            Timestamp: new Date().getTime(),
        };
    
        console.log(JSON.stringify(encryptedKeyJSON).toLocaleLowerCase());

        return JSON.stringify(encryptedKeyJSON);
    }

    decryptKeystore(ciphertext, nonce, pwd, tag) {
        let { encryptPwd } = encryptKey(pwd);

        const decipher = crypto.createDecipheriv(aesMode, encryptPwd, nonce);
        decipher.setAuthTag(tag);
        decipher.setAAD(additionData);

        let cleartext = decipher.update(libUtils.hexToArrayBuffer(ciphertext), 'utf8', 'hex');
        cleartext += decipher.final('hex');
        console.log(cleartext);

        return cleartext;
    }

    status() {

    }

    unLock() {

    }

    lock() {

    }


    // signTX() {

    // }
}

export default Account;

function encryptKey(pwd) {
    const salt = libUtils.uint8ArrayToHexStr( tweetnacl.randomBytes(32) );
    console.log(salt);
    return {
        encryptPwd: scryptsy(pwd, salt, n, scryptR, p, scryptKeyLen),
        salt
    };
}

function cipherText(privKey, encryptPwd, nonce) {
    nonce = nonce || tweetnacl.randomBytes(12);
    // nonce = nonce || libUtils.uint8ArrayToHexStr( tweetnacl.randomBytes(12) );
    let cipher = crypto.createCipheriv(aesMode, encryptPwd, nonce);
    cipher.setAAD(additionData);

    let ciphertext = cipher.update(libUtils.hexToArrayBuffer(privKey), 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    let tag = cipher.getAuthTag().toString('hex');

    console.log(ciphertext);
    console.log(tag);
    return {
        text: ciphertext + tag,
        nonce: libUtils.uint8ArrayToHexStr( nonce )
    };
}
