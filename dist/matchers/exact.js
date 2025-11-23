"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExactMatcher = void 0;
class ExactMatcher {
    match(pattern, url) {
        return {
            matched: pattern === url,
        };
    }
}
exports.ExactMatcher = ExactMatcher;
