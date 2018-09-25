"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(require("../../libs/utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nacl = require('../../libs/nacl_blake2b');

var scryptsy = require('scryptsy');

var loopTime = 2000;

var Account =
/*#__PURE__*/
function () {
  function Account(Vite) {
    _classCallCheck(this, Account);

    this.Vite = Vite;
    this.addrList = [];
    this.version = 1; // LightScryptN is the N parameter of Scrypt encryption algorithm, using 4MB
    // memory and taking approximately 100ms CPU time on a modern processor.

    this.n = 4096; // LightScryptP is the P parameter of Scrypt encryption algorithm, using 4MB
    // memory and taking approximately 100ms CPU time on a modern processor.

    this.p = 6;
    this.scryptR = 8;
    this.scryptKeyLen = 32;
  }

  _createClass(Account, [{
    key: "getUnLockAddrList",
    value: function getUnLockAddrList() {
      return this.addrList;
    }
  }, {
    key: "unlock",
    value: function unlock(address, privKey) {
      this.addrList = this.addrList || [];

      if (this.addrList.indexOf(address) >= 0) {
        return;
      }

      this.addrList.push(address);

      this._loopAddr(address, privKey);
    }
  }, {
    key: "lock",
    value: function lock(address) {
      var i = this.addrList.indexOf(address);

      if (i < 0) {
        return;
      }

      this.addrList.splice(i, 1);
    }
  }, {
    key: "_loopAddr",
    value: function _loopAddr(address, privKey) {
      var _this = this;

      if (this.addrList.indexOf(address) < 0) {
        return;
      }

      var loop = function loop() {
        var loopTimeout = setTimeout(function () {
          clearTimeout(loopTimeout);
          loopTimeout = null;

          _this._loopAddr(address, privKey);
        }, loopTime);
      };

      this.receiveTx(address, privKey).then(function () {
        loop();
      }).catch(function (err) {
        console.warn(err);
        loop();
      });
    }
  }, {
    key: "receiveTx",
    value: function receiveTx(address, privKey) {
      var _this2 = this;

      return new Promise(function (res, rej) {
        _this2.Vite.Ledger.getReceiveBlock(address).then(function (accountBlock) {
          if (!accountBlock) {
            return res();
          }

          var _this2$Vite$Account$s = _this2.Vite.Account.signTX(accountBlock, privKey),
              hash = _this2$Vite$Account$s.hash,
              signature = _this2$Vite$Account$s.signature,
              pubKey = _this2$Vite$Account$s.pubKey;

          accountBlock.publicKey = pubKey;
          accountBlock.hash = hash;
          accountBlock.signature = signature;

          _this2.Vite.Ledger.sendTx(accountBlock).then(function (data) {
            if (data && data.error) {
              return rej(data.error);
            }

            return res(data);
          }).catch(function (err) {
            return rej(err);
          });
        }).catch(function (err) {
          return rej(err);
        });
      });
    }
  }, {
    key: "sendTx",
    value: function sendTx(_ref, privKey) {
      var _this3 = this;

      var fromAddr = _ref.fromAddr,
          toAddr = _ref.toAddr,
          tokenId = _ref.tokenId,
          amount = _ref.amount,
          message = _ref.message;

      if (!this.Vite.Types.isValidHexAddr(fromAddr)) {
        return Promise.reject('fromAddr fail');
      }

      if (!this.Vite.Types.isValidHexAddr(toAddr)) {
        return Promise.reject('toAddr fail');
      }

      if (!amount) {
        return Promise.reject('amount fail');
      }

      return new Promise(function (res, rej) {
        _this3.Vite.Ledger.getSendBlock({
          fromAddr: fromAddr,
          toAddr: toAddr,
          tokenId: tokenId,
          amount: amount,
          message: message
        }).then(function (accountBlock) {
          var _this3$Vite$Account$s = _this3.Vite.Account.signTX(accountBlock, privKey),
              hash = _this3$Vite$Account$s.hash,
              signature = _this3$Vite$Account$s.signature,
              pubKey = _this3$Vite$Account$s.pubKey;

          accountBlock.publicKey = pubKey;
          accountBlock.hash = hash;
          accountBlock.signature = signature;

          _this3.Vite.Ledger.sendTx(accountBlock).then(function (data) {
            return res(data);
          }).catch(function (err) {
            return rej(err);
          });
        }).catch(function (err) {
          return rej(err);
        });
      });
    }
  }, {
    key: "encrypt",
    value: function encrypt(str) {
      var scryptParams = {
        n: this.n,
        r: this.scryptR,
        p: this.p,
        keylen: this.scryptKeyLen,
        salt: _utils.default.bytesToHex(nacl.randomBytes(32))
      };
      var encryptP = encryptKey(str, scryptParams);
      return {
        encryptP: encryptP.toString('hex'),
        scryptParams: scryptParams,
        version: this.version
      };
    }
  }, {
    key: "verify",
    value: function verify(scryptP, str) {
      if (!isValid.call(this, scryptP)) {
        return false;
      }

      var encryptP = encryptKey(str, scryptP.scryptParams);
      return encryptP.toString('hex') === scryptP.encryptP;
    }
  }]);

  return Account;
}();

var _default = Account;
exports.default = _default;

function encryptKey(pwd, scryptParams) {
  var pwdBuff = Buffer.from(pwd);

  var salt = _utils.default.hexToBytes(scryptParams.salt);

  salt = Buffer.from(salt);
  return scryptsy(pwdBuff, salt, +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen);
}

function isValid(scryptP) {
  if (!scryptP.scryptParams || !scryptP.encryptP || !scryptP.version || scryptP.version !== 1) {
    return false;
  }

  var scryptParams = scryptP.scryptParams;

  if (!scryptParams.n || !scryptParams.r || !scryptParams.p || !scryptParams.keylen || !scryptParams.salt) {
    return false;
  }

  try {
    _utils.default.hexToBytes(scryptParams.salt);
  } catch (err) {
    return false;
  }

  return true;
}