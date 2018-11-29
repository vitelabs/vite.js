import '@babel/polyfill';
require('es6-promise').polyfill();

import * as p from "./provider";
import * as u from "./utils";
import * as con from "./const";
import * as w from "./Wallet";
import * as c from "./client";

export const provider=p;
export const utils=u;
export const constant=con;
export const wallet=w;
export const client=c;