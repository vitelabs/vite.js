const Buffer = require('buffer/').Buffer
const BigNumber = require('bn.js');
const blake = require('blakejs/blake2b');

import { checkParams, isHexString, isBase64String } from '~@vite/vitejs-utils';
import { getOriginalAddressFromAddress, getAddressFromPublicKey, isValidAddress, createAddressByPrivateKey } from '~@vite/vitejs-wallet/address';

import {
    isRequestBlock, isResponseBlock, isValidAccountBlockWithoutHash, checkAccountBlock,
    Default_Hash, getBlockTypeHex, getHeightHex, getAddressHex, getToAddressHex, getDataHex,
    getAmountHex, getFeeHex, getNonceHex, getPreviousHashHex, getTokenIdHex, getSendBlockHashHex,
    getAccountBlockHash, signAccountBlock, createContractAddress
} from './utils';
import { Address, Hex, Base64, BigInt, Uint64, BlockType, TokenId, AccountBlockBlock, ProviderType, AccountBlockType } from './type';


class AccountBlockClass {
    blockType: BlockType;
    address: Address;
    fee?: BigInt;
    data?: Base64;
    sendBlockHash?: Hex;
    tokenId?: TokenId;
    amount?: BigInt;
    height?: Uint64;
    previousHash?: Hex;
    difficulty?: BigInt;
    nonce?: Base64;
    signature?: Base64;
    publicKey?: Base64;
    _toAddress?: Address;

    private privateKey: Hex;
    private provider: ProviderType;

    constructor({ blockType, address, fee, data, sendBlockHash, amount, toAddress, tokenId }: {
        blockType: BlockType;
        address: Address;
        fee?: BigInt;
        data?: Base64;
        sendBlockHash?: Hex;
        amount?: BigInt;
        toAddress?: Address;
        tokenId?: TokenId;
    }, provider?: ProviderType, privateKey?: Hex) {
        const err = checkParams({ blockType, address }, [ 'blockType', 'address' ], [ {
            name: 'blockType',
            func: _b => BlockType[_b],
            msg: `Don\'t have blockType ${ blockType }`
        }, {
            name: 'address',
            func: isValidAddress
        } ]);
        if (err) {
            throw err;
        }

        this.blockType = blockType;
        this.address = address;
        this.fee = fee;
        this.data = data;
        this.sendBlockHash = sendBlockHash;
        this.amount = amount;
        this.tokenId = tokenId;
        this._toAddress = toAddress;

        provider && this.setProvider(provider);
        privateKey && this.setPrivateKey(privateKey);
    }

    get accountBlock(): AccountBlockBlock {
        return {
            blockType: this.blockType,
            address: this.address,
            fee: this.fee === '' ? null : this.fee,
            data: this.data === '' ? null : this.data,
            sendBlockHash: this.sendBlockHash === '' ? null : this.sendBlockHash,
            toAddress: this.toAddress === '' ? null : this.toAddress,
            tokenId: this.tokenId === '' ? null : this.tokenId,
            amount: this.amount === '' ? null : this.amount,
            height: this.height === '' ? null : this.height,
            previousHash: this.previousHash === '' ? null : this.previousHash,
            difficulty: this.difficulty === '' ? null : this.difficulty,
            nonce: this.nonce === '' ? null : this.nonce,
            hash: this.hash === '' ? null : this.hash,
            publicKey: this.publicKey === '' ? null : this.publicKey,
            signature: this.signature === '' ? null : this.signature
        };
    }

    get toAddress(): Address {
        if (this.blockType !== BlockType.CreateContractRequest) {
            return this._toAddress;
        }

        if (!this.previousHash || !this.height) {
            return '';
        }

        return createContractAddress({
            address: this.address,
            height: this.height,
            previousHash: this.previousHash
        });
    }

    get originalAddress(): Hex {
        return getOriginalAddressFromAddress(this.address);
    }

    get blockTypeHex(): Hex {
        return getBlockTypeHex(this.blockType);
    }

