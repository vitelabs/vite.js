import {createAccountBlock} from '~@vite/vitejs-accountblock/index';

const assert = require('assert');

import AccountClass from '~@vite/vitejs-accountblock/account';
import {Vite_TokenId} from '../../../src/constant/index';

describe('createAccountBlock', function () {
    const _address = 'vite_69f3bdb5cdcfa145ae6cc42593a89088ff3dac587eb692d689';
    const methods = Reflect.ownKeys(AccountClass.prototype);
    for (const index in methods) {
        const name = String(methods[index]);
        it(name, function () {
            switch (name) {
            case 'receive': {
                const params = {
                    address: _address,
                    sendBlockHash: '18095215a419e346dde2f678180382b65146502fb543a7e96c41b141136b47d9'
                };
                const { address, blockType, sendBlockHash } = createAccountBlock(name, params);
                assert.deepEqual({ address, blockType, sendBlockHash }, {
                    address: _address,
                    blockType: 4,
                    sendBlockHash: '18095215a419e346dde2f678180382b65146502fb543a7e96c41b141136b47d9'
                });
                break;
            }
            case 'send': {
                const params = {
                    address: _address,
                    data: 'jefc/QAAAAAAAAAAAAAAVTRivKE3usKfRA6a9KsuLBu4JJMA',
                    toAddress: _address
                };
                const { address, blockType, toAddress, tokenId, amount, data } = createAccountBlock(name, params);
                assert.deepEqual({ address, blockType, toAddress, tokenId, amount, data }, {
                    address: _address,
                    blockType: 2,
                    toAddress: _address,
                    data: 'jefc/QAAAAAAAAAAAAAAVTRivKE3usKfRA6a9KsuLBu4JJMA',
                    tokenId: Vite_TokenId,
                    amount: 0
                });
                break;
            }
            case 'registerSBP': {
                const params = {
                    address: _address,
                    sbpName: 'sbp01',
                    blockProducingAddress: _address,
                    rewardWithdrawAddress: _address
                };
                const { address, blockType, toAddress, tokenId, amount, data } = createAccountBlock(name, params);
                assert.deepEqual({ address, blockType, toAddress, tokenId, amount, data }, {
                    address: _address,
                    blockType: 2,
                    toAddress: 'vite_0000000000000000000000000000000000000004d28108e76b',
                    data: 'QwdfvwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAABp8721zc+hRa5sxCWTqJCI/z2sWAAAAAAAAAAAAAAAAGnzvbXNz6FFrmzEJZOokIj/PaxYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFc2JwMDEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
                    tokenId: Vite_TokenId,
                    amount: 1000000000000000000000000
                });
                break;
            }
            case 'setProvider':
            case 'setPrivateKey':
            case 'constructor': {
                const params = { address: _address };
                assert.throws(() => createAccountBlock(name, params), new Error(`Don\'t support transaction type ${ name }`));
                break;
            }
            }
        });
    }
});
