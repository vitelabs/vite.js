"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ViteJS = require("./index");
if (typeof window !== 'undefined' && typeof window.ViteJS === 'undefined') {
    window.ViteJS = ViteJS;
}
module.exports = ViteJS;
