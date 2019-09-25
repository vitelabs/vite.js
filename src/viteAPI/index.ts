import { requestTimeout } from '~@vite/vitejs-error';
import { checkParams, isArray } from '~@vite/vitejs-utils';
import { isAddress } from '~@vite/vitejs-hdwallet/address';
import { Contracts } from '~@vite/vitejs-constant';
import { getTransactionTypeByContractList } from '~@vite/vitejs-accountblock/builtin';
import { getTransactionType, decodeBlockByContract } from '~@vite/vitejs-accountblock';

import { RPCrequest, RPCresponse, Methods, Address, AccountBlockType, Transaction, AccountBlockBlock } from './type';
import EventEmitter from './eventEmitter';


class ViteAPIClass {
    _provider: any
    isConnected: Boolean
    private subscriptionList: Array<EventEmitter>
    private requestList: Array<any>
    private customTransactionType: Object

    constructor(provider: any, firstConnect: Function) {
        this._provider = provider;
        this.isConnected = false;
        this.connectedOnce(firstConnect);
        this.requestList = [];
        this.subscriptionList = [];

        // { [funcSign + contractAddress]: { contractAddress, abi, transactionType } }
        this.customTransactionType = null;
    }

    // { [txType]String: { contractAddress:Address, abi:String } }
    addTransactionType(contractList: Object = {}) {
        for (const transactionType in contractList) {
            if (Contracts[transactionType]) {
                throw new Error(`Please rename it. Your transactionType ${ transactionType } conflicts with default transactionType.`);
            }
            if (this.customTransactionType && this.customTransactionType[transactionType]) {
                throw new Error(`Please rename it. Your transactionType ${ transactionType } conflicts with custom transactionType.`);
            }
        }

        const contract = getTransactionTypeByContractList(contractList);
        this.customTransactionType = Object.assign({}, this.customTransactionType, contract);
    }

    async getBalanceAndUnreceived(address: Address) {
        const err = checkParams({ address }, ['address'], [{
            name: 'address',
            func: isAddress
        }]);
        if (err) {
            return Promise.reject(err);
        }

        const data = await this.batch([ {
            // ledger.getAccountByAccAddr
            methodName: 'ledger_getAccountByAccAddr',
            params: [address]
        }, {
            // onroad.getOnroadInfoByAddress
            methodName: 'ledger_getUnreceivedBlocksByAddress',
            params: [address]
        } ]);

        if (!data || (data instanceof Array && data.length < 2)) {
            return null;
        }

        return {
            balance: data[0].result,
            unreceived: data[1].result
        };
    }

    async getTransactionList({ address, pageIndex, pageCount = 50 }: {
        address: Address; pageIndex: number; pageCount?: number;
    }, decodeTxTypeList: 'all' | String[] = 'all') {
        const err = checkParams({ address, pageIndex, decodeTxTypeList }, [ 'address', 'pageIndex' ], [ {
            name: 'address',
            func: isAddress
        }, {
            name: 'decodeTxTypeList',
            func: function (_d) {
                return _d === 'all' || _d === 'none' || isArray(_d);
            },
            msg: '\'all\' || \'none\' || TransactionType[]'
        } ]);
        if (err) {
            throw err;
        }

        pageIndex = pageIndex >= 0 ? pageIndex : 0;
        const data = await this.request('ledger_getBlocksByAccAddr', address, pageIndex, pageCount);
        const rawList = data || [];

        const list: Transaction[] = [];
        rawList.forEach((accountBlock: AccountBlockType) => {
            const transaction: Transaction = accountBlock;
            const { abi, transactionType, contractAddress } = getTransactionType(accountBlock, this.customTransactionType);

            transaction.transationType = transactionType;

            const isDecodeTx = contractAddress
                && abi
                && (
                    decodeTxTypeList === 'all'
                    || (decodeTxTypeList.length && decodeTxTypeList.indexOf(transactionType) !== -1
                    )
                );

            if (isDecodeTx) {
                transaction.contractResult = contractAddress && abi
                    ? decodeBlockByContract({ accountBlock, contractAddress, abi })
                    : null;
            }

            list.push(transaction);
        });

        return list;
    }

    async sendAccountBlock(accountBlock: AccountBlockBlock) {
        // const data = await this.request('ledger_getBlocksByAccAddr', address, pageIndex, pageCount);

    }

    setProvider(provider, firstConnect, abort) {
        abort && this._provider.abort(abort);
        this.clearSubscriptions();
        this._provider = provider;

        this.isConnected = false;
        this.connectedOnce(firstConnect);
    }

