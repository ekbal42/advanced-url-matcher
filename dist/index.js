"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchUrl = exports.UrlMatcher = void 0;
const url_parser_1 = require("./utils/url-parser");
const scheme_1 = require("./plugins/scheme");
const domain_1 = require("./plugins/domain");
const path_1 = require("./plugins/path");
const query_1 = require("./plugins/query");
const hash_1 = require("./plugins/hash");
const regex_1 = require("./matchers/regex");
__exportStar(require("./types"), exports);
class UrlMatcher {
    constructor() {
        this.plugins = [
            new scheme_1.SchemePlugin(),
            new domain_1.DomainPlugin(),
            new path_1.PathPlugin(),
            new query_1.QueryPlugin(),
            new hash_1.HashPlugin(),
        ];
        this.regexMatcher = new regex_1.RegexMatcher();
    }
    match(pattern, url, options = {}) {
        if (options.exact === true) {
            return { matched: pattern === url };
        }
        if (pattern.startsWith("regex:")) {
            return this.regexMatcher.match(pattern, url);
        }
        const patternUrl = url_parser_1.UrlParser.parse(pattern);
        const targetUrl = url_parser_1.UrlParser.parse(url);
        if (!patternUrl || !targetUrl) {
            return { matched: false };
        }
        const context = {
            patternUrl,
            targetUrl,
            patternOriginal: pattern,
            targetOriginal: url,
            options,
        };
        const combinedParams = {};
        for (const plugin of this.plugins) {
            const result = plugin.match(context);
            if (!result.matched) {
                return { matched: false };
            }
            if (result.params) {
                Object.assign(combinedParams, result.params);
            }
        }
        return {
            matched: true,
            params: Object.keys(combinedParams).length > 0 ? combinedParams : undefined,
        };
    }
}
exports.UrlMatcher = UrlMatcher;
const matchUrl = (pattern, url, options) => {
    const matcher = new UrlMatcher();
    return matcher.match(pattern, url, options);
};
exports.matchUrl = matchUrl;
