class Vite {
    constructor(provider) {
        this._currentProvider = provider;
    }

    setProvider(provider) {
        this._currentProvider = provider;
    }

    /**
     * Get account list
     *
     * @param {*} {pageIndex, pageCount, pageNum, tokenName, tokenId}
     * @param {*} callback
     * @memberof Account
     * @returns Array<account>
     */
    getAccountList({ pageIndex, pageCount, pageNum, tokenName, tokenId }) {

    }

    /**
     * Get account details
     *
     * @param {*} {accountAddress}
     * @param {*} callback
     * @memberof Account
     */
    getAccount({ accountAddress }) {

    }

    /**
     * Get account block list
     *
     * @param {*} {pageIndex, pageCount, pageNum, accountAddress, tokenName, tokenId}
     * @param {*} callback
     * @memberof AccountChain
     * @returns Array<accountBlock>
     */
    getAccountBlockList({ pageIndex, pageCount, pageNum, accountAddress, tokenName, tokenId }) {

    }

    /**
     * Get account block details
     *
     * @param {*} {blockHash}
     * @param {*} callback
     * @memberof AccountChain
     */
    getAccountBlock({ blockHash }) {

    }

    /**
     * Get Snapshot block list
     *
     * @param {*} {pageIndex, pageCount, pageNum}
     * @param {*} callback
     * @memberof SnapshotChain
     * @returns Array<SnapshotBlock>
     */
    getSnapshotBlockList({ pageIndex, pageCount, pageNum }) {
       
    }

    /**
     * Get Snapshot block details
     *
     * @param {*} {blockHash}
     * @param {*} callback
     * @memberof SnapshotChain
     */
    getSnapshotBlock({ blockHash }) {

    }

    /**
     * Get Token block list
     *
     * @param {*} {pageIndex, pageCount, pageNum}
     * @param {*} callback
     * @memberof SnapshotChain
     * @returns Array<SnapshotBlock>
     */
    getTokenList({ pageIndex, pageCount, pageNum }) {
      
    }

    /**
     * Get Token block details
     *
     * @param {*} {tokenName, tokenId}
     * @param {*} callback
     * @memberof SnapshotChain
     */
    getToken({ tokenName, tokenId }) {

    }
}

export default Vite;