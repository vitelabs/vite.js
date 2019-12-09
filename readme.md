# Vite.js

[![Build Status](https://www.travis-ci.org/vitelabs/vite.js.svg?branch=master)](https://www.travis-ci.org/vitelabs/vite.js) [![Coverage Status](https://coveralls.io/repos/github/vitelabs/vite.js/badge.svg?branch=master)](https://coveralls.io/github/vitelabs/vite.js?branch=master)

ViteJS 最新版本为 2.3.0 与旧版本不兼容: 更改了大部分的包结构，包括函数名、传参方式等，具体可参考：https://vite.wiki/api/vitejs/
如果暂时不想升级可以继续使用 <=2.2.10 的版本

The latest version of ViteJS is 2.3.0, it is not compatible with the old version: most of the package structure has been changed, including the function name, parameters, etc. Please refer to: https://vite.wiki/api/vitejs/
If you do not want to upgrade, you can continue to use the version <= 2.2.10

## Prerequisites

* node.js
* yarn

## Building (gulp)

`yarn run build`

## Testing (mocha) 

`yarn run test`

## Starting

1. `yarn install`
2. Configure eslint in your editor, rules like '.eslintrc'.

### Branch naming rules

* Develop on branch 'dev/{version}/{function name}'
* Fixed version on branch 'dev/{version}'

> Notice 1: development branch split from `dev/{last_version}`. If `dev/{last_version}` is not exist, split from `master`
> Notice 2: change `src/type.ts`. You should run `yarn run format-type` after changing the file `src/type.ts`

#### Examples

` 'dev/2.0.0/utf8' from 'dev/1.0.0' || 'master' `
