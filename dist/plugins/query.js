"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPlugin = void 0;
class QueryPlugin {
    constructor() {
        this.name = "query";
    }
    match(context) {
        const patternParams = context.patternUrl.searchParams;
        const targetParams = context.targetUrl.searchParams;
        for (const [key, value] of patternParams.entries()) {
            const targetValue = targetParams.get(key);
            if (!targetValue) {
                return { matched: false };
            }
            const allowedValues = value.split(",");
            let paramMatched = false;
            for (const allowedValue of allowedValues) {
                if (allowedValue.includes("*")) {
                    const regexPattern = allowedValue
                        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
                        .replace(/\*/g, ".*");
                    const regex = new RegExp(`^${regexPattern}$`);
                    if (regex.test(targetValue)) {
                        paramMatched = true;
                        break;
                    }
                }
                else {
                    if (targetValue === allowedValue) {
                        paramMatched = true;
                        break;
                    }
                }
            }
            if (!paramMatched) {
                return { matched: false };
            }
        }
        return { matched: true };
    }
}
exports.QueryPlugin = QueryPlugin;
