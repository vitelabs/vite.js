const hd = require('@sisi/ed25519-blake2b-hd-key');
import { createAddressByPrivateKey, isAddress as _isAddress, getRealAddressFromAddress as _getRealAddressFromAddress } from '~@vite/vitejs-privtoaddr';
import { paramsFormat } from '~@vite/vitejs-error';
import { bytesToHex, blake2b } from '~@vite/vitejs-utils';

import { AddrObj, Hex } from './type';

const ROOT_PATH = 'm/44\'/666666\'';

export function createAddress(seed: string, isContract?: boolean): AddrObj {
    const path = getPath(0);
    return getAddrFromPath(path, seed, isContract);
}

export function getAddrFromMnemonic(seed, index = 0, isContract?: boolean): AddrObj {
    if (index < 0) {
        console.warn(`${ paramsFormat.message } Index must greater than 0.`);
        index = 0;
    }

    const path = getPath(index);
    return getAddrFromPath(path, seed, isContract);
}

export function getAddrsFromMnemonic(seed, start = 0, num = 10, isContract?: boolean): AddrObj[] {
    if (start < 0) {
        console.warn(`${ paramsFormat.message } Start must greater than 0 or equal to 0.`);
        start = 0;
    }

    if (num <= 0) {
        return [];
    }

    const addrs = [];
    for (let i = start; i < start + num; i++) {
        const currentPath = getPath(i);
        const addr = getAddrFromPath(currentPath, seed, isContract);
        addrs.push(addr);
    }

    return addrs;
}

export const getId = _getId;

export const getRealAddressFromAddress = _getRealAddressFromAddress;

export const isAddress = _isAddress;


function getAddrFromPath(path: string, seed: string, isContract?: boolean): AddrObj {
    const { key } = hd.derivePath(path, seed);
    const { privateKey } = hd.getPublicKey(key);
    const priv = bytesToHex(privateKey);
    return createAddressByPrivateKey(priv, isContract);
}

function getPath(index: number): string {
    return `${ ROOT_PATH }/${ index }\'`;
}

function _getId(address: string): Hex {
    const keyBuffer = Buffer.from(address);
    const idByte = blake2b(keyBuffer, null, 32);
    return Buffer.from(idByte).toString('hex');
}
