"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require('bip39');
var vitejs_utils_1 = require("./../utils");
var wallet_1 = require("./wallet");
var hdKey = require("./hdKey");
var addressLib = require("./address");
exports.default = __assign({}, addressLib, hdKey, { deriveAddress: deriveAddress, deriveAddressList: function (_a) {
        var mnemonics = _a.mnemonics, startIndex = _a.startIndex, endIndex = _a.endIndex, _b = _a.wordlist, wordlist = _b === void 0 ? bip39.wordlists.EN : _b, _c = _a.passphrase, passphrase = _c === void 0 ? '' : _c;
        var err = vitejs_utils_1.checkParams({ startIndex: startIndex, endIndex: endIndex }, ['startIndex', 'endIndex']);
        if (err) {
            throw new Error(err.message);
        }
        if (startIndex >= endIndex) {
            throw new Error('Illegal index');
        }
        var addressList = [];
        for (var i = startIndex; i <= endIndex; i++) {
            var addr = deriveAddress({ mnemonics: mnemonics, index: i, wordlist: wordlist, passphrase: passphrase });
            addressList.push(addr);
        }
        return addressList;
    }, createWallet: function (strength, wordlist, passphrase) {
        if (strength === void 0) { strength = 256; }
        if (wordlist === void 0) { wordlist = bip39.wordlists.EN; }
        if (passphrase === void 0) { passphrase = ''; }
        var mnemonic = hdKey.createMnemonics(strength, wordlist);
        return new wallet_1.default(mnemonic, wordlist, passphrase);
    }, getWallet: function (mnemonics, wordlist, passphrase) {
        if (wordlist === void 0) { wordlist = bip39.wordlists.EN; }
        if (passphrase === void 0) { passphrase = ''; }
        var err = vitejs_utils_1.checkParams({ mnemonics: mnemonics, wordlist: wordlist }, ['mnemonics', 'wordlist'], [{
                name: 'mnemonics',
                func: function (_m) { return hdKey.validateMnemonics(_m, wordlist); }
            }]);
        if (err) {
            throw new Error(err.message);
        }
        return new wallet_1.default(mnemonics, wordlist, passphrase);
    } });
function deriveAddress(_a) {
    var mnemonics = _a.mnemonics, _b = _a.index, index = _b === void 0 ? 0 : _b, _c = _a.wordlist, wordlist = _c === void 0 ? bip39.wordlists.EN : _c, _d = _a.passphrase, passphrase = _d === void 0 ? '' : _d;
    var seedHex = hdKey.getSeedFromMnemonics(mnemonics, passphrase, wordlist).seedHex;
    var privateKey = hdKey.deriveKeyPairByIndex(seedHex, index).privateKey;
    return addressLib.createAddressByPrivateKey(privateKey);
}
