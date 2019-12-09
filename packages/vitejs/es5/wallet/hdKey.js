"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require('bip39');
var hd = require('@sisi/ed25519-blake2b-hd-key');
var vitejs_utils_1 = require("./../utils");
exports.ROOT_PATH = 'm/44\'/666666\'';
function createMnemonics(strength, wordlist) {
    if (strength === void 0) { strength = 256; }
    if (wordlist === void 0) { wordlist = bip39.wordlists.EN; }
    var err = vitejs_utils_1.checkParams({ strength: strength, wordlist: wordlist }, ['strength', 'wordlist']);
    if (err) {
        throw new Error(err.message);
    }
    return bip39.generateMnemonic(strength, null, wordlist);
}
exports.createMnemonics = createMnemonics;
function validateMnemonics(mnemonic, wordlist) {
    if (wordlist === void 0) { wordlist = bip39.wordlists.EN; }
    return mnemonic && bip39.validateMnemonic(mnemonic, wordlist);
}
exports.validateMnemonics = validateMnemonics;
function getEntropyFromMnemonics(mnemonic, wordlist) {
    if (wordlist === void 0) { wordlist = bip39.wordlists.EN; }
    var err = vitejs_utils_1.checkParams({ mnemonic: mnemonic, wordlist: wordlist }, ['mnemonic', 'wordlist'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonics(_m, wordlist); }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    return bip39.mnemonicToEntropy(mnemonic, wordlist);
}
exports.getEntropyFromMnemonics = getEntropyFromMnemonics;
function getSeedFromMnemonics(mnemonic, passphrase, wordlist) {
    if (passphrase === void 0) { passphrase = ''; }
    if (wordlist === void 0) { wordlist = bip39.wordlists.EN; }
    var err = vitejs_utils_1.checkParams({ mnemonic: mnemonic, wordlist: wordlist }, ['mnemonic', 'wordlist'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonics(_m, wordlist); }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    var seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
    var seedHex = seed.toString('hex');
    return { seed: seed, seedHex: seedHex };
}
exports.getSeedFromMnemonics = getSeedFromMnemonics;
function createSeed(strength, passphrase, wordlist) {
    if (strength === void 0) { strength = 256; }
    if (passphrase === void 0) { passphrase = ''; }
    if (wordlist === void 0) { wordlist = bip39.wordlists.EN; }
    var mnemonic = createMnemonics(strength, wordlist);
    var _a = getSeedFromMnemonics(mnemonic, passphrase, wordlist), seed = _a.seed, seedHex = _a.seedHex;
    return { mnemonic: mnemonic, seed: seed, seedHex: seedHex };
}
exports.createSeed = createSeed;
function getMnemonicsFromEntropy(entropy, wordlist) {
    if (wordlist === void 0) { wordlist = bip39.wordlists.EN; }
    var err = vitejs_utils_1.checkParams({ entropy: entropy }, ['entropy']);
    if (err) {
        throw new Error(err.message);
    }
    return bip39.entropyToMnemonic(entropy, wordlist);
}
exports.getMnemonicsFromEntropy = getMnemonicsFromEntropy;
function getPath(index) {
    return exports.ROOT_PATH + "/" + index + "'";
}
exports.getPath = getPath;
function deriveKeyPairByPath(seed, path) {
    var key = hd.derivePath(path, seed).key;
    var _a = hd.getPublicKey(key), privateKey = _a.privateKey, publicKey = _a.publicKey;
    return {
        privateKey: Buffer.from(privateKey).toString('hex'),
        publicKey: Buffer.from(publicKey).toString('hex')
    };
}
exports.deriveKeyPairByPath = deriveKeyPairByPath;
function deriveKeyPairByIndex(seed, index) {
    var path = getPath(index);
    return deriveKeyPairByPath(seed, path);
}
exports.deriveKeyPairByIndex = deriveKeyPairByIndex;
