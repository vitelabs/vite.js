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

var crypto = typeof window !== 'undefined' ? require('browserify-aes') : require('crypto');
var loopTime = 2000;
var scryptName = 'scrypt';
var len = 64;
var versions = [1, 2];
var algorithms = ['aes-256-gcm'];

var Account =
/*#__PURE__*/
function () {
  function Account(Vite) {
    _classCallCheck(this, Account);

    this.Vite = Vite;
    this.addrList = [];
    this.version = 2; // LightScryptN is the N parameter of Scrypt encryption algorithm, using 4MB
    // memory and taking approximately 100ms CPU time on a modern processor.

    this.n = 4096; // LightScryptP is the P parameter of Scrypt encryption algorithm, using 4MB
    // memory and taking approximately 100ms CPU time on a modern processor.

    this.p = 6;
    this.scryptR = 8;
    this.scryptKeyLen = 32;
    this.algorithm = 'aes-256-gcm';
  }

  _createClass(Account, [{
    key: "getUnLockAddrList",
    value: function getUnLockAddrList() {
      return this.addrList;
    }
  }, {
    key: "autoReceiveTX",
    value: function autoReceiveTX(address, privKey) {
      this.addrList = this.addrList || [];

      if (this.addrList.indexOf(address) >= 0) {
        return;
      }

      this.addrList.push(address);
      loopAddr.call(this, address, privKey);
    }
  }, {
    key: "stopAutoReceiveTX",
    value: function stopAutoReceiveTX(address) {
      var i = this.addrList.indexOf(address);

      if (i < 0) {
        return;
      }

      this.addrList.splice(i, 1);
    }
  }, {
    key: "receiveTx",
    value: function receiveTx(address, privKey) {
      var _this = this;

      return new Promise(function (res, rej) {
        _this.Vite.Ledger.getReceiveBlock(address).then(function (accountBlock) {
          if (!accountBlock) {
            return res();
          }

          var _this$Vite$Account$si = _this.Vite.Account.signTX(accountBlock, privKey),
              hash = _this$Vite$Account$si.hash,
              signature = _this$Vite$Account$si.signature,
              pubKey = _this$Vite$Account$si.pubKey;

          accountBlock.hash = hash;
          accountBlock.publicKey = Buffer.from(pubKey).toString('base64');
          accountBlock.signature = Buffer.from(signature).toString('base64');

          _this.Vite['tx_sendRawTx'](accountBlock).then(function (data) {
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
      var _this2 = this;

      var fromAddr = _ref.fromAddr,
          toAddr = _ref.toAddr,
          tokenId = _ref.tokenId,
          amount = _ref.amount,
          message = _ref.message;

      if (!this.Vite.Account.isValidHexAddr(fromAddr)) {
        return Promise.reject('FromAddr error');
      }

      if (!this.Vite.Account.isValidHexAddr(toAddr)) {
        return Promise.reject('ToAddr error');
      }

      if (!amount) {
        return Promise.reject('Amount error');
      }

      return new Promise(function (res, rej) {
        _this2.Vite.Ledger.getSendBlock({
          fromAddr: fromAddr,
          toAddr: toAddr,
          tokenId: tokenId,
          amount: amount,
          message: message
        }).then(function (accountBlock) {
          var _this2$Vite$Account$s = _this2.Vite.Account.signTX(accountBlock, privKey),
              hash = _this2$Vite$Account$s.hash,
              signature = _this2$Vite$Account$s.signature,
              pubKey = _this2$Vite$Account$s.pubKey;

          accountBlock.hash = hash;
          accountBlock.publicKey = Buffer.from(pubKey).toString('base64');
          accountBlock.signature = Buffer.from(signature).toString('base64');

          _this2.Vite['tx_sendRawTx'](accountBlock).then(function (data) {
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
    value: function encrypt(key, pwd, scryptP) {
      var scryptParams = scryptP && scryptP.scryptParams ? scryptP.scryptParams : {
        n: scryptP && scryptP.n ? scryptP.n : this.n,
        r: scryptP && scryptP.r ? scryptP.r : this.scryptR,
        p: scryptP && scryptP.p ? scryptP.p : this.p,
        keylen: scryptP && scryptP.keylen ? scryptP.keylen : this.scryptKeyLen,
        salt: scryptP && scryptP.salt ? scryptP.salt : _utils.default.bytesToHex(nacl.randomBytes(32))
      };
      var encryptPwd = scryptP && scryptP.encryptPwd ? _utils.default.hexToBytes(scryptP.encryptPwd) : encryptKey(pwd, scryptParams);
      var nonce = nacl.randomBytes(12);
      var encryptEntropy = cipherText({
        hexData: key,
        pwd: encryptPwd,
        nonce: nonce,
        algorithm: this.algorithm
      });
      var cryptoJSON = {
        cipherName: this.algorithm,
        KDF: scryptName,
        salt: scryptParams.salt,
        Nonce: _utils.default.bytesToHex(nonce)
      };
      var encryptedKeyJSON = {
        encryptEntropy: encryptEntropy,
        crypto: cryptoJSON,
        version: this.version,
        timestamp: new Date().getTime()
      };
      return JSON.stringify(encryptedKeyJSON).toLocaleLowerCase();
    }
  }, {
    key: "decrypt",
    value: function decrypt(keystore, pwd) {
      var keyJson = isValid(keystore);

      if (!keyJson) {
        return false;
      }

      var scryptParams = {
        n: keystore.scryptParams ? keystore.scryptParams.n || this.n : this.n,
        r: keystore.scryptParams ? keystore.scryptParams.scryptR || this.scryptR : this.scryptR,
        p: keystore.scryptParams ? keystore.scryptParams.p || this.p : this.p,
        keylen: keystore.scryptParams ? keystore.scryptParams.scryptKeyLen || this.scryptKeyLen : this.scryptKeyLen,
        salt: keyJson.crypto.salt
      };
      var encryptPwd = encryptKey(pwd, scryptParams);
      var ciphertext = keyJson.encryptentropy.slice(0, len);
      var tag = keyJson.encryptentropy.slice(len);
      var entropy;

      try {
        var decipher = crypto.createDecipheriv(keyJson.crypto.ciphername, encryptPwd, _utils.default.hexToBytes(keyJson.crypto.nonce));
        decipher.setAuthTag(_utils.default.hexToBytes(tag));
        entropy = decipher.update(_utils.default.hexToBytes(ciphertext), 'utf8', 'hex');
        entropy += decipher.final('hex');
      } catch (err) {
        console.warn(err);
        return false;
      }

      return entropy;
    }
  }, {
    key: "verify",
    value: function verify(scryptP, str) {
      if (!isValidVersion1.call(this, scryptP)) {
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

function loopAddr(address, privKey) {
  var _this3 = this;

  if (this.addrList.indexOf(address) < 0) {
    return;
  }

  var loop = function loop() {
    var loopTimeout = setTimeout(function () {
      clearTimeout(loopTimeout);
      loopTimeout = null;
      loopAddr.call(_this3, address, privKey);
    }, loopTime);
  };

  this.receiveTx(address, privKey).then(function () {
    loop();
  }).catch(function (err) {
    console.warn(err);
    loop();
  });
}

function encryptKey(pwd, scryptParams) {
  var pwdBuff = Buffer.from(pwd);

  var salt = _utils.default.hexToBytes(scryptParams.salt);

  salt = Buffer.from(salt);
  return scryptsy(pwdBuff, salt, +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen);
}

function isValidVersion1(scryptP) {
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

function isValid(keystore) {
  // Out keystore file size is about 500 so if a file is very large it must not be a keystore file
  if (_utils.default.getBytesSize(keystore) > 2 * 1024) {
    return false;
  } // Must be a JSON-string


  var keyJson = {};

  try {
    keyJson = JSON.parse(keystore.toLowerCase());
  } catch (err) {
    console.warn(err);
    return false;
  } // Required parameter


  if (!keyJson.crypto || !keyJson.encryptentropy || !keyJson.version) {
    return false;
  }

  if (versions.indexOf(+keyJson.version) === -1) {
    return false;
  } // Check cryptoJSON


  var crypto = keyJson.crypto;

  try {
    if (algorithms.indexOf(crypto.ciphername) === -1 || crypto.kdf !== scryptName || !crypto.salt) {
      return false;
    }

    _utils.default.hexToBytes(keyJson.encryptentropy);

    _utils.default.hexToBytes(crypto.nonce);

    _utils.default.hexToBytes(crypto.salt);
  } catch (err) {
    console.warn(err);
    return false;
  }

  return keyJson;
}

function cipherText(_ref2) {
  var hexData = _ref2.hexData,
      pwd = _ref2.pwd,
      nonce = _ref2.nonce,
      algorithm = _ref2.algorithm;
  var cipher = crypto.createCipheriv(algorithm, pwd, nonce);
  var ciphertext = cipher.update(_utils.default.hexToBytes(hexData), 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  var tag = cipher.getAuthTag().toString('hex');
  return ciphertext + tag;
}