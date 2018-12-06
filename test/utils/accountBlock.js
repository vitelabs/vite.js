const assert = require('assert');
import { getBuiltinTxType, signAccountBlock } from 'utils/accountBlock';

describe('signAccountBlock', function () {
    it('test_signTX_receive', function () {
        let privKey = 'dcb735c454777a697c417472a5dc46333fd738c062c26f2dc6bce8a972dece1f79e0fbc083681e636fef9b389d91c5700ae5d401438158e5c7798b76232cdf88';
        let accountBlock = {
            'accountAddress':'vite_a17465557d554fd27ff958887082f147054e0d6f75762e25cb',
            'height':'1',
            'timestamp':1539669939,
            'snapshotHash':'17c5712f0feb83c3a25a63b55979f1991d5c41bf9450849eaebfe39e54076393',
            'fee':'0',
            'prevHash':'0000000000000000000000000000000000000000000000000000000000000000',
            'blockType':4,
            'fromBlockHash':'382c9d11894aa45d18bb02edf4b520a281341e686915c750adbbb0655c8ba6ec',
            'nonce':'xjpCTkxYBfA=',
            'publicKey':'79e0fbc083681e636fef9b389d91c5700ae5d401438158e5c7798b76232cdf88',
            'hash':'2b39c5c1e3f70eee84679914aedea5585b3990c2d922cd7f8d31b49b759ab8eb',
            'signature':'cad7e04fe1a1184df1394d73cee27ef79b6b6a9b52a82b9bcf546cd9e96adf53423149a33a856c6220f7745bd7c1512bd1e6fc21f9a4dd878dd50ac44e596200'
        };

        let { hash, signature, publicKey } = signAccountBlock(accountBlock, privKey);

        assert.equal(hash, accountBlock.hash);
        assert.equal(publicKey, accountBlock.publicKey);
        assert.equal(signature, accountBlock.signature);
    });

    it('test_signTX_send', function () {
        let privKey = '39ad24b209000da30661d62b017e61640ae6c44531b6d603131477bd2f4841d6e91c860c63d01f6d4a92901971907a72103e8baa87f8878665f5a4def9ec7a36';
        let accountBlock = {
            'accountAddress':'vite_aac0d5bb7d5585716a8d9a0ee600d6d28cb52d6695673e8f50',
            'height':'1',
            'timestamp':1539677137,
            'snapshotHash':'8aa4d1427223ed4757a784245483501efe728d4b9675ab02249833b6f8c462b8',
            'fee':'0',
            'prevHash':'a574cef0e2a22978f194e8ac818cb7ca4c14ea3b5d14649e4c4f0723c27b1bf6',
            'data':'MTI=',
            'tokenId':'tti_5649544520544f4b454e6e40',
            'toAddress':'vite_aac0d5bb7d5585716a8d9a0ee600d6d28cb52d6695673e8f50',
            'amount':'1000000000000000000',
            'blockType':2,
            'nonce':'jnrqnJpfOb4=',
            'hash':'cb4cc0b762bd86c95941f45a8d69d004e7c558bc27fd5204cfc504b9082f383a',
            'publicKey':'6RyGDGPQH21KkpAZcZB6chA+i6qH+IeGZfWk3vnsejY=',
            'signature':'r9JcJLiZGhFK6+bCLmcfu2W5yIPDbm2BpVWJaokkeiOebGe2WSq94jxfvF/UI40/hOWhnlWMSvXTgmnnt8P7Bw=='
        };

        let { hash, signature, publicKey } = signAccountBlock(accountBlock, privKey);

        assert.equal(hash, accountBlock.hash);
        assert.equal(publicKey, accountBlock.publicKey);
        assert.equal(signature, accountBlock.signature);
    });
});

describe('', function () {
    let block = {
        accountAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        amount: '0',
        blockType: 2,
        confirmedTimes: '279',
        data: 'pinFMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB',
        difficulty: null,
        fee: '0',
        fromAddress: 'vite_155e4e83fb0499dcc3047e0458bbfae77f2ac1270e38c176f8',
        fromBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
        hash: '35a17f1919f3c95c5ecb710c97fca0a0c4049fa8cb9c64e3b475769450498bf1',
        height: '19',
        logHash: null,
        nonce: null,
        prevHash: 'fef0b178458acb3f7d37d575b10139357d79a5a90adc3fdc8ddd96800770fce7',
        publicKey: 'Kn+xAEkrRm/KSsfE38htuM5P6NCwsp1x70/yya+ZIJ0=',
        quota: '62000',
        signature: 'DPiaz3ZjGzXrycnjXdmXgr823J/4zv1MB1yoDQRaIkCZkLlwM6V8AzekqHjhveWz+ymM57X3royv5FtpfdKcCA==',
        snapshotHash: 'ff91866c4393566c44a667e8344c1567a12fdefa27093a69fed6ecbf4cb02046',
        timestamp: 1544100858,
        toAddress: 'vite_000000000000000000000000000000000000000270a48cc491',
        tokenId: 'tti_5649544520544f4b454e6e40',
    };
    console.log( getBuiltinTxType(block.toAddress, block.data, block.blockType) );
});
