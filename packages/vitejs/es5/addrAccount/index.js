"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var privToAddr = require("./../privtoaddr");
var vitejs_constant_1 = require("./../constant");
var AddrAccountClass = (function () {
    function AddrAccountClass(_a) {
        var _b = _a === void 0 ? { address: null, client: null } : _a, address = _b.address, client = _b.client;
        if (!privToAddr.isValidHexAddr(address)) {
            throw new Error("Illegal address " + address + ".");
        }
        this.address = address;
        this.realAddress = privToAddr.getAddrFromHexAddr(this.address);
        this._client = client;
        this.getBlock = {};
        this._setMethodBlock();
    }
    AddrAccountClass.prototype.callOffChainContract = function (_a) {
        var abi = _a.abi, offChainCode = _a.offChainCode;
        return this._client.callOffChainContract({
            addr: this.address,
            abi: abi,
            offChainCode: offChainCode
        });
    };
    AddrAccountClass.prototype.getBalance = function () {
        return this._client.getBalance(this.address);
    };
    AddrAccountClass.prototype.getTxList = function (_a) {
        var index = _a.index, _b = _a.pageCount, pageCount = _b === void 0 ? 50 : _b, _c = _a.totalNum, totalNum = _c === void 0 ? null : _c;
        return this._client.getTxList({ addr: this.address, index: index, pageCount: pageCount, totalNum: totalNum });
    };
    AddrAccountClass.prototype.getOnroad = function () {
        return this._client.onroad.getOnroadInfoByAddress(this.address);
    };
    AddrAccountClass.prototype.getOnroadBlocks = function (_a) {
        var index = _a.index, _b = _a.pageCount, pageCount = _b === void 0 ? 50 : _b;
        return this._client.onroad.getOnroadBlocksByAddress(this.address, index, pageCount);
    };
    AddrAccountClass.prototype.getBlocks = function (_a) {
        var index = _a.index, _b = _a.pageCount, pageCount = _b === void 0 ? 50 : _b;
        return this._client.ledger.getBlocksByAccAddr(this.address, index, pageCount);
    };
    AddrAccountClass.prototype.getAccountBalance = function () {
        return this._client.ledger.getAccountByAccAddr(this.address);
    };
    AddrAccountClass.prototype.getLatestBlock = function () {
        return this._client.ledger.getLatestBlock(this.address);
    };
    AddrAccountClass.prototype.getBlockByHeight = function (height) {
        return this._client.ledger.getBlockByHeight(this.address, height);
    };
    AddrAccountClass.prototype.getBlocksByHash = function (_a) {
        var hash = _a.hash, num = _a.num;
        return this._client.ledger.getBlocksByHash(this.address, hash, num);
    };
    AddrAccountClass.prototype.getBlocksByHashInToken = function (_a) {
        var hash = _a.hash, tokenId = _a.tokenId, num = _a.num;
        return this._client.ledger.getBlocksByHashInToken(this.address, hash, tokenId, num);
    };
    AddrAccountClass.prototype.getPledgeQuota = function () {
        return this._client.pledge.getPledgeQuota(this.address);
    };
    AddrAccountClass.prototype.getPledgeList = function (_a) {
        var index = _a.index, pageCount = _a.pageCount;
        return this._client.pledge.getPledgeList(this.address, index, pageCount);
    };
    AddrAccountClass.prototype.getRegistrationList = function () {
        return this._client.register.getRegistrationList(vitejs_constant_1.Snapshot_Gid, this.address);
    };
    AddrAccountClass.prototype.getVoteInfo = function () {
        return this._client.vote.getVoteInfo(vitejs_constant_1.Snapshot_Gid, this.address);
    };
    AddrAccountClass.prototype.getTokenInfoListByOwner = function () {
        return this._client.mintage.getTokenInfoListByOwner(this.address);
    };
    AddrAccountClass.prototype._setMethodBlock = function () {
        var _this = this;
        var _loop_1 = function (key) {
            if (key === '_client') {
                return "continue";
            }
            this_1.getBlock[key] = function (block, requestType) {
                block = block || {};
                block.accountAddress = _this.address;
                return _this._client.builtinTxBlock[key](block, requestType);
            };
        };
        var this_1 = this;
        for (var key in this._client.builtinTxBlock) {
            _loop_1(key);
        }
    };
    return AddrAccountClass;
}());
exports.addrAccount = AddrAccountClass;
exports.default = AddrAccountClass;
