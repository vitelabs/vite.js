let blake = require('blakejs/blake2b');
let nacl = require('../../libs/nacl_blake2b');

import utils from '../../libs/utils';

const ADDR_PRE = 'vite_';
const ADDR_SIZE = 20;
const ADDR_CHECK_SUM_SIZE = 5;
const ADDR_LEN = ADDR_PRE.length + ADDR_SIZE*2 + ADDR_CHECK_SUM_SIZE*2;

export default {
    newHexAddr(priv) {
        // address = Blake2b(PubKey)(len:20)
        let {
            addr, privKey
        } = newAddr(priv);

        // checkSum = Blake2b(address)(len:5)
        let checkSum = getAddrCheckSum(addr);

        // HumanReadableAddress = 'vite_' + Hex(address + checkSum)
        addr = utils.bytesToHex(addr);
        return {
            addr,
            privKey: utils.bytesToHex(privKey),
            hexAddr: ADDR_PRE + addr + checkSum
        };
    },

    isValidHexAddr(hexAddr) {
        if (!hexAddr || hexAddr.length !== ADDR_LEN || hexAddr.indexOf(ADDR_PRE) !== 0) {
            return false;
        }
    
        let pre = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
        let addr = utils.hexToBytes(pre); 
    
        let currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
        let checkSum = getAddrCheckSum(addr);
      
        return currentChecksum === checkSum;
    }
};

function newAddr(privKey) {
    let addr = '';
    if (privKey) {
        privKey = privKey instanceof ArrayBuffer ? privKey : utils.hexToBytes(privKey);
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
    return pre.slice(0, ADDR_SIZE);
}

function newAddrFromPriv(privKey) {
    return newAddrFromPub( privKey.slice(32) );
}

function getAddrCheckSum(addr) {
    let res = blake.blake2bHex(addr, null, ADDR_CHECK_SUM_SIZE);
    return res;
}
