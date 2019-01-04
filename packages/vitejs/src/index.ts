import '@babel/polyfill';
require('es6-promise').polyfill();

import * as _constant from "@vite/vitejs-constant";
import * as error from "@vite/vitejs-error";

import * as _utils from "@vite/vitejs-utils";
import * as accountBlock from "@vite/vitejs-accountblock";

import * as _keysotre from "@vite/vitejs-keystore";

import * as privToAddr from "@vite/vitejs-privtoaddr";
import * as hdAddr from "@vite/vitejs-hdaddr";

import _client from '@vite/vitejs-client';

import account from '@vite/vitejs-account';
import hdAccount from '@vite/vitejs-hdaccount';

let c = _constant;
c.error = error;
export const constant = c;

let u = _utils;
u.accountBlock = accountBlock;
export const utils = u;

export const keysore = _keysotre;

export const address = {
    privToAddr, hdAddr
}

export const client = _client;

export const wallet = { account, hdAccount };
