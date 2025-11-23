"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathPlugin = void 0;
class PathPlugin {
    constructor() {
        this.name = "path";
    }
    match(context) {
        let patternPath = context.patternUrl.pathname;
        let targetPath = context.targetUrl.pathname;
        // When strictTrailingSlash is true, we need to check the original URLs
        // because the URL parser normalizes trailing slashes automatically
        if (context.options.strictTrailingSlash === true) {
            // Extract path from original URL strings to detect trailing slash
            const patternHasTrailingSlash = this.hasTrailingSlash(context.patternOriginal);
            const targetHasTrailingSlash = this.hasTrailingSlash(context.targetOriginal);
            // If trailing slashes don't match, return false
            if (patternHasTrailingSlash !== targetHasTrailingSlash) {
                return { matched: false };
            }
        }
        else {
            // Default behavior: normalize trailing slashes (ignore them)
            if (patternPath.endsWith("/") && patternPath.length > 1) {
                patternPath = patternPath.slice(0, -1);
            }
            if (targetPath.endsWith("/") && targetPath.length > 1) {
                targetPath = targetPath.slice(0, -1);
            }
        }
        let regexPattern = patternPath
            .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
            .replace(/\*/g, ".*");
        regexPattern = regexPattern.replace(/:([a-zA-Z0-9_]+)/g, "([^/]+)");
        const regex = new RegExp(`^${regexPattern}$`);
        const match = targetPath.match(regex);
        if (!match) {
            return { matched: false };
        }
        const params = {};
        const paramNames = [];
        const extractionRegexStr = patternPath
            .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
            .replace(/\*/g, ".*")
            .replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
            paramNames.push(name);
            return "([^/]+)";
        });
        const extractionRegex = new RegExp(`^${extractionRegexStr}$`);
        const extractionMatch = targetPath.match(extractionRegex);
        if (extractionMatch) {
            paramNames.forEach((name, index) => {
                params[name] = extractionMatch[index + 1];
            });
        }
        return { matched: true, params };
    }
    hasTrailingSlash(url) {
        // Remove protocol and domain to get path+query+hash
        const urlWithoutProtocol = url.replace(/^[a-z]+:\/\/[^\/]+/i, "");
        // Extract just the path (before ? or #)
        const pathPart = urlWithoutProtocol.split(/[?#]/)[0];
        // Check if path ends with /
        return pathPart.endsWith("/");
    }
}
exports.PathPlugin = PathPlugin;
