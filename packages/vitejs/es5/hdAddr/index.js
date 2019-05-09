"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require('bip39');
var hd = require('@sisi/ed25519-blake2b-hd-key');
var vitejs_privtoaddr_1 = require("./../privtoaddr");
var vitejs_error_1 = require("./../error");
var vitejs_utils_1 = require("./../utils");
var type_1 = require("../type");
var ROOT_PATH = 'm/44\'/666666\'';
function validateMnemonic(mnemonic, lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    return mnemonic && bip39.validateMnemonic(mnemonic, getWordList(lang));
}
exports.validateMnemonic = validateMnemonic;
function getEntropyFromMnemonic(mnemonic, lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    var err = vitejs_utils_1.checkParams({ mnemonic: mnemonic }, ['mnemonic'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonic(_m, lang); }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    return bip39.mnemonicToEntropy(mnemonic, getWordList(lang));
}
exports.getEntropyFromMnemonic = getEntropyFromMnemonic;
function getMnemonicFromEntropy(entropy, lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    var err = vitejs_utils_1.checkParams({ entropy: entropy }, ['entropy']);
    if (err) {
        throw new Error(err.message);
    }
    return bip39.entropyToMnemonic(entropy, getWordList(lang));
}
exports.getMnemonicFromEntropy = getMnemonicFromEntropy;
function newAddr(bits, lang, pwd, isContract) {
    if (bits === void 0) { bits = 256; }
    if (lang === void 0) { lang = type_1.LangList.english; }
    if (pwd === void 0) { pwd = ''; }
    var err = vitejs_utils_1.checkParams({ bits: bits }, ['bits']);
    if (err) {
        throw new Error(err.message);
    }
    var wordList = getWordList(lang);
    var mnemonic = bip39.generateMnemonic(bits, null, wordList);
    var entropy = bip39.mnemonicToEntropy(mnemonic, wordList);
    var seed = bip39.mnemonicToSeedHex(mnemonic, pwd);
    var path = getPath(0);
    var addr = getAddrFromPath(path, seed, isContract);
    var id = exports.getId(mnemonic, lang);
    return { addr: addr, entropy: entropy, mnemonic: mnemonic, id: id };
}
exports.newAddr = newAddr;
function getAddrFromMnemonic(mnemonic, index, lang, pwd, isContract) {
    if (index === void 0) { index = 0; }
    if (lang === void 0) { lang = type_1.LangList.english; }
    if (pwd === void 0) { pwd = ''; }
    var err = vitejs_utils_1.checkParams({ mnemonic: mnemonic }, ['mnemonic'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonic(_m, lang); }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    if (index < 0) {
        console.warn(vitejs_error_1.paramsFormat.message + " Index must greater than 0.");
        index = 0;
    }
    var path = getPath(index);
    var seed = bip39.mnemonicToSeedHex(mnemonic, pwd);
    return getAddrFromPath(path, seed, isContract);
}
exports.getAddrFromMnemonic = getAddrFromMnemonic;
function getAddrsFromMnemonic(mnemonic, start, num, lang, pwd, isContract) {
    if (start === void 0) { start = 0; }
    if (num === void 0) { num = 10; }
    if (lang === void 0) { lang = type_1.LangList.english; }
    if (pwd === void 0) { pwd = ''; }
    var err = vitejs_utils_1.checkParams({ mnemonic: mnemonic }, ['mnemonic'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonic(_m, lang); }
        }]);
    if (err) {
        throw new Error(err.message);
    }
    if (start < 0) {
        console.warn(vitejs_error_1.paramsFormat.message + " Start must greater than 0 or equal to 0.");
        start = 0;
    }
    if (num <= 0) {
        return [];
    }
    var addrs = [];
    var seed = bip39.mnemonicToSeedHex(mnemonic, pwd);
    for (var i = start; i < start + num; i++) {
        var currentPath = getPath(i);
        var addr = getAddrFromPath(currentPath, seed, isContract);
        addrs.push(addr);
    }
    return addrs;
}
exports.getAddrsFromMnemonic = getAddrsFromMnemonic;
exports.getId = _getId;
exports.getAddrFromHexAddr = vitejs_privtoaddr_1.getAddrFromHexAddr;
exports.isValidHexAddr = vitejs_privtoaddr_1.isValidHexAddr;
function getAddrFromPath(path, seed, isContract) {
    var key = hd.derivePath(path, seed).key;
    var privateKey = hd.getPublicKey(key).privateKey;
    var priv = vitejs_utils_1.bytesToHex(privateKey);
    return vitejs_privtoaddr_1.newHexAddr(priv, isContract);
}
function getPath(index) {
    return ROOT_PATH + "/" + index + "'";
}
function getWordList(lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    lang = lang && bip39.wordlists[lang] ? lang : type_1.LangList.english;
    return bip39.wordlists[lang];
}
function _getId(mnemonic, lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    var err = vitejs_utils_1.checkParams({ mnemonic: mnemonic }, ['mnemonic'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonic(_m, lang); }
        }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    var addrObj = getAddrFromMnemonic(mnemonic, 0);
    var keyBuffer = Buffer.from(addrObj.hexAddr);
    var idByte = vitejs_utils_1.blake2b(keyBuffer, null, 32);
    return Buffer.from(idByte).toString('hex');
}
