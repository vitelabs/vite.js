let blake = require('blakejs/blake2b');
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
            privKey: libUtils.bytesToHex(privKey),
            addr: libUtils.bytesToHex(addr),
            hexAddr: ADDR_PRE + libUtils.bytesToHex(addr) + checkSum
        };
    },

    isValidHexAddress
};

function newAddr(privKey) {
    let addr = '';
    if (privKey) {
        privKey = privKey instanceof ArrayBuffer ? privKey : libUtils.hexToBytes(privKey);
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
    let pre = blake.blake2b(pubKey, null, ADDR_SIZE);
    // console.log(libUtils.bytesToHex(pubKey), ADDR_SIZE, libUtils.bytesToHex(pre));
    return pre.slice(0, ADDR_SIZE);
}

function newAddrFromPriv(privKey) {
    return newAddrFromPub( privKey.slice(32) );
}

function getAddrCheckSum(addr) {
    let res = blake.blake2bHex(addr, null, ADDR_CHECK_SUM_SIZE);
    // console.log(libUtils.bytesToHex(addr), ADDR_CHECK_SUM_SIZE, res);
    return res;
}

function isValidHexAddress(hexAddr) {
    if (!hexAddr || hexAddr.length !== ADDR_LEN || hexAddr.indexOf(ADDR_PRE) !== 0) {
        return false;
    }

    let pre = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    let addr = libUtils.hexToBytes(pre); 

    let currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
    let checkSum = getAddrCheckSum(addr);
  
    return currentChecksum === checkSum;
}
