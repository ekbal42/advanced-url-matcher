"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashPlugin = void 0;
class HashPlugin {
    constructor() {
        this.name = "hash";
    }
    match(context) {
        if (context.options.ignoreHash === true) {
            return { matched: true };
        }
        const patternHash = context.patternUrl.hash;
        const targetHash = context.targetUrl.hash;
        if (patternHash !== targetHash) {
            return { matched: false };
        }
        return { matched: true };
    }
}
exports.HashPlugin = HashPlugin;
