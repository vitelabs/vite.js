---
title: Vite.js
description: Bridging Every Blockchain in a Multi-Chain Future
footer:
  newsletter: false
aside: true
---

# Vite.js

## Installation

```bash
npm install @vite/vitejs --save
npm install @vite/vitejs-ws --save
```

Or

```bash
yarn add @vite/vitejs
yarn add @vite/vitejs-ws
```

## Module Import

ES6:

```javascript
import {
    abi, error, keystore, utils, constant,
    accountBlock, ViteAPI, wallet
} from '@vite/vitejs';

// must install http/ipc/ws packages separately if you need set up network connection
import ws from '@vite/vitejs-ws';
import http from '@vite/vitejs-http';
import ipc from '@vite/vitejs-ipc';
```

Common:

```javascript
const {
    abi, error, keystore, utils, constant,
    accountBlock, ViteAPI, wallet
} = require('@vite/vitejs');

// must install http/ipc/ws packages separately if you need set up network connection
const { WS_RPC } = require('@vite/vitejs-ws');
const { HTTP_RPC } = require('@vite/vitejs-http');
const { IPC_RPC } = require('@vite/vitejs-ipc');
```

## Quick Start

1. `npm install @vite/vitejs-ws`
2. `npm install @vite/vitejs`
3. Create file `test.js`
```javascript
const { WS_RPC } = require('@vite/vitejs-ws');
const { ViteAPI } = require('@vite/vitejs');

let WS_service = new WS_RPC("ws://example.com");
let provider = new ViteAPI(WS_service, () => {
    console.log("Connected");
});

provider.request('ledger_getSnapshotChainHeight').then((result) => {
    console.log(result);
}).catch((err) => {
    console.warn(err);
});
```
4. `node test.js`
