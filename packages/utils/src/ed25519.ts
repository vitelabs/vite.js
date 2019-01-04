const nacl = require('@sisi/tweetnacl-blake2b');
import { Hex } from './type';
import { checkParams } from './tools';

export function keyPair() {
    return nacl.sign.keyPair();
}

export function getPublicKey(privKey: Buffer) {
    let err = checkParams({ privKey }, ['privKey']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    let key = nacl.sign.keyPair.fromSecretKey(privKey);
    return key.publicKey;
}

export function sign(hexStr: Hex, privKey: Buffer) {    
    let err = checkParams({ hexStr, privKey }, ['hexStr', 'privKey']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    let hash = Buffer.from(hexStr, 'hex');
    let pubKey = getPublicKey(privKey);
    let signature = nacl.sign.detached(hash, privKey, pubKey);
    let signatureHex = Buffer.from(signature).toString('hex');
    return signatureHex;
}

export function verify(message: Hex, signature: Hex, publicKey: Buffer) {
    let err = checkParams({ message, signature, publicKey }, ['message', 'signature', 'publicKey']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    let _msg = Buffer.from(message, 'hex');
    let _signature = Buffer.from(signature, 'hex');
    return nacl.sign.detached.verify(_msg, _signature, publicKey);
}

export function random(bytesLen: number = 32) {
    let err = checkParams({ bytesLen }, ['bytesLen']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }

    return nacl.randomBytes(bytesLen)
}
