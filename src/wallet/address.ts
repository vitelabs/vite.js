import { checkParams, ed25519, blake2b, isHexString } from '@vite/vitejs-utils';
import { addressIllegal } from '@vite/vitejs-error';

import { Hex, AddressObj, Address } from './type';

const { keyPair, getPublicKey } = ed25519;

export const ADDR_PRE = 'vite_';
export const ADDR_SIZE = 20;
export const ADDR_CHECK_SUM_SIZE = 5;
export const ADDR_LEN = ADDR_PRE.length + ADDR_SIZE * 2 + ADDR_CHECK_SUM_SIZE * 2;
export enum AddressType {
    'Illegal' = 0,
    'Account',
    'Contract'
}


export function createAddressByPrivateKey(privateKey?: Hex): AddressObj {
    const err = checkParams({ privateKey }, [], [{
        name: 'privateKey',
        func: isHexString
    }]);
    if (err) {
        throw err;
    }

    // originalAddress = Blake2b(PubKey)(len:20) + (isContract ? 1 : 0)(len:1)  // There is false
    const addressResult = createAddress(privateKey);
    const originalAddress = addressResult.originAddress;

    // checkSum = isContract ? reverse(Blake2b(address[0:20])(len:5)) : Blake2b(address[0:20])(len:5)  // There is false
    const checkSum = getAddrCheckSum(originalAddress, false);

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

export function getAddressFromPublicKey(publicKey: Hex): Address {
    const err = checkParams({ publicKey }, ['publicKey'], [{
        name: 'publicKey',
        func: isHexString
    }]);
    if (err) {
        throw new Error(err.message);
    }

    const publicKeyBuffer = Buffer.from(publicKey, 'hex');

    const originalAddress = newAddrFromPub(publicKeyBuffer);
    const checkSum = getAddrCheckSum(originalAddress, false);

    return getHexAddr(originalAddress, checkSum);
}

export function getOriginalAddressFromAddress(hexAddr: Hex): Hex {
    const addrType = isValidAddress(hexAddr);
    if (addrType === AddressType.Illegal) {
        throw addressIllegal;
    }

    return getOriginalAddress(hexAddr, addrType);
}

export function getAddressFromOriginalAddress(originalAddress: Hex): Address {
    const err = checkParams({ originalAddress }, ['originalAddress'], [{
        name: 'originalAddress',
        func: _originalAddress => typeof _originalAddress === 'string' && /^[0-9a-fA-F]+$/.test(_originalAddress) && (_originalAddress.length === ADDR_SIZE * 2 || _originalAddress.length === (ADDR_SIZE + 1) * 2)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    let contractNum = Number(originalAddress.slice(-2));
    contractNum = contractNum !== 0 && contractNum !== 1 ? 0 : contractNum;
    const isContract = !!Number(contractNum);

    const originalAddressBuf = Buffer.from(originalAddress, 'hex');
    const checkSum = getAddrCheckSum(originalAddressBuf, isContract);
    return getHexAddr(originalAddressBuf, checkSum);
}

export function isValidAddress(address: Hex): AddressType {
    if (!isValidHex(address)) {
        return AddressType.Illegal;
    }
    return isValidCheckSum(address);
}


function getOriginalAddress(hexAddr: Hex, addrType: AddressType): Hex {
    const addr = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    if (addrType === AddressType.Account) {
        return `${ addr }00`;
    }
    return `${ addr }01`;
}

function createAddress(privateKey?: Hex): {
    originAddress: Buffer;
    privateKey: Buffer;
} {
    // Init priveKey
    let privateKeyBuffer: Buffer;
    if (privateKey) {
        privateKeyBuffer = Buffer.from(privateKey, 'hex');
    } else {
        const _keyPair = keyPair();
        privateKeyBuffer = _keyPair.privateKey;
    }

    return {
        originAddress: newAddrFromPriv(privateKeyBuffer),
        privateKey: privateKeyBuffer
    };
}

function newAddrFromPub(publicKey: Buffer): Buffer {
    const _pre = blake2b(publicKey, undefined, ADDR_SIZE);

    const pre = new Uint8Array(21);
    pre.set(_pre);
    pre.set([0], 20);

    return Buffer.from(pre);
}

function newAddrFromPriv(privateKey: Buffer): Buffer {
    const publicKey: Buffer = getPublicKey(privateKey);
    return newAddrFromPub(Buffer.from(publicKey));
}

function getAddrCheckSum(addr: Buffer, isContract? : boolean): Hex {
    const addrPre20 = addr.slice(0, 20);
    const _checkSum = blake2b(addrPre20, undefined, ADDR_CHECK_SUM_SIZE);
    const checkSum = Buffer.from(_checkSum);

    if (!isContract) {
        return checkSum.toString('hex');
    }

    const newCheckSum:number[] = [];
    checkSum.forEach(function (byte) {
        newCheckSum.push(byte ^ 0xFF);
    });

    return Buffer.from(newCheckSum).toString('hex');
}

function getHexAddr(originalAddress: Buffer, checkSum: Hex): Address {
    return ADDR_PRE + originalAddress.slice(0, 20).toString('hex') + checkSum;
}

function isValidHex(hexAddr: Address): boolean {
    if(hexAddr){
        return hexAddr.length === ADDR_LEN && hexAddr.indexOf(ADDR_PRE) === 0;
    }
    return false;
}

function isValidCheckSum(hexAddr: Address): AddressType {
    const currentChecksum = hexAddr.slice(ADDR_PRE.length + ADDR_SIZE * 2);
    const _addr = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    const addr = Buffer.from(_addr, 'hex');

    const contractCheckSum = getAddrCheckSum(addr, true);
    if (contractCheckSum === currentChecksum) {
        return AddressType.Contract;
    }

    const checkSum = getAddrCheckSum(addr);
    if (currentChecksum === checkSum) {
        return AddressType.Account;
    }

    return AddressType.Illegal;
}
