import { BlockType, Vite_TokenId, Contracts } from './../constant';
import { isValidAddress, AddressType, createAddressByPrivateKey  } from './../wallet/address';
import { checkParams, isNonNegativeInteger, isHexString, isArray, isObject, isValidSBPName, isValidTokenId, isBase64String } from './../utils';

import AccountBlock from './accountBlock';
import { getCreateContractData, getCallContractData } from './utils';

import { Hex, Address, TokenId, BigInt, Base64, Int32, Uint8, Uint32, Uint256, Bytes32, ProviderType } from './type';


class TransactionClass {
    readonly address: Address
    private provider: ProviderType
    private privateKey: Hex

    constructor(address: Address) {
        const err = checkParams({ address }, ['address'], [{
            name: 'address',
            func: isValidAddress
        }]);
        if (err) {
            throw err;
        }

        this.address = address;
    }

    setProvider(provider: ProviderType): TransactionClass {
        this.provider = provider;
        return this;
    }

    setPrivateKey(privateKey: Hex): TransactionClass {
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

    receive({ sendBlockHash }: { sendBlockHash: Hex }): AccountBlock {
        const err = checkParams({ sendBlockHash }, ['sendBlockHash']);
        if (err) {
            throw err;
        }

        const accountBlock: AccountBlock = new AccountBlock({
            blockType: BlockType.Response,
            address: this.address,
            sendBlockHash
        }, this.provider, this.privateKey);

        return accountBlock;
    }

    send({ toAddress, tokenId = Vite_TokenId, amount = '0', data }: {
        toAddress: Address;
        tokenId: TokenId;
        amount: BigInt;
        data: Base64;
    }): AccountBlock {
        const err = checkParams({ toAddress }, ['toAddress']);
        if (err) {
            throw err;
        }

        const accountBlock: AccountBlock = new AccountBlock({
            blockType: BlockType.TransferRequest,
            address: this.address,
            toAddress,
            tokenId,
            amount,
            data
        }, this.provider, this.privateKey);

        return accountBlock;
    }

    createContract({ responseLatency = '0', quotaMultiplier = '10', randomDegree = '0', code, abi, params }: {
        code: Hex;
        responseLatency?: Uint8;
        quotaMultiplier?: Uint8;
        randomDegree?: Uint8;
        abi?: Object | Array<Object>;
        params?: string | Array<string | boolean>;
    }): AccountBlock {
        const err = checkParams({ abi, responseLatency, quotaMultiplier, randomDegree },
            [ 'responseLatency', 'quotaMultiplier', 'randomDegree' ],
            [{
                name: 'abi',
                func: _a => isArray(_a) || isObject(_a)
            }]);
        if (err) {
            throw err;
        }

        const data = getCreateContractData({
            abi,
            code,
            params,
            responseLatency,
            quotaMultiplier,
            randomDegree
        });
        return new AccountBlock({
            blockType: BlockType.CreateContractRequest,
            address: this.address,
            data,
            fee: '10000000000000000000',
            tokenId: Vite_TokenId
        }, this.provider, this.privateKey);
    }

    callContract({ toAddress, tokenId = Vite_TokenId, amount = '0', fee = '0', abi, methodName, params = [] }: {
        toAddress: Address;
        abi: Object | Array<Object>;
        methodName?: string;
        params?: any;
        tokenId?: TokenId;
        amount?: BigInt;
        fee?: BigInt;
    }): AccountBlock {
        const err = checkParams({ toAddress, abi }, [ 'toAddress', 'abi' ], [{
            name: 'address',
            func: _a => isValidAddress(_a) === AddressType.Contract
        }]);
        if (err) {
            throw err;
        }

        return new AccountBlock({
            blockType: BlockType.TransferRequest,
            address: this.address,
            toAddress,
            tokenId,
            amount,
            fee,
            data: getCallContractData({ abi, params, methodName })
        }, this.provider, this.privateKey);
    }

    registerSBP({ sbpName, blockProducingAddress, rewardWithdrawAddress, amount = '1000000000000000000000000' }: {
        sbpName: string;
        blockProducingAddress: Address;
        rewardWithdrawAddress: Address;
        amount?: BigInt;
    }): AccountBlock {
        const err = checkParams({ blockProducingAddress, sbpName, rewardWithdrawAddress }, [ 'blockProducingAddress', 'sbpName', 'rewardWithdrawAddress' ], [ {
            name: 'sbpName',
            func: isValidSBPName
        }, {
            name: 'blockProducingAddress',
            func: isValidAddress
        }, {
            name: 'rewardWithdrawAddress',
            func: isValidAddress
        } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.RegisterSBP.abi,
            toAddress: Contracts.RegisterSBP.contractAddress,
            params: [ sbpName, blockProducingAddress, rewardWithdrawAddress ],
            tokenId: Vite_TokenId,
            amount
        });
    }

    updateSBPBlockProducingAddress({ sbpName, blockProducingAddress }: {
        sbpName: string;
        blockProducingAddress: Address;
    }): AccountBlock {
        const err = checkParams({ blockProducingAddress, sbpName }, [ 'blockProducingAddress', 'sbpName' ], [ {
            name: 'sbpName',
            func: isValidSBPName
        }, {
            name: 'blockProducingAddress',
            func: isValidAddress
        } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.UpdateSBPBlockProducingAddress.abi,
            toAddress: Contracts.UpdateSBPBlockProducingAddress.contractAddress,
            params: [ sbpName, blockProducingAddress ]
        });
    }

    UpdateSBPRewardWithdrawAddress({ sbpName, rewardWithdrawAddress }: {
        sbpName: string;
        rewardWithdrawAddress: Address;
    }): AccountBlock {
        const err = checkParams({ rewardWithdrawAddress, sbpName }, [ 'rewardWithdrawAddress', 'sbpName' ], [ {
            name: 'sbpName',
            func: isValidSBPName
        }, {
            name: 'rewardWithdrawAddress',
            func: isValidAddress
        } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.UpdateSBPRewardWithdrawAddress.abi,
            toAddress: Contracts.UpdateSBPRewardWithdrawAddress.contractAddress,
            params: [ sbpName, rewardWithdrawAddress ]
        });
    }

    revokeSBP({ sbpName }: {
        sbpName: string;
    }): AccountBlock {
        const err = checkParams({ sbpName }, ['sbpName'], [{
            name: 'sbpName',
            func: isValidSBPName
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.RevokeSBP.abi,
            toAddress: Contracts.RevokeSBP.contractAddress,
            params: [sbpName]
        });
    }

    withdrawSBPReward({ sbpName, receiveAddress }: {
        sbpName: string;
        receiveAddress: Address;
    }): AccountBlock {
        const err = checkParams({ sbpName, receiveAddress }, [ 'sbpName', 'receiveAddress' ], [ {
            name: 'sbpName',
            func: isValidSBPName
        }, {
            name: 'receiveAddress',
            func: isValidAddress
        } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.WithdrawSBPReward.abi,
            toAddress: Contracts.WithdrawSBPReward.contractAddress,
            params: [ sbpName, receiveAddress ]
        });
    }

    voteForSBP({ sbpName }: {
        sbpName: string;
    }): AccountBlock {
        const err = checkParams({ sbpName }, ['sbpName'], [{
            name: 'sbpName',
            func: isValidSBPName
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.VoteForSBP.abi,
            toAddress: Contracts.VoteForSBP.contractAddress,
            params: [sbpName]
        });
    }

    cancelSBPVoting(): AccountBlock {
        return this.callContract({
            abi: Contracts.CancelSBPVoting.abi,
            toAddress: Contracts.CancelSBPVoting.contractAddress,
            params: []
        });
    }

    stakeForQuota({ beneficiaryAddress, amount }: {
        beneficiaryAddress: Address;
        amount: BigInt;
    }): AccountBlock {
        const err = checkParams({ beneficiaryAddress, amount }, [ 'beneficiaryAddress', 'amount' ], [{
            name: 'beneficiaryAddress',
            func: isValidAddress
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.StakeForQuota.abi,
            toAddress: Contracts.StakeForQuota.contractAddress,
            params: [beneficiaryAddress],
            tokenId: Vite_TokenId,
            amount
        });
    }

    stakeForQuota_V2({ beneficiaryAddress, amount }: {
        beneficiaryAddress: Address;
        amount: BigInt;
    }): AccountBlock {
        const err = checkParams({ beneficiaryAddress, amount }, [ 'beneficiaryAddress', 'amount' ], [{
            name: 'beneficiaryAddress',
            func: isValidAddress
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.StakeForQuota_V2.abi,
            toAddress: Contracts.StakeForQuota_V2.contractAddress,
            params: [beneficiaryAddress],
            tokenId: Vite_TokenId,
            amount
        });
    }

    cancelQuotaStake({ id }: {
        id: Bytes32;
    }): AccountBlock {
        const err = checkParams({ id }, ['id']);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.CancelQuotaStake.abi,
            toAddress: Contracts.CancelQuotaStake.contractAddress,
            params: [id]
        });
    }

    cancelQuotaStake_V2({ beneficiaryAddress, amount }: {
        beneficiaryAddress: Address;
        amount: Uint256;
    }): AccountBlock {
        const err = checkParams({ beneficiaryAddress, amount }, [ 'beneficiaryAddress', 'amount' ], [{
            name: 'beneficiaryAddress',
            func: isValidAddress
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.CancelQuotaStake_V2.abi,
            toAddress: Contracts.CancelQuotaStake_V2.contractAddress,
            params: [ beneficiaryAddress, amount ]
        });
    }

    issueToken({ tokenName, isReIssuable, maxSupply, isOwnerBurnOnly, totalSupply, decimals, tokenSymbol }: {
        tokenName: string;
        tokenSymbol: string;
        decimals: Uint8;
        maxSupply: Uint256;
        totalSupply: Uint256;
        isReIssuable: boolean;
        isOwnerBurnOnly: boolean;
    }): AccountBlock {
        const err = checkParams({ tokenName, tokenSymbol, decimals }, [ 'tokenName', 'tokenSymbol', 'decimals' ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.IssueToken.abi,
            toAddress: Contracts.IssueToken.contractAddress,
            params: [ isReIssuable, tokenName, tokenSymbol, totalSupply, decimals, maxSupply, isOwnerBurnOnly ],
            fee: '1000000000000000000000'
        });
    }

    reIssueToken({ tokenId, amount, receiveAddress }: {
        tokenId: TokenId;
        amount: Uint256;
        receiveAddress: Address;
    }): AccountBlock {
        const err = checkParams({ tokenId, amount, receiveAddress }, [ 'tokenId', 'amount', 'receiveAddress' ], [ {
            name: 'receiveAddress',
            func: isValidAddress
        }, {
            name: 'amount',
            func: isNonNegativeInteger,
            msg: 'Amount must be an non-negative integer string.'
        } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.ReIssueToken.abi,
            toAddress: Contracts.ReIssueToken.contractAddress,
            params: [ tokenId, amount, receiveAddress ],
            tokenId
        });
    }

    burnToken({ tokenId, amount }: {
        tokenId: TokenId;
        amount: BigInt;
    }): AccountBlock {
        const err = checkParams({ tokenId, amount }, [ 'tokenId', 'amount' ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.BurnToken.abi,
            toAddress: Contracts.BurnToken.contractAddress,
            params: [],
            tokenId,
            amount
        });
    }

    disableReIssueToken({ tokenId }: {
        tokenId: TokenId;
    }): AccountBlock {
        const err = checkParams({ tokenId }, ['tokenId']);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DisableReIssue.abi,
            toAddress: Contracts.DisableReIssue.contractAddress,
            params: [tokenId],
            tokenId
        });
    }

    transferTokenOwnership({ newOwnerAddress, tokenId }: {
        tokenId: TokenId;
        newOwnerAddress: Address;
    }): AccountBlock {
        const err = checkParams({ tokenId, newOwnerAddress }, [ 'tokenId', 'newOwnerAddress' ], [{
            name: 'newOwnerAddress',
            func: isValidAddress
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.TransferTokenOwnership.abi,
            toAddress: Contracts.TransferTokenOwnership.contractAddress,
            params: [ tokenId, newOwnerAddress ],
            tokenId
        });
    }

    dexDeposit({ tokenId, amount }: {
        tokenId: TokenId;
        amount: BigInt;
    }): AccountBlock {
        const err = checkParams({ tokenId, amount }, [ 'tokenId', 'amount' ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexDeposit.abi,
            toAddress: Contracts.DexDeposit.contractAddress,
            params: [],
            tokenId,
            amount
        });
    }

    dexWithdraw({ tokenId, amount }: {
        tokenId: TokenId;
        amount: Uint256;
    }): AccountBlock {
        const err = checkParams({ tokenId, amount }, [ 'tokenId', 'amount' ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexWithdraw.abi,
            toAddress: Contracts.DexWithdraw.contractAddress,
            params: [ tokenId, amount ],
            tokenId
        });
    }

    dexOpenNewMarket({ tradeToken, quoteToken }: {
        tradeToken: TokenId;
        quoteToken: TokenId;
    }): AccountBlock {
        const err = checkParams({ tradeToken, quoteToken }, [ 'tradeToken', 'quoteToken' ], [ {
            name: 'tradeToken',
            func: isValidTokenId
        }, {
            name: 'quoteToken',
            func: isValidTokenId
        } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            toAddress: Contracts.DexOpenNewMarket.contractAddress,
            abi: Contracts.DexOpenNewMarket.abi,
            params: [ tradeToken, quoteToken ]
        });
    }

    dexPlaceOrder({ tradeToken, quoteToken, side, price, quantity, orderType = '0' }: {
        tradeToken: TokenId;
        quoteToken: TokenId;
        side: '0' | '1';
        orderType: Uint8;
        price: string;
        quantity: Uint256;
    }): AccountBlock {
        const err = checkParams({ tradeToken, quoteToken, side, price, quantity },
            [ 'tradeToken', 'quoteToken', 'side', 'price', 'quantity' ],
            [ {
                name: 'tradeToken',
                func: isValidTokenId
            }, {
                name: 'quoteToken',
                func: isValidTokenId
            }, {
                name: 'side',
                func: _s => `${ _s }` === '1' || `${ _s }` === '0'
            } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexPlaceOrder.abi,
            toAddress: Contracts.DexPlaceOrder.contractAddress,
            params: [ tradeToken, quoteToken, side, orderType, price, quantity ],
            tokenId: tradeToken
        });
    }

    dexCancelOrder({ orderId }: {
        orderId: Hex | Base64;
    }): AccountBlock {
        const err = checkParams({ orderId }, ['orderId'], [{
            name: 'orderId',
            func: _o => isHexString(_o) || isBase64String(_o)
        }]);
        if (err) {
            throw err;
        }

        if (isBase64String(orderId)) {
            orderId = Buffer.from(orderId, 'base64').toString('hex');
        }

        return this.callContract({
            abi: Contracts.DexCancelOrder.abi,
            toAddress: Contracts.DexCancelOrder.contractAddress,
            params: [`0x${ orderId }`]
        });
    }

    dexStakeForMining({ actionType, amount }: {
        actionType: Uint8;
        amount: Uint256;
    }): AccountBlock {
        const err = checkParams({ actionType, amount }, [ 'actionType', 'amount' ], [ {
            name: 'actionType',
            func: _a => Number(actionType) === 1 || Number(actionType) === 2
        }, {
            name: 'amount',
            func: isNonNegativeInteger,
            msg: 'Amount must be an non-negative integer string.'
        } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexStakeForMining.abi,
            toAddress: Contracts.DexStakeForMining.contractAddress,
            params: [ actionType, amount ]
        });
    }

    dexStakeForVIP({ actionType }: {
        actionType: Uint8;
    }): AccountBlock {
        const err = checkParams({ actionType }, ['actionType'], [{
            name: 'actionType',
            func: _a => Number(actionType) === 1 || Number(actionType) === 2
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexStakeForVIP.abi,
            toAddress: Contracts.DexStakeForVIP.contractAddress,
            params: [actionType]
        });
    }

    dexMarketAdminConfig({ operationCode, tradeToken, quoteToken, marketOwner, takerFeeRate, makerFeeRate, stopMarket = false }: {
        operationCode: Uint8;
        tradeToken: TokenId;
        quoteToken: TokenId;
        marketOwner: Address;
        takerFeeRate: Int32;
        makerFeeRate: Int32;
        stopMarket?: boolean;
    }): AccountBlock {
        const err = checkParams({ operationCode, tradeToken, quoteToken, marketOwner, takerFeeRate, makerFeeRate },
            [ 'operationCode', 'tradeToken', 'quoteToken', 'marketOwner', 'takerFeeRate', 'makerFeeRate' ],
            [ {
                name: 'tradeToken',
                func: isValidTokenId
            }, {
                name: 'quoteToken',
                func: isValidTokenId
            }, {
                name: 'marketOwner',
                func: isValidAddress
            }, {
                name: 'operationCode',
                func: _o => _o >= 1 && _o <= 15
            } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexMarketAdminConfig.abi,
            toAddress: Contracts.DexMarketAdminConfig.contractAddress,
            params: [ operationCode, tradeToken, quoteToken, marketOwner, takerFeeRate, makerFeeRate, !!stopMarket ],
            tokenId: quoteToken
        });
    }

    dexTransferTokenOwnership({ tokenId, newOwner }): AccountBlock {
        const err = checkParams({ tokenId, newOwner }, [ 'tokenId', 'newOwner' ], [{
            name: 'newOwner',
            func: isValidAddress
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexTransferTokenOwnership.abi,
            toAddress: Contracts.DexTransferTokenOwnership.contractAddress,
            params: [ tokenId, newOwner ],
            tokenId
        });
    }

    dexCreateNewInviter(): AccountBlock {
        return this.callContract({
            abi: Contracts.DexCreateNewInviter.abi,
            toAddress: Contracts.DexCreateNewInviter.contractAddress,
            params: []
        });
    }

    dexBindInviteCode({ code }: {
        code: Uint32;
    }): AccountBlock {
        const err = checkParams({ code }, ['code']);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexBindInviteCode.abi,
            toAddress: Contracts.DexBindInviteCode.contractAddress,
            params: [code]
        });
    }

    dexStakeForSuperVIP({ actionType }: {
        actionType: Uint8;
    }): AccountBlock {
        const err = checkParams({ actionType }, ['actionType'], [{
            name: 'actionType',
            func: _a => Number(_a) === 1 || Number(_a) === 2
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexStakeForSuperVIP.abi,
            toAddress: Contracts.DexStakeForSuperVIP.contractAddress,
            params: [actionType]
        });
    }

    dexConfigMarketAgents({ actionType, agent, tradeTokens, quoteTokens }: {
        actionType: Uint8;
        agent: Address;
        tradeTokens: TokenId[];
        quoteTokens: TokenId[];
    }) {
        const err = checkParams({ actionType, agent, tradeTokens, quoteTokens },
            [ 'actionType', 'agent', 'tradeTokens', 'quoteTokens' ],
            [ {
                name: 'actionType',
                func: _a => Number(_a) === 1 || Number(_a) === 2
            }, {
                name: 'agent',
                func: isValidAddress
            }, {
                name: 'tradeTokens',
                func: _t => {
                    for (let i = 0; i < _t.length; i++) {
                        if (!isValidTokenId(_t[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }, {
                name: 'quoteTokens',
                func: _t => {
                    for (let i = 0; i < _t.length; i++) {
                        if (!isValidTokenId(_t[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexConfigMarketAgents.abi,
            toAddress: Contracts.DexConfigMarketAgents.contractAddress,
            params: [ actionType, agent, tradeTokens, quoteTokens ]
        });
    }

    dexLockVxForDividend({ actionType, amount }: {
        actionType: Uint8;
        amount: Uint256;
    }) {
        const err = checkParams({ actionType, amount }, [ 'actionType', 'amount' ], [ {
            name: 'actionType',
            func: _a => Number(actionType) === 1 || Number(actionType) === 2
        }, {
            name: 'amount',
            func: isNonNegativeInteger,
            msg: 'Amount must be an non-negative integer string.'
        } ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexLockVxForDividend.abi,
            toAddress: Contracts.DexLockVxForDividend.contractAddress,
            params: [ actionType, amount ]
        });
    }

    dexSwitchConfig({ switchType, enable }: {
        switchType: Uint8;
        enable: boolean;
    }) {
        const err = checkParams({ switchType, enable }, [ 'switchType', 'enable' ]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexSwitchConfig.abi,
            toAddress: Contracts.DexSwitchConfig.contractAddress,
            params: [ switchType, enable ]
        });
    }

    dexStakeForPrincipalSVIP({ principal }: {
        principal: Address;
    }) {
        const err = checkParams({ principal }, ['principal'], [{
            name: 'principal',
            func: isValidAddress
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexStakeForPrincipalSVIP.abi,
            toAddress: Contracts.DexStakeForPrincipalSVIP.contractAddress,
            params: [principal]
        });
    }

    dexCancelStakeById({ id }: {
        id: Hex;
    }) {
        const err = checkParams({ id }, ['id'], [{
            name: 'id',
            func: isHexString
        }]);
        if (err) {
            throw err;
        }

        return this.callContract({
            abi: Contracts.DexCancelStakeById.abi,
            toAddress: Contracts.DexCancelStakeById.contractAddress,
            params: [id]
        });
    }
}

export const Transaction = TransactionClass;
export default TransactionClass;
