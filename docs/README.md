---
sidebarDepth: 4
title: Start
---

:::tip Maintainer
[cs](https://github.com/lovelycs)
[hurrytospring](https://github.com/hurrytospring)
:::

The Vite Javascript SDK

:::tip Tips

Before you start, reading through the following documents is highly recommended
1. [Key Concepts](./QA.md)
2. [Vite RPC API](../rpc/README.md)

:::

## Installation

:::demo

```bash tab:npm
npm install @vite/vitejs --save
npm install @vite/vitejs-ws --save
```

```bash tab:yarn
yarn add @vite/vitejs
yarn add @vite/vitejs-ws
```

:::

## Module Import

:::demo

```javascript tab:ES6
import {
    abi, error, keystore, utils, constant,
    accountBlock, ViteAPI, wallet
} from '@vite/vitejs';

// must install http/ipc/ws packages separately if you need set up network connection
import ws from '@vite/vitejs-ws';
import http from '@vite/vitejs-http';
import ipc from '@vite/vitejs-ipc';
```

```javascript tab:require
const {
    abi, error, keystore, utils, constant,
    accountBlock, ViteAPI, wallet
} = require('@vite/vitejs');

// must install http/ipc/ws packages separately if you need set up network connection
const { WS_RPC } = require('@vite/vitejs-ws');
const { HTTP_RPC } = require('@vite/vitejs-http');
const { IPC_RPC } = require('@vite/vitejs-ipc');
```

:::

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
