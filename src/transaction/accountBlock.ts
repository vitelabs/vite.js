const BigNumber = require('bn.js');
const blake = require('blakejs/blake2b');

import { checkParams, bytesToHex, getRawTokenId, isHexString, ed25519 } from '~@vite/vitejs-utils';
import { getRealAddressFromAddress, createAddressByPrivateKey, getAddressFromPublicKey } from  '~@vite/vitejs-hdwallet/address';

import { isRequestBlock, isResponseBlock, checkAccountBlock, Default_Hash } from './utils';
import { Address, Hex, Base64, BigInt, Uint64, BlockType, ViteAPI, TokenId, AccountBlockBlock } from './type';

class AccountBlockClass {
    blockType: BlockType;
    address: Address;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    toAddress?: Address;
    tokenId?: TokenId;
    amount?: BigInt;
    height?: Uint64;
    previousHash?: Hex;
    difficulty?: BigInt;
    nonce?: Base64;
    signature?: Base64;
    publicKey?: Base64;

    constructor({ blockType, address, fee, data, sendBlockHash, amount, toAddress, tokenId }: {
        blockType: BlockType;
        address: Address;
        fee?: BigInt;
        data?: Base64;
        sendBlockHash?: Hex;
        amount?: BigInt;
        toAddress?: Address;
        tokenId?: TokenId;
    }) {
        const err = checkAccountBlock({ blockType, address, fee, data, sendBlockHash, amount, toAddress, tokenId });
        if (!err) {
            throw err;
        }

        this.blockType = blockType;
        this.address = address;
        this.fee = fee;
        this.data = data;
        this.sendBlockHash = sendBlockHash;
        this.amount = amount;
        this.toAddress = toAddress;
        this.tokenId = tokenId;
    }

    get accountBlock(): AccountBlockBlock {
        return {
            blockType: this.blockType,
            address: this.address,
            fee: this.fee,
            data: this.data,
            sendBlockHash: this.sendBlockHash,
            toAddress: this.toAddress,
            tokenId: this.tokenId,
            amount: this.amount,

            height: this.height,
            previousHash: this.previousHash,

            difficulty: this.difficulty,
            nonce: this.nonce,

            hash: this.hash,

            publicKey: this.publicKey,
            signature: this.signature
        };
    }

    get realAddress(): Hex {
        return getRealAddressFromAddress(this.address);
    }

    get blockTypeHex(): Hex {
        return Buffer.from([this.blockType]).toString('hex');
    }

    get previousHashHex(): Hex {
        return this.previousHash;
    }

    get heightHex(): Hex {
        return Number(this.height) ? bytesToHex(new BigNumber(this.height).toArray('big', 8)) : '';
    }

    get addressHex(): Hex {
        return this.realAddress;
    }

    get toAddressHex(): Hex {
        return getRealAddressFromAddress(this.toAddress);
    }

    get amountHex(): Hex {
        return getNumberHex(this.amount);
    }

    get tokenIdHex(): Hex {
        return this.tokenId ? getRawTokenId(this.tokenId) || '' : '';
    }

    get sendBlockHashHex(): Hex {
        return this.sendBlockHash || Default_Hash;
    }

    get dataHex(): Hex {
        return blake.blake2bHex(Buffer.from(this.data, 'base64'), null, 32);
    }

    get feeHex(): Hex {
        return getNumberHex(this.fee);
    }

    get nonceHex(): Hex {
        const nonceBuffer = this.nonce ? Buffer.from(this.nonce, 'base64') : '';
        return leftPadBytes(nonceBuffer, 8);
    }

    get isRequestBlock(): Boolean {
        return isRequestBlock(this.blockType);
    }

    get isResponseBlock(): Boolean {
        return isResponseBlock(this.blockType);
    }

    // 1.sendBlock
    // hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + ToAddress + Amount + TokenId + Data + Fee + LogHash + Nonce + sendBlockHashList）

    // 2.receiveBlock
    // hash = HashFunction(BlockType + PrevHash  + Height + AccountAddress + FromBlockHash + Data + Fee + LogHash + Nonce + sendBlockHashList）

    get hash(): Hex {
        let source = this.blockTypeHex + this.previousHashHex + this.heightHex + this.addressHex;
        if (this.isRequestBlock) {
            source += this.toAddressHex + this.amountHex + this.tokenIdHex;
        } else {
            source += this.sendBlockHashHex;
        }
        source += this.dataHex + this.feeHex + this.nonceHex;

        const sourceHex = Buffer.from(source, 'hex');
        const hashBuffer = blake.blake2b(sourceHex, null, 32);
        return Buffer.from(hashBuffer).toString('hex');
    }

