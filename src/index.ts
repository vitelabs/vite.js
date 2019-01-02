import '@babel/polyfill';
require('es6-promise').polyfill();

import * as con from "./const";
import * as u from "./utils";
import c from "./client";
import * as w from "./Wallet";

export const constant = con;
export const utils = u;
export const client = c;
export const wallet = w;
