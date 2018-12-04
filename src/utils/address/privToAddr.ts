const blake = require('blakejs/blake2b');
const nacl = require('@sisi/tweetnacl-blake2b');

import { bytesToHex, hexToBytes } from '../encoder';
import { ADDR_PRE, ADDR_SIZE, ADDR_CHECK_SUM_SIZE, ADDR_LEN  } from './vars';


export function newHexAddr(priv?: Buffer | string): {
    addr: string, pubKey: string, privKey: string, hexAddr: string
} {
    // address = Blake2b(PubKey)(len:20)
    let {
        addr, privKey
    } = newAddr(priv);

    // checkSum = Blake2b(address)(len:5)
    let checkSum = getAddrCheckSum(addr);

    // HumanReadableAddress = 'vite_' + Hex(address + checkSum)
    let _addr = bytesToHex(addr);

    return {
        addr: _addr,
        pubKey: bytesToHex(privToPub(privKey)),
        privKey: bytesToHex(privKey),
        hexAddr: ADDR_PRE + _addr + checkSum
    };
}

export function getAddrFromHexAddr(hexAddr: string): string {
    if (!isValidHexAddr(hexAddr)) {
        return null;
    }
    return getRealAddr(hexAddr);
}

export function isValidHexAddr(hexAddr: string): boolean {
    if (!hexAddr || hexAddr.length !== ADDR_LEN || hexAddr.indexOf(ADDR_PRE) !== 0) {
        return false;
    }

    let pre = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    let addr = hexToBytes(pre);

    let currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
    let checkSum = getAddrCheckSum(addr);

    return currentChecksum === checkSum;
}



function getRealAddr(hexAddr: string): string {
    return hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
}

function privToPub(privKey: Buffer): Buffer {
    return privKey.slice(32);
}

function newAddr(privKey?: Buffer | string): { addr: Buffer, privKey: Buffer } {
    // Init priveKey
    let _privKey;
    if (privKey) {
        _privKey = privKey instanceof Buffer ? privKey : Buffer.from(privKey, 'hex');
    } else {
        let keyPair = nacl.sign.keyPair();
        _privKey = keyPair.secretKey as Buffer;
    }

    const addr = newAddrFromPriv(_privKey);
    return { addr, privKey: _privKey };
}

function newAddrFromPub(pubKey: string | Buffer): Buffer {
    let pre = blake.blake2b(pubKey, null, ADDR_SIZE);
    return pre;
}

function newAddrFromPriv(privKey: Buffer): Buffer  {
    return newAddrFromPub(privToPub(privKey));
}

function getAddrCheckSum(addr: string | ArrayBufferView): string {
    return blake.blake2bHex(addr, null, ADDR_CHECK_SUM_SIZE);
}