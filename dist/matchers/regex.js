"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexMatcher = void 0;
class RegexMatcher {
    match(pattern, url) {
        if (!pattern.startsWith("regex:")) {
            return { matched: false };
        }
        try {
            const regexString = pattern.substring(6);
            const regex = new RegExp(regexString);
            return {
                matched: regex.test(url),
            };
        }
        catch (e) {
            console.error("Invalid regex pattern:", pattern);
            return { matched: false };
        }
    }
}
exports.RegexMatcher = RegexMatcher;
