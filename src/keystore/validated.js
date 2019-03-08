const uuid = require('pure-uuid');
import { encoder, tools } from 'utils';
import { isValidHexAddr } from 'privToAddr';

import { currentVersion, algorithm, scryptName } from './vars';

const { checkParams } = tools;
const { hexToBytes } = encoder;


function isValidVersion1(keyJson) {
    // Required parameter
    if (!keyJson.scryptparams ||
        !keyJson.encryptp ||
        !keyJson.version ||
        +keyJson.version !== 1) {
        return false;
    }

    // Check scryptparams
    let scryptParams = keyJson.scryptparams;
    if (!scryptParams.n ||
        !scryptParams.r ||
        !scryptParams.p ||
        !scryptParams.keylen ||
        !scryptParams.salt) {
        return false;
    }

    // Try to do it
    hexToBytes(scryptParams.salt);

    return keyJson;
}

function isValidVersion2(keyJson) {
    // Required parameter
    if (!keyJson.crypto ||
        !keyJson.encryptentropy ||
        !keyJson.version ||
        +keyJson.version !== 2) {
        return false;
    }

    // Check cryptoJSON
    let crypto = keyJson.crypto;

    if (crypto.ciphername !== algorithm ||
        crypto.kdf !== scryptName || 
        !crypto.nonce ||
        (!crypto.salt && !crypto.scryptparams)) {
        return false;
    }

    let salt = crypto.salt || crypto.scryptparams.salt;
    if (!salt) {
        return false;
    }

    if (crypto.scryptparams && (
        !crypto.scryptparams.n || 
        !crypto.scryptparams.p ||
        !crypto.scryptparams.r ||
        !crypto.scryptparams.keylen
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
    if (!keyJson.uuid ||
        !keyJson.crypto ||
        !keyJson.version ||
        +keyJson.version !== 3) {
        return false;
    }

    // Check cryptoJSON
    let crypto = keyJson.crypto;
    if (crypto.ciphername !== algorithm ||
        !crypto.ciphertext ||
        !crypto.nonce ||
        crypto.kdf !== scryptName || 
        !crypto.scryptparams) {
        return false;
    }

    // Check scryptparams
    let scryptparams = crypto.scryptparams;
    if (!scryptparams.n || 
        !scryptparams.p ||
        !scryptparams.r ||
        !scryptparams.keylen ||
        !scryptparams.salt
    ) {
        return false;
    }

    // Try to do
    new uuid().parse(keyJson.uuid);
    hexToBytes(crypto.ciphertext);
    hexToBytes(crypto.nonce);
    hexToBytes(scryptparams.salt);

    return keyJson;
}

function isValidOldKeystore(keyJson) {
    // Required parameter
    if (!keyJson.id ||
        !keyJson.crypto ||
        !keyJson.hexaddress ||
        !isValidHexAddr(keyJson.hexaddress)) {
        return false;
    }

    // Check cryptoJSON
    let crypto = keyJson.crypto;
    if (crypto.ciphername !== algorithm ||
        !crypto.ciphertext ||
        !crypto.nonce ||
        crypto.kdf !== scryptName || 
        !crypto.scryptparams) {
        return false;
    }

    // Check scryptparams
    let scryptparams = crypto.scryptparams;
    if (!scryptparams.n || 
        !scryptparams.p ||
        !scryptparams.r ||
        !scryptparams.keylen ||
        !scryptparams.salt
    ) {
        return false;
    }

    // Try to do
    new uuid().parse(keyJson.id);
    hexToBytes(crypto.ciphertext);
    hexToBytes(crypto.nonce);
    hexToBytes(scryptparams.salt);

    return keyJson;
}



const validatedFuncs = [isValidOldKeystore, isValidVersion1, isValidVersion2, isValidVersion3];

export default function isValid(keystore) {
    let err = checkParams({ keystore }, ['keystore']);
    if (err) {
        console.error(new Error(err));
        return false;
    }

    try {
        // Must be a JSON-string
        let keyJson = JSON.parse(keystore.toLowerCase());
        if (!keyJson.version && !keyJson.keystoreversion) {
            return false;
        }
 
        if ((keyJson.version && +keyJson.version > currentVersion) ||
            (keyJson.keystoreversion && keyJson.keystoreversion !== 1)) {
            return false;
        } 

        if (keyJson.version) {
            return validatedFuncs[+keyJson.version](keyJson);
        }

        return validatedFuncs[0](keyJson);
    } catch (err) {
        return false;
    }
}
