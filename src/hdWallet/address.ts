import { checkParams, ed25519, blake2b, isHexString } from '~@vite/vitejs-utils';
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


export function createAddressByPrivateKey(privateKey?: Hex, isContract?: boolean): AddrObj {
    const err = checkParams({ privateKey }, [], [{
        name: 'privateKey',
        func: isHexString
    }]);
    if (err) {
        throw err;
    }

    // originalAddress = Blake2b(PubKey)(len:20) + (isContract ? 1 : 0)(len:1)
    const addressResult = createAddress(privateKey, isContract);
    const originalAddress = addressResult.originAddress;

    // checkSum = isContract ? reverse(Blake2b(address[0:20])(len:5)) : Blake2b(address[0:20])(len:5)
    const checkSum = getAddrCheckSum(originalAddress, isContract);

    // address = 'vite_' + Hex(originalAddress[0:20] + checkSum)
    const address = getHexAddr(originalAddress, checkSum);
    const publicKey: Buffer = getPublicKey(addressResult.privateKey);

    return {
        originalAddress: originalAddress.toString('hex'),
        publicKey: Buffer.from(publicKey).toString('hex'),
        privateKey: addressResult.privateKey.toString('hex'),
        address
    };
}

export function getAddressFromPublicKey(publicKey: Hex, isContract?: boolean): Address {
    const err = checkParams({ publicKey }, ['publicKey'], [{
        name: 'publicKey',
        func: isHexString
    }]);
    if (err) {
        throw new Error(err.message);
    }

    const publicKeyBuffer = Buffer.from(publicKey, 'hex');

    const originalAddress = newAddrFromPub(publicKeyBuffer, isContract);
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

function createAddress(privateKey?: Hex, isContract?: boolean): {
    originAddress: Buffer;
    privateKey: Buffer;
} {
    // Init priveKey
    let privateKeyBuffer: Buffer;
    if (privateKey) {
        privateKeyBuffer = Buffer.from(privateKey, 'hex');
    } else {
        const _keyPair = keyPair();
        privateKeyBuffer = Buffer.from(_keyPair.privateKey);
    }

    return {
        originAddress: newAddrFromPriv(privateKeyBuffer, isContract),
        privateKey: privateKeyBuffer
    };
}

function newAddrFromPub(publicKey: Buffer, isContract?: boolean): Buffer {
    const _pre = blake2b(publicKey, null, ADDR_SIZE);
    const isContractByte = isContract ? 1 : 0;

    const pre = new Uint8Array(21);
    pre.set(_pre);
    pre.set([isContractByte], 20);

    return Buffer.from(pre);
}

function newAddrFromPriv(privateKey: Buffer, isContract?: boolean): Buffer {
    const publicKey: Buffer = getPublicKey(privateKey);
    return newAddrFromPub(Buffer.from(publicKey), isContract);
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
