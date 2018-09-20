// const assert = require('assert');
// import vitejs from '../../index.js';

// const HTTP_RPC = new vitejs.HTTP_RPC({});
// const ViteJS = new vitejs(HTTP_RPC);
// const Account = ViteJS.Vite.Account;

// describe('Vite_Account', function () {
//     let accountBlock = {
//         'to':'vite_18068b64b49852e1c4dfbc304c4e606011e068836260bc9975',
//         'publicKey':'36105734843edfec74185bea38d0dbb30d0b213d07a75c3cc903c4c1ce333f5f',
//         'amount':'1000000000000000000',
//         'prevHash':'1500d077ed8c82d899a6c73a85b4569442baf56a7178f5d98e2c60abe3da4e60',
//         'data':'',
//         'tokenId':'tti_000000000000000000004cfd',
//         'nonce':'0000000000',
//         'difficulty':'0000000000',
//         'meta':{
//             'height':'28'
//         },
//         'accountAddress':'vite_4827fbc6827797ac4d9e814affb34b4c5fa85d39bf96d105e7',
//         'snapshotTimestamp':'740b09b9b940a9eb33223ba2b7a70798754f7ddcd8762daa3f6d96a7c8c3ec61',
//         'fromHash':'1500d077ed8c82d899a6c73a85b4569442baf56a7178f5d98e2c60abe3da4e60',
//     };
//     let privKey = 'ddbe2b5d3744db659fdb049e7b841bdbdf93ce304c62212ce59a3e4727e594f136105734843edfec74185bea38d0dbb30d0b213d07a75c3cc903c4c1ce333f5f';
    
//     it('test_signTX', function () {
//         let { hash, signature } = Account.signTX(accountBlock, privKey);
//         assert.equal(hash, '03b312c4435c7bc0a640bfddaefbd27141681907da22022d99e409cf28ddc732');
//         assert.equal(signature, '513b4af815fda75a1aa5595dc618ab60b8aa860a9d66afea97e9c4ae865b371688ae5daaf6a3060c60416b9de7c56d22c0607a2a45149fc9048de5bebf290a04');
//     });
// });
