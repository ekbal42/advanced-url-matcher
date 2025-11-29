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
            const matched = regex.test(url);
            return {
                matched,
                error: matched ? undefined : "Regex match failed",
            };
        }
        catch (e) {
            return { matched: false, error: "Invalid regex pattern" };
        }
    }
}
exports.RegexMatcher = RegexMatcher;
