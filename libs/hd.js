// Copy from https://github.com/alepop/ed25519-hd-key
// Convert to ed25519-blake2b

import createHmac from 'create-hmac';
import tweetnacl from 'tweetnacl-blake2b';

const ED25519_CURVE = 'ed25519 blake2b seed';
const HARDENED_OFFSET = 0x80000000;

const pathRegex = new RegExp('^m(\\/[0-9]+\')+$');
const replaceDerive = val => val.replace('\'', '');

export default {
    getMasterKeyFromSeed,

    getPublicKey (seed) {
        let {
            secretKey, publicKey
        } = tweetnacl.sign.keyPair.fromSeed(seed);
        return {
            publicKey, 
            privateKey: secretKey
        };
    },
    
    derivePath (path, seed) {
        if (!isValidPath(path)) {
            throw new Error('Invalid derivation path');
        }
    
        const { key, chainCode } = getMasterKeyFromSeed(seed);
        const segments = path
            .split('/')
            .slice(1)
            .map(replaceDerive)
            .map(el => parseInt(el, 10));
    
        return segments.reduce(
            (parentKeys, segment) => CKDPriv(parentKeys, segment + HARDENED_OFFSET),
            { key, chainCode }
        );
    }
};

function getMasterKeyFromSeed (seed) {
    const hmac = createHmac('sha512', ED25519_CURVE);
    const I = hmac.update(Buffer.from(seed, 'hex')).digest();
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR,
    };
}

function CKDPriv ({ key, chainCode }, index) {
    const indexBuffer = Buffer.allocUnsafe(4);
    indexBuffer.writeUInt32BE(index, 0);

    const data = Buffer.concat([Buffer.alloc(1, 0), key, indexBuffer]);

    const I = createHmac('sha512', chainCode).update(data).digest();
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR,
    };
}

function isValidPath (path) {
    if (!pathRegex.test(path)) {
        return false;
    }
    return !path.split('/').slice(1).map(replaceDerive).some(isNaN);
}
