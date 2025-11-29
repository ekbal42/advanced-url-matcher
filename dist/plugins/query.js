"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPlugin = void 0;
const json_matcher_1 = require("../utils/json-matcher");
class QueryPlugin {
    constructor() {
        this.name = "query";
    }
    match(context) {
        if (context.options.ignoreQuery === true) {
            return { matched: true };
        }
        const patternParams = context.patternUrl.searchParams;
        const targetParams = context.targetUrl.searchParams;
        for (const [key, value] of patternParams.entries()) {
            const targetValue = targetParams.get(key);
            if (!targetValue) {
                return {
                    matched: false,
                    error: `Missing query parameter: ${key}`,
                };
            }
            const allowedValues = value.split(",");
            let paramMatched = false;
            try {
                const patternJson = JSON.parse(value);
                const targetJson = JSON.parse(targetValue);
                if ((0, json_matcher_1.jsonMatch)(patternJson, targetJson)) {
                    paramMatched = true;
                }
            }
            catch (e) { }
            if (!paramMatched) {
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
            }
            if (!paramMatched) {
                return {
                    matched: false,
                    error: `Query parameter mismatch: ${key}=${targetValue} does not match ${value}`,
                };
            }
        }
        if (context.options.strictQuery === true) {
            for (const key of targetParams.keys()) {
                if (!patternParams.has(key)) {
                    return {
                        matched: false,
                        error: `Unexpected query parameter: ${key}`,
                    };
                }
            }
        }
        return { matched: true };
    }
}
exports.QueryPlugin = QueryPlugin;
