// const assert = require('assert');

// import HTTP_RPC from '../../src/HTTP';
// import Client from '../../src/client/index';
// import AddrAccount from '../../src/addrAccount/index';
// import { createAddressByPrivateKey } from '../../src/hdWallet/address';

// const addrObj = createAddressByPrivateKey();
// const myHTTPClient = new Client(new HTTP_RPC());

// const myAddrAccount = new AddrAccount({
//     address: addrObj.address,
//     client: myHTTPClient
// });

// describe('New AddrAccount: property', function () {
//     it('address', function () {
//         assert(myAddrAccount.address, addrObj.address);
//     });

//     it('realAddress', function () {
//         assert(myAddrAccount.realAddress, addrObj.realAddress);
//     });

//     it('_client', function () {
//         assert.deepEqual(myAddrAccount._client, myHTTPClient);
//     });
// });

// describe('New AddrAccount: function', function () {
//     for (const key in myHTTPClient.builtinTxBlock) {
//         if (key === '_client') {
//             continue;
//         }

//         it(`getBlock.${ key }`, function () {
//             assert(typeof myAddrAccount.getBlock[key], 'function');
//         });
//     }

//     [ 'getBalance', 'callOffChainContract', 'getTxList',
//         'getOnroad', 'getOnroadBlocks', 'getBlocks',
//         'getAccountBalance', 'getLatestBlock',
//         'getBlockByHeight', 'getBlocksByHash',
//         'getBlocksByHashInToken', 'getPledgeQuota',
//         'getPledgeList', 'getRegistrationList', 'getVoteInfo'
//     ].forEach(key => {
//         it(key, function () {
//             assert(typeof myAddrAccount[key], 'function');
//         });
//     });
// });