    get previousHashHex(): Hex {
        return getPreviousHashHex(this.previousHash);
    }

    get heightHex(): Hex {
        return getHeightHex(this.height);
    }

    get addressHex(): Hex {
        return getAddressHex(this.address);
    }

    get toAddressHex(): Hex {
        return getToAddressHex(this.toAddress);
    }

    get amountHex(): Hex {
        return getAmountHex(this.amount);
    }

    get tokenIdHex(): Hex {
        return getTokenIdHex(this.tokenId);
    }

    get sendBlockHashHex(): Hex {
        return getSendBlockHashHex(this.sendBlockHash);
    }

    get dataHex(): Hex {
        return getDataHex(this.data);
    }

    get feeHex(): Hex {
        return getFeeHex(this.fee);
    }

    get nonceHex(): Hex {
        return getNonceHex(this.nonce);
    }

    get isRequestBlock(): boolean {
        return isRequestBlock(this.blockType);
    }

    get isResponseBlock(): boolean {
        return isResponseBlock(this.blockType);
    }

    get hash(): Hex {
        const block = {
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
            nonce: this.nonce
        };

        if (isValidAccountBlockWithoutHash(block)) {
            return getAccountBlockHash(block);
        }
        return null;
    }

    setProvider(provider: ProviderType): AccountBlockClass {
        this.provider = provider;
        return this;
    }

    setPrivateKey(privateKey: Hex): AccountBlockClass {
        const err = checkParams({ privateKey }, ['privateKey'], [{
            name: 'privateKey',
            func: isHexString
        }]);
        if (err) {
            throw err;
        }

        const { address } = createAddressByPrivateKey(privateKey);
        if (address !== this.address) {
            throw new Error('PrivateKey is wrong');
        }

        this.privateKey = privateKey;
        return this;
    }

    async getPreviousAccountBlock(): Promise<AccountBlockType> {
        const previousAccountBlock: AccountBlockType = await this.provider.request('ledger_getLatestAccountBlock', this.address);
        return previousAccountBlock;
    }

    setHeight(height: Uint64): AccountBlockClass {
        this.height = height;
        return this;
    }

    setPreviousHash(previousHash: Hex): AccountBlockClass {
        this.previousHash = previousHash;
        return this;
    }

    setPreviousAccountBlock(previousAccountBlock: AccountBlockType): AccountBlockClass {
        let height: Uint64 = previousAccountBlock && previousAccountBlock.height ? previousAccountBlock.height : '';
        height = height ? new BigNumber(height).add(new BigNumber(1)).toString() : '1';
        this.setHeight(height);

        const previousHash: Hex = previousAccountBlock && previousAccountBlock.hash ? previousAccountBlock.hash : Default_Hash;
        this.setPreviousHash(previousHash);
        return this;
    }

    async autoSetPreviousAccountBlock(): Promise<{
        height: Uint64;
        previousHash: Hex;
    }> {
        const previousAccountBlock: AccountBlockType = await this.getPreviousAccountBlock();
        this.setPreviousAccountBlock(previousAccountBlock);
        return {
            height: this.height,
            previousHash: this.previousHash
        };
    }

    async getDifficulty(): Promise<BigInt> {
        const err = checkParams(this.accountBlock, ['previousHash']);
        if (err) {
            throw err;
        }

        const result: {
            requiredQuota: Uint64;
            difficulty: BigInt;
            qc: BigInt;
            isCongestion: boolean;
        } = await this.provider.request('ledger_getPoWDifficulty', {
            address: this.address,
            previousHash: this.previousHash,
            blockType: this.blockType,
            toAddress: this.toAddress,
            data: this.data
        });

        return result.difficulty;
    }

    setDifficulty(difficulty: BigInt): AccountBlockClass {
        this.difficulty = difficulty;
        return this;
    }

    async autoSetDifficulty(): Promise<BigInt> {
        const difficulty = await this.getDifficulty();
        this.setDifficulty(difficulty);
        return this.difficulty;
    }

