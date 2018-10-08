"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(require("../../libs/utils"));

var _address = _interopRequireDefault(require("../address.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uuid = require('pure-uuid');

var scryptsy = require('scryptsy');

var nacl = require('../../libs/nacl_blake2b');

var crypto = typeof window !== 'undefined' ? require('browserify-aes') : require('crypto');
var versions = [1];
var algorithms = ['aes-256-gcm'];
var scryptName = 'scrypt';
var additionData = Buffer.from('vite');
var privKeyLen = 64;

var keystore =
/*#__PURE__*/
function () {
  function keystore() {
    _classCallCheck(this, keystore);

    this.keystoreVersion = 1; // LightScryptN is the N parameter of Scrypt encryption algorithm, using 4MB
    // memory and taking approximately 100ms CPU time on a modern processor.

    this.n = 4096; // LightScryptP is the P parameter of Scrypt encryption algorithm, using 4MB
    // memory and taking approximately 100ms CPU time on a modern processor.

    this.p = 6;
    this.scryptR = 8;
    this.scryptKeyLen = 32;
    this.algorithm = 'aes-256-gcm';
  }

  _createClass(keystore, [{
    key: "encrypt",
    value: function encrypt(key, pwd) {
      var scryptParams = {
        n: this.n,
        r: this.scryptR,
        p: this.p,
        keylen: this.scryptKeyLen,
        salt: _utils.default.bytesToHex(nacl.randomBytes(32))
      };
      var encryptPwd = encryptKey(pwd, scryptParams);
      var nonce = nacl.randomBytes(12);
      var text = cipherText({
        hexData: key.privKey,
        pwd: encryptPwd,
        nonce: nonce,
        algorithm: this.algorithm
      });
      var cryptoJSON = {
        cipherName: this.algorithm,
        KDF: scryptName,
        ScryptParams: scryptParams,
        CipherText: text,
        Nonce: _utils.default.bytesToHex(nonce)
      };
      var encryptedKeyJSON = {
        hexAddress: key.hexAddr,
        crypto: cryptoJSON,
        id: new uuid(1).format(),
        keystoreversion: this.keystoreVersion,
        timestamp: new Date().getTime()
      };
      return JSON.stringify(encryptedKeyJSON).toLocaleLowerCase();
    }
  }, {
    key: "isValid",
    value: function isValid(keystore) {
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


      if (!keyJson.id || !keyJson.crypto || !keyJson.hexaddress || !keyJson.keystoreversion || !_address.default.isValidHexAddr(keyJson.hexaddress)) {
        return false;
      }

      try {
        new uuid().parse(keyJson.id);
      } catch (err) {
        console.warn(err);
        return false;
      }

      if (versions.indexOf(+keyJson.keystoreversion) === -1) {
        return false;
      } // Check cryptoJSON


      var crypto = keyJson.crypto;

      try {
        if (algorithms.indexOf(crypto.ciphername) === -1 || crypto.kdf !== scryptName || !crypto.scryptparams || !crypto.scryptparams.salt) {
          return false;
        }

        _utils.default.hexToBytes(crypto.ciphertext);

        _utils.default.hexToBytes(crypto.nonce);

        _utils.default.hexToBytes(crypto.scryptparams.salt);
      } catch (err) {
        console.warn(err);
        return false;
      }

      return keyJson;
    }
  }, {
    key: "decrypt",
    value: function decrypt(keystore, pwd) {
      var keyJson = this.isValid(keystore);

      if (!keyJson) {
        return false;
      }

      var encryptPwd = encryptKey(pwd, keyJson.crypto.scryptparams);
      var ciphertext = keyJson.crypto.ciphertext.slice(0, privKeyLen * 2);
      var tag = keyJson.crypto.ciphertext.slice(privKeyLen * 2);
      var privKey;

      try {
        var decipher = crypto.createDecipheriv(keyJson.crypto.ciphername, encryptPwd, _utils.default.hexToBytes(keyJson.crypto.nonce));
        decipher.setAuthTag(_utils.default.hexToBytes(tag));
        decipher.setAAD(additionData);
        privKey = decipher.update(_utils.default.hexToBytes(ciphertext), 'utf8', 'hex');
        privKey += decipher.final('hex');
      } catch (err) {
        console.warn(err);
        return false;
      }

      return privKey;
    }
  }]);

  return keystore;
}();

var _default = keystore;
exports.default = _default;

function encryptKey(pwd, scryptParams) {
  var pwdBuff = Buffer.from(pwd);

  var salt = _utils.default.hexToBytes(scryptParams.salt);

  salt = Buffer.from(salt);
  return scryptsy(pwdBuff, salt, +scryptParams.n, +scryptParams.r, +scryptParams.p, +scryptParams.keylen);
}

function cipherText(_ref) {
  var hexData = _ref.hexData,
      pwd = _ref.pwd,
      nonce = _ref.nonce,
      algorithm = _ref.algorithm;
  var cipher = crypto.createCipheriv(algorithm, pwd, nonce);
  cipher.setAAD(additionData);
  var ciphertext = cipher.update(_utils.default.hexToBytes(hexData), 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  var tag = cipher.getAuthTag().toString('hex');
  return ciphertext + tag;
}