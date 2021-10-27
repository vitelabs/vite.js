# Vite.js

![example workflow name](https://github.com/vitelabs/vite.js/workflows/CI/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/vitelabs/vite.js/badge.svg?branch=master)](https://coveralls.io/github/vitelabs/vite.js?branch=master)

The latest version of ViteJS is 2.3.16. 

**Note: 2.3.x is not compatible with 2.2. You can continue to use the version <= 2.2.10 if you do not want to upgrade.**

* Documentation: [vite.wiki](https://vite.wiki/api/vitejs/)
* Changelog: [CHANGELOG.md](./CHANGELOG.md)


## Prerequisites

* node.js
* yarn

## Build

```
yarn build
```

## Test

```
yarn test
```

## Lint

```
yarn lint
```

## Starting

1. `yarn`

2. Configure eslint in your editor, rules like '.eslintrc'.

### Branch naming rules

* Develop on branch 'dev/{version}/{function name}'
* Fixed version on branch 'dev/{version}'

* Notice 1: development branch split from `dev/{last_version}`. If `dev/{last_version}` is not exist, split from `master`

* Notice 2: change `src/type.ts`. You should run `yarn run format-type` after changing the file `src/type.ts`

#### Examples

```
'dev/2.0.0/utf8' from 'dev/1.0.0' || 'master' 
```

### Release

```bash
yarn release
```

### Commit File

```bash
yarn commit
```

