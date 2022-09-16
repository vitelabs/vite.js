const assert = require('assert');

import Provider, {
    AlwaysReconnect,
    ConnectHandler,
    ReconnectHandler,
    RenewSubscription
} from '../../../src/viteAPI/provider';
import WS_RPC from '../../../src/WS';
import HTTP_RPC from '../../../src/HTTP';
import IPC_RPC from '../../../src/IPC';
import {sleep, tx, viteProvider, waitUntil} from '../../RPC/utils';
import {Vite_TokenId} from '../../../src/constant/index';

const abi = require('../../../src/abi/index');
const config = require('../../rpcConfig');

const contract = {
    abi: [ {'constant': false, 'inputs': [{'name': 'addr', 'type': 'address'}], 'name': 'SayHello', 'outputs': [], 'payable': true, 'stateMutability': 'payable', 'type': 'function'}, {'anonymous': false, 'inputs': [ {'indexed': true, 'name': 'addr', 'type': 'address'}, {'indexed': false, 'name': 'amount', 'type': 'uint256'} ], 'name': 'transfer', 'type': 'event'} ],
    code: '608060405234801561001057600080fd5b50610141806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806391a6cb4b14610046575b600080fd5b6100896004803603602081101561005c57600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff16906020019092919050505061008b565b005b8074ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f1505050508074ffffffffffffffffffffffffffffffffffffffffff167faa65281f5df4b4bd3c71f2ba25905b907205fce0809a816ef8e04b4d496a85bb346040518082815260200191505060405180910390a25056fea165627a7a7230582023e9669dd6fec3b6b2a84a1fd7c9939f49197203d0e1db312278e633c219c2480029'
};

