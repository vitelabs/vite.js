!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("$vite_WS",[],t):"object"==typeof exports?exports.$vite_WS=t():e.$vite_WS=t()}(this,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=536)}({109:function(e,t,n){"use strict";var r=n(66);function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var a=function(e){function t(e){var n,r=e.onEventTypes,o=e.sendFuncName,i=e.path;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=s(this,u(t).call(this))).path=i,n._onEventTypes=r||[],n._sendFuncName=o,n.connectStatus=!1,n.responseCbs={},n._connectEnd=null,n._connectErr=null,n._connectTimeout=null,n._connectConnect=null,n._connectClose=null,n.subscribeMethod=null,n}var n,o,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(t,r["a"]),n=t,(o=[{key:"_connected",value:function(){this.connectStatus=!0,this._connectConnect&&this._connectConnect()}},{key:"_closed",value:function(){this.connectStatus=!1,this._connectClose&&this._connectClose()}},{key:"_errored",value:function(e){this._connectErr&&this._connectErr(e)}},{key:"_parse",value:function(e){var t=this,n=[];e.forEach(function(e){if(e)try{var t=JSON.parse(e);if(!(t instanceof Array)&&t.result)try{t.result=JSON.parse(t.result)}catch(e){}n.push(t)}catch(e){}}),n.forEach(function(e){if(e instanceof Array||e.id)if(e.id)t.responseCbs[e.id]&&t.responseCbs[e.id](e);else for(var n=0;n<e.length;n++)if(e[n].id){var r=e[n].id;t.responseCbs[r]&&t.responseCbs[r](e)}else t.subscribeMethod&&t.subscribeMethod(e[n]);else t.subscribeMethod&&t.subscribeMethod(e)})}},{key:"_checkOnType",value:function(e){if(this._onEventTypes.indexOf(e)<0)return!1;var t=e.substring(0,1).toUpperCase()+e.substring(1);return"_connect".concat(t)}},{key:"_onSend",value:function(e){var t=this,n=function(e){var t;if(e instanceof Array){for(var n=0;n<e.length;n++)if(e[n].id){t=e[n].id;break}}else t=e.id||null;return t}(e);if(n)return new Promise(function(e,r){var o=!1,i={id:n,abort:function(){o=!0}};t.responseCbs[n]=function(t){if(u(),t&&t.error)return r(t);e(t)};var s=t._addReq({request:i,rej:function(e){u(),r(e)}}),u=function(){for(var e in c&&clearTimeout(c),c=null,t._removeReq(s),t.responseCbs)if(t.responseCbs[e]===n){delete t.responseCbs[e];break}},c=t.timeout?setTimeout(function(){if(!o)return u(),r(t.ERRORS.TIMEOUT(t.timeout))},t.timeout):null})}},{key:"_send",value:function(e){return this.connectStatus?(this.socket[this._sendFuncName](JSON.stringify(e)),this._onSend(e)):Promise.reject(this.ERRORS.CONNECT(this.path))}},{key:"on",value:function(e,t){var n=this._checkOnType(e);return n<0?this.ERRORS.IPC_ON(e):t?void(this[n]=t):this.ERRORS.IPC_ON_CB(e)}},{key:"remove",value:function(e){var t=this._checkOnType(e);t&&(this[t]=null)}},{key:"request",value:function(e,t){var n=this._getRequestPayload(e,t);return n instanceof Error?Promise.reject(n):this._send(n)}},{key:"notification",value:function(e,t){var n=this._getNotificationPayload(e,t);if(n instanceof Error)return n;this._send(n)}},{key:"batch",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=this._getBatchPayload(e);return t instanceof Error?Promise.reject(t):this._send(t)}},{key:"subscribe",value:function(e){if("function"!=typeof e)throw new Error("[Error] callback should be a function.");this.subscribeMethod=e}},{key:"unSubscribe",value:function(){this.subscribeMethod=null}}])&&i(n.prototype,o),a&&i(n,a),t}();t.a=a},23:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={CONNECT:function(e){return new Error("CONNECTION ERROR: Couldn't connect to node "+e+".")},ABORT:function(){return new Error("ABORT ERROR: Request already aborted.")},PARAMS:function(){return new Error("PARAMS ERROR.")},TIMEOUT:function(e){return new Error("CONNECTION TIMEOUT: timeout of "+e+" ms achived")},INVAILID_RESPONSE:function(e){return new Error("Invalid JSON RPC response: "+JSON.stringify(e))},IPC_ON:function(e){return new Error("Invalid IPC event on: "+JSON.stringify(e))},IPC_ON_CB:function(e){return new Error("The IPC on event "+JSON.stringify(e)+", cb is necessary")}}},536:function(e,t,n){"use strict";n.r(t),n.d(t,"WS_RPC",function(){return f});var r=n(109);function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var a=n(537).w3cwebsocket,f=function(e){function t(){var e,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"ws://localhost:31420",r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:6e4,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{protocol:"",headers:"",clientConfig:"",retryTimes:10,retryInterval:1e4};if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),e=s(this,u(t).call(this,{onEventTypes:["error","close","connect"],sendFuncName:"send",path:n})),!n)return console.error(e.ERRORS.CONNECT(n)),s(e,e.ERRORS.CONNECT(n));e.timeout=r,e.protocol=o.protocol,e.headers=o.headers,e.clientConfig=o.clientConfig,e.reconnect();var i=0;return e.on("connect",function(){i=0}),e.on("close",function(){i>o.retryTimes||setTimeout(function(){i++,e.reconnect()},o.retryInterval)}),e}var n,o,f;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(t,r["a"]),n=t,(o=[{key:"reconnect",value:function(){var e=this;this.socket=new a(this.path,this.protocol,null,this.headers,null,this.clientConfig),this.socket.onopen=function(){e.socket.readyState===e.socket.OPEN&&e._connected()},this.socket.onclose=function(){e._closed()},this.socket.onerror=function(){e._errored()},this.socket.onmessage=function(t){var n="string"==typeof t.data?t.data:"";e._parse([n])}}},{key:"disconnect",value:function(){this.socket&&this.socket.close&&this.socket.close()}}])&&i(n.prototype,o),f&&i(n,f),t}();t.default=f},537:function(e,t,n){var r=function(){return this}(),o=r.WebSocket||r.MozWebSocket,i=n(538);function s(e,t){return t?new o(e,t):new o(e)}o&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach(function(e){Object.defineProperty(s,e,{get:function(){return o[e]}})}),e.exports={w3cwebsocket:o?s:null,version:i}},538:function(e,t,n){e.exports=n(539).version},539:function(e){e.exports={name:"websocket",description:"Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",keywords:["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],author:"Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)",contributors:["Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"],version:"1.0.28",repository:{type:"git",url:"https://github.com/theturtle32/WebSocket-Node.git"},homepage:"https://github.com/theturtle32/WebSocket-Node",engines:{node:">=0.10.0"},dependencies:{debug:"^2.2.0",nan:"^2.11.0","typedarray-to-buffer":"^3.1.5",yaeti:"^0.0.6"},devDependencies:{"buffer-equal":"^1.0.0",faucet:"^0.0.1",gulp:"git+https://github.com/gulpjs/gulp.git#4.0","gulp-jshint":"^2.0.4","jshint-stylish":"^2.2.1",jshint:"^2.0.0",tape:"^4.9.1"},config:{verbose:!1},scripts:{install:"(node-gyp rebuild 2> builderror.log) || (exit 0)",test:"faucet test/unit",gulp:"gulp"},main:"index",directories:{lib:"./lib"},browser:"lib/browser.js",license:"Apache-2.0"}},66:function(e,t,n){"use strict";var r=n(23),o=n.n(r),i=n(91),s=n.n(i);function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var c=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.ERRORS=o.a,this.jsonrpc=s.a,this._requestManager=[],this._requestId=0}var t,n,r;return t=e,(n=[{key:"abort",value:function(){var e=this;this._requestManager.forEach(function(t){var n=t.request,r=t.rej;n.abort(),r(e.ERRORS.ABORT())}),this._requestManager=[]}},{key:"_addReq",value:function(e){var t={request:e.request,rej:e.rej};return this._requestManager.push(t),t}},{key:"_removeReq",value:function(e){for(var t=0;t<this._requestManager.length;t++)if(this._requestManager[t]===e){this._requestManager.splice(t,1);break}}},{key:"_getRequestPayload",value:function(e,t){return e?(this._requestId++,this.jsonrpc.request(this._requestId,e,t)):o.a.PARAMS()}},{key:"_getNotificationPayload",value:function(e,t){return e?this.jsonrpc.notification(e,t):o.a.PARAMS()}},{key:"_getBatchPayload",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(!e||!e.length)return o.a.PARAMS();for(var t=[],n=0;n<e.length;n++){var r=e[n];if(!r||!r.type||"request"!==r.type&&"notification"!==r.type)return o.a.PARAMS();var i="notification"===r.type?this._getNotificationPayload(r.methodName,r.params):this._getRequestPayload(r.methodName,r.params);if(i instanceof Error)return i;t.push(i)}return t}}])&&u(t.prototype,n),r&&u(t,r),e}();t.a=c},91:function(e,t,n){var r,o,i;!function(n,s){"use strict";e.exports?e.exports=s():(o=[],void 0===(i="function"==typeof(r=s)?r.apply(t,o):r)||(e.exports=i))}("object"==typeof window&&window,function(){"use strict";var e=void 0,t=Object.prototype.toString,n=Object.prototype.hasOwnProperty,r=Array.isArray||function(e){return"[object Array]"===t.call(e)},o=Number.isSafeInteger||function(e){return"number"==typeof e&&isFinite(e)&&e===Math.floor(e)&&Math.abs(e)<=9007199254740991},i=Error.captureStackTrace||function(e){e.stack=(new Error).stack},s={JsonRpc:c,JsonRpcError:d};function u(e){var t=null,r=null;if(e&&e.jsonrpc===c.VERSION)if(n.call(e,"id")){if(n.call(e,"method"))t=y(r=new a(e.id,e.method,e.params));else if(n.call(e,"result"))t=y(r=new l(e.id,e.result));else if(n.call(e,"error"))if(e.error){var o=new d(e.error.message,e.error.code,e.error.data);t=o.message!==e.error.message||o.code!==e.error.code?d.internalError(e):y(r=new p(e.id,o))}else t=d.internalError(e)}else t=y(r=new f(e.method,e.params));else t=d.invalidRequest(e);return!t&&r?new h(r):new h(t||d.invalidRequest(e),"invalid")}function c(){this.jsonrpc="2.0"}function a(t,n,r){c.call(this),this.id=t,this.method=n,r!==e&&(this.params=r)}function f(t,n){c.call(this),this.method=t,n!==e&&(this.params=n)}function l(e,t){c.call(this),this.id=e,this.result=t}function p(e,t){c.call(this),this.id=e,this.error=t}function h(e,t){this.payload=e,this.type=t||e.name}function d(t,n,r){i(this,this.constructor),this.message=t===e?"":String(t),this.code=o(n)?n:0,null!=r&&(this.data=r)}function y(t,n){var r=null;switch(t.name){case a.prototype.name:r=b(t.id)||v(t.method)||m(t.params);break;case f.prototype.name:r=v(t.method)||m(t.params);break;case l.prototype.name:r=b(t.id)||(t.result===e?d.internalError("Result must exist for success Response objects"):null);break;case p.prototype.name:r=b(t.id,!0)||function(e){if(!(e instanceof d))return d.internalError("Error must be an instance of JsonRpcError.");if(!o(e.code))return d.internalError("Invalid error code. It must be an integer.");if(!g(e.message))return d.internalError("Message must exist or must be a string.");return null}(t.error)}if(r&&n)throw r;return r}function b(e,t){return t&&null===e?null:g(e)||o(e)?null:d.internalError('"id" must be provided, a string or an integer.')}function v(e){return g(e)?null:d.methodNotFound(e)}function m(t){if(t===e)return null;if(r(t)||(n=t)&&"object"==typeof n&&!r(n))try{return JSON.stringify(t),null}catch(e){return d.parseError(t)}var n;return d.invalidParams(t)}function g(e){return e&&"string"==typeof e}function _(e,t){function n(){this.constructor=e}return n.prototype=t.prototype,e.prototype=new n,e}return s.request=function(e,t,n){var r=new a(e,t,n);return y(r,!0),r},s.notification=function(e,t){var n=new f(e,t);return y(n,!0),n},s.success=function(e,t){var n=new l(e,t);return y(n,!0),n},s.error=function(e,t){var n=new p(e,t);return y(n,!0),n},s.parse=function(e){if(!e||"string"!=typeof e)return new h(d.invalidRequest(e),"invalid");try{e=JSON.parse(e)}catch(t){return new h(d.parseError(e),"invalid")}if(!r(e))return u(e);if(!e.length)return new h(d.invalidRequest(e),"invalid");for(var t=0,n=e.length;t<n;t++)e[t]=u(e[t]);return e},s.parseObject=u,c.VERSION="2.0",c.prototype.serialize=c.prototype.toString=function(){return JSON.stringify(this)},_(a,c),a.prototype.name="request",_(f,c),f.prototype.name="notification",_(l,c),l.prototype.name="success",_(p,c),p.prototype.name="error",_(d,Error),d.prototype.name="JsonRpcError",d.invalidRequest=function(e){return new d("Invalid request",-32600,e)},d.methodNotFound=function(e){return new d("Method not found",-32601,e)},d.invalidParams=function(e){return new d("Invalid params",-32602,e)},d.internalError=function(e){return new d("Internal error",-32603,e)},d.parseError=function(e){return new d("Parse error",-32700,e)},s})}})});