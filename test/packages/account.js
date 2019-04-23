const assert = require('assert');

import HTTP_RPC from '../../src/HTTP';
import Client from '../../src/client/index';
import Account from '../../src/account/index';
import AddrAccount from '../../src/addrAccount/index';
import { newHexAddr } from '../../src/privToAddr/index';


const myHTTPClient = new Client(new HTTP_RPC());

describe('New Account with privateKey', function () {
    const addrObj = newHexAddr();
    const myAccount = new Account({
        privateKey: addrObj.privKey,
        client: myHTTPClient
    });

    it('extends of AddrAccount', function () {
        assert(myAccount instanceof AddrAccount, true);
    });
    it('property realAddress', function () {
        assert(myAccount.realAddress, addrObj.addr);
    });
    it('property privateKey', function () {
        assert(myAccount.privateKey, addrObj.privKey);
    });
    it('property getPublicKey', function () {
        assert(myAccount.getPublicKey(), addrObj.pubKey);
    });
    it('property _client', function () {
        assert.deepEqual(myAccount._client, myHTTPClient);
    });

    testFunctions(myAccount);
});

describe('New Account without privateKey', function () {
    const myAccount = new Account({ client: myHTTPClient });

    it('property privateKey', function () {
        assert(!!myAccount.privateKey, true);
    });

    const addrObj = newHexAddr(myAccount.privateKey);
    it('property realAddress', function () {
        assert(myAccount.realAddress, addrObj.addr);
    });
    it('property getPublicKey', function () {
        assert(myAccount.getPublicKey(), addrObj.pubKey);
    });

    testFunctions(myAccount);
});

function testFunctions(myAccount) {
    for (let key in myHTTPClient.builtinTxBlock) {
        if (key === '_client' || key.endsWith('Block')) {
            continue;
        }

        if (key.startsWith('async')) {
            key = key.replace('async', '');
            key = key[0].toLocaleLowerCase() + key.slice(1);
        }

        it(`Function ${ key }`, function () {
            assert(typeof myAccount[key], 'function');
        });
    }

    const requiredFuncList = [
        'getPublicKey', 'sign', 'signAccountBlock',
        'activate', 'freeze', 'autoReceiveTx', 'stopAutoReceiveTx',
        'sendRawTx', 'sendAutoPowRawTx', 'sendPowTx'
    ];

    requiredFuncList.forEach(key => {
        it(`Function ${ key }`, function () {
            assert(typeof myAccount[key], 'function');
        });
    });
}
