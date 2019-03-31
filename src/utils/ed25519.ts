const nacl = require('@sisi/tweetnacl-blake2b');
import { Hex } from '../type';
import { checkParams } from './index';

export function keyPair() {
    return nacl.sign.keyPair();
}

export function getPublicKey(privKey: Buffer) {
    const err = checkParams({ privKey }, ['privKey']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const key = nacl.sign.keyPair.fromSecretKey(privKey);
    return key.publicKey;
}

export function sign(hexStr: Hex, privKey: Buffer) {
    const err = checkParams({ hexStr, privKey }, [ 'hexStr', 'privKey' ]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const hash = Buffer.from(hexStr, 'hex');
    const pubKey = getPublicKey(privKey);
    const signature = nacl.sign.detached(hash, privKey, pubKey);
    const signatureHex = Buffer.from(signature).toString('hex');
    return signatureHex;
}

export function verify(message: Hex, signature: Hex, publicKey: Buffer) {
    const err = checkParams({ message, signature, publicKey }, [ 'message', 'signature', 'publicKey' ]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    const _msg = Buffer.from(message, 'hex');
    const _signature = Buffer.from(signature, 'hex');
    return nacl.sign.detached.verify(_msg, _signature, publicKey);
}

export function random(bytesLen: number = 32) {
    const err = checkParams({ bytesLen }, ['bytesLen']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    return nacl.randomBytes(bytesLen);
}
