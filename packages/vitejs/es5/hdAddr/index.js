"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require('bip39');
var hd = require('@sisi/ed25519-blake2b-hd-key');
var privToAddr_1 = require("privToAddr");
var error_1 = require("error");
var utils_1 = require("utils");
var type_1 = require("../type");
var ROOT_PATH = 'm/44\'/666666\'';
var checkParams = utils_1.tools.checkParams;
var bytesToHex = utils_1.encoder.bytesToHex, blake2b = utils_1.encoder.blake2b;
function validateMnemonic(mnemonic, lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    return mnemonic && bip39.validateMnemonic(mnemonic, getWordList(lang));
}
exports.validateMnemonic = validateMnemonic;
function getEntropyFromMnemonic(mnemonic, lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    var err = checkParams({ mnemonic: mnemonic }, ['mnemonic'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonic(_m, lang); }
        }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    return bip39.mnemonicToEntropy(mnemonic, getWordList(lang));
}
exports.getEntropyFromMnemonic = getEntropyFromMnemonic;
function getMnemonicFromEntropy(entropy, lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    var err = checkParams({ entropy: entropy }, ['entropy']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    return bip39.entropyToMnemonic(entropy, getWordList(lang));
}
exports.getMnemonicFromEntropy = getMnemonicFromEntropy;
function newAddr(bits, lang, pwd) {
    if (bits === void 0) { bits = 256; }
    if (lang === void 0) { lang = type_1.LangList.english; }
    if (pwd === void 0) { pwd = ''; }
    var err = checkParams({ bits: bits }, ['bits']);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    var wordList = getWordList(lang);
    var mnemonic = bip39.generateMnemonic(bits, null, wordList);
    var entropy = bip39.mnemonicToEntropy(mnemonic, wordList);
    var seed = bip39.mnemonicToSeedHex(mnemonic, pwd);
    var path = getPath(0);
    var addr = getAddrFromPath(path, seed);
    return { addr: addr, entropy: entropy, mnemonic: mnemonic };
}
exports.newAddr = newAddr;
function getAddrFromMnemonic(mnemonic, index, lang, pwd) {
    if (index === void 0) { index = 0; }
    if (lang === void 0) { lang = type_1.LangList.english; }
    if (pwd === void 0) { pwd = ''; }
    var err = checkParams({ mnemonic: mnemonic }, ['mnemonic'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonic(_m, lang); }
        }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    if (index < 0) {
        console.warn(error_1.paramsFormat.message + " Index must greater than 0.");
        index = 0;
    }
    var path = getPath(index);
    var seed = bip39.mnemonicToSeedHex(mnemonic, pwd);
    return getAddrFromPath(path, seed);
}
exports.getAddrFromMnemonic = getAddrFromMnemonic;
function getAddrsFromMnemonic(mnemonic, start, num, lang, pwd) {
    if (start === void 0) { start = 0; }
    if (num === void 0) { num = 10; }
    if (lang === void 0) { lang = type_1.LangList.english; }
    if (pwd === void 0) { pwd = ''; }
    var err = checkParams({ mnemonic: mnemonic }, ['mnemonic'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonic(_m, lang); }
        }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    if (start < 0) {
        console.warn(error_1.paramsFormat.message + " Start must greater than 0 or equal to 0.");
        start = 0;
    }
    if (num <= 0) {
        return [];
    }
    var addrs = [];
    var seed = bip39.mnemonicToSeedHex(mnemonic, pwd);
    for (var i = start; i < num; i++) {
        var currentPath = getPath(i);
        var addr = getAddrFromPath(currentPath, seed);
        addrs.push(addr);
    }
    return addrs;
}
exports.getAddrsFromMnemonic = getAddrsFromMnemonic;
function getId(mnemonic, lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    var err = checkParams({ mnemonic: mnemonic }, ['mnemonic'], [{
            name: 'mnemonic',
            func: function (_m) { return validateMnemonic(_m, lang); }
        }]);
    if (err) {
        console.error(new Error(err.message));
        return null;
    }
    var addrObj = getAddrFromMnemonic(mnemonic, 0);
    var keyBuffer = Buffer.from(addrObj.hexAddr);
    var idByte = blake2b(keyBuffer, null, 32);
    return Buffer.from(idByte).toString('hex');
}
exports.getId = getId;
exports.getAddrFromHexAddr = privToAddr_1.getAddrFromHexAddr;
exports.isValidHexAddr = privToAddr_1.isValidHexAddr;
function getAddrFromPath(path, seed) {
    var key = hd.derivePath(path, seed).key;
    var privateKey = hd.getPublicKey(key).privateKey;
    var priv = bytesToHex(privateKey);
    return privToAddr_1.newHexAddr(priv);
}
function getPath(index) {
    return ROOT_PATH + "/" + index + "'";
}
function getWordList(lang) {
    if (lang === void 0) { lang = type_1.LangList.english; }
    lang = lang && bip39.wordlists[lang] ? lang : type_1.LangList.english;
    return bip39.wordlists[lang];
}
