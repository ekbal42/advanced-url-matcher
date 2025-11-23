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
        if (context.options.strictTrailingSlash === false) {
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
}
exports.PathPlugin = PathPlugin;
