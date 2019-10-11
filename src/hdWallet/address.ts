import { checkParams, ed25519, blake2b } from '~@vite/vitejs-utils';
import { addressIllegal } from '~@vite/vitejs-error';

import { Hex, AddrObj, Address } from './type';

const { keyPair, getPublicKey } = ed25519;

export const ADDR_PRE = 'vite_';
export const ADDR_SIZE = 20;
export const ADDR_CHECK_SUM_SIZE = 5;
export const ADDR_LEN = ADDR_PRE.length + ADDR_SIZE * 2 + ADDR_CHECK_SUM_SIZE * 2;
export enum ADDR_TYPE {
    'Illegal' = 0,
    'Account',
    'Contract'
}


export function createAddressByPrivateKey(priv?: Hex | Buffer, isContract?: boolean): AddrObj {
    // originalAddress = Blake2b(PubKey)(len:20) + (isContract ? 1 : 0)(len:1)
    const { originalAddress, privKey } = newAddr(priv, isContract);

    // checkSum = isContract ? reverse(Blake2b(address[0:20])(len:5)) : Blake2b(address[0:20])(len:5)
    const checkSum = getAddrCheckSum(originalAddress, isContract);

    // address = 'vite_' + Hex(originalAddress[0:20] + checkSum)
    const address = getHexAddr(originalAddress, checkSum);

    return {
        originalAddress: originalAddress.toString('hex'),
        publicKey: Buffer.from(getPublicKey(privKey)),
        privateKey: privKey,
        address
    };
}

export function getAddressFromPublicKey(pubkey: Hex | Buffer, isContract?: boolean): Address {
    const err = checkParams({ pubkey }, ['pubkey']);
    if (err) {
        throw new Error(err.message);
    }

    const originalAddress = newAddrFromPub(pubkey, isContract);
    const checkSum = getAddrCheckSum(originalAddress, isContract);

    return getHexAddr(originalAddress, checkSum);
}

export function getOriginalAddressFromAddress(hexAddr: Hex): Hex {
    const addrType = isValidAddress(hexAddr);
    if (addrType === ADDR_TYPE.Illegal) {
        throw addressIllegal;
    }

    return getOriginalAddress(hexAddr, addrType);
}

export function getAddressFromOriginalAddress(originalAddress: Hex, isContract? : boolean): Address {
    const err = checkParams({ originalAddress }, ['originalAddress'], [{
        name: 'originalAddress',
        func: _originalAddress => typeof _originalAddress === 'string' && /^[0-9a-fA-F]+$/.test(_originalAddress) && (_originalAddress.length === ADDR_SIZE * 2 || _originalAddress.length === (ADDR_SIZE + 1) * 2)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    const originalAddressBuf = Buffer.from(originalAddress, 'hex');
    const checkSum = getAddrCheckSum(originalAddressBuf, isContract);
    return getHexAddr(originalAddressBuf, checkSum);
}

export function isValidAddress(hexAddr: Hex): ADDR_TYPE {
    if (!isValidHex(hexAddr)) {
        return ADDR_TYPE.Illegal;
    }
    return isValidCheckSum(hexAddr);
}



function getOriginalAddress(hexAddr: Hex, addrType: ADDR_TYPE): Hex {
    const addr = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    if (addrType === ADDR_TYPE.Account) {
        return `${ addr }00`;
    }
    return `${ addr }01`;
}

function newAddr(privKey?: Buffer | Hex, isContract?: boolean): { originalAddress: Buffer; privKey: Buffer } {
    // Init priveKey
    let _privKey;
    if (privKey) {
        _privKey = privKey instanceof Buffer ? privKey : Buffer.from(privKey, 'hex');
    } else {
        const _keyPair = keyPair();
        _privKey = Buffer.from(_keyPair.privateKey);
    }

    const addr = newAddrFromPriv(_privKey, isContract);
    return {
        originalAddress: addr,
        privKey: _privKey
    };
}

function newAddrFromPub(pubKey: Hex | Buffer, isContract?: boolean): Buffer {
    const _pubKey = pubKey instanceof Buffer ? Buffer.from(pubKey) : Buffer.from(pubKey, 'hex');
    const _pre = blake2b(_pubKey, null, ADDR_SIZE);
    const isContractByte = isContract ? 1 : 0;

    const pre = new Uint8Array(21);
    pre.set(_pre);
    pre.set([isContractByte], 20);

    return Buffer.from(pre);
}

function newAddrFromPriv(privKey: Buffer, isContract?: boolean): Buffer {
    const publicKey = getPublicKey(privKey);
    return newAddrFromPub(publicKey, isContract);
}

function getAddrCheckSum(addr: Buffer, isContract? : boolean): Hex {
    const addrPre20 = addr.slice(0, 20);
    const _checkSum = blake2b(addrPre20, null, ADDR_CHECK_SUM_SIZE);
    const checkSum = Buffer.from(_checkSum);

    if (!isContract) {
        return checkSum.toString('hex');
    }

    const newCheckSum = [];
    checkSum.forEach(function (byte) {
        newCheckSum.push(byte ^ 0xFF);
    });

    return Buffer.from(newCheckSum).toString('hex');
}

function getHexAddr(originalAddress: Buffer, checkSum: Hex): Address {
    return ADDR_PRE + originalAddress.slice(0, 20).toString('hex') + checkSum;
}

function isValidHex(hexAddr: Address): Boolean {
    return hexAddr && hexAddr.length === ADDR_LEN && hexAddr.indexOf(ADDR_PRE) === 0;
}

function isValidCheckSum(hexAddr: Address): ADDR_TYPE {
    const currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
    const _addr = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    const addr = Buffer.from(_addr, 'hex');

    const contractCheckSum = getAddrCheckSum(addr, true);
    if (contractCheckSum === currentChecksum) {
        return ADDR_TYPE.Contract;
    }

    const checkSum = getAddrCheckSum(addr);
    if (currentChecksum === checkSum) {
        return ADDR_TYPE.Account;
    }

    return ADDR_TYPE.Illegal;
}
