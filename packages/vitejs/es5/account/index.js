"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var privToAddr = require("./../privtoaddr");
var vitejs_error_1 = require("./../error");
var vitejs_utils_1 = require("./../utils");
var vitejs_addraccount_1 = require("./../addraccount");
var vitejs_accountblock_1 = require("./../accountblock");
var sign = vitejs_utils_1.ed25519.sign, getPublicKey = vitejs_utils_1.ed25519.getPublicKey;
var AccountClass = (function (_super) {
    __extends(AccountClass, _super);
    function AccountClass(_b, _c) {
        var privateKey = _b.privateKey, client = _b.client, address = _b.address;
        var _d = _c === void 0 ? { autoPow: false, usePledgeQuota: true } : _c, _e = _d.autoPow, autoPow = _e === void 0 ? false : _e, _f = _d.usePledgeQuota, usePledgeQuota = _f === void 0 ? true : _f;
        var _this = this;
        if (!client) {
            throw new Error(vitejs_error_1.paramsMissing.message + " Client.");
        }
        if (!privateKey && address) {
            _this = _super.call(this, { address: address, client: client }) || this;
            _this.privateKey = null;
            _this.publicKey = null;
        }
        else {
            var _g = privToAddr.newHexAddr(privateKey), pubKey = _g.pubKey, privKey = _g.privKey, hexAddr = _g.hexAddr;
            if (privateKey && address && hexAddr !== address) {
                throw new Error("Private key does not match address " + address);
            }
            _this = _super.call(this, { address: hexAddr, client: client }) || this;
            _this.privateKey = privKey;
            _this.publicKey = pubKey;
        }
        _this._lock = true;
        _this._autoReceive = false;
        _this.balance = null;
        _this.autoPow = autoPow;
        _this.usePledgeQuota = usePledgeQuota;
        _this._setTxMethod();
        return _this;
    }
    AccountClass.prototype.clearPrivateKey = function () {
        this.freeze();
        this.privateKey = null;
        this.publicKey = null;
    };
    AccountClass.prototype.setPrivateKey = function (privateKey) {
        if (this.privateKey) {
            return;
        }
        var _b = privToAddr.newHexAddr(privateKey), pubKey = _b.pubKey, privKey = _b.privKey, hexAddr = _b.hexAddr;
        if (hexAddr !== this.address) {
            throw new Error("Private key does not match address " + this.address);
        }
        this.privateKey = privKey;
        this.publicKey = pubKey;
    };
    AccountClass.prototype.getPublicKey = function () {
        if (!this.privateKey) {
            throw new Error('Please set privateKey before calling this method');
        }
        if (this.publicKey) {
            return Buffer.from(this.publicKey, 'hex');
        }
        var privKey = Buffer.from(this.privateKey, 'hex');
        return getPublicKey(privKey);
    };
    AccountClass.prototype.sign = function (hexStr) {
        if (!this.privateKey) {
            throw new Error('Please set privateKey before calling this method');
        }
        var privKey = Buffer.from(this.privateKey, 'hex');
        return sign(hexStr, privKey);
    };
    AccountClass.prototype.signAccountBlock = function (accountBlock) {
        var _this = this;
        if (!this.privateKey) {
            throw new Error('Please set privateKey before calling this method');
        }
        vitejs_utils_1.checkParams({ accountBlock: accountBlock }, ['accountBlock'], [{
                name: 'accountBlock',
                func: function (_a) { return !_a.accountAddress || (_a.accountAddress === _this.address); },
                msg: 'AccountAddress is wrong.'
            }]);
        accountBlock.accountAddress = this.address;
        return vitejs_accountblock_1.signAccountBlock(accountBlock, this.privateKey);
    };
    AccountClass.prototype.activate = function (intervals, autoPow, usePledgeQuota) {
        var _this = this;
        if (intervals === void 0) { intervals = 2000; }
        if (!this.privateKey) {
            throw new Error('Please set privateKey before calling this method');
        }
        if (!this._lock) {
            return;
        }
        this._lock = false;
        var loop = function () {
            if (_this._lock) {
                return;
            }
            var _t = function () {
                var loopTimeout = setTimeout(function () {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                    loop();
                }, intervals);
            };
            _this.getBalance().then(function (balance) {
                _this.balance = balance;
                var onroad = _this.balance && _this.balance.onroad ? _this.balance.onroad : null;
                var balanceInfos = onroad && onroad.tokenBalanceInfoMap ? onroad.tokenBalanceInfoMap : null;
                _t();
                if (balanceInfos) {
                    _this.autoReceiveTx(intervals, autoPow, usePledgeQuota);
                    return;
                }
                _this.stopAutoReceiveTx();
            }).catch(function () {
                _t();
            });
        };
        loop();
    };
    AccountClass.prototype.freeze = function () {
        this._lock = true;
    };
    AccountClass.prototype.autoReceiveTx = function (intervals, autoPow, usePledgeQuota) {
        var _this = this;
        if (intervals === void 0) { intervals = 2000; }
        if (!this.privateKey) {
            throw new Error('Please set privateKey before calling this method');
        }
        if (this._autoReceive) {
            return;
        }
        this._autoReceive = true;
        var _receive = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, fromBlockHash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.getOnroadBlocks({
                            index: 0,
                            pageCount: 1
                        })];
                    case 1:
                        result = _b.sent();
                        if (!result || !result.length) {
                            return [2, null];
                        }
                        fromBlockHash = result[0].hash;
                        return [2, this['receiveTx']({ fromBlockHash: fromBlockHash }, autoPow, usePledgeQuota)];
                }
            });
        }); };
        var loop = function () {
            if (!_this._autoReceive) {
                return;
            }
            var _t = function () {
                var loopTimeout = setTimeout(function () {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                    loop();
                }, intervals);
            };
            _receive().then(function () {
                _t();
            }).catch(function () {
                _t();
            });
        };
        loop();
    };
    AccountClass.prototype.stopAutoReceiveTx = function () {
        this._autoReceive = false;
    };
    AccountClass.prototype.sendRawTx = function (accountBlock) {
        if (!this.privateKey) {
            throw new Error('Please set privateKey before calling this method');
        }
        return this._client.sendTx(accountBlock, this.privateKey);
    };
    AccountClass.prototype.sendAutoPowRawTx = function (accountBlock, usePledgeQuota) {
        if (!this.privateKey) {
            throw new Error('Please set privateKey before calling this method');
        }
        var _usePledgeQuota = usePledgeQuota === true || usePledgeQuota === false ? usePledgeQuota : !!this.usePledgeQuota;
        return this._client.sendAutoPowTx({
            accountBlock: accountBlock,
            privateKey: this.privateKey,
            usePledgeQuota: _usePledgeQuota
        });
    };
    AccountClass.prototype.sendPowTx = function (_b) {
        var methodName = _b.methodName, params = _b.params, beforeCheckPow = _b.beforeCheckPow, beforePow = _b.beforePow, beforeSignTx = _b.beforeSignTx, beforeSendTx = _b.beforeSendTx;
        return __awaiter(this, void 0, void 0, function () {
            var _c, lifeCycle, checkPowResult, accountBlock, checkFunc, _beforePow, powFunc, _beforeSignTx, signTx, _beforeSendTx, sendTxFunc, result;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.privateKey) {
                            throw new Error('Please set privateKey before calling this method');
                        }
                        lifeCycle = 'start';
                        return [4, (_c = this.getBlock)[methodName].apply(_c, params)];
                    case 1:
                        accountBlock = _d.sent();
                        checkFunc = function (usePledgeQuota) {
                            if (usePledgeQuota === void 0) { usePledgeQuota = true; }
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4, this._client.tx.calcPoWDifficulty({
                                                selfAddr: accountBlock.accountAddress,
                                                prevHash: accountBlock.prevHash,
                                                blockType: accountBlock.blockType,
                                                toAddr: accountBlock.toAddress,
                                                data: accountBlock.data,
                                                usePledgeQuota: usePledgeQuota
                                            })];
                                        case 1:
                                            checkPowResult = _b.sent();
                                            lifeCycle = 'checkPowDone';
                                            if (!checkPowResult.difficulty) {
                                                return [2, _beforeSignTx()];
                                            }
                                            return [2, _beforePow()];
                                    }
                                });
                            });
                        };
                        _beforePow = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_b) {
                                if (!beforePow) {
                                    return [2, powFunc()];
                                }
                                return [2, beforePow(accountBlock, checkPowResult, powFunc)];
                            });
                        }); };
                        powFunc = function (isReject) {
                            if (isReject === void 0) { isReject = false; }
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (isReject) {
                                                return [2, { lifeCycle: lifeCycle, checkPowResult: checkPowResult, accountBlock: accountBlock }];
                                            }
                                            return [4, this._client.builtinTxBlock.pow(accountBlock, checkPowResult.difficulty)];
                                        case 1:
                                            accountBlock = _b.sent();
                                            lifeCycle = 'powDone';
                                            return [2, _beforeSignTx()];
                                    }
                                });
                            });
                        };
                        _beforeSignTx = function () {
                            if (!beforeSignTx) {
                                return signTx();
                            }
                            return beforeSignTx(accountBlock, checkPowResult, signTx);
                        };
                        signTx = function (isReject) {
                            if (isReject === void 0) { isReject = false; }
                            if (isReject) {
                                return Promise.resolve({
                                    lifeCycle: lifeCycle,
                                    checkPowResult: checkPowResult,
                                    accountBlock: accountBlock
                                });
                            }
                            accountBlock = _this.signAccountBlock(accountBlock);
                            lifeCycle = 'signDone';
                            return _beforeSendTx();
                        };
                        _beforeSendTx = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_b) {
                                if (!beforeSendTx) {
                                    return [2, sendTxFunc()];
                                }
                                return [2, beforeSendTx(accountBlock, checkPowResult, sendTxFunc)];
                            });
                        }); };
                        sendTxFunc = function (isReject) {
                            if (isReject === void 0) { isReject = false; }
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (isReject) {
                                                return [2, {
                                                        lifeCycle: lifeCycle,
                                                        checkPowResult: checkPowResult,
                                                        accountBlock: accountBlock
                                                    }];
                                            }
                                            return [4, this.sendAccountBlock(accountBlock)];
                                        case 1:
                                            _b.sent();
                                            return [2, {
                                                    lifeCycle: 'finish',
                                                    accountBlock: accountBlock,
                                                    checkPowResult: checkPowResult
                                                }];
                                    }
                                });
                            });
                        };
                        lifeCycle = 'beforeCheckPow';
                        result = beforeCheckPow ? beforeCheckPow(accountBlock, checkFunc) : checkFunc();
                        return [2, result];
                }
            });
        });
    };
    AccountClass.prototype._sendRawTx = function (accountBlock, autoPow, usePledgeQuota) {
        var _autoPow = autoPow === true || autoPow === false ? autoPow : !!this.autoPow;
        if (!_autoPow) {
            return this.sendRawTx(accountBlock);
        }
        return this.sendAutoPowRawTx(accountBlock, usePledgeQuota);
    };
    AccountClass.prototype._setTxMethod = function () {
        var _this = this;
        var _loop_1 = function (key) {
            if (key === '_client' || key.endsWith('Block')) {
                return "continue";
            }
            var _key = key;
            if (_key.startsWith('async')) {
                _key = _key.replace('async', '');
                _key = _key[0].toLocaleLowerCase() + _key.slice(1);
            }
            this_1[_key] = function (block, autoPow, usePledgeQuota) { return __awaiter(_this, void 0, void 0, function () {
                var accountBlock;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.privateKey) {
                                throw new Error('Please set privateKey before calling this method');
                            }
                            return [4, this.getBlock[key](block)];
                        case 1:
                            accountBlock = _b.sent();
                            return [2, this._sendRawTx(accountBlock, autoPow, usePledgeQuota)];
                    }
                });
            }); };
        };
        var this_1 = this;
        for (var key in this._client.builtinTxBlock) {
            _loop_1(key);
        }
    };
    return AccountClass;
}(vitejs_addraccount_1.default));
exports.account = AccountClass;
exports.default = AccountClass;