describe('test provider and connect handlers', () => {
    // provider for general purpose
    let wsServer;
    // test contract address created in step one
    let contractAddr;

    before(() => {
        wsServer = new WS_RPC(config.ws);
        const _provider = new Provider(wsServer, () => {});
        tx.setProvider(_provider); // set provider
    });

    it('create contract', async () => {
        const accountBlock = await CreateContract();
        contractAddr = accountBlock && accountBlock.toAddress;
        assert.ok(true);
    }).timeout(30000);

    it('reconnect', async () => {
        const _wsRpc = new WS_RPC(config.ws, 2000);
        const _provider = new Provider(_wsRpc, () => {
            console.log('Connected');
        }, new AlwaysReconnect(1000));
        tx.setProvider(_provider);

        const event = await newOnroadBlocksByAddr(config.address, _provider);
        event.on(result => {
            console.log(result);
            assert.fail(); // we should not receive event
        });

        // reconnect
        let i = 0;
        while (i++ < 3) {
            await sleep(2000);
            _wsRpc.disconnect();
        }

        await sleep(2000);
        await SendTx(config.address, '100000000000000000');

        await sleep(20000); // wait for 20s to make sure the listener does not receive event

        _wsRpc.destroy();
        assert.ok(true);
    }).timeout(30000);

    it('reconnect ipc', async () => {
        const _ipcRpc = new IPC_RPC(config.ipc, 2000);
        const _provider = new Provider(_ipcRpc, () => {
            console.log('Connected');
        }, new ReconnectHandler(100, 100));
        tx.setProvider(_provider);

        const event = await newOnroadBlocksByAddr(config.address, _provider);
        event.on(result => {
            console.log(result);
            assert.fail(); // we should not receive event
        });

        // reconnect
        let i = 0;
        while (i++ < 3) {
            await sleep(2000);
            _ipcRpc.disconnect();
        }

        await sleep(2000);
        await SendTx(config.address, '100000000000000000');

        await sleep(20000); // wait for 20s to make sure the listener does not receive event

        _ipcRpc.destroy();
        assert.ok(true);
    }).timeout(30000);

    it('resubscribe', async () => {
        let e1, e2 = false;
        const _wsRpc = new WS_RPC(config.ws);
        const _provider = new Provider(_wsRpc, () => {
            console.log('Connected');
        }, new RenewSubscription(50, 1000));
        // use new provider
        tx.setProvider(_provider);
        // register for new account blocks on sending address
        let event = await newAccountBlockByAddress(config.address, _provider);
        event.on(async result => {
            console.log(result);
            const { hash, address, toAddress, amount } = await getHashInfo(result[0]?.hash, _provider);
            assert.deepEqual({ hash, address, toAddress, amount },
                { hash: result[0]?.hash, address: config.address, toAddress: contractAddr, amount: '100000000000000000'});
            e1 = true;
        });
        // register for event logs
        event = await newVmLog(contractAddr, _provider);
        event.on(result => {
            console.log(result);
            result.forEach(log => {
                const vmLog = log.vmlog;
                const topics = vmLog.topics;
                const dataHex = vmLog.data && Buffer.from(vmLog.data, 'base64').toString('hex');
                const result = abi.decodeLog(contract.abi, dataHex, topics, 'transfer');
                assert.deepEqual(result, {
                    '0': config.address,
                    '1': '100000000000000000',
                    addr: config.address,
                    amount: '100000000000000000'
                });
            });
            e2 = true;
        });

        // reconnect
        let i = 0;
        while (i++ < 3) {
            await sleep(2000);
            _wsRpc.disconnect();
        }

        await sleep(2000);
        await CallContract(contractAddr, 'SayHello', '100000000000000000', [config.address]);

        await waitUntil(() => e1 && e2);

        _wsRpc.destroy();
        assert.ok(true);
    }).timeout(60000);

    it('resubscribe ipc', async () => {
        let e1, e2 = false;
        const _ipcRpc = new IPC_RPC(config.ipc, 2000);
        const _provider = new Provider(_ipcRpc, () => {
            console.log('Connected');
        }, new RenewSubscription(5, 10));
        // use new provider
        tx.setProvider(_provider);
        // register for new account blocks on sending address
        let event = await newAccountBlockByAddress(config.address, _provider);
        event.on(async result => {
            console.log(result);
            const { hash, address, toAddress, amount } = await getHashInfo(result[0]?.hash, _provider);
            assert.deepEqual({ hash, address, toAddress, amount },
                { hash: result[0]?.hash, address: config.address, toAddress: contractAddr, amount: '100000000000000000'});
            e1 = true;
        });
        // register for event logs
        event = await newVmLog(contractAddr, _provider);
        event.on(result => {
            console.log(result);
            result.forEach(log => {
                const vmLog = log.vmlog;
                const topics = vmLog.topics;
                const dataHex = vmLog.data && Buffer.from(vmLog.data, 'base64').toString('hex');
                const result = abi.decodeLog(contract.abi, dataHex, topics, 'transfer');
                assert.deepEqual(result, {
                    '0': config.address,
                    '1': '100000000000000000',
                    addr: config.address,
                    amount: '100000000000000000'
                });
            });
            e2 = true;
        });

        // reconnect
        let i = 0;
        while (i++ < 3) {
            await sleep(2000);
            _ipcRpc.disconnect();
        }

        await sleep(2000);
        await CallContract(contractAddr, 'SayHello', '100000000000000000', [config.address]);

        await waitUntil(() => e1 && e2);

        _ipcRpc.destroy();
        assert.ok(true);
    }).timeout(60000);

    it('resubscribe fail after maximum retry reached', async () => {
        const _wsRpc = new WS_RPC(config.ws);
        const _provider = new Provider(_wsRpc, () => {
            console.log('Connected');
        }, new RenewSubscription(1, 100));
        tx.setProvider(_provider);

        const event = await newAccountBlockByAddress(config.address, _provider);
        event.on(async result => {
            console.log(result);
            assert.fail(); // we should not receive event
        });

        // reconnect
        let i = 0;
        while (i++ < 2) {
            await sleep(2000);
            _wsRpc.disconnect();
        }

        await assert.rejects(SendTx(contractAddr, '100000000000000000'), new Error(`CONNECTION ERROR: Couldn\'t connect to node ${ config.ws }.`));
        // await assertThrowsAsync(() => SendTx(contractAddr, '100000000000000000'), new Error(`CONNECTION ERROR: Couldn\'t connect to node ${ config.ws }.`));

        _wsRpc.destroy();
        assert.ok(true);
    }).timeout(60000);

    it('work with http', async () => { // retry times doesn't not apply to http provider
        let e1 = false;
        const _httpRpc = new HTTP_RPC(config.http);
        const _provider = new Provider(_httpRpc, () => {
            console.log('Connected');
        }, new RenewSubscription(1, 100));
        tx.setProvider(_provider);

        const event = await newAccountBlockByAddress(config.address, _provider);
        event.on(async result => {
            console.log(result);
            const { hash, address, toAddress, amount } = await getHashInfo(result[0]?.hash, _provider);
            assert.deepEqual({ hash, address, toAddress, amount },
                { hash: result[0]?.hash, address: config.address, toAddress: contractAddr, amount: '100000000000000000'});
            e1 = true;
        });

        // reconnect
        let i = 0;
        while (i++ < 3) {
            await sleep(2000);
            _httpRpc.abort();
        }

        // retry times is not applicable to http provider, we can still call the contract and get event
        await sleep(2000);
        await CallContract(contractAddr, 'SayHello', '100000000000000000', [config.address]);

        await waitUntil(() => e1);

        _provider.unsubscribeAll();
        assert.ok(true);
    }).timeout(30000);

    it('no reconnect', async () => {
        const _wsRpc = new WS_RPC(config.ws);
        const _provider = new Provider(_wsRpc, () => {
            console.log('Connected');
        }, new NoReconnectHandler());
        tx.setProvider(_provider);

        const event = await newAccountBlockByAddress(config.address, _provider);
        event.on(result => {
            console.log(result);
            assert.fail(); // we should not receive event
        });

        // reconnect
        let i = 0;
        while (i++ < 1) {
            await sleep(2000);
            _wsRpc.disconnect();
        }

        await sleep(2000);
        await assert.rejects(SendTx(config.address, '100000000000000000'), new Error(`CONNECTION ERROR: Couldn\'t connect to node ${ config.ws }.`));

        _wsRpc.destroy();
        assert.ok(true);
    }).timeout(30000);

    it('no reconnect ipc', async () => {
        const _ipcRpc = new IPC_RPC(config.ipc, 2000);
        const _provider = new Provider(_ipcRpc, () => {
            console.log('Connected');
        }, new NoReconnectHandler());
        tx.setProvider(_provider);

        const event = await newOnroadBlocksByAddr(config.address, _provider);
        event.on(result => {
            console.log(result);
            assert.fail(); // we should not receive event
        });

        // reconnect
        let i = 0;
        while (i++ < 1) {
            await sleep(2000);
            _ipcRpc.disconnect();
        }

        await sleep(2000);
        await assert.rejects(SendTx(config.address, '100000000000000000'), new Error(`CONNECTION ERROR: Couldn\'t connect to node ${ config.ipc }.`));

        _ipcRpc.destroy();
        assert.ok(true);
    }).timeout(30000);

    it('invalid endpoint', async () => {
        const _wsRpc = new WS_RPC('wss://no.vite.net/ws', 2000);
        const _provider = new Provider(_wsRpc, () => {
            console.log('Connected');
        }, new AssertErrorHandler());

        _wsRpc.destroy();
        assert.ok(true);
    }).timeout(30000);

    after(() => {
        wsServer.destroy();
        // reset provider
        tx.setProvider(viteProvider);
    });
});

