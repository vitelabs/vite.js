const blake = require('blakejs/blake2b');
import { tools, ed25519, encoder } from 'utils';

import { ADDR_PRE, ADDR_SIZE, ADDR_CHECK_SUM_SIZE, ADDR_LEN } from './vars';
import { Hex, AddrObj } from '../type';

const { checkParams } = tools;
const { keyPair, getPublicKey } = ed25519;
const { bytesToHex, hexToBytes } = encoder;


export function newHexAddr(priv?: Hex | Buffer): AddrObj {
    // address = Blake2b(PubKey)(len:20)
    const { addr, privKey } = newAddr(priv);

    // checkSum = Blake2b(address)(len:5)
    const checkSum = getAddrCheckSum(addr);

    // HumanReadableAddress = 'vite_' + Hex(address + checkSum)
    const _addr = bytesToHex(addr);

    const _pubKey = getPublicKey(privKey);
    return {
        addr: _addr,
        pubKey: _pubKey,
        privKey: bytesToHex(privKey),
        hexAddr: ADDR_PRE + _addr + checkSum
    };
}

export function newHexAddrFromPub(pubkey: Hex | Buffer): string {
    const err = checkParams({ pubkey }, ['pubkey']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const addr = newAddrFromPub(pubkey);
    const checkSum = getAddrCheckSum(addr);
    const _addr = bytesToHex(addr);
    return ADDR_PRE + _addr + checkSum;
}

export function getAddrFromHexAddr(hexAddr: Hex): Hex {
    const err = checkParams({ hexAddr }, ['hexAddr'], [{
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
    const err = checkParams({ realAddr }, ['realAddr'], [{
        name: 'realAddr',
        func: _realAddr => typeof _realAddr === 'string' && /^[0-9a-fA-F]+$/.test(_realAddr) && _realAddr.length === ADDR_SIZE * 2
    }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const checkSum = getAddrCheckSum(Buffer.from(realAddr, 'hex'));
    return ADDR_PRE + realAddr + checkSum;
}

export function isValidHexAddr(hexAddr: Hex): boolean {
    if (!hexAddr || hexAddr.length !== ADDR_LEN || hexAddr.indexOf(ADDR_PRE) !== 0) {
        return false;
    }

    const pre = getRealAddr(hexAddr);
    const addr = hexToBytes(pre);

    const currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
    const checkSum = getAddrCheckSum(addr);

    return currentChecksum === checkSum;
}


function getRealAddr(hexAddr: Hex): string {
    return hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
}

function newAddr(privKey?: Buffer | Hex): { addr: Buffer; privKey: Buffer } {
    // Init priveKey
    let _privKey;
    if (privKey) {
        _privKey = privKey instanceof Buffer ? privKey : Buffer.from(privKey, 'hex');
    } else {
        const _keyPair = keyPair();
        _privKey = _keyPair.secretKey as Buffer;
    }

    const addr = newAddrFromPriv(_privKey);
    return { addr, privKey: _privKey };
}

function newAddrFromPub(pubKey: Hex | Buffer): Buffer {
    const pre = blake.blake2b(pubKey, null, ADDR_SIZE);
    return pre;
}

function newAddrFromPriv(privKey: Buffer): Buffer {
    const publicKey = getPublicKey(privKey);
    return newAddrFromPub(publicKey);
}

function getAddrCheckSum(addr: ArrayBufferView): string {
    return blake.blake2bHex(addr, null, ADDR_CHECK_SUM_SIZE);
}
