const blake = require('blakejs/blake2b');
import { tools, ed25519, encoder } from '@vite/vitejs-utils';

import { ADDR_PRE, ADDR_SIZE, ADDR_CHECK_SUM_SIZE, ADDR_LEN  } from './vars';
import { Hex, AddrObj } from "./type";

const { checkParams } = tools;
const { keyPair, getPublicKey } = ed25519;
const { bytesToHex, hexToBytes } = encoder;


export function newHexAddr(priv?: Hex | Buffer): AddrObj {
    // address = Blake2b(PubKey)(len:20)
    let {
        addr, privKey
    } = newAddr(priv);

    // checkSum = Blake2b(address)(len:5)
    let checkSum = getAddrCheckSum(addr);

    // HumanReadableAddress = 'vite_' + Hex(address + checkSum)
    let _addr = bytesToHex(addr);

    let _pubKey = getPublicKey(privKey);
    return {
        addr: _addr,
        pubKey: _pubKey,
        privKey: bytesToHex(privKey),
        hexAddr: ADDR_PRE + _addr + checkSum
    };
}

export function newHexAddrFromPub(pubkey: Hex | Buffer): string {
    let err = checkParams({ pubkey }, ['pubkey']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    let addr = newAddrFromPub(pubkey);
    let checkSum = getAddrCheckSum(addr);
    let _addr = bytesToHex(addr);
    return ADDR_PRE + _addr + checkSum;
}

export function getAddrFromHexAddr(hexAddr: Hex): Hex {
    let err = checkParams({ hexAddr }, ['hexAddr'], [{
        name: 'hexAddr',
        func: isValidHexAddr
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    return getRealAddr(hexAddr);
}

export function getHexAddrFromAddr(realAddr: Hex): string {
    let err = checkParams({ realAddr }, ['realAddr'], [{
        name: 'realAddr',
        func: (_realAddr) => {
            return typeof _realAddr === 'string' && /^[0-9a-fA-F]+$/.test(_realAddr) && _realAddr.length === ADDR_SIZE * 2
        }
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    let checkSum = getAddrCheckSum( Buffer.from(realAddr, 'hex') );
    return ADDR_PRE + realAddr + checkSum;
}

export function isValidHexAddr(hexAddr: Hex): boolean {
    if (!hexAddr || hexAddr.length !== ADDR_LEN || hexAddr.indexOf(ADDR_PRE) !== 0) {
        return false;
    }

    let pre = getRealAddr(hexAddr);
    let addr = hexToBytes(pre);

    let currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
    let checkSum = getAddrCheckSum(addr);

    return currentChecksum === checkSum;
}



function getRealAddr(hexAddr: Hex): string {
    return hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
}

function newAddr(privKey?: Buffer | Hex): { addr: Buffer, privKey: Buffer } {
    // Init priveKey
    let _privKey;
    if (privKey) {
        _privKey = privKey instanceof Buffer ? privKey : Buffer.from(privKey, 'hex');
    } else {
        let _keyPair = keyPair();
        _privKey = _keyPair.secretKey as Buffer;
    }

    const addr = newAddrFromPriv(_privKey);
    return { addr, privKey: _privKey };
}

function newAddrFromPub(pubKey: Hex | Buffer): Buffer {
    let pre = blake.blake2b(pubKey, null, ADDR_SIZE);
    return pre;
}

function newAddrFromPriv(privKey: Buffer): Buffer  {
    let publicKey = getPublicKey(privKey);
    return newAddrFromPub(publicKey);
}

function getAddrCheckSum(addr: ArrayBufferView): string {
    return blake.blake2bHex(addr, null, ADDR_CHECK_SUM_SIZE);
}
