const nacl = require('@sisi/tweetnacl-blake2b');
import { Hex } from './type';
import { checkParams, isHexString } from './index';

export function keyPair(): { privateKey: Buffer; publicKey: Buffer; } {
    const keys = nacl.sign.keyPair();
    return {
        privateKey: Buffer.from(keys.secretKey),
        publicKey: Buffer.from(keys.publicKey)
    };
}

export function getPublicKey(privKey: Buffer): Buffer {
    const err = checkParams({ privKey }, ['privKey']);
    if (err) {
        throw new Error(err.message);
    }

    const key = nacl.sign.keyPair.fromSecretKey(privKey);
    return Buffer.from(key.publicKey);
}

export function sign(hexStr: Hex, privKey: Hex): Hex {
    const err = checkParams({ hexStr, privKey }, [ 'hexStr', 'privKey' ], [ {
        name: 'hexStr',
        func: isHexString
    }, {
        name: 'privKey',
        func: isHexString
    } ]);
    if (err) {
        throw new Error(err.message);
    }

    const privateKeyBuffer = Buffer.from(privKey, 'hex');
    const hash = Buffer.from(hexStr, 'hex');
    const pubKey = getPublicKey(privateKeyBuffer);

    const signature = nacl.sign.detached(hash, privateKeyBuffer, pubKey);
    const signatureHex = Buffer.from(signature).toString('hex');
    return signatureHex;
}

export function verify(message: Hex, signature: Hex, publicKey: Hex): boolean {
    const err = checkParams({ message, signature, publicKey }, [ 'message', 'signature', 'publicKey' ], [ {
        name: 'message',
        func: isHexString
    }, {
        name: 'signature',
        func: isHexString
    }, {
        name: 'publicKey',
        func: isHexString
    } ]);
    if (err) {
        throw new Error(err.message);
    }

    const _publicKey = Buffer.from(publicKey, 'hex');
    const _msg = Buffer.from(message, 'hex');
    const _signature = Buffer.from(signature, 'hex');

    return nacl.sign.detached.verify(_msg, _signature, _publicKey);
}

export function random(bytesLen = 32) {
    const err = checkParams({ bytesLen }, ['bytesLen']);
    if (err) {
        throw new Error(err.message);
    }

    return nacl.randomBytes(bytesLen);
}
