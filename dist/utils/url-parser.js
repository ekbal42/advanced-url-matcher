"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlParser = void 0;
class UrlParser {
    static parse(url) {
        try {
            return new URL(url);
        }
        catch (_a) {
            return null;
        }
    }
}
exports.UrlParser = UrlParser;
