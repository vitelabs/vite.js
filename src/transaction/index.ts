// import { isAddress } from '~@vite/vitejs-privtoaddr';
// import { checkParams, isNonNegativeInteger } from '~@vite/vitejs-utils';
// import { BlockType } from '~@vite/vitejs-constant';
// import { paramsMissing } from '~@vite/vitejs-error';

// import { Hex } from './type';

// class TransactionClass {
//     accountBlock: Object
//     private privateKey: Hex

//     constructor({ privateKey }) {
//         this.privateKey = privateKey || '';
//         this.accountBlock = null;
//     }

//     setPrivateKey(privateKey: Hex) {
//         this.privateKey = privateKey || '';
//     }

//     sign() {

//     }

//     hash() {

//     }

//     receive({ fromBlockHash }) {
//         const err = checkParams({ fromBlockHash }, ['fromBlockHash']);
//         if (err) {
//             throw err;
//         }

//         this.accountBlock = this.formatAccountBlock({
//             blockType: 4,
//             fromBlockHash
//         });

//         return this;
//     }

//     send({ toAddress, tokenId, amount, data }) {
//         const err = checkParams({ toAddress, tokenId, amount }, [ 'toAddress', 'tokenId', 'amount' ]);
//         if (err) {
//             throw err;
//         }

//         this.accountBlock = this.formatAccountBlock({
//             blockType: 2,
//             toAddress,
//             tokenId,
//             amount,
//             data
//         });

//         return this;
//     }

//     createContract({ fee = '10000000000000000000', confirmTime = '0', quotaRatio = '10', seedCount = '0', hexCode, abi, params }) {
//         const err = checkParams({ hexCode, abi, fee, confirmTime, quotaRatio, seedCount }, [ 'hexCode', 'abi', 'fee', 'confirmTime', 'quotaRatio', 'seedCount' ],
//             [ {
//                 name: 'confirmTime',
//                 func: _c => Number(_c) >= 0 && Number(_c) <= 75
//             }, {
//                 name: 'quotaRatio',
//                 func: _c => Number(_c) >= 10 && Number(_c) <= 100
//             }, {
//                 name: 'seedCount',
//                 func: _c => Number(_c) >= 0 && Number(_c) <= 75
//             } ]);
//         if (err) {
//             throw err;
//         }

//         const data = getCreateContractData({ abi, hexCode, params, confirmTime, quotaRatio, seedCount });
//     }

//     callContract() {

//     }

//     private formatAccountBlock({ blockType, fromBlockHash, toAddress, tokenId, amount, data }: {
//         blockType;
//         fromBlockHash?;
//         toAddress?;
//         tokenId?;
//         amount?;
//         data?;
//     }): Object {
//         checkBlock({ blockType, toAddress, tokenId, amount, fromBlockHash, data });
//         return { toAddress, tokenId, amount, data };
//     }
// }

// export const transaction = TransactionClass;
// export default TransactionClass;



// function checkBlock({ blockType, data, toAddress, amount, tokenId, fromBlockHash }) {
//     const err = checkParams({ blockType, toAddress, amount }, ['blockType'], [ {
//         name: 'toAddress',
//         func: isAddress
//     }, {
//         name: 'blockType',
//         func: _b => BlockType[_b],
//         msg: `Don\'t have blockType ${ blockType }`
//     }, {
//         name: 'amount',
//         func: isNonNegativeInteger,
//         msg: 'Amount must be an non-negative integer string.'
//     } ]);

//     if (err) {
//         throw err;
//     }

//     if (Number(blockType) === 4 && !fromBlockHash) {
//         throw new Error(`${ paramsMissing.message } ReceiveBlock must have fromBlockHash.`);
//     }
// }

// function getCreateContractData({ abi, hexCode, params, confirmTime = '0', quotaRatio = '10', seedCount = '0' }) {
//     const err = checkParams({ confirmTime, quotaRatio, seedCount }, [ 'confirmTime', 'quotaRatio', 'seedCount' ], [ {
//         name: 'confirmTime',
//         func: _c => Number(_c) >= 0 && Number(_c) <= 75
//     }, {
//         name: 'quotaRatio',
//         func: _c => Number(_c) >= 10 && Number(_c) <= 100
//     }, {
//         name: 'seedCount',
//         func: _c => Number(_c) >= 0 && Number(_c) <= 75
//     } ]);
//     if (err) {
//         throw err;
//     }

//     const jsonInterface = getAbi(abi);
//     const _confirmTime = new BigNumber(confirmTime).toArray();
//     const _seedCount = new BigNumber(seedCount).toArray();
//     const _quotaRatio = new BigNumber(quotaRatio).toArray();
//     let data = `${ Delegate_Gid }01${ Buffer.from(_confirmTime).toString('hex') }${ Buffer.from(_seedCount).toString('hex') }${ Buffer.from(_quotaRatio).toString('hex') }${ hexCode }`;

//     if (jsonInterface) {
//         data += encodeParameters(jsonInterface, params);
//     }
//     return Buffer.from(data, 'hex').toString('base64');
// }
