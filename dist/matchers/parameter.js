"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterMatcher = void 0;
class ParameterMatcher {
    match(pattern, url) {
        // Check if pattern contains parameters
        if (!pattern.includes(':')) {
            return { matched: false };
        }
        const patternParts = pattern.split('/');
        const urlParts = url.split('/');
        if (patternParts.length !== urlParts.length) {
            return { matched: false };
        }
        const params = {};
        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const urlPart = urlParts[i];
            if (patternPart.startsWith(':')) {
                const paramName = patternPart.substring(1);
                params[paramName] = urlPart;
            }
            else if (patternPart !== urlPart) {
                return { matched: false };
            }
        }
        return {
            matched: true,
            params,
        };
    }
}
exports.ParameterMatcher = ParameterMatcher;
