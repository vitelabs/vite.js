# Vite.js

[![Build Status](https://www.travis-ci.org/vitelabs/vite.js.svg?branch=master)](https://www.travis-ci.org/vitelabs/vite.js) [![Coverage Status](https://coveralls.io/repos/github/vitelabs/vite.js/badge.svg?branch=master)](https://coveralls.io/github/vitelabs/vite.js?branch=master)

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
