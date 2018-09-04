let blake = require('blakejs');
let tweetnacl = require('tweetnacl-blake2b');

import libUtils from '../../libs/utils/index';

const ADDR_PRE = 'vite_';
const ADDR_SIZE = 20;
const ADDR_CHECK_SUM_SIZE = 5;
const ADDR_LEN = ADDR_PRE.length + ADDR_SIZE*2 + ADDR_CHECK_SUM_SIZE*2;

export default {
    newHexAddr(priv) {
        // address = Blake2b(PubKey)[0, 19]
        let {
            addr, privKey
        } = newAddr(priv);

        // checkSum = Blake2b(address)[0, 4] 
        let checkSum = getAddrCheckSum(addr);

        // HumanReadableAddress = 'vite_' + Hex(address + checkSum)
        return {
            privKey: libUtils.uint8ArrayToHexStr(privKey),
            addr: libUtils.uint8ArrayToHexStr(addr),
            hexAddr: ADDR_PRE + libUtils.uint8ArrayToHexStr(addr) + libUtils.uint8ArrayToHexStr(checkSum)
        };
    },

    isValidHexAddress
};

function newAddr(privKey) {
    let addr = '';
    if (privKey) {
        privKey = privKey instanceof ArrayBuffer ? privKey : libUtils.hexToArrayBuffer(privKey);
        addr = newAddrFromPriv(privKey);
    } else {
        let keyPair = tweetnacl.sign.keyPair();
        let publicKey = keyPair.publicKey;
        privKey = keyPair.secretKey;
        addr = newAddrFromPub(publicKey);
    }

    return { addr, privKey };
}

function newAddrFromPub(pubKey) {
    let pre = blake.blake2b(pubKey, null, 32);
    return pre.slice(0, ADDR_SIZE);
}

function newAddrFromPriv(privKey) {
    let pre = blake.blake2b(privKey, null, 64);
    return pre.slice(32, ADDR_SIZE + 32);
}

function getAddrCheckSum(addr) {
    // console.log(addr);
    let after = blake.blake2b(addr, null, 32);
    // console.log(after);
    return after.slice(after.length - ADDR_CHECK_SUM_SIZE);
}

function isValidHexAddress(hexAddr) {
    if (!hexAddr || hexAddr.length !== ADDR_LEN || hexAddr.indexOf(ADDR_PRE) !== 0) {
        return false;
    }

    let pre = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    let addr = libUtils.hexToArrayBuffer(pre); 

    let checkSum = getAddrCheckSum(addr);
    let currentCheckSum = hexAddr.slice(ADDR_LEN - ADDR_CHECK_SUM_SIZE * 2);
    
    return libUtils.uint8ArrayToHexStr(checkSum) === currentCheckSum;
}
