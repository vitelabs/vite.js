class Vite {
    constructor(provider) {
        this.provider = provider;
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
        // rpc params
        // paging: {
        //     number index, // 从第几页开始取，从0开始。
        //     number num,   // 取几页。默认取1页
        //     number count  // 每页取多少个Account。默认为10个。
        // },

        // optional string tokenName, // 可选，代币的名称，如果没写tokenName和tokenId，默认就是vite代币
        // optional string tokenId, // 可选，代币的Id
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
        // rpc params
        // paging: {
        //     number index, // 从第几页开始取，从0开始。
        //     number num,   // 取几页。默认取1页
        //     number count  // 每页取多少个Block。默认为10个。
        // },
        // optional string accountAddress, // 可选，账号地址
        // optional string tokenName,   // 可选，代币名称
        // optional string tokenId,    // 可选，代币Id
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
        // rpc params
        //{
        //     paging: {
        //         number index, // 从第几页开始取，从0开始。
        //         number num,   // 取几页。默认取1页
        //         number count  // 每页取多少个Block。默认为10个。
        //     }
        // }
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
        // rpc params
        //{
        //     paging: {
        //         number index, // 从第几页开始取，从0开始。
        //         number num,   // 取几页。默认取1页
        //         number count  // 每页取多少个Block。默认为10个。
        //     }
        // }
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

module.exports = Vite;