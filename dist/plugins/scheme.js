"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemePlugin = void 0;
class SchemePlugin {
    constructor() {
        this.name = "scheme";
    }
    match(context) {
        if (context.patternUrl.protocol !== context.targetUrl.protocol) {
            return { matched: false };
        }
        return { matched: true };
    }
}
exports.SchemePlugin = SchemePlugin;
