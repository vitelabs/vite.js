const UUID = require('pure-uuid');
import { hexToBytes, checkParams } from '~@vite/vitejs-utils';
import { isAddress } from '~@vite/vitejs-hdwallet/address';

import { currentVersion, algorithm, scryptName } from './vars';


function isValidVersion1(keyJson) {
    // Required parameter
    if (!keyJson.scryptparams
        || !keyJson.encryptp
        || !keyJson.version
        || Number(keyJson.version) !== 1) {
        return false;
    }

    // Check scryptparams
    const scryptParams = keyJson.scryptparams;
    if (!scryptParams.n
        || !scryptParams.r
        || !scryptParams.p
        || !scryptParams.keylen
        || !scryptParams.salt) {
        return false;
    }

    // Try to do it
    hexToBytes(scryptParams.salt);

    return keyJson;
}

function isValidVersion2(keyJson) {
    // Required parameter
    if (!keyJson.crypto
        || !keyJson.encryptentropy
        || !keyJson.version
        || Number(keyJson.version) !== 2) {
        return false;
    }

    // Check cryptoJSON
    const crypto = keyJson.crypto;

    if (crypto.ciphername !== algorithm
        || crypto.kdf !== scryptName
        || !crypto.nonce
        || (!crypto.salt && !crypto.scryptparams)) {
        return false;
    }

    const salt = crypto.salt || crypto.scryptparams.salt;
    if (!salt) {
        return false;
    }

    if (crypto.scryptparams && (
        !crypto.scryptparams.n
        || !crypto.scryptparams.p
        || !crypto.scryptparams.r
        || !crypto.scryptparams.keylen
    )) {
        return false;
    }

    // Try to do it
    hexToBytes(keyJson.encryptentropy);
    hexToBytes(crypto.nonce);
    hexToBytes(crypto.salt);

    return keyJson;
}

function isValidVersion3(keyJson) {
    // Required parameter
    if (!keyJson.uuid
        || !keyJson.crypto
        || !keyJson.version
        || Number(keyJson.version) !== 3) {
        return false;
    }

    // Check cryptoJSON
    const crypto = keyJson.crypto;
    if (crypto.ciphername !== algorithm
        || !crypto.ciphertext
        || !crypto.nonce
        || crypto.kdf !== scryptName
        || !crypto.scryptparams) {
        return false;
    }

    // Check scryptparams
    const scryptparams = crypto.scryptparams;
    if (!scryptparams.n
        || !scryptparams.p
        || !scryptparams.r
        || !scryptparams.keylen
        || !scryptparams.salt
    ) {
        return false;
    }

    // Try to do
    new UUID().parse(keyJson.uuid);
    hexToBytes(crypto.ciphertext);
    hexToBytes(crypto.nonce);
    hexToBytes(scryptparams.salt);

    return keyJson;
}

function isValidOldKeystore(keyJson) {
    // Required parameter
    if (!keyJson.id
        || !keyJson.crypto
        || !keyJson.hexaddress
        || !isAddress(keyJson.hexaddress)) {
        return false;
    }

    // Check cryptoJSON
    const crypto = keyJson.crypto;
    if (crypto.ciphername !== algorithm
        || !crypto.ciphertext
        || !crypto.nonce
        || crypto.kdf !== scryptName
        || !crypto.scryptparams) {
        return false;
    }

    // Check scryptparams
    const scryptparams = crypto.scryptparams;
    if (!scryptparams.n
        || !scryptparams.p
        || !scryptparams.r
        || !scryptparams.keylen
        || !scryptparams.salt
    ) {
        return false;
    }

    // Try to do
    new UUID().parse(keyJson.id);
    hexToBytes(crypto.ciphertext);
    hexToBytes(crypto.nonce);
    hexToBytes(scryptparams.salt);

    return keyJson;
}


const validatedFuncs = [ isValidOldKeystore, isValidVersion1, isValidVersion2, isValidVersion3 ];

export default function isValid(keystore) {
    const err = checkParams({ keystore }, ['keystore']);
    if (err) {
        return false;
    }

    try {
        // Must be a JSON-string
        const keyJson = JSON.parse(keystore.toLowerCase());
        if (!keyJson.version && !keyJson.keystoreversion) {
            return false;
        }

        if ((keyJson.version && Number(keyJson.version) > currentVersion)
            || (keyJson.keystoreversion && keyJson.keystoreversion !== 1)) {
            return false;
        }

        if (keyJson.version) {
            return validatedFuncs[Number(keyJson.version)](keyJson);
        }

        return validatedFuncs[0](keyJson);
    } catch (err) {
        return false;
    }
}
