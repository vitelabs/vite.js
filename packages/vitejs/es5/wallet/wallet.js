"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require('bip39');
var blake = require('blakejs/blake2b');
var vitejs_utils_1 = require("./../utils");
var hdKey = require("./hdKey");
var addressLib = require("./address");
var Wallet = (function () {
    function Wallet(mnemonics, wordlist, passphrase) {
        if (wordlist === void 0) { wordlist = bip39.wordlists.EN; }
        if (passphrase === void 0) { passphrase = ''; }
        if (!hdKey.validateMnemonics(mnemonics, wordlist)) {
            throw new Error('Illegal mnemonic');
        }
        this.rootPath = hdKey.ROOT_PATH;
        this.mnemonics = mnemonics;
        this.wordlist = wordlist;
        this.passphrase = passphrase;
        this.entropy = hdKey.getEntropyFromMnemonics(mnemonics, wordlist);
        var _a = hdKey.getSeedFromMnemonics(mnemonics, passphrase, wordlist), seed = _a.seed, seedHex = _a.seedHex;
        this.seed = seed;
        this.seedHex = seedHex;
        this.addressList = {};
    }
    Object.defineProperty(Wallet.prototype, "id", {
        get: function () {
            var address = '';
            if (this.addressList[0]) {
                address = this.addressList[0].address;
            }
            else {
                var account = this.deriveAddress(0);
                address = account.address;
            }
            var addressBuffer = Buffer.from(address);
            var idBuffer = blake.blake2b(addressBuffer, null, 32);
            return Buffer.from(idBuffer).toString('hex');
        },
        enumerable: true,
        configurable: true
    });
    Wallet.prototype.getAddressList = function () {
        return this.addressList;
    };
    Wallet.prototype.deriveAddress = function (index) {
        var err = vitejs_utils_1.checkParams({ index: index }, ['index'], [{
                name: 'index',
                func: vitejs_utils_1.isNonNegativeInteger
            }]);
        if (err) {
            throw new Error(err.message);
        }
        if (this.addressList[index]) {
            return this.addressList[index];
        }
        var path = hdKey.getPath(index);
        var _a = hdKey.deriveKeyPairByPath(this.seedHex, path), privateKey = _a.privateKey, publicKey = _a.publicKey;
        var address = addressLib.getAddressFromPublicKey(publicKey);
        var originalAddress = addressLib.getOriginalAddressFromAddress(address);
        var account = {
            privateKey: privateKey,
            publicKey: publicKey,
            address: address,
            originalAddress: originalAddress,
            path: path
        };
        this.addressList[index] = account;
        return account;
    };
    Wallet.prototype.deriveAddressList = function (startIndex, endIndex) {
        var err = vitejs_utils_1.checkParams({ startIndex: startIndex, endIndex: endIndex }, ['startIndex', 'endIndex'], [{
                name: 'startIndex',
                func: vitejs_utils_1.isNonNegativeInteger
            }, {
                name: 'endIndex',
                func: vitejs_utils_1.isNonNegativeInteger
            }]);
        if (err) {
            throw new Error(err.message);
        }
        if (startIndex > endIndex) {
            throw new Error('Illegal index');
        }
        var addressList = [];
        for (var i = startIndex; i <= endIndex; i++) {
            var account = this.deriveAddress(i);
            addressList.push(account);
        }
        return addressList;
    };
    return Wallet;
}());
exports.default = Wallet;
