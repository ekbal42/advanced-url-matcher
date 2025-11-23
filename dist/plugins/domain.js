"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainPlugin = void 0;
class DomainPlugin {
    constructor() {
        this.name = "domain";
    }
    match(context) {
        const patternHost = context.patternUrl.hostname;
        const targetHost = context.targetUrl.hostname;
        const regexPattern = patternHost
            .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
            .replace(/\*/g, ".*");
        const regex = new RegExp(`^${regexPattern}$`);
        if (!regex.test(targetHost)) {
            return { matched: false };
        }
        return { matched: true };
    }
}
exports.DomainPlugin = DomainPlugin;