    async getHeight(viteAPI: ViteAPI): Promise<{height: Uint64; previousHash: Hex }> {
        const previousAccountBlock = await viteAPI.request('ledger_getLatestAccountBlock', this.address);

        let height: Uint64 = previousAccountBlock && previousAccountBlock.height ? previousAccountBlock.height : '';
        height = height ? new BigNumber(height).add(new BigNumber(1)).toString() : '1';
        const previousHash: Hex = previousAccountBlock && previousAccountBlock.hash ? previousAccountBlock.hash : Default_Hash;
        return { height, previousHash };
    }

    setHeight({ height, previousHash }: {
        height: Uint64;
        previousHash: Hex;
    }) {
        this.height = height;
        this.previousHash = previousHash;
    }

    async getDifficulty(viteAPI: ViteAPI): Promise<{
        requiredQuota: Uint64;
        difficulty: BigInt;
        qc: BigInt;
        isCongestion: Boolean;
    }> {
        const err = checkParams(this.accountBlock, ['previousHash']);
        if (err) {
            throw err;
        }

        const result: {
            requiredQuota: Uint64;
            difficulty: BigInt;
            qc: BigInt;
            isCongestion: Boolean;
        } = await viteAPI.request('ledger_getPoWDifficulty', {
            address: this.address,
            previousHash: this.previousHash,
            blockType: this.blockType,
            toAddress: this.toAddress,
            data: this.data
        });

        return result;
    }

    setDifficulty(difficulty: BigInt) {
        this.difficulty = difficulty;
    }

    async getNonce(viteAPI: ViteAPI): Promise<Base64> {
        const err = checkParams({
            difficulty: this.difficulty,
            previousHash: this.previousHash
        }, [ 'difficulty', 'previousHash' ]);
        if (err) {
            throw err;
        }

        const getNonceHashBuffer = Buffer.from(this.realAddress + this.previousHash, 'hex');
        const getNonceHash = blake.blake2bHex(getNonceHashBuffer, null, 32);
        const nonce: Base64 = viteAPI.request('util_getPoWNonce', this.difficulty, getNonceHash);

        return nonce;
    }

    setNonce(nonce: Base64) {
        this.nonce = nonce;
    }

    async autoSetNonce(viteAPI: ViteAPI): Promise<{difficulty: BigInt; nonce: Base64}> {
        const result = await this.getDifficulty(viteAPI);
        this.setDifficulty(result.difficulty);

        const nonce: Base64 = this.difficulty ? await this.getNonce(viteAPI) : null;
        this.setNonce(nonce);

        return {
            difficulty: this.difficulty,
            nonce: this.nonce
        };
    }

    setPublicKey(publicKey: Buffer | Hex) {
        const err = checkParams({ publicKey }, ['publicKey'], [{
            name: 'publicKey',
            func: _p => _p instanceof Buffer || isHexString(_p),
            msg: 'PublicKey is Buffer or Hex-string'
        }]);

        if (err) {
            throw err;
        }

        const address = getAddressFromPublicKey(publicKey);
        if (this.address !== address) {
            throw new Error('PublicKey is wrong.');
        }

        const _publicKey = publicKey instanceof Buffer ? publicKey : Buffer.from(publicKey, 'hex');
        this.publicKey = _publicKey.toString('base64');
    }

    setSignature(signature: Base64) {
        this.signature = signature;
    }

    sign(privateKey: Buffer | Hex): AccountBlockBlock {
        const err = checkParams({ privateKey }, ['privateKey'], [{
            name: 'privateKey',
            func: _p => _p instanceof Buffer || isHexString(_p),
            msg: 'PrivateKey is Buffer or Hex-string'
        }]);

        if (err) {
            throw err;
        }

        const _privateKey: Buffer = privateKey instanceof Buffer ? privateKey : Buffer.from(privateKey, 'hex');
        const {
            address,
            publicKey
        } = createAddressByPrivateKey(_privateKey);
        if (this.address !== address) {
            throw new Error('PrivateKey is wrong.');
        }

        this.setPublicKey(publicKey);
        this.setSignature(ed25519.sign(this.hash, _privateKey));
        return this.accountBlock;
    }
}

export const AccountBlock = AccountBlockClass;
export default AccountBlockClass;



function leftPadBytes(bytesData, len) {
    if (bytesData && len - bytesData.length < 0) {
        return bytesData.toString('hex');
    }

    const result = new Uint8Array(len);
    if (bytesData) {
        result.set(bytesData, len - bytesData.length);
    }
    return Buffer.from(result).toString('hex');
}

function getNumberHex(amount) {
    const bigAmount = new BigNumber(amount);
    const amountBytes = amount && !bigAmount.isZero() ? bigAmount.toArray('big') : '';
    return leftPadBytes(amountBytes, 32);
}
