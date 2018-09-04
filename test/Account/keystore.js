// const assert = require('assert');
// import vitejs from '../../index.js';

// const HTTP_RPC = new vitejs.HTTP_RPC({});
// const ViteJS = new vitejs(HTTP_RPC);

// describe('Account_getKeystore', function () {
//     it('test', function () {
//         // let privKey = 'afa2a3ab3347b5bbe210dc099b2e010e5491d698e5112db6bc278cfd8fa27eb9f0fde0110193147e7961e61eeb22576c535b3442fd6bd9c457775e0cc69f1951';
//         // let k = ViteJS.Vite.Account.newHexAddress(privKey);
//         // let keystore = ViteJS.Vite.Account.encryptKeystore(k, '1');

//         // assert.equal(k.privKey, privKey);
//     });
// });

// describe('Account_decryptKeystore', function () {
//     // {
//     //     "hexaddress":"vite_1cf844d09103f9fef29b8cfef9855f6da3a5839f8753902315",
//     //     "id":"4344d2ea-ef82-4153-9f6a-3d97df6c4607",
//     //     "crypto":{
//     //         "ciphername":"aes-256-gcm",
//     //         "ciphertext":"ed5170ef14b9d06b3d97d1e940de74b43396d5f2542391a161721624a8f62e04bfc0586eabe5a204cd8fb3ef3030d86bef6df53398b7f1b071360284b60f18b65c711d6acc8f941fcd8feb6395333657",
//     //         "nonce":"a683d77d04999a67e0bdeef2",
//     //         "kdf":"scrypt",
//     //         "scryptparams":{
//     //             "n":262144,
//     //             "r":8,
//     //             "p":1,
//     //             "keylen":32,
//     //             "salt":"e95a65568815f652a4f2458972e9971e350e844a66797e177103cf930756a014"
//     //         }
//     //     },
//     //     "keystoreversion":1,
//     //     "timestamp":1535965431
//     // }

//     it('test', function () {
//         let nonce = 'a683d77d04999a67e0bdeef2';
//         let ciphertext = 'ed5170ef14b9d06b3d97d1e940de74b43396d5f2542391a161721624a8f62e04bfc0586eabe5a204cd8fb3ef3030d86bef6df53398b7f1b071360284b60f18b65c711d6acc8f941fcd8feb6395333657';
        
//     });
// });

// describe('Account_isValidKeystore', function() {
//     let keystore = ViteJS.Vite.Types.isValidKeystore();

// });

// // describe('Account_isValidHexAddr', function () {
// //     it('test', function () {
// //         let privKey = '3e07a131ef776640970bd4a2000202c04740c53bccb9ca9f76435d8967a459c496330193fc5bb0e3918a626a18205261f8715bfba6da4cf639e5654238d1a73e';
// //         let k = ViteJS.Vite.Account.newHexAddress(privKey);
// //         assert.equal( ViteJS.Vite.Types.isValidHexAddress(k.hexAddr), true );
// //     });
// // });
