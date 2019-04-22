!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("$vite_netProcessor",[],t):"object"==typeof exports?exports.$vite_netProcessor=t():e.$vite_netProcessor=t()}(this,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=80)}({2:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.no={code:"100000",message:"What do you want to do?"},t.paramsMissing={code:"100001",message:"Missing parameter(s)."},t.paramsFormat={code:"100002",message:"Incorrect parameter format."},t.paramsConflict={code:"100003",message:"Parameter conflict."},t.addressIllegal={code:"200001",message:"Illegal address."},t.addressMissing={code:"200002",message:"Address does not exist"},t.requestTimeout={code:"300001",message:"Request timeout"}},80:function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))(function(r,i){function s(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){e.done?r(e.value):new n(function(t){t(e.value)}).then(s,a)}c((o=o.apply(e,t||[])).next())})},r=this&&this.__generator||function(e,t){var n,o,r,i,s={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,o=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(r=(r=s.trys).length>0&&r[r.length-1])&&(6===i[0]||2===i[0])){s=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){s.label=i[1];break}if(6===i[0]&&s.label<r[1]){s.label=r[1],r=i;break}if(r&&s.label<r[2]){s.label=r[2],s.ops.push(i);break}r[2]&&s.ops.pop(),s.trys.pop();continue}i=t.call(e,s)}catch(e){i=[6,e],o=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}};Object.defineProperty(t,"__esModule",{value:!0});var i=n(2),s=n(88),a=function(){function e(e,t){this._provider=e,this.isConnected=!1,this.connectedOnce(t),this.requestList=[],this.subscriptionList=[]}return e.prototype._setProvider=function(e,t,n){n&&this._provider.abort(n),this.clearSubscriptions(),this._provider=e,this.isConnected=!1,this.connectedOnce(t)},e.prototype.connectedOnce=function(e){var t=this,n=function(){t.isConnected=!0,t.requestList&&t.requestList.forEach(function(e){e&&e()}),e&&e(t)};"http"===this._provider.type||this._provider.connectStatus?n():this._provider.on&&this._provider.on("connect",function(){n(),t._provider.remove("connect")})},e.prototype.unSubscribe=function(e){var t;for(t=0;t<this.subscriptionList.length&&this.subscriptionList[t]!==e;t++);t>=this.subscriptionList.length||(e&&e.stopLoop(),this.subscriptionList.splice(t,1),this.subscriptionList&&this.subscriptionList.length||this._provider.unSubscribe&&this._provider.unSubscribe())},e.prototype.clearSubscriptions=function(){this.subscriptionList.forEach(function(e){e.stopLoop()}),this.subscriptionList=[],this._provider.unSubscribe&&this._provider.unSubscribe()},e.prototype.request=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return o(this,void 0,void 0,function(){var n;return r(this,function(o){switch(o.label){case 0:return this.isConnected?[4,this._provider.request(e,t)]:[2,this._onReq.apply(this,["request",e].concat(t))];case 1:if((n=o.sent()).error)throw n.error;return[2,n.result]}})})},e.prototype.notification=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return o(this,void 0,void 0,function(){return r(this,function(n){return this.isConnected?[2,this._provider.notification(e,t)]:[2,this._onReq.apply(this,["notification",e].concat(t))]})})},e.prototype.batch=function(e){return o(this,void 0,void 0,function(){return r(this,function(t){switch(t.label){case 0:return this.isConnected?(e.forEach(function(e){e.type=e.type||"request"}),[4,this._provider.batch(e)]):[2,this._onReq("batch",e)];case 1:return[2,t.sent()]}})})},e.prototype.subscribe=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return o(this,void 0,void 0,function(){var n,o,i,a,c,l=this;return r(this,function(r){switch(r.label){case 0:return n=this._provider.subscribe?"subscribe_subscribe":"subscribe_"+e+"Filter",o=this._provider.subscribe?[e].concat(t):t,this.isConnected?[4,this._provider.request(n,o)]:[3,2];case 1:return i=(i=r.sent()).result,[3,4];case 2:return[4,this._onReq.apply(this,["request",n].concat(o))];case 3:i=r.sent(),r.label=4;case 4:return a=i,this.subscriptionList&&this.subscriptionList.length||(this.subscriptionList=[],this._provider.subscribe&&this._provider.subscribe(function(e){l.subscribeCallback(e)})),c=new s.default(a,this,!!this._provider.subscribe),this._provider.subscribe||c.startLoop(function(e){l.subscribeCallback(e)}),this.subscriptionList.push(c),[2,c]}})})},e.prototype._offReq=function(e){var t;for(t=0;t<this.requestList.length&&this.requestList[t]!==e;t++);t!==this.requestList.length&&this.requestList.splice(t,1)},e.prototype._onReq=function(e,t){for(var n=this,o=[],r=2;r<arguments.length;r++)o[r-2]=arguments[r];return new Promise(function(r,s){var a=function(){n[e].apply(n,[t].concat(o)).then(function(e){clearTimeout(c),n._offReq(a),r(e)}).catch(function(e){n._offReq(a),clearTimeout(c),s(e)})};n.requestList.push(a);var c=setTimeout(function(){n._offReq(a),s(i.requestTimeout)},n._provider._timeout||3e4)})},e.prototype.subscribeCallback=function(e){if(e){var t=e.params&&e.params.subscription?e.params.subscription:e.subscription||"";t&&this.subscriptionList&&this.subscriptionList.forEach(function(n){if(n.id===t){var o=e.params&&e.params.result?e.params.result:e.result||null;o&&n.emit(o)}})}},e}();t.default=a},88:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(9),r=function(){function e(e,t,n){this.id=e,this.callback=null,this.netProcessor=t,this.isSubscribe=n,this.timeLoop=null}return e.prototype.on=function(e){this.callback=e},e.prototype.off=function(){this.stopLoop(),this.netProcessor.unSubscribe(this)},e.prototype.emit=function(e){this.callback&&this.callback(e)},e.prototype.startLoop=function(e,t){var n=this;void 0===t&&(t=2e3);var r=function(){n.timeLoop=setTimeout(function(){n.netProcessor.request(o.subscribe.getFilterChanges,n.id).then(function(t){e&&e(t),r()}).catch(function(){r()})},t)};r()},e.prototype.stopLoop=function(){this.timeLoop&&(clearTimeout(this.timeLoop),this.timeLoop=null,this.netProcessor.request(o.subscribe.uninstallFilter,this.id))},e}();t.default=r},9:function(e,t,n){"use strict";var o,r,i,s,a,c,l,u,d,g,p,f,h,b;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.SBPreg=0]="SBPreg",e[e.UpdateReg=1]="UpdateReg",e[e.RevokeReg=2]="RevokeReg",e[e.RetrieveReward=3]="RetrieveReward",e[e.Voting=4]="Voting",e[e.RevokeVoting=5]="RevokeVoting",e[e.GetQuota=6]="GetQuota",e[e.WithdrawalOfQuota=7]="WithdrawalOfQuota",e[e.Mintage=8]="Mintage",e[e.MintageIssue=9]="MintageIssue",e[e.MintageBurn=10]="MintageBurn",e[e.MintageTransferOwner=11]="MintageTransferOwner",e[e.MintageChangeTokenType=12]="MintageChangeTokenType",e[e.MintageCancelPledge=13]="MintageCancelPledge",e[e.DexFundUserDeposit=14]="DexFundUserDeposit",e[e.DexFundUserWithdraw=15]="DexFundUserWithdraw",e[e.DexFundNewOrder=16]="DexFundNewOrder",e[e.DexTradeCancelOrder=17]="DexTradeCancelOrder",e[e.DexFundNewMarket=18]="DexFundNewMarket",e[e.CreateContractReq=19]="CreateContractReq",e[e.TxReq=20]="TxReq",e[e.RewardReq=21]="RewardReq",e[e.TxRes=22]="TxRes",e[e.TxResFail=23]="TxResFail"}(t.BuiltinTxType||(t.BuiltinTxType={})),function(e){e[e.CreateContractReq=1]="CreateContractReq",e[e.TxReq=2]="TxReq",e[e.RewardReq=3]="RewardReq",e[e.TxRes=4]="TxRes",e[e.TxResFail=5]="TxResFail",e[e.SendRefund=6]="SendRefund",e[e.GenesisReceive=7]="GenesisReceive"}(t.BlockType||(t.BlockType={})),function(e){e.listEntropyFilesInStandardDir="wallet_listEntropyFilesInStandardDir",e.listAllEntropyFiles="wallet_listAllEntropyFiles",e.extractMnemonic="wallet_extractMnemonic",e.unlock="wallet_unlock",e.lock="wallet_lock",e.listEntropyStoreAddresses="wallet_listEntropyStoreAddresses",e.newMnemonicAndEntropyStore="wallet_newMnemonicAndEntropyStore",e.deriveByIndex="wallet_deriveByIndex",e.deriveByFullPath="wallet_deriveByFullPath",e.recoverEntropyStoreFromMnemonic="wallet_recoverEntropyStoreFromMnemonic",e.globalCheckAddrUnlocked="wallet_globalCheckAddrUnlocked",e.isAddrUnlocked="wallet_isAddrUnlocked",e.isUnlocked="wallet_isUnlocked",e.findAddr="wallet_findAddr",e.globalFindAddr="wallet_globalFindAddr",e.createTxWithPassphrase="wallet_createTxWithPassphrase",e.addEntropyStore="wallet_addEntropyStore"}(o=t.wallet||(t.wallet={})),function(e){e.getOnroadBlocksByAddress="onroad_getOnroadBlocksByAddress",e.getOnroadInfoByAddress="onroad_getOnroadInfoByAddress",e.getOnroadBlocksInBatch="onroad_getOnroadBlocksInBatch",e.getOnroadInfoInBatch="onroad_getOnroadInfoInBatch"}(r=t.onroad||(t.onroad={})),function(e){e.sendRawTx="tx_sendRawTx",e.calcPoWDifficulty="tx_calcPoWDifficulty"}(i=t.tx||(t.tx={})),function(e){e.getBlocksByAccAddr="ledger_getBlocksByAccAddr",e.getAccountByAccAddr="ledger_getAccountByAccAddr",e.getLatestSnapshotChainHash="ledger_getLatestSnapshotChainHash",e.getLatestBlock="ledger_getLatestBlock",e.getBlockByHeight="ledger_getBlockByHeight",e.getBlockByHash="ledger_getBlockByHash",e.getBlocksByHash="ledger_getBlocksByHash",e.getBlocksByHashInToken="ledger_getBlocksByHashInToken",e.getSnapshotChainHeight="ledger_getSnapshotChainHeight",e.getSnapshotBlockByHash="ledger_getSnapshotBlockByHash",e.getSnapshotBlockByHeight="ledger_getSnapshotBlockByHeight",e.getVmLogList="ledger_getVmLogList",e.getFittestSnapshotHash="ledger_getFittestSnapshotHash"}(s=t.ledger||(t.ledger={})),function(e){e.getCreateContractToAddress="contract_getCreateContractToAddress",e.getCreateContractData="contract_getCreateContractData",e.getCallContractData="contract_getCallContractData",e.getContractInfo="contract_getContractInfo",e.getCallOffChainData="contract_getCallOffChainData",e.callOffChainMethod="contract_callOffChainMethod"}(a=t.contract||(t.contract={})),function(e){e.getPledgeData="pledge_getPledgeData",e.getCancelPledgeData="pledge_getCancelPledgeData",e.getPledgeQuota="pledge_getPledgeQuota",e.getPledgeList="pledge_getPledgeList"}(c=t.pledge||(t.pledge={})),function(e){e.getRegisterData="register_getRegisterData",e.getCancelRegisterData="register_getCancelRegisterData",e.getRewardData="register_getRewardData",e.getUpdateRegistrationData="register_getUpdateRegistrationData",e.getRegistrationList="register_getRegistrationList",e.getCandidateList="register_getCandidateList"}(l=t.register||(t.register={})),function(e){e.getVoteData="vote_getVoteData",e.getCancelVoteData="vote_getCancelVoteData",e.getVoteInfo="vote_getVoteInfo"}(u=t.vote||(t.vote={})),function(e){e.getMintData="mintage_getMintData",e.getMintageCancelPledgeData="mintage_getMintageCancelPledgeData",e.getIssueData="mintage_getIssueData",e.getBurnData="mintage_getBurnData",e.getTransferOwnerData="mintage_getTransferOwnerData",e.getChangeTokenTypeData="mintage_getChangeTokenTypeData",e.getTokenInfoList="mintage_getTokenInfoList",e.getTokenInfoById="mintage_getTokenInfoById",e.getTokenInfoListByOwner="mintage_getTokenInfoListByOwner"}(d=t.mintage||(t.mintage={})),function(e){e.getAccountFundInfo="dexfund_getAccountFundInfo",e.getAccountFundInfoByStatus="dexfund_getAccountFundInfoByStatus"}(g=t.dexfund||(t.dexfund={})),function(e){e.syncInfo="net_syncInfo",e.peers="net_peers",e.peersCount="net_peersCount"}(p=t.net||(t.net={})),function(e){e.getTestToken="testapi_getTestToken"}(f=t.testapi||(t.testapi={})),function(e){e.getPowNonce="pow_getPowNonce"}(h=t.pow||(t.pow={})),function(e){e.newSnapshotBlocksFilter="subscribe_newSnapshotBlocksFilter",e.newAccountBlocksFilter="subscribe_newAccountBlocksFilter",e.newLogsFilter="subscribe_newLogsFilter",e.uninstallFilter="subscribe_uninstallFilter",e.getFilterChanges="subscribe_getFilterChanges",e.newSnapshotBlocks="subscribe_newSnapshotBlocks",e.newAccountBlocks="subscribe_newAccountBlocks",e.newLogs="subscribe_newLogs",e.getLogs="subscribe_getLogs"}(b=t.subscribe||(t.subscribe={})),t._methods={testapi:f,pow:h,dexfund:g,wallet:o,onroad:r,tx:i,ledger:s,contract:a,pledge:c,register:l,vote:u,mintage:d,net:p,subscribe:b},function(e){e.english="english",e.japanese="japanese",e.chineseSimplified="chinese_simplified",e.chineseTraditional="chinese_traditional",e.french="french",e.italian="italian",e.korean="korean",e.spanish="spanish"}(t.LangList||(t.LangList={}))}})});