// import { checkParams } from '~@vite/vitejs-utils';

// export function checkAccountBlockKeywords({ blockType, accountAddress, toAddress, amount }) {
//     const err = checkParams({ blockType, accountAddress, toAddress, amount }, [], [ {
//         name: 'accountAddress',
//         func: isAddress
//     }, {
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
//         return err;
//     }
// }
