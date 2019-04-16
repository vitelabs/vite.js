"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var privToAddr = require("./../privtoaddr");
var vitejs_constant_1 = require("./../constant");
var AddrAccount = (function () {
    function AddrAccount(_a) {
        var _b = _a === void 0 ? { address: null, client: null } : _a, address = _b.address, client = _b.client;
        if (!privToAddr.isValidHexAddr(address)) {
            throw new Error("Illegal address " + address + ".");
        }
        this.address = address;
        this.realAddress = privToAddr.getAddrFromHexAddr(this.address);
        this._client = client;
    }
    AddrAccount.prototype.getBalance = function () {
        return this._client.getBalance(this.address);
    };
    AddrAccount.prototype.getOnroad = function () {
        return this._client.onroad.getAccountOnroadInfo(this.address);
    };
    AddrAccount.prototype.getOnroadBlocks = function (_a) {
        var index = _a.index, _b = _a.pageCount, pageCount = _b === void 0 ? 50 : _b;
        return this._client.onroad.getOnroadBlocksByAddress(this.address, index, pageCount);
    };
    AddrAccount.prototype.getBlocks = function (_a) {
        var index = _a.index, _b = _a.pageCount, pageCount = _b === void 0 ? 50 : _b;
        return this._client.ledger.getBlocksByAccAddr(this.address, index, pageCount);
    };
    AddrAccount.prototype.getAccountBalance = function () {
        return this._client.ledger.getAccountByAccAddr(this.address);
    };
    AddrAccount.prototype.getLatestBlock = function () {
        return this._client.ledger.getLatestBlock(this.address);
    };
    AddrAccount.prototype.getBlockByHeight = function (height) {
        return this._client.ledger.getBlockByHeight(this.address, height);
    };
    AddrAccount.prototype.getBlocksByHash = function (_a) {
        var hash = _a.hash, num = _a.num;
        return this._client.ledger.getBlocksByHash(this.address, hash, num);
    };
    AddrAccount.prototype.getBlocksByHashInToken = function (_a) {
        var hash = _a.hash, tokenId = _a.tokenId, num = _a.num;
        return this._client.ledger.getBlocksByHashInToken(this.address, hash, tokenId, num);
    };
    AddrAccount.prototype.getFittestSnapshotHash = function (sendblockHash) {
        return this._client.ledger.getFittestSnapshotHash(this.address, sendblockHash);
    };
    AddrAccount.prototype.getPledgeQuota = function () {
        return this._client.pledge.getPledgeQuota(this.address);
    };
    AddrAccount.prototype.getPledgeList = function (_a) {
        var index = _a.index, pageCount = _a.pageCount;
        return this._client.pledge.getPledgeList(this.address, index, pageCount);
    };
    AddrAccount.prototype.getRegistrationList = function () {
        return this._client.register.getRegistrationList(vitejs_constant_1.Snapshot_Gid, this.address);
    };
    AddrAccount.prototype.getVoteInfo = function () {
        return this._client.vote.getVoteInfo(vitejs_constant_1.Snapshot_Gid, this.address);
    };
    AddrAccount.prototype.getTxList = function (_a) {
        var index = _a.index, _b = _a.pageCount, pageCount = _b === void 0 ? 50 : _b, _c = _a.totalNum, totalNum = _c === void 0 ? null : _c;
        return this._client.getTxList({ addr: this.address, index: index, pageCount: pageCount, totalNum: totalNum });
    };
    return AddrAccount;
}());
exports.default = AddrAccount;