async function SendTx(address, amount, previousAccountBlock) {
    const accountBlock = await tx.send({
        toAddress: address,
        tokenId: Vite_TokenId,
        amount
    });

    let result = null;
    if (previousAccountBlock) {
        await accountBlock.setPreviousAccountBlock(previousAccountBlock);
        result = await accountBlock.sendByPoW();
        console.log('[LOG] SendTransaction', result, '\n');
    } else {
        result = await accountBlock.autoSendByPoW();
        console.log('[LOG] SendTransaction', result, '\n');
    }
}

async function CreateContract(previousAccountBlock) {
    const accountBlock = tx.createContract({
        abi: contract.abi,
        code: contract.code,
        responseLatency: 2
    });

    let result = null;
    if (previousAccountBlock) {
        await accountBlock.setPreviousAccountBlock(previousAccountBlock);
        result = await accountBlock.sendByPoW();
        console.log('[LOG] CreateContract', result, '\n');
    } else {
        result = await accountBlock.autoSendByPoW();
        console.log('[LOG] CreateContract', result, '\n');
    }

    return result;
}

async function CallContract(address, methodName, amount = '0', params, previousAccountBlock) {
    const accountBlock = tx.callContract({
        abi: contract.abi,
        methodName,
        amount,
        toAddress: address,
        params
    });

    let result = null;
    if (previousAccountBlock) {
        await accountBlock.setPreviousAccountBlock(previousAccountBlock);
        result = await accountBlock.sendByPoW();
        console.log('[LOG] CallContract', result, '\n');
    } else {
        result = await accountBlock.autoSendByPoW();
        console.log('[LOG] CallContract', result, '\n');
    }

    return result;
}

async function newOnroadBlocksByAddr(address, provider) {
    return await provider.subscribe('newUnreceivedBlockByAddress', address);
}

async function newAccountBlockByAddress(address, provider) {
    return await provider.subscribe('newAccountBlockByAddress', address);
}

async function newVmLog(address, provider) {
    const filterParam = { addressHeightRange: {}};
    filterParam['addressHeightRange'][address] = {
        fromHeight: '0',
        toHeight: '0'
    };
    return await provider.subscribe('newVmLog', filterParam);
}

async function getHashInfo(hash, provider) {
    return await provider.request('ledger_getBlockByHash', hash);
}

async function assertThrowsAsync(fn, regExp) {
    let f = () => {};
    try {
        await fn();
    } catch (e) {
        f = () => {
            throw e;
        };
    } finally {
        assert.throws(f, regExp);
    }
}

class AssertErrorHandler extends ConnectHandler {
    onError(e) {
        assert.equal(e.type, 'error');
        assert.equal(e.target._readyState, 3);
    }
}

class NoReconnectHandler extends ConnectHandler {
    setReconnect() {}
}
