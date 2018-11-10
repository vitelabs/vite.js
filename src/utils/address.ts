let blake = require('blakejs/blake2b');
let nacl = require('@sisi/tweetnacl-blake2b');

import encoder from './encoder';
import {ADDR_PRE,ADDR_SIZE,ADDR_CHECK_SUM_SIZE,ADDR_LEN} from './const/address'


export default {
    newHexAddr(priv) {
        // address = Blake2b(PubKey)(len:20)
        let {
            addr, privKey
        } = newAddr(priv);

        // checkSum = Blake2b(address)(len:5)
        let checkSum = getAddrCheckSum(addr);

        // HumanReadableAddress = 'vite_' + Hex(address + checkSum)
        addr = encoder.bytesToHex(addr);
        return {
            addr,
            pubKey: encoder.bytesToHex( privToPub(privKey) ),
            privKey: encoder.bytesToHex(privKey),
            hexAddr: ADDR_PRE + addr + checkSum
        };
    },

    isValidHexAddr,

    getAddrFromHexAddr(hexAddr) {
        if (!isValidHexAddr(hexAddr)) {
            return null;
        }
        return getRealAddr(hexAddr);
    }
};

function isValidHexAddr(hexAddr) {
    if (!hexAddr || hexAddr.length !== ADDR_LEN || hexAddr.indexOf(ADDR_PRE) !== 0) {
        return false;
    }

    let pre = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    let addr = encoder.hexToBytes(pre); 

    let currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
    let checkSum = getAddrCheckSum(addr);
  
    return currentChecksum === checkSum;
}

function getRealAddr(hexAddr) {
    return hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
}

function privToPub(privKey) {
    return privKey.slice(32);
}

function newAddr(privKey) {
    let addr = '';
    if (privKey) {
        privKey = privKey instanceof ArrayBuffer ? privKey : encoder.hexToBytes(privKey);
        addr = newAddrFromPriv(privKey);
    } else {
        let keyPair = nacl.sign.keyPair();
        let publicKey = keyPair.publicKey;
        privKey = keyPair.secretKey;
        addr = newAddrFromPub(publicKey);
    }

    return { addr, privKey };
}

function newAddrFromPub(pubKey) {
    let pre = blake.blake2b(pubKey, null, ADDR_SIZE);
    return pre;
}

function newAddrFromPriv(privKey) {
    return newAddrFromPub( privToPub(privKey) );
}

function getAddrCheckSum(addr) {
    let res = blake.blake2bHex(addr, null, ADDR_CHECK_SUM_SIZE);
    return res;
}
