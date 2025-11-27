"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathPlugin = void 0;
const segment_matcher_1 = require("../utils/segment-matcher");
class PathPlugin {
    constructor() {
        this.name = "path";
    }
    match(context) {
        let patternPath = context.patternUrl.pathname;
        let targetPath = context.targetUrl.pathname;
        if (context.options.strictTrailingSlash === true) {
            const patternHasTrailingSlash = this.hasTrailingSlash(context.patternOriginal);
            const targetHasTrailingSlash = this.hasTrailingSlash(context.targetOriginal);
            if (patternHasTrailingSlash !== targetHasTrailingSlash) {
                return { matched: false };
            }
        }
        else {
            if (patternPath.endsWith("/") && patternPath.length > 1) {
                patternPath = patternPath.slice(0, -1);
            }
            if (targetPath.endsWith("/") && targetPath.length > 1) {
                targetPath = targetPath.slice(0, -1);
            }
        }
        const patternSegments = patternPath.split("/").filter((s) => s !== "");
        const targetSegments = targetPath.split("/").filter((s) => s !== "");
        const params = {};
        let pIndex = 0;
        let tIndex = 0;
        while (pIndex < patternSegments.length && tIndex < targetSegments.length) {
            let pSegment = patternSegments[pIndex];
            const tSegment = targetSegments[tIndex];
            if (pSegment === ":*" || pSegment === "**") {
                return { matched: true, params };
            }
            if (pSegment === "*") {
                pIndex++;
                tIndex++;
                continue;
            }
            let isOptional = false;
            if (pSegment.endsWith("?") && pSegment.startsWith(":")) {
                isOptional = true;
                pSegment = pSegment.slice(0, -1);
            }
            const segmentMatches = (0, segment_matcher_1.matchSegment)(pSegment, tSegment);
            if (segmentMatches) {
                if (pSegment.startsWith(":") && !pSegment.includes("*")) {
                    const paramName = pSegment.slice(1);
                    params[paramName] = tSegment;
                }
                pIndex++;
                tIndex++;
            }
            else if (isOptional) {
                pIndex++;
            }
            else {
                return { matched: false };
            }
        }
        while (pIndex < patternSegments.length) {
            const pSegment = patternSegments[pIndex];
            if (pSegment === ":*" || pSegment === "**") {
                return { matched: true, params };
            }
            if (pSegment.endsWith("?") && pSegment.startsWith(":")) {
                pIndex++;
                continue;
            }
            return { matched: false };
        }
        if (tIndex < targetSegments.length) {
            return { matched: false };
        }
        return { matched: true, params };
    }
    hasTrailingSlash(url) {
        const urlWithoutProtocol = url.replace(/^[a-z]+:\/\/[^\/]+/i, "");
        const pathPart = urlWithoutProtocol.split(/[?#]/)[0];
        return pathPart.endsWith("/");
    }
}
exports.PathPlugin = PathPlugin;