    async getNonce(): Promise<Base64> {
        const err = checkParams({
            difficulty: this.difficulty,
            previousHash: this.previousHash
        }, [ 'difficulty', 'previousHash' ]);
        if (err) {
            throw err;
        }

        const getNonceHashBuffer = Buffer.from(this.originalAddress + this.previousHash, 'hex');
        const getNonceHash = blake.blake2bHex(getNonceHashBuffer, null, 32);

        const nonce: Base64 = this.provider.request('util_getPoWNonce', this.difficulty, getNonceHash);
        return nonce;
    }

    setNonce(nonce: Base64): AccountBlockClass {
        this.nonce = nonce;
        return this;
    }

    async autoSetNonce(): Promise<Base64> {
        if (!this.difficulty) {
            return this.nonce;
        }

        const nonce = await this.getNonce();
        this.setNonce(nonce);
        return this.nonce;
    }

    async PoW(difficulty?: BigInt): Promise<{difficulty: BigInt; nonce: Base64}> {
        const _difficulty = difficulty || await this.getDifficulty();
        this.setDifficulty(_difficulty);
        await this.autoSetNonce();
        return {
            difficulty: this.difficulty,
            nonce: this.nonce
        };
    }

    setPublicKey(publicKey: Hex | Base64): AccountBlockClass {
        const err = checkParams({ publicKey }, ['publicKey'], [{
            name: 'publicKey',
            func: _p => isHexString(_p) || isBase64String(_p),
            msg: 'PublicKey is Hex-string or Base64-string'
        }]);

        if (err) {
            throw err;
        }

        const publicKeyHex = isHexString(publicKey)
            ? publicKey
            : Buffer.from(`${ publicKey }`, 'base64').toString('hex');
        const publicKeyBase64 = isHexString(publicKey)
            ? Buffer.from(`${ publicKey }`, 'hex').toString('base64')
            : publicKey;

        const address = getAddressFromPublicKey(publicKeyHex);
        if (this.address !== address) {
            throw new Error('PublicKey is wrong.');
        }

        this.publicKey = publicKeyBase64;
        return this;
    }

    setSignature(signature: Hex | Base64): AccountBlockClass {
        const err = checkParams({ signature }, ['signature'], [{
            name: 'signature',
            func: _s => isHexString(_s) || isBase64String(_s),
            msg: 'Signature is Hex-string or Base64-string'
        }]);
        if (err) {
            throw err;
        }

        if (isBase64String(signature)) {
            this.signature = signature;
            return this;
        }

        this.signature = Buffer.from(signature, 'hex').toString('base64');
        return this;
    }

    sign(privateKey: Hex = this.privateKey): AccountBlockClass {
        const { signature, publicKey } = signAccountBlock(this.accountBlock, privateKey);
        this.setPublicKey(publicKey);
        this.setSignature(signature);
        return this;
    }

    async send(): Promise<AccountBlockBlock> {
        const err = checkAccountBlock(this.accountBlock);
        if (err) {
            throw err;
        }

        try {
            const res = await this.provider.request('ledger_sendRawTransaction', this.accountBlock);
            return res || this.accountBlock;
        } catch (err) {
            err.acccountBlock = this.accountBlock;
            throw err;
        }
    }

    async sendByPoW(privateKey: Hex = this.privateKey): Promise<AccountBlockBlock> {
        await this.PoW();
        return this.sign(privateKey).send();
    }

    async autoSendByPoW(privateKey: Hex = this.privateKey): Promise<AccountBlockBlock> {
        await this.autoSetPreviousAccountBlock();
        await this.PoW();
        return this.sign(privateKey).send();
    }

    async autoSend(privateKey: Hex = this.privateKey): Promise<AccountBlockBlock> {
        await this.autoSetPreviousAccountBlock();
        return this.sign(privateKey).send();
    }
}

export const AccountBlock = AccountBlockClass;
export default AccountBlockClass;
