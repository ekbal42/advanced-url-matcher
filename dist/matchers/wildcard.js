"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WildcardMatcher = void 0;
class WildcardMatcher {
    match(pattern, url) {
        // Escape special regex characters except *
        const regexPattern = pattern
            .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            .replace(/\*/g, '.*');
        const regex = new RegExp(`^${regexPattern}$`);
        return {
            matched: regex.test(url),
        };
    }
}
exports.WildcardMatcher = WildcardMatcher;
