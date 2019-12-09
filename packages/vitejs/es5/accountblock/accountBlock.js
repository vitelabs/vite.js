"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var BigNumber = require('bn.js');
var blake = require('blakejs/blake2b');
var vitejs_utils_1 = require("./../utils");
var address_1 = require("./../wallet/address");
var utils_1 = require("./utils");
var type_1 = require("./type");
var AccountBlockClass = (function () {
    function AccountBlockClass(_a, provider, privateKey) {
        var blockType = _a.blockType, address = _a.address, fee = _a.fee, data = _a.data, sendBlockHash = _a.sendBlockHash, amount = _a.amount, toAddress = _a.toAddress, tokenId = _a.tokenId;
        var err = vitejs_utils_1.checkParams({ blockType: blockType, address: address }, ['blockType', 'address'], [{
                name: 'blockType',
                func: function (_b) { return type_1.BlockType[_b]; },
                msg: "Don't have blockType " + blockType
            }, {
                name: 'address',
                func: address_1.isValidAddress
            }]);
        if (err) {
            throw err;
        }
        this.blockType = blockType;
        this.address = address;
        this.fee = fee;
        this.data = data;
        this.sendBlockHash = sendBlockHash;
        this.amount = amount;
        this.tokenId = tokenId;
        this._toAddress = toAddress;
        provider && this.setProvider(provider);
        privateKey && this.setPrivateKey(privateKey);
    }
    Object.defineProperty(AccountBlockClass.prototype, "accountBlock", {
        get: function () {
            return {
                blockType: this.blockType,
                address: this.address,
                fee: this.fee === '' ? null : this.fee,
                data: this.data === '' ? null : this.data,
                sendBlockHash: this.sendBlockHash === '' ? null : this.sendBlockHash,
                toAddress: this.toAddress === '' ? null : this.toAddress,
                tokenId: this.tokenId === '' ? null : this.tokenId,
                amount: this.amount === '' ? null : this.amount,
                height: this.height === '' ? null : this.height,
                previousHash: this.previousHash === '' ? null : this.previousHash,
                difficulty: this.difficulty === '' ? null : this.difficulty,
                nonce: this.nonce === '' ? null : this.nonce,
                hash: this.hash === '' ? null : this.hash,
                publicKey: this.publicKey === '' ? null : this.publicKey,
                signature: this.signature === '' ? null : this.signature
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "toAddress", {
        get: function () {
            if (this.blockType !== type_1.BlockType.CreateContractRequest) {
                return this._toAddress;
            }
            if (!this.previousHash || !this.height) {
                return '';
            }
            return utils_1.createContractAddress({
                address: this.address,
                height: this.height,
                previousHash: this.previousHash
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "originalAddress", {
        get: function () {
            return address_1.getOriginalAddressFromAddress(this.address);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "blockTypeHex", {
        get: function () {
            return utils_1.getBlockTypeHex(this.blockType);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "previousHashHex", {
        get: function () {
            return utils_1.getPreviousHashHex(this.previousHash);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "heightHex", {
        get: function () {
            return utils_1.getHeightHex(this.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "addressHex", {
        get: function () {
            return utils_1.getAddressHex(this.address);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "toAddressHex", {
        get: function () {
            return utils_1.getToAddressHex(this.toAddress);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "amountHex", {
        get: function () {
            return utils_1.getAmountHex(this.amount);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "tokenIdHex", {
        get: function () {
            return utils_1.getTokenIdHex(this.tokenId);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "sendBlockHashHex", {
        get: function () {
            return utils_1.getSendBlockHashHex(this.sendBlockHash);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "dataHex", {
        get: function () {
            return utils_1.getDataHex(this.data);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "feeHex", {
        get: function () {
            return utils_1.getFeeHex(this.fee);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "nonceHex", {
        get: function () {
            return utils_1.getNonceHex(this.nonce);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "isRequestBlock", {
        get: function () {
            return utils_1.isRequestBlock(this.blockType);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "isResponseBlock", {
        get: function () {
            return utils_1.isResponseBlock(this.blockType);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountBlockClass.prototype, "hash", {
        get: function () {
            var block = {
                blockType: this.blockType,
                address: this.address,
                fee: this.fee,
                data: this.data,
                sendBlockHash: this.sendBlockHash,
                toAddress: this.toAddress,
                tokenId: this.tokenId,
                amount: this.amount,
                height: this.height,
                previousHash: this.previousHash,
                difficulty: this.difficulty,
                nonce: this.nonce
            };
            if (utils_1.isValidAccountBlockWithoutHash(block)) {
                return utils_1.getAccountBlockHash(block);
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    AccountBlockClass.prototype.setProvider = function (provider) {
        this.provider = provider;
        return this;
    };
    AccountBlockClass.prototype.setPrivateKey = function (privateKey) {
        var err = vitejs_utils_1.checkParams({ privateKey: privateKey }, ['privateKey'], [{
                name: 'privateKey',
                func: vitejs_utils_1.isHexString
            }]);
        if (err) {
            throw err;
        }
        var address = address_1.createAddressByPrivateKey(privateKey).address;
        if (address !== this.address) {
            throw new Error('PrivateKey is wrong');
        }
        this.privateKey = privateKey;
        return this;
    };
    AccountBlockClass.prototype.getPreviousAccountBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var previousAccountBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.provider.request('ledger_getLatestAccountBlock', this.address)];
                    case 1:
                        previousAccountBlock = _a.sent();
                        return [2, previousAccountBlock];
                }
            });
        });
    };
    AccountBlockClass.prototype.setHeight = function (height) {
        this.height = height;
        return this;
    };
    AccountBlockClass.prototype.setPreviousHash = function (previousHash) {
        this.previousHash = previousHash;
        return this;
    };
    AccountBlockClass.prototype.setPreviousAccountBlock = function (previousAccountBlock) {
        var height = previousAccountBlock && previousAccountBlock.height ? previousAccountBlock.height : '';
        height = height ? new BigNumber(height).add(new BigNumber(1)).toString() : '1';
        this.setHeight(height);
        var previousHash = previousAccountBlock && previousAccountBlock.hash ? previousAccountBlock.hash : utils_1.Default_Hash;
        this.setPreviousHash(previousHash);
        return this;
    };
    AccountBlockClass.prototype.autoSetPreviousAccountBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var previousAccountBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getPreviousAccountBlock()];
                    case 1:
                        previousAccountBlock = _a.sent();
                        this.setPreviousAccountBlock(previousAccountBlock);
                        return [2, {
                                height: this.height,
                                previousHash: this.previousHash
                            }];
                }
            });
        });
    };
    AccountBlockClass.prototype.getDifficulty = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        err = vitejs_utils_1.checkParams(this.accountBlock, ['previousHash']);
                        if (err) {
                            throw err;
                        }
                        return [4, this.provider.request('ledger_getPoWDifficulty', {
                                address: this.address,
                                previousHash: this.previousHash,
                                blockType: this.blockType,
                                toAddress: this.toAddress,
                                data: this.data
                            })];
                    case 1:
                        result = _a.sent();
                        return [2, result.difficulty];
                }
            });
        });
    };
    AccountBlockClass.prototype.setDifficulty = function (difficulty) {
        this.difficulty = difficulty;
        return this;
    };
    AccountBlockClass.prototype.autoSetDifficulty = function () {
        return __awaiter(this, void 0, void 0, function () {
            var difficulty;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getDifficulty()];
                    case 1:
                        difficulty = _a.sent();
                        this.setDifficulty(difficulty);
                        return [2, this.difficulty];
                }
            });
        });
    };
    AccountBlockClass.prototype.getNonce = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err, getNonceHashBuffer, getNonceHash, nonce;
            return __generator(this, function (_a) {
                err = vitejs_utils_1.checkParams({
                    difficulty: this.difficulty,
                    previousHash: this.previousHash
                }, ['difficulty', 'previousHash']);
                if (err) {
                    throw err;
                }
                getNonceHashBuffer = Buffer.from(this.originalAddress + this.previousHash, 'hex');
                getNonceHash = blake.blake2bHex(getNonceHashBuffer, null, 32);
                nonce = this.provider.request('util_getPoWNonce', this.difficulty, getNonceHash);
                return [2, nonce];
            });
        });
    };
    AccountBlockClass.prototype.setNonce = function (nonce) {
        this.nonce = nonce;
        return this;
    };
    AccountBlockClass.prototype.autoSetNonce = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.difficulty) {
                            return [2, this.nonce];
                        }
                        return [4, this.getNonce()];
                    case 1:
                        nonce = _a.sent();
                        this.setNonce(nonce);
                        return [2, this.nonce];
                }
            });
        });
    };
    AccountBlockClass.prototype.PoW = function (difficulty) {
        return __awaiter(this, void 0, void 0, function () {
            var _difficulty, _a;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = difficulty;
                        if (_a) return [3, 2];
                        return [4, this.getDifficulty()];
                    case 1:
                        _a = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _difficulty = _a;
                        this.setDifficulty(_difficulty);
                        return [4, this.autoSetNonce()];
                    case 3:
                        _c.sent();
                        return [2, {
                                difficulty: this.difficulty,
                                nonce: this.nonce
                            }];
                }
            });
        });
    };
    AccountBlockClass.prototype.setPublicKey = function (publicKey) {
        var err = vitejs_utils_1.checkParams({ publicKey: publicKey }, ['publicKey'], [{
                name: 'publicKey',
                func: function (_p) { return vitejs_utils_1.isHexString(_p) || vitejs_utils_1.isBase64String(_p); },
                msg: 'PublicKey is Hex-string or Base64-string'
            }]);
        if (err) {
            throw err;
        }
        var publicKeyBase64 = vitejs_utils_1.isBase64String(publicKey)
            ? publicKey
            : Buffer.from("" + publicKey, 'hex').toString('base64');
        var publicKeyHex = vitejs_utils_1.isBase64String(publicKey)
            ? Buffer.from("" + publicKey, 'base64').toString('hex')
            : publicKey;
        var address = address_1.getAddressFromPublicKey(publicKeyHex);
        if (this.address !== address) {
            throw new Error('PublicKey is wrong.');
        }
        this.publicKey = publicKeyBase64;
        return this;
    };
    AccountBlockClass.prototype.setSignature = function (signature) {
        var err = vitejs_utils_1.checkParams({ signature: signature }, ['signature'], [{
                name: 'signature',
                func: function (_s) { return vitejs_utils_1.isHexString(_s) || vitejs_utils_1.isBase64String(_s); },
                msg: 'Signature is Hex-string or Base64-string'
            }]);
        if (err) {
            throw err;
        }
        if (vitejs_utils_1.isBase64String(signature)) {
            this.signature = signature;
            return this;
        }
        this.signature = Buffer.from(signature, 'hex').toString('base64');
        return this;
    };
    AccountBlockClass.prototype.sign = function (privateKey) {
        if (privateKey === void 0) { privateKey = this.privateKey; }
        var _a = utils_1.signAccountBlock(this.accountBlock, privateKey), signature = _a.signature, publicKey = _a.publicKey;
        this.setPublicKey(publicKey);
        this.setSignature(signature);
        return this;
    };
    AccountBlockClass.prototype.send = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        err = utils_1.checkAccountBlock(this.accountBlock);
                        if (err) {
                            throw err;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.provider.request('ledger_sendRawTransaction', this.accountBlock)];
                    case 2:
                        res = _a.sent();
                        return [2, res || this.accountBlock];
                    case 3:
                        err_1 = _a.sent();
                        err_1.acccountBlock = this.accountBlock;
                        throw err_1;
                    case 4: return [2];
                }
            });
        });
    };
    AccountBlockClass.prototype.sendByPoW = function (privateKey) {
        if (privateKey === void 0) { privateKey = this.privateKey; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.PoW()];
                    case 1:
                        _a.sent();
                        return [2, this.sign(privateKey).send()];
                }
            });
        });
    };
    AccountBlockClass.prototype.autoSendByPoW = function (privateKey) {
        if (privateKey === void 0) { privateKey = this.privateKey; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.autoSetPreviousAccountBlock()];
                    case 1:
                        _a.sent();
                        return [4, this.PoW()];
                    case 2:
                        _a.sent();
                        return [2, this.sign(privateKey).send()];
                }
            });
        });
    };
    AccountBlockClass.prototype.autoSend = function (privateKey) {
        if (privateKey === void 0) { privateKey = this.privateKey; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.autoSetPreviousAccountBlock()];
                    case 1:
                        _a.sent();
                        return [2, this.sign(privateKey).send()];
                }
            });
        });
    };
    return AccountBlockClass;
}());
exports.AccountBlock = AccountBlockClass;
exports.default = AccountBlockClass;