    unSubscribe(event) {
        let i;

        for (i = 0; i < this.subscriptionList.length; i++) {
            if (this.subscriptionList[i] === event) {
                break;
            }
        }

        if (i >= this.subscriptionList.length) {
            return;
        }

        event && event.stopLoop();
        this.subscriptionList.splice(i, 1);

        if (!this.subscriptionList || !this.subscriptionList.length) {
            this._provider.unSubscribe && this._provider.unSubscribe();
        }
    }

    clearSubscriptions() {
        this.subscriptionList.forEach(s => {
            s.stopLoop();
        });
        this.subscriptionList = [];
        this._provider.unSubscribe && this._provider.unSubscribe();
    }

    async request(methods: Methods, ...args: any[]) {
        if (!this.isConnected) {
            return this._onReq('request', methods, ...args);
        }

        const rep: RPCresponse = await this._provider.request(methods, args);
        if (rep.error) {
            throw rep.error;
        }
        return rep.result;
    }

    async notification(methods: Methods, ...args: any[]) {
        if (!this.isConnected) {
            return this._onReq('notification', methods, ...args);
        }

        return this._provider.notification(methods, args);
    }

    async batch(reqs: RPCrequest[]) {
        if (!this.isConnected) {
            return this._onReq('batch', reqs);
        }

        reqs.forEach(v => {
            v.type = v.type || 'request';
        });
        const reps: RPCresponse[] = await this._provider.batch(reqs);
        return reps;
    }

    async subscribe(methodName, ...args) {
        const subMethodName = this._provider.subscribe ? 'subscribe_subscribe' : `subscribe_${ methodName }Filter`;
        const params = this._provider.subscribe ? [ methodName, ...args ] : args;

        let rep;
        if (this.isConnected) {
            rep = await this._provider.request(subMethodName, params);
            rep = rep.result;
        } else {
            rep = await this._onReq('request', subMethodName, ...params);
        }

        const subscription = rep;

        if (!this.subscriptionList || !this.subscriptionList.length) {
            this.subscriptionList = [];
            this._provider.subscribe && this._provider.subscribe(jsonEvent => {
                this.subscribeCallback(jsonEvent);
            });
        }

        const event = new EventEmitter(subscription, this, !!this._provider.subscribe);
        if (!this._provider.subscribe) {
            event.startLoop(jsonEvent => {
                this.subscribeCallback(jsonEvent);
            });
        }

        this.subscriptionList.push(event);
        return event;
    }


    private _offReq(_q) {
        let i;
        for (i = 0; i < this.requestList.length; i++) {
            if (this.requestList[i] === _q) {
                break;
            }
        }
        if (i === this.requestList.length) {
            return;
        }
        this.requestList.splice(i, 1);
    }

    private _onReq(type, methods, ...args) {
        return new Promise((res, rej) => {
            const _q = () => {
                this[type](methods, ...args).then(data => {
                    clearTimeout(_timeout);
                    this._offReq(_q);
                    res(data);
                }).catch(err => {
                    this._offReq(_q);
                    clearTimeout(_timeout);
                    rej(err);
                });
            };

            this.requestList.push(_q);

            const _timeout = setTimeout(() => {
                this._offReq(_q);
                rej(requestTimeout);
            }, this._provider._timeout || 30000);
        });
    }

    private subscribeCallback(jsonEvent) {
        if (!jsonEvent) {
            return;
        }

        const id = jsonEvent.params && jsonEvent.params.subscription ? jsonEvent.params.subscription : jsonEvent.subscription || '';
        if (!id) {
            return;
        }

        this.subscriptionList && this.subscriptionList.forEach(s => {
            if (s.id !== id) {
                return;
            }

            const result = jsonEvent.params && jsonEvent.params.result ? jsonEvent.params.result : jsonEvent.result || null;
            if (!result) {
                return;
            }

            s.emit(result);
        });
    }

    private connectedOnce(cb) {
        const connectedCB = () => {
            this.isConnected = true;
            this.requestList && this.requestList.forEach(_q => {
                _q && _q();
            });
            cb && cb(this);
        };

        if (this._provider.type === 'http' || this._provider.connectStatus) {
            connectedCB();
            return;
        }

        this._provider.on && this._provider.on('connect', () => {
            connectedCB();
            this._provider.remove('connect');
        });
    }
}

export const ViteAPI = ViteAPIClass;
export default ViteAPIClass;
