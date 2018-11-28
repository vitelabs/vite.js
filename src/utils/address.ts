let blake = require('blakejs/blake2b');
let nacl = require('@sisi/tweetnacl-blake2b');

import encoder from './encoder';
import { ADDR_PRE, ADDR_SIZE, ADDR_CHECK_SUM_SIZE, ADDR_LEN } from 'const/address';


export default {
    newHexAddr(priv: string) {
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
            pubKey: encoder.bytesToHex(privToPub(privKey)),
            privKey: encoder.bytesToHex(privKey),
            hexAddr: ADDR_PRE + addr + checkSum
        };
    },

    isValidHexAddr,

    getAddrFromHexAddr(hexAddr:string) {
        if (!isValidHexAddr(hexAddr)) {
            return null;
        }
        return getRealAddr(hexAddr);
    }
};

function isValidHexAddr(hexAddr:string) {
    if (!hexAddr || hexAddr.length !== ADDR_LEN || hexAddr.indexOf(ADDR_PRE) !== 0) {
        return false;
    }

    let pre = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    let addr = encoder.hexToBytes(pre);

    let currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
    let checkSum = getAddrCheckSum(addr);

    return currentChecksum === checkSum;//????
}

function getRealAddr(hexAddr:string) {
    return hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
}

function privToPub(privKey: Buffer) {
    return privKey.slice(32);
}

function newAddr(privKey?: Buffer| string):{addr:Buffer,privKey:Buffer} {
    if (privKey) {
        privKey=privKey instanceof Buffer?privKey:Buffer.from(privKey)
        const addr = newAddrFromPriv(privKey);
        return { addr, privKey };
    }
    let keyPair = nacl.sign.keyPair();
    let publicKey = keyPair.publicKey;
    privKey= keyPair.secretKey as Buffer;
    const addr = newAddrFromPub(publicKey);
    return { addr, privKey};
}

function newAddrFromPub(pubKey: string|Buffer): Buffer {
    let pre = blake.blake2b(pubKey, null, ADDR_SIZE);
    return pre;
}

function newAddrFromPriv(privKey: Buffer) {
    return newAddrFromPub(privToPub(privKey));
}

function getAddrCheckSum(addr:string|ArrayBufferView):string {
    let res = blake.blake2bHex(addr, null, ADDR_CHECK_SUM_SIZE);//?????
    return res;
}