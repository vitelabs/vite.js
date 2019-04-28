import * as privToAddr from '~@vite/vitejs-privtoaddr';
import client from '~@vite/vitejs-client';
import { Snapshot_Gid } from '~@vite/vitejs-constant';

import { Address } from '../type';

class AddrAccountClass {
    address: Address
    realAddress: string
    _client: client
    getBlock: Object

    constructor({ address, client }: {
        address: Address; client: client;
    } = { address: null, client: null }) {
        if (!privToAddr.isValidHexAddr(address)) {
            throw new Error(`Illegal address ${ address }.`);
        }

        this.address = address;
        this.realAddress = privToAddr.getAddrFromHexAddr(this.address);

        this._client = client;
        this.getBlock = {};
        this._setMethodBlock();
    }

    callOffChainContract({ abi, offChainCode }) {
        return this._client.callOffChainContract({
            addr: this.address,
            abi,
            offChainCode
        });
    }

    getBalance() {
        return this._client.getBalance(this.address);
    }

    getTxList({ index, pageCount = 50, totalNum = null }) {
        return this._client.getTxList({ addr: this.address, index, pageCount, totalNum });
    }

    getOnroad() {
        return this._client.onroad.getOnroadInfoByAddress(this.address);
    }

    getOnroadBlocks({ index, pageCount = 50 }) {
        return this._client.onroad.getOnroadBlocksByAddress(this.address, index, pageCount);
    }

    getBlocks({ index, pageCount = 50 }) {
        return this._client.ledger.getBlocksByAccAddr(this.address, index, pageCount);
    }

    getAccountBalance() {
        return this._client.ledger.getAccountByAccAddr(this.address);
    }

    getLatestBlock() {
        return this._client.ledger.getLatestBlock(this.address);
    }

    getBlockByHeight(height) {
        return this._client.ledger.getBlockByHeight(this.address, height);
    }

    getBlocksByHash({ hash, num }) {
        return this._client.ledger.getBlocksByHash(this.address, hash, num);
    }

    getBlocksByHashInToken({ hash, tokenId, num }) {
        return this._client.ledger.getBlocksByHashInToken(this.address, hash, tokenId, num);
    }

    getPledgeQuota() {
        return this._client.pledge.getPledgeQuota(this.address);
    }

    getPledgeList({ index, pageCount }) {
        return this._client.pledge.getPledgeList(this.address, index, pageCount);
    }

    getRegistrationList() {
        return this._client.register.getRegistrationList(Snapshot_Gid, this.address);
    }

    getVoteInfo() {
        return this._client.vote.getVoteInfo(Snapshot_Gid, this.address);
    }

    getTokenInfoListByOwner() {
        return this._client.mintage.getTokenInfoListByOwner(this.address);
    }

    private _setMethodBlock() {
        for (const key in this._client.builtinTxBlock) {
            if (key === '_client') {
                continue;
            }

            this.getBlock[key] = (block, requestType?) => {
                block = block || {};
                block.accountAddress = this.address;
                return this._client.builtinTxBlock[key](block, requestType);
            };
        }
    }
}

export const addrAccount = AddrAccountClass;
export default AddrAccountClass;
