import { checkParams, ed25519, blake2b } from '~@vite/vitejs-utils';
import { addressIllegal } from '~@vite/vitejs-error';

import { ADDR_PRE, ADDR_SIZE, ADDR_CHECK_SUM_SIZE, ADDR_LEN, ADDR_TYPE } from './vars';
import { Hex, AddrObj, Address } from './type';

const { keyPair, getPublicKey } = ed25519;

export function createAddressByPrivateKey(priv?: Hex | Buffer, isContract?: boolean): AddrObj {
    // realAddr = Blake2b(PubKey)(len:20) + (isContract ? 1 : 0)(len:1)
    const { realAddr, privKey } = newAddr(priv, isContract);

    // checkSum = isContract ? reverse(Blake2b(address[0:20])(len:5)) : Blake2b(address[0:20])(len:5)
    const checkSum = getAddrCheckSum(realAddr, isContract);

    // address = 'vite_' + Hex(realAddr[0:20] + checkSum)
    const address = getHexAddr(realAddr, checkSum);

    return {
        realAddress: realAddr.toString('hex'),
        publicKey: getPublicKey(privKey),
        privateKey: privKey.toString('hex'),
        address
    };
}

export function createAddressByPublicKey(pubkey: Hex | Buffer, isContract?: boolean): Address {
    const err = checkParams({ pubkey }, ['pubkey']);
    if (err) {
        throw new Error(err.message);
    }

    const realAddr = newAddrFromPub(pubkey, isContract);
    const checkSum = getAddrCheckSum(realAddr, isContract);

    return getHexAddr(realAddr, checkSum);
}

export function getRealAddressFromAddress(hexAddr: Hex): Hex {
    const addrType = isAddress(hexAddr);
    if (addrType === ADDR_TYPE.Illegal) {
        throw addressIllegal;
    }

    return getRealAddr(hexAddr, addrType);
}

export function getAddressFromRealAddress(realAddr: Hex, isContract? : boolean): Hex {
    const err = checkParams({ realAddr }, ['realAddr'], [{
        name: 'realAddr',
        func: _realAddr => typeof _realAddr === 'string' && /^[0-9a-fA-F]+$/.test(_realAddr) && (_realAddr.length === ADDR_SIZE * 2 || _realAddr.length === (ADDR_SIZE + 1) * 2)
    }]);
    if (err) {
        throw new Error(err.message);
    }

    const realAddrBuf = Buffer.from(realAddr, 'hex');
    const checkSum = getAddrCheckSum(realAddrBuf, isContract);
    return getHexAddr(realAddrBuf, checkSum);
}

export function isAddress(hexAddr: Hex): ADDR_TYPE {
    if (!isValidHex(hexAddr)) {
        return ADDR_TYPE.Illegal;
    }
    return isValidCheckSum(hexAddr);
}



function getRealAddr(hexAddr: Hex, addrType: ADDR_TYPE): string {
    const addr = hexAddr.slice(ADDR_PRE.length, ADDR_PRE.length + ADDR_SIZE * 2);
    if (addrType === ADDR_TYPE.Account) {
        return `${ addr }00`;
    }
    return `${ addr }01`;
}

function newAddr(privKey?: Buffer | Hex, isContract?: boolean): { realAddr: Buffer; privKey: Buffer } {
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
        realAddr: addr,
        privKey: _privKey
    };
}

function newAddrFromPub(pubKey: Hex | Buffer, isContract?: boolean): Buffer {
    const _pre = blake2b(pubKey, null, ADDR_SIZE);
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

function getHexAddr(realAddr: Buffer, checkSum: Hex): string {
    return ADDR_PRE + realAddr.slice(0, 20).toString('hex') + checkSum;
}

function isValidHex(hexAddr) {
    return hexAddr && hexAddr.length === ADDR_LEN && hexAddr.indexOf(ADDR_PRE) === 0;
}

function isValidCheckSum(hexAddr) {
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
