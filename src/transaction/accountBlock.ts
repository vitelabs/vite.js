const BigNumber = require('bn.js');
const blake = require('blakejs/blake2b');

import { checkParams, isHexString, isBase64String } from '~@vite/vitejs-utils';
import { getOriginalAddressFromAddress, getAddressFromPublicKey, isValidAddress } from  '~@vite/vitejs-hdwallet/address';

import {
    isRequestBlock, isResponseBlock, checkAccountBlock, Default_Hash,
    getBlockTypeHex, getHeightHex, getAddressHex, getToAddressHex, getDataHex,
    getAmountHex, getFeeHex, getNonceHex, getPreviousHashHex, getTokenIdHex, getSendBlockHashHex,
    getAccountBlockHash, signAccountBlock
} from '~@vite/vitejs-accountblock';
import { Address, Hex, Base64, BigInt, Uint64, BlockType, TokenId, AccountBlockBlock, ProviderType } from './type';


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

    private viteProvider: ProviderType

    constructor({ blockType, address, fee, data, sendBlockHash, amount, toAddress, tokenId }: {
        blockType: BlockType;
        address: Address;
        fee?: BigInt;
        data?: Base64;
        sendBlockHash?: Hex;
        amount?: BigInt;
        toAddress?: Address;
        tokenId?: TokenId;
    }, viteProvider?: ProviderType) {
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
        this.toAddress = toAddress;
        this.tokenId = tokenId;

        viteProvider && this.setViteProvider(viteProvider);
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

    get isRequestBlock(): Boolean {
        return isRequestBlock(this.blockType);
    }

    get isResponseBlock(): Boolean {
        return isResponseBlock(this.blockType);
    }

    get hash(): Hex {
        return getAccountBlockHash({
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
        });
    }

    setViteProvider(viteProvider: ProviderType) {
        this.viteProvider = viteProvider;
    }

    updateViteProvider(viteProvider: ProviderType) {
        this.viteProvider = viteProvider;
    }

    async getHeight(): Promise<{height: Uint64; previousHash: Hex }> {
        const previousAccountBlock = await this.viteProvider.request('ledger_getLatestAccountBlock', this.address);
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

    async autoSetHeight() {
        const { height, previousHash } = await this.getHeight();
        this.setHeight({ height, previousHash });
        return {
            height: this.height,
            previousHash: this.previousHash
        };
    }

    async getToAddress() {
        const err = checkParams(this.accountBlock, ['previousHash'], [{
            name: 'blockType',
            func: _b => _b === BlockType.CreateContractRequest
        }]);
        if (err) {
            throw err;
        }

        return this.viteProvider.request('contract_createContractAddress', this.address, this.height, this.previousHash);
    }

    setToAddress(address: Address) {
        this.toAddress = address;
    }

    async autoSetToAddress() {
        if (this.blockType !== BlockType.CreateContractRequest) {
            return this.toAddress;
        }

        const address = await this.getToAddress();
        this.setToAddress(address);
        return this.toAddress;
    }

    async getDifficulty(): Promise<{
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
        } = await this.viteProvider.request('ledger_getPoWDifficulty', {
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

        const nonce: Base64 = this.viteProvider.request('util_getPoWNonce', this.difficulty, getNonceHash);
        return nonce;
    }

    setNonce(nonce: Base64) {
        this.nonce = nonce;
    }

    async autoSetNonce(): Promise<{difficulty: BigInt; nonce: Base64}> {
        const result = await this.getDifficulty();
        this.setDifficulty(result.difficulty);

        const nonce: Base64 = this.difficulty ? await this.getNonce() : null;
        this.setNonce(nonce);

        return {
            difficulty: this.difficulty,
            nonce: this.nonce
        };
    }

    setPublicKey(publicKey: Hex | Base64) {
        const err = checkParams({ publicKey }, ['publicKey'], [{
            name: 'publicKey',
            func: _p => isHexString(_p) || isBase64String(_p),
            msg: 'PublicKey is Hex-string or Base64-string'
        }]);

        if (err) {
            throw err;
        }

        const publicKeyBase64 = isBase64String(publicKey)
            ? publicKey
            : Buffer.from(`${ publicKey }`, 'hex').toString('base64');
        const publicKeyHex = isBase64String(publicKey)
            ? Buffer.from(`${ publicKey }`, 'base64').toString('hex')
            : publicKey;

        const address = getAddressFromPublicKey(publicKeyHex);
        if (this.address !== address) {
            throw new Error('PublicKey is wrong.');
        }

        this.publicKey = publicKeyBase64;
    }

    setSignature(signature: Hex | Base64) {
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
            return;
        }
        this.signature = Buffer.from(signature, 'hex').toString('base64');
    }

    sign(privateKey: Hex): AccountBlockBlock {
        const { signature, publicKey } = signAccountBlock(this.accountBlock, privateKey);
        this.setPublicKey(publicKey);
        this.setSignature(signature);
        return this.accountBlock;
    }

    async send() {
        const err = checkAccountBlock(this.accountBlock);
        if (err) {
            throw err;
        }

        try {
            const res = await this.viteProvider.request('ledger_sendRawTransaction', this.accountBlock);
            return res || this.accountBlock;
        } catch (err) {
            err.acccountBlock = this.accountBlock;
            throw err;
        }
    }

    async autoPoWSend(privateKey: Hex) {
        await this.autoSetHeight();
        await this.autoSetToAddress();
        await this.autoSetNonce();
        this.sign(privateKey);
        return this.send();
    }

    async autoSend(privateKey: Hex) {
        await this.autoSetHeight();
        await this.autoSetToAddress();
        this.sign(privateKey);
        return this.send();
    }
}

export const AccountBlock = AccountBlockClass;
export default AccountBlockClass;
